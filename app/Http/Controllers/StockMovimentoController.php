<?php

namespace App\Http\Controllers;

use App\Models\ConsumivelTipo;
use App\Models\StockMovimento;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockMovimentoController extends Controller
{
    public function index()
    {
        $movimentos = StockMovimento::with('tipo')
            ->orderByDesc('data_entrada')
            ->paginate(50);

        return Inertia::render('stock_movimentos/index', [
            'movimentos' => $movimentos,
            'tiposMovLabel' => StockMovimento::$tiposMovLabel,
        ]);
    }

    public function create()
    {
        $tipos = ConsumivelTipo::where('ativo', true)->orderBy('nome')->get();

        return Inertia::render('stock_movimentos/form', [
            'tipos' => $tipos,
            'tiposMovLabel' => StockMovimento::$tiposMovLabel,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'consumivel_tipo_id' => ['required', 'exists:consumivel_tipos,id'],
            'tipo_mov' => ['required', 'in:entrada,saida,ajuste,encomenda,devolucao'],
            'referencia' => ['nullable', 'string', 'max:100'],
            'codigo' => ['nullable', 'string', 'max:100'],
            'vidas' => ['nullable', 'integer', 'min:1'],
            'data_entrada' => ['required', 'date'],
            'observacoes' => ['nullable', 'string'],
        ]);

        StockMovimento::create($validated);

        return redirect('/stock_movimentos')->with('success', 'Movimento de stock registado com sucesso!');
    }

    public function edit(StockMovimento $stock_movimento)
    {
        $tipos = ConsumivelTipo::where('ativo', true)->orderBy('nome')->get();

        return Inertia::render('stock_movimentos/form', [
            'movimento' => $stock_movimento->load('tipo'),
            'tipos' => $tipos,
            'tiposMovLabel' => StockMovimento::$tiposMovLabel,
        ]);
    }

    public function update(Request $request, StockMovimento $stock_movimento)
    {
        $validated = $request->validate([
            'consumivel_tipo_id' => ['required', 'exists:consumivel_tipos,id'],
            'tipo_mov' => ['required', 'in:entrada,saida,ajuste,encomenda,devolucao'],
            'referencia' => ['nullable', 'string', 'max:100'],
            'codigo' => ['nullable', 'string', 'max:100'],
            'vidas' => ['nullable', 'integer', 'min:1'],
            'data_entrada' => ['required', 'date'],
            'observacoes' => ['nullable', 'string'],
        ]);

        $stock_movimento->update($validated);

        return redirect('/stock_movimentos')->with('success', 'Movimento de stock atualizado com sucesso!');
    }

    public function destroy(StockMovimento $stock_movimento)
    {
        $stock_movimento->delete();

        return redirect('/stock_movimentos')->with('success', 'Movimento de stock eliminado com sucesso!');
    }
}
