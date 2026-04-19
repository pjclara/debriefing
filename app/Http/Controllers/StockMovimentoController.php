<?php

namespace App\Http\Controllers;

use App\Http\Requests\StockMovimentoRequest;
use App\Models\ConsumivelTipo;
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
            ->paginate(50)
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
        $stock_movimento->update($request->validated());

        return redirect()->back()->with('success', 'Movimento de stock atualizado com sucesso!');
    }

    public function destroy(StockMovimento $stock_movimento): RedirectResponse
    {
        $stock_movimento->delete();

        return redirect('/stock_movimentos')->with('success', 'Movimento de stock eliminado com sucesso!');
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
