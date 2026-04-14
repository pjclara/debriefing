<?php

namespace App\Http\Controllers;

use App\Http\Requests\StockMovimentoRequest;
use App\Models\Consumivel;
use App\Models\Consumo;
use App\Models\StockMovimento;
use App\Models\Surgery;
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

    /**
     * Criar movimento de stock e associar à cirurgia
     */
    public function storeForSurgery(StockMovimentoRequest $request, Surgery $surgery): RedirectResponse
    {
        $validated = $request->validated();
        
        // Crear o movimento de stock
        $movimento = StockMovimento::create($validated);
        
        // Refresh relação para ter consumível carregado
        $movimento->load('consumivel');
        
        // Criar o consumo vinculando a cirurgia ao movimento de stock
        Consumo::create([
            'surgery_id' => $surgery->id,
            'stock_movimento_id' => $movimento->id,
            'consumivel_id' => $validated['consumivel_id'],
            'designacao' => $movimento->consumivel?->designacao ?? '',
            'unidade' => $movimento->consumivel?->unidade ?? 'un',
            'quantidade' => $validated['vidas_inicial'] ?? 0, // Quantidade = vidas
        ]);

        return redirect()->back()->with('success', 'Movimento de stock adicionado à cirurgia!');
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
