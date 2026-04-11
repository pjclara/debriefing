<?php

namespace App\Http\Controllers;

use App\Http\Requests\ConsumoRequest;
use App\Models\Consumo;
use App\Models\Surgery;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class ConsumoController extends Controller
{
    public function indexAll(): Response
    {
        $consumos = Consumo::with(['surgery.briefing'])
            ->orderByDesc('created_at')
            ->get()
            ->groupBy('surgery_id');

        return Inertia::render('consumos/all', [
            'groups' => $consumos->map(function ($items, $surgeryId) {
                $surgery = $items->first()->surgery;
                return [
                    'surgery'  => $surgery->only('id', 'processo', 'procedimento'),
                    'briefing' => $surgery->briefing->only('id', 'data', 'sala', 'especialidade'),
                    'consumos' => $items->values(),
                ];
            })->values(),
        ]);
    }

    public function index(Surgery $surgery): Response
    {
        return Inertia::render('consumos/index', [
            'surgery'  => $surgery->load('briefing'),
            'consumos' => $surgery->consumos()->orderBy('created_at')->get(),
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
