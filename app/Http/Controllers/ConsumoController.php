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
            'surgery'     => $surgery->load('briefing'),
            'consumos'    => $surgery->consumos()->orderBy('created_at')->get(),
            'consumiveis' => Consumivel::where('ativo', true)->orderBy('categoria')->orderBy('designacao')->get(['id','designacao','categoria','unidade']),
        ]);
    }

    public function store(ConsumoRequest $request, Surgery $surgery): RedirectResponse
    {
        $surgery->consumos()->create($request->validated());

        $this->recalcularSeNecessario($request->input('consumivel_id'));

        return redirect()->back()
            ->with('success', 'Consumo adicionado.');
    }

    public function update(ConsumoRequest $request, Surgery $surgery, Consumo $consumo): RedirectResponse
    {
        $oldConsumivelId = $consumo->consumivel_id;
        $consumo->update($request->validated());

        // Recalcular o consumível anterior e o novo (podem ser diferentes)
        $this->recalcularSeNecessario($oldConsumivelId);
        if ($request->input('consumivel_id') != $oldConsumivelId) {
            $this->recalcularSeNecessario($request->input('consumivel_id'));
        }

        return redirect()->back()
            ->with('success', 'Consumo actualizado.');
    }

    public function destroy(Surgery $surgery, Consumo $consumo): RedirectResponse
    {
        $consumivelId = $consumo->consumivel_id;
        $consumo->delete();

        $this->recalcularSeNecessario($consumivelId);

        return redirect()->back()
            ->with('success', 'Consumo eliminado.');
    }

    private function recalcularSeNecessario(?int $consumivelId): void
    {
        if ($consumivelId) {
            Consumivel::find($consumivelId)?->recalcularStock();
        }
    }
}
