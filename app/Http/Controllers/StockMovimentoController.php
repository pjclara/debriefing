<?php

namespace App\Http\Controllers;

use App\Http\Requests\StockMovimentoRequest;
use App\Models\ConsumivelTipo;
use App\Models\Consumo;
use App\Models\StockMovimento;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class StockMovimentoController extends Controller
{
    public function index(Request $request): Response
    {
        $q      = $request->input('q');
        $tipo   = $request->input('tipo');
        $dataDE = $request->input('data_de');
        $dataATE = $request->input('data_ate');

        $movimentos = StockMovimento::with('consumivelTipo')
            ->when($q, function ($query) use ($q) {
                $query->where(function ($sub) use ($q) {
                    $sub->whereHas('consumivelTipo', fn($ct) => $ct->where('nome', 'like', "%{$q}%"))
                        ->orWhere('referencia', 'like', "%{$q}%")
                        ->orWhere('codigo', 'like', "%{$q}%");
                });
            })
            ->when($tipo, fn($query) => $query->where('tipo_mov', $tipo))
            ->when($dataDE, fn($query) => $query->whereDate('data_entrada', '>=', $dataDE))
            ->when($dataATE, fn($query) => $query->whereDate('data_entrada', '<=', $dataATE))
            ->orderByDesc('data_entrada')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('stock_movimentos/index', [
            'movimentos'    => $movimentos,
            'tiposMovLabel' => StockMovimento::$tiposMovLabel,
            'filters'       => $request->only(['q', 'tipo', 'data_de', 'data_ate']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('stock_movimentos/form', [
            'tiposMovLabel' => StockMovimento::$tiposMovLabel,
            'tipos' => ConsumivelTipo::where('ativo', true)->orderBy('categoria')->orderBy('nome')->get(),
        ]);
    }

    public function store(StockMovimentoRequest $request): RedirectResponse
    {
        $data = $request->validated();

        // Garantir que o valor actual é igual ao inicial no momento da criação
        if (isset($data['vidas_inicial'])) {
            $data['vidas_atual'] = $data['vidas_inicial'];
        }
        if (isset($data['unidades_inicial'])) {
            $data['unidades_atual'] = $data['unidades_inicial'];
        }

        StockMovimento::create($data);

        return redirect('/stock_movimentos')->with('success', 'Movimento de stock registado com sucesso!');
    }

    public function edit(StockMovimento $stock_movimento): Response
    {
        return Inertia::render('stock_movimentos/form', [
            'movimento' => $stock_movimento->load('consumivelTipo'),
            'tiposMovLabel' => StockMovimento::$tiposMovLabel,
            'tipos' => ConsumivelTipo::where('ativo', true)->orderBy('categoria')->orderBy('nome')->get(),
        ]);
    }

    public function update(StockMovimentoRequest $request, StockMovimento $stock_movimento): RedirectResponse
    {
        $data = $request->validated();

        // Se o valor "inicial" for corrigido manualmente (ex.: erro de
        // introdução de dados), o valor "atual" tem de ser recalculado a
        // partir dos consumos realmente registados — nunca fica apenas
        // como estava antes, para não voltar a desalinhar-se da realidade.
        $consumido = null;

        if (array_key_exists('vidas_inicial', $data)
            && $data['vidas_inicial'] !== null
            && (int) $data['vidas_inicial'] !== (int) $stock_movimento->vidas_inicial
        ) {
            $consumido ??= (int) Consumo::where('stock_movimento_id', $stock_movimento->id)->sum('quantidade');
            $data['vidas_atual'] = max(0, (int) $data['vidas_inicial'] - $consumido);
        }

        if (array_key_exists('unidades_inicial', $data)
            && $data['unidades_inicial'] !== null
            && (int) $data['unidades_inicial'] !== (int) $stock_movimento->unidades_inicial
        ) {
            $consumido ??= (int) Consumo::where('stock_movimento_id', $stock_movimento->id)->sum('quantidade');
            $data['unidades_atual'] = max(0, (int) $data['unidades_inicial'] - $consumido);
        }

        $stock_movimento->update($data);

        return redirect()->back()->with('success', 'Movimento de stock atualizado com sucesso!');
    }

    public function destroy(StockMovimento $stock_movimento): RedirectResponse
    {
        $stock_movimento->delete();

        return redirect('/stock_movimentos')->with('success', 'Movimento de stock eliminado com sucesso!');
    }

    /**
     * Confirma manualmente que o desvio atual entre "vidas_atual" e o valor
     * calculado a partir dos consumos registados é conhecido e correto
     * (ex.: uso real não logado enquanto o instrumento esteve invisível na
     * lista de seleção). Fixa um ponto de partida (vidas_atual + total de
     * consumos neste momento) a partir do qual novos desvios voltam a ser
     * detetados normalmente.
     */
    public function reconciliarVidas(StockMovimento $stock_movimento): RedirectResponse
    {
        $consumido = (int) Consumo::where('stock_movimento_id', $stock_movimento->id)->sum('quantidade');

        $stock_movimento->update([
            'vidas_reconciliado_em'        => now(),
            'vidas_atual_na_reconciliacao' => (int) $stock_movimento->vidas_atual,
            'consumos_na_reconciliacao'    => $consumido,
        ]);

        return redirect()->back()->with('success', 'Vidas reconciliadas manualmente com sucesso.');
    }

    public function print(Request $request): Response
    {
        $q       = $request->input('q');
        $tipo    = $request->input('tipo');
        $dataDE  = $request->input('data_de');
        $dataATE = $request->input('data_ate');

        $movimentos = StockMovimento::with('consumivelTipo')
            ->when($q, function ($query) use ($q) {
                $query->where(function ($sub) use ($q) {
                    $sub->whereHas('consumivelTipo', fn($ct) => $ct->where('nome', 'like', "%{$q}%"))
                        ->orWhere('referencia', 'like', "%{$q}%")
                        ->orWhere('codigo', 'like', "%{$q}%");
                });
            })
            ->when($tipo, fn($query) => $query->where('tipo_mov', $tipo))
            ->when($dataDE, fn($query) => $query->whereDate('data_entrada', '>=', $dataDE))
            ->when($dataATE, fn($query) => $query->whereDate('data_entrada', '<=', $dataATE))
            ->orderByDesc('data_entrada')
            ->get();

        return Inertia::render('stock_movimentos/print', [
            'movimentos'    => $movimentos,
            'tiposMovLabel' => StockMovimento::$tiposMovLabel,
            'filters'       => $request->only(['q', 'tipo', 'data_de', 'data_ate']),
        ]);
    }
}
