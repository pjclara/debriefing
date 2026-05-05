<?php

namespace App\Http\Controllers;

use App\Http\Requests\BriefingRequest;
use App\Models\Briefing;
use App\Models\ConsumivelTipo;
use App\Models\Department;
use App\Models\Stock;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class BriefingController extends Controller
{
    public function index(Request $request): Response
    {
        $search     = $request->input('search');
        $dataInicio = $request->input('data_inicio');
        $dataFim    = $request->input('data_fim');

        $briefings = Briefing::withCount('surgeries')
            ->when($search, function ($q) use ($search) {
                $q->where(function ($q2) use ($search) {
                    $q2->where('especialidade', 'like', "%{$search}%")
                       ->orWhere('sala', 'like', "%{$search}%");
                });
            })
            ->when($dataInicio, fn($q) => $q->whereDate('data', '>=', $dataInicio))
            ->when($dataFim,    fn($q) => $q->whereDate('data', '<=', $dataFim))
            ->orderByDesc('data')
            ->orderByDesc('hora')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('briefings/index', [
            'briefings' => $briefings,
            'filters'   => [
                'search'      => $search ?? '',
                'data_inicio' => $dataInicio ?? '',
                'data_fim'    => $dataFim ?? '',
            ],
        ]);
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
            'surgeries.consumos.stockMovimento.consumivelTipo',
            'debriefing',
        ]);

        $stockItems = Stock::orderBy('consumivel_nome')
            ->orderBy('codigo')
            ->get();

        return Inertia::render('briefings/show', [
            'briefing'   => $briefing,
            'stockItems' => $stockItems,
        ]);
    }

    public function print(Briefing $briefing): Response
    {
        $briefing->load([
            'surgeries.consumos.stockMovimento.consumivelTipo',
            'debriefing',
        ]);

        // Mapa id → nome para resolver b1/b2/b3/b4/equipamento_extra
        $consumivelTipos = ConsumivelTipo::orderBy('nome')->pluck('nome', 'id');

        return Inertia::render('briefings/print', [
            'briefing'        => $briefing,
            'consumivelTipos' => $consumivelTipos,
        ]);
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
