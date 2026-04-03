<?php

namespace App\Http\Controllers;

use App\Http\Requests\BriefingRequest;
use App\Models\Briefing;
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
        return Inertia::render('briefings/form');
    }

    public function store(BriefingRequest $request): RedirectResponse
    {
        $briefing = Briefing::create($request->validated());

        return redirect()->route('briefings.show', $briefing)
            ->with('success', 'Briefing criado. Adicione agora as cirurgias.');
    }

    public function show(Briefing $briefing): Response
    {
        $briefing->load('surgeries', 'debriefing');

        return Inertia::render('briefings/show', ['briefing' => $briefing]);
    }

    public function edit(Briefing $briefing): Response
    {
        return Inertia::render('briefings/form', ['briefing' => $briefing]);
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
