<?php

namespace App\Http\Controllers;

use App\Http\Requests\StockMovimentoRequest;
use App\Models\Consumivel;
use App\Models\StockMovimento;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class StockMovimentoController extends Controller
{
    public function index(): Response
    {
        $movimentos = StockMovimento::with('consumivel')
            ->orderByDesc('data_entrada')
            ->paginate(50);

        return Inertia::render('stock_movimentos/index', [
            'movimentos' => $movimentos,
            'tiposMovLabel' => StockMovimento::$tiposMovLabel,
        ]);
    }

    public function create(): Response
    {
        $consumiveis = Consumivel::where('ativo', true)
            ->orderBy('categoria')
            ->orderBy('designacao')
            ->get(['id', 'designacao', 'categoria']);

        return Inertia::render('stock_movimentos/form', [
            'consumiveis' => $consumiveis,
            'tiposMovLabel' => StockMovimento::$tiposMovLabel,
        ]);
    }

    public function store(StockMovimentoRequest $request): RedirectResponse
    {
        StockMovimento::create($request->validated());

        return redirect('/stock_movimentos')->with('success', 'Movimento de stock registado com sucesso!');
    }

    public function edit(StockMovimento $stock_movimento): Response
    {
        $consumiveis = Consumivel::where('ativo', true)
            ->orderBy('categoria')
            ->orderBy('designacao')
            ->get(['id', 'designacao', 'categoria']);

        return Inertia::render('stock_movimentos/form', [
            'movimento' => $stock_movimento->load('consumivel'),
            'consumiveis' => $consumiveis,
            'tiposMovLabel' => StockMovimento::$tiposMovLabel,
        ]);
    }

    public function update(StockMovimentoRequest $request, StockMovimento $stock_movimento): RedirectResponse
    {
        $stock_movimento->update($request->validated());

        return redirect('/stock_movimentos')->with('success', 'Movimento de stock atualizado com sucesso!');
    }

    public function destroy(StockMovimento $stock_movimento): RedirectResponse
    {
        $stock_movimento->delete();

        return redirect('/stock_movimentos')->with('success', 'Movimento de stock eliminado com sucesso!');
    }
}
