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
        return Inertia::render('consumos/index', [
            'surgery'  => $surgery->load('briefing'),
            'consumos' => $surgery->consumos()->orderBy('created_at')->get(),
        ]);
    }

    public function store(ConsumoRequest $request, Surgery $surgery): RedirectResponse
    {
        $validated = $request->validated();

        // Preencher campos a partir do StockMovimento se não enviados
        $movimento = StockMovimento::findOrFail($validated['stock_movimento_id']);
        $validated['designacao'] ??= $movimento->designacao ?? '';
        $validated['quantidade'] ??= 1;

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
        $consumo->delete();

        return redirect()->back()
            ->with('success', 'Consumo eliminado.');
    }
}
