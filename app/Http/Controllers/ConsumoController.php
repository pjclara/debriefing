<?php

namespace App\Http\Controllers;

use App\Http\Requests\ConsumoRequest;
use App\Models\Consumivel;
use App\Models\Consumo;
use App\Models\Surgery;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class ConsumoController extends Controller
{
    public function index(Surgery $surgery): Response
    {
        // Consumíveis com stock disponível
        $consumiveis = Consumivel::where('ativo', true)
            ->where('tem_stock', true)
            ->where('stock_atual', '>', 0)
            ->orderBy('designacao')
            ->get(['id', 'designacao', 'referencia', 'categoria', 'stock_atual', 'stock_minimo']);

        return Inertia::render('consumos/index', [
            'surgery'      => $surgery->load('briefing'),
            'consumos'     => $surgery->consumos()->orderBy('created_at')->get(),
            'consumiveis'  => $consumiveis,
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
