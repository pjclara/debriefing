<?php

namespace App\Http\Controllers;

use App\Http\Requests\BriefingRequest;
use App\Models\Briefing;
use App\Models\Department;
use App\Models\StockMovimento;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class BriefingController extends Controller
{
    public function index(): Response
    {
        $briefings = Briefing::withCount('surgeries')
            ->orderByDesc('data')
            ->orderByDesc('hora')
            ->get();

        return Inertia::render('briefings/index', ['briefings' => $briefings]);
    }

    public function create(): Response
    {
        $departments = Department::where('ativo', true)
            ->orderBy('nome')
            ->get(['id', 'nome']);

        return Inertia::render('briefings/form', ['departments' => $departments]);
    }

    public function store(BriefingRequest $request): RedirectResponse
    {
        $briefing = Briefing::create($request->validated());

        return redirect()->route('briefings.show', $briefing)
            ->with('success', 'Briefing criado. Adicione agora as cirurgias.');
    }

    public function show(Briefing $briefing): Response
    {
        $briefing->load([
            'surgeries.consumos.stockMovimento',
            'debriefing',
        ]);

        // Stock movimentos disponíveis para associar a cirurgias
        $stockMovimentos = StockMovimento::with('consumivelTipo:id,nome,categoria')
            ->orderByDesc('data_entrada')
            ->get(['id', 'consumivel_tipo_id', 'tipo_mov', 'referencia', 'vidas_inicial', 'vidas_atual', 'unidades', 'data_entrada', 'observacoes']);

        return Inertia::render('briefings/show', [
            'briefing' => $briefing,
            'stockMovimentos' => $stockMovimentos,
        ]);
    }

    public function print(Briefing $briefing): Response
    {
        $briefing->load(['surgeries.consumos', 'debriefing']);

        return Inertia::render('briefings/print', ['briefing' => $briefing]);
    }

    public function edit(Briefing $briefing): Response
    {
        $departments = Department::where('ativo', true)
            ->orderBy('nome')
            ->get(['id', 'nome']);

        return Inertia::render('briefings/form', [
            'briefing' => $briefing,
            'departments' => $departments,
        ]);
    }

    public function update(BriefingRequest $request, Briefing $briefing): RedirectResponse
    {
        $briefing->update($request->validated());

        return redirect()->route('briefings.show', $briefing)
            ->with('success', 'Briefing actualizado.');
    }

    public function destroy(Briefing $briefing): RedirectResponse
    {
        $briefing->delete();

        return redirect()->route('briefings.index')
            ->with('success', 'Briefing eliminado.');
    }
}
