<?php

namespace App\Http\Controllers;

use App\Http\Requests\ConsumoRequest;
use App\Models\Consumo;
use App\Models\ConsumivelTipo;
use App\Models\Stock;
use App\Models\StockMovimento;
use App\Models\Surgery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class ConsumoController extends Controller
{
    public function index(Surgery $surgery): Response
    {
        $surgery->load(['briefing', 'consumos.stockMovimento.consumivelTipo']);

        $stockItems = Stock::orderBy('consumivel_nome')
            ->orderBy('codigo')
            ->get();

        return Inertia::render('consumos/index', [
            'surgery'    => $surgery,
            'consumos'   => $surgery->consumos,
            'stockItems' => $stockItems,
        ]);
    }

    public function materialPorCirurgia(): Response
    {
        // Para cada procedimento distinto, lista os consumíveis usados
        // com frequência (nº de cirurgias), total e média de quantidade.
        $rows = DB::table('consumos')
            ->join('surgeries', 'consumos.surgery_id', '=', 'surgeries.id')
            ->join('stock_movimentos', 'consumos.stock_movimento_id', '=', 'stock_movimentos.id')
            ->join('consumivel_tipos', 'stock_movimentos.consumivel_tipo_id', '=', 'consumivel_tipos.id')
            ->select(
                'surgeries.procedimento',
                'consumivel_tipos.id as consumivel_id',
                'consumivel_tipos.nome',
                'consumivel_tipos.categoria',
                DB::raw('COUNT(DISTINCT consumos.surgery_id) as num_cirurgias'),
                DB::raw('SUM(consumos.quantidade) as total_quantidade'),
                DB::raw('ROUND(AVG(consumos.quantidade), 1) as media_quantidade'),
            )
            ->groupBy(
                'surgeries.procedimento',
                'consumivel_tipos.id',
                'consumivel_tipos.nome',
                'consumivel_tipos.categoria',
            )
            ->orderBy('surgeries.procedimento')
            ->orderByDesc('num_cirurgias')
            ->orderByDesc('total_quantidade')
            ->get();

        // Contar nº total de cirurgias distintas por procedimento
        $totalCirurgias = DB::table('surgeries')
            ->select('procedimento', DB::raw('COUNT(*) as total'))
            ->groupBy('procedimento')
            ->pluck('total', 'procedimento');

        // Agrupar por procedimento
        $porProcedimento = $rows->groupBy('procedimento')->map(function ($items, $procedimento) use ($totalCirurgias) {
            return [
                'procedimento'   => $procedimento,
                'num_cirurgias'  => $totalCirurgias[$procedimento] ?? 0,
                'materiais'      => $items->values(),
            ];
        })->values();

        return Inertia::render('consumos/material-por-cirurgia', [
            'porProcedimento' => $porProcedimento,
        ]);
    }

    public function historico(Request $request): Response
    {
        $search     = $request->input('search');
        $categoria  = $request->input('categoria');
        $dataInicio = $request->input('data_inicio');
        $dataFim    = $request->input('data_fim');

        $query = Consumo::with([
            'surgery.briefing',
            'stockMovimento.consumivelTipo',
        ]);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('surgery', function ($q2) use ($search) {
                    $q2->where('processo', 'like', "%{$search}%")
                       ->orWhere('procedimento', 'like', "%{$search}%");
                })->orWhereHas('stockMovimento.consumivelTipo', function ($q2) use ($search) {
                    $q2->where('nome', 'like', "%{$search}%");
                })->orWhereHas('stockMovimento', function ($q2) use ($search) {
                    $q2->where('referencia', 'like', "%{$search}%");
                });
            });
        }

        if ($categoria) {
            $query->whereHas('stockMovimento.consumivelTipo', function ($q) use ($categoria) {
                $q->where('categoria', $categoria);
            });
        }

        if ($dataInicio) {
            $query->whereDate('created_at', '>=', $dataInicio);
        }

        if ($dataFim) {
            $query->whereDate('created_at', '<=', $dataFim);
        }

        $consumos = $query->orderByDesc('created_at')->paginate(50)->withQueryString();

        return Inertia::render('consumos/historico', [
            'consumos' => $consumos,
            'filters'  => [
                'search'      => $search ?? '',
                'categoria'   => $categoria ?? '',
                'data_inicio' => $dataInicio ?? '',
                'data_fim'    => $dataFim ?? '',
            ],
        ]);
    }

    public function printHistorico(Request $request): Response
    {
        $search     = $request->input('search');
        $categoria  = $request->input('categoria');
        $dataInicio = $request->input('data_inicio');
        $dataFim    = $request->input('data_fim');

        $query = Consumo::with([
            'surgery.briefing',
            'stockMovimento.consumivelTipo',
        ]);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('surgery', function ($q2) use ($search) {
                    $q2->where('processo', 'like', "%{$search}%")
                       ->orWhere('procedimento', 'like', "%{$search}%");
                })->orWhereHas('stockMovimento.consumivelTipo', function ($q2) use ($search) {
                    $q2->where('nome', 'like', "%{$search}%");
                })->orWhereHas('stockMovimento', function ($q2) use ($search) {
                    $q2->where('referencia', 'like', "%{$search}%");
                });
            });
        }

        if ($categoria) {
            $query->whereHas('stockMovimento.consumivelTipo', function ($q) use ($categoria) {
                $q->where('categoria', $categoria);
            });
        }

        if ($dataInicio) {
            $query->whereDate('created_at', '>=', $dataInicio);
        }

        if ($dataFim) {
            $query->whereDate('created_at', '<=', $dataFim);
        }

        $consumos = $query->orderByDesc('created_at')->get();

        return Inertia::render('consumos/print', [
            'consumos' => $consumos,
        ]);
    }

    public function store(ConsumoRequest $request, Surgery $surgery): RedirectResponse
    {
        $validated  = $request->validated();
        $quantidade = (int) ($validated['quantidade'] ?? 1);

        DB::transaction(function () use ($validated, $quantidade, $surgery) {
            if (!empty($validated['stock_movimento_id'])) {
                // Vidas: decremento directo com lock
                $movimento = StockMovimento::with('consumivelTipo')
                    ->lockForUpdate()
                    ->findOrFail($validated['stock_movimento_id']);

                if ($movimento->consumivelTipo?->categoria === ConsumivelTipo::CAT_ROBOTICO_VIDAS) {
                    $movimento->decrement('vidas_atual', $quantidade);
                } else {
                    $movimento->decrement('unidades_atual', $quantidade);
                }

                $surgery->consumos()->create([
                    'stock_movimento_id' => $movimento->id,
                    'quantidade'         => $quantidade,
                    'observacoes'        => $validated['observacoes'] ?? null,
                ]);
            } else {
                // Agrupado: FIFO automático
                $this->consumirFifo(
                    $surgery,
                    (int) $validated['consumivel_tipo_id'],
                    $validated['referencia'] ?? null,
                    $quantidade,
                    $validated['observacoes'] ?? null
                );
            }
        });

        return redirect()->back()
            ->with('success', 'Consumo adicionado.');
    }

    public function update(ConsumoRequest $request, Surgery $surgery, Consumo $consumo): RedirectResponse
    {
        $validated  = $request->validated();
        $novaQty    = (int) ($validated['quantidade'] ?? $consumo->quantidade);
        $diff       = $novaQty - (int) $consumo->quantidade; // positivo = usou mais

        if ($diff !== 0) {
            $movimento = $consumo->stockMovimento()->with('consumivelTipo')->first();
            if ($movimento) {
                if ($movimento->consumivelTipo?->categoria === ConsumivelTipo::CAT_ROBOTICO_VIDAS) {
                    DB::table('stock_movimentos')
                        ->where('id', $movimento->id)
                        ->update(['vidas_atual' => DB::raw('GREATEST(COALESCE(vidas_atual, 0) - ' . $diff . ', 0)')]);
                } else {
                    DB::table('stock_movimentos')
                        ->where('id', $movimento->id)
                        ->update(['unidades_atual' => DB::raw('GREATEST(COALESCE(unidades_atual, 0) - ' . $diff . ', 0)')]);
                }
            }
        }

        $consumo->update($validated);

        return redirect()->back()
            ->with('success', 'Consumo actualizado.');
    }

    public function destroy(Surgery $surgery, Consumo $consumo): RedirectResponse
    {
        // Restaurar stock
        $movimento = $consumo->stockMovimento()->with('consumivelTipo')->first();
        if ($movimento) {
            if ($movimento->consumivelTipo?->categoria === ConsumivelTipo::CAT_ROBOTICO_VIDAS) {
                DB::table('stock_movimentos')
                    ->where('id', $movimento->id)
                    ->update(['vidas_atual' => DB::raw('COALESCE(vidas_atual, 0) + ' . (int)$consumo->quantidade)]);
            } else {
                DB::table('stock_movimentos')
                    ->where('id', $movimento->id)
                    ->update(['unidades_atual' => DB::raw('COALESCE(unidades_atual, 0) + ' . (int)$consumo->quantidade)]);
            }
        }

        $consumo->delete();

        return redirect()->back()
            ->with('success', 'Consumo eliminado.');
    }

    public function storeBatch(Request $request, Surgery $surgery): RedirectResponse
    {
        $request->validate([
            'items'                      => ['required', 'array', 'min:1'],
            'items.*.stock_movimento_id' => ['nullable', 'integer', 'exists:stock_movimentos,id'],
            'items.*.consumivel_tipo_id' => ['nullable', 'integer', 'exists:consumivel_tipos,id'],
            'items.*.referencia'         => ['nullable', 'string', 'max:255'],
            'items.*.quantidade'         => ['required', 'integer', 'min:1'],
            'items.*.observacoes'        => ['nullable', 'string', 'max:255'],
        ]);

        DB::transaction(function () use ($request, $surgery) {
            foreach ($request->input('items') as $item) {
                $quantidade = (int) $item['quantidade'];

                if (!empty($item['stock_movimento_id'])) {
                    // Vidas: decremento directo com lock
                    $movimento = StockMovimento::lockForUpdate()->findOrFail($item['stock_movimento_id']);
                    $movimento->decrement('vidas_atual', $quantidade);

                    $surgery->consumos()->create([
                        'stock_movimento_id' => $movimento->id,
                        'quantidade'         => $quantidade,
                        'observacoes'        => $item['observacoes'] ?? null,
                    ]);
                } else {
                    // Agrupado: FIFO automático
                    $this->consumirFifo(
                        $surgery,
                        (int) $item['consumivel_tipo_id'],
                        $item['referencia'] ?? null,
                        $quantidade,
                        $item['observacoes'] ?? null
                    );
                }
            }
        });

        $n = count($request->input('items'));
        return redirect()->back()
            ->with('success', $n . ' consumo' . ($n !== 1 ? 's' : '') . ' adicionado' . ($n !== 1 ? 's' : '') . '.');
    }

    /**
     * Distribui o consumo de material agrupado por FIFO (data_entrada ASC).
     * Cria um registo de Consumo por cada StockMovimento necessário.
     * Deve ser chamado dentro de DB::transaction.
     */
    private function consumirFifo(
        Surgery $surgery,
        int $consumivelTipoId,
        ?string $referencia,
        int $quantidade,
        ?string $observacoes
    ): void {
        $movimentos = StockMovimento::where('consumivel_tipo_id', $consumivelTipoId)
            ->where('referencia', $referencia)
            ->where('unidades_atual', '>', 0)
            ->orderBy('data_entrada')
            ->lockForUpdate()
            ->get();

        $restante = $quantidade;
        foreach ($movimentos as $mov) {
            if ($restante <= 0) break;
            $usar = min($restante, (int) $mov->unidades_atual);
            $mov->decrement('unidades_atual', $usar);
            $surgery->consumos()->create([
                'stock_movimento_id' => $mov->id,
                'quantidade'         => $usar,
                'observacoes'        => $observacoes,
            ]);
            $restante -= $usar;
        }
    }
}
