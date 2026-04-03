<?php

namespace App\Http\Controllers;

use App\Http\Requests\StockMovimentoRequest;
use App\Models\Consumivel;
use App\Models\StockMovimento;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class StockController extends Controller
{
    public function index(Consumivel $consumivel): Response
    {
        return Inertia::render('stock/index', [
            'consumivel'  => $consumivel,
            'movimentos'  => $consumivel->stockMovimentos()
                                ->orderByDesc('data_movimento')
                                ->orderByDesc('id')
                                ->get(),
            'tiposLabel'  => StockMovimento::$tiposLabel,
        ]);
    }

    public function store(StockMovimentoRequest $request, Consumivel $consumivel): RedirectResponse
    {
        $movimento = $consumivel->stockMovimentos()->create(
            array_merge($request->validated(), ['consumivel_id' => $consumivel->id])
        );

        $consumivel->recalcularStock();

        return redirect()->route('consumiveis.stock.index', $consumivel)
            ->with('success', 'Movimento registado.');
    }

    public function destroy(Consumivel $consumivel, StockMovimento $movimento): RedirectResponse
    {
        $movimento->delete();
        $consumivel->recalcularStock();

        return redirect()->route('consumiveis.stock.index', $consumivel)
            ->with('success', 'Movimento eliminado.');
    }
}
