<?php

namespace App\Http\Controllers;

use App\Http\Requests\ConsumoRequest;
use App\Models\Consumo;
use App\Models\ConsumivelTipo;
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

        $stockMovimentos = StockMovimento::with('consumivelTipo:id,nome,categoria')
            ->orderByDesc('data_entrada')
            ->get(['id', 'consumivel_tipo_id', 'tipo_mov', 'referencia', 'codigo', 'vidas_inicial', 'vidas_atual', 'unidades_inicial', 'unidades_atual', 'observacoes']);

        return Inertia::render('consumos/index', [
            'surgery'          => $surgery,
            'consumos'         => $surgery->consumos,
            'stockMovimentos'  => $stockMovimentos,
        ]);
    }

    public function historico(): Response
    {
        $consumos = Consumo::with([
            'surgery.briefing',
            'stockMovimento.consumivelTipo',
        ])
        ->orderByDesc('created_at')
        ->paginate(50);

        return Inertia::render('consumos/historico', [
            'consumos' => $consumos,
        ]);
    }

    public function printHistorico(): Response
    {
        $consumos = Consumo::with([
            'surgery.briefing',
            'stockMovimento.consumivelTipo',
        ])
        ->orderByDesc('created_at')
        ->get();

        return Inertia::render('consumos/print', [
            'consumos' => $consumos,
        ]);
    }

    public function store(ConsumoRequest $request, Surgery $surgery): RedirectResponse
    {
        $validated = $request->validated();
        $quantidade = $validated['quantidade'] ?? 1;

        $movimento = StockMovimento::with('consumivelTipo')->findOrFail($validated['stock_movimento_id']);

        // Abater stock
        if ($movimento->consumivelTipo?->categoria === ConsumivelTipo::CAT_ROBOTICO_VIDAS) {
            DB::table('stock_movimentos')
                ->where('id', $movimento->id)
                ->update(['vidas_atual' => DB::raw('GREATEST(COALESCE(vidas_atual, 0) - ' . (int)$quantidade . ', 0)')]);
        } else {
            DB::table('stock_movimentos')
                ->where('id', $movimento->id)
                ->update(['unidades_atual' => DB::raw('GREATEST(COALESCE(unidades_atual, 0) - ' . (int)$quantidade . ', 0)')]);
        }

        $surgery->consumos()->create($validated);

        return redirect()->back()
            ->with('success', 'Consumo adicionado.');
    }

    public function update(ConsumoRequest $request, Surgery $surgery, Consumo $consumo): RedirectResponse
    {
        $consumo->update($request->validated());

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
            'items'                       => ['required', 'array', 'min:1'],
            'items.*.stock_movimento_id'  => ['required', 'integer', 'exists:stock_movimentos,id'],
            'items.*.quantidade'          => ['required', 'integer', 'min:1'],
            'items.*.observacoes'         => ['nullable', 'string', 'max:255'],
        ]);

        DB::transaction(function () use ($request, $surgery) {
            foreach ($request->input('items') as $item) {
                $quantidade = (int) $item['quantidade'];
                $movimento  = StockMovimento::with('consumivelTipo')->findOrFail($item['stock_movimento_id']);

                if ($movimento->consumivelTipo?->categoria === ConsumivelTipo::CAT_ROBOTICO_VIDAS) {
                    DB::table('stock_movimentos')
                        ->where('id', $movimento->id)
                        ->update(['vidas_atual' => DB::raw('GREATEST(COALESCE(vidas_atual, 0) - ' . $quantidade . ', 0)')]);
                } else {
                    DB::table('stock_movimentos')
                        ->where('id', $movimento->id)
                        ->update(['unidades_atual' => DB::raw('GREATEST(COALESCE(unidades_atual, 0) - ' . $quantidade . ', 0)')]);
                }

                $surgery->consumos()->create([
                    'stock_movimento_id' => $item['stock_movimento_id'],
                    'quantidade'         => $quantidade,
                    'observacoes'        => $item['observacoes'] ?? null,
                ]);
            }
        });

        $n = count($request->input('items'));
        return redirect()->back()
            ->with('success', $n . ' consumo' . ($n !== 1 ? 's' : '') . ' adicionado' . ($n !== 1 ? 's' : '') . '.');
    }
}
