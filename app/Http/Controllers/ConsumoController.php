<?php

namespace App\Http\Controllers;

use App\Http\Requests\ConsumoRequest;
use App\Models\Consumo;
use App\Models\StockMovimento;
use App\Models\Surgery;
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
            ->get(['id', 'consumivel_tipo_id', 'tipo_mov', 'referencia', 'codigo', 'vidas_inicial', 'vidas_atual', 'unidades', 'observacoes']);

        return Inertia::render('consumos/index', [
            'surgery'          => $surgery,
            'consumos'         => $surgery->consumos,
            'stockMovimentos'  => $stockMovimentos,
        ]);
    }

    public function store(ConsumoRequest $request, Surgery $surgery): RedirectResponse
    {
        $surgery->consumos()->create($request->validated());

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
        $consumo->delete();

        return redirect()->back()
            ->with('success', 'Consumo eliminado.');
    }
}
