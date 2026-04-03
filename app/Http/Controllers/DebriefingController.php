<?php

namespace App\Http\Controllers;

use App\Http\Requests\DebriefingRequest;
use App\Models\Briefing;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class DebriefingController extends Controller
{
    public function create(Briefing $briefing): Response
    {
        return Inertia::render('debriefings/form', [
            'briefing'   => $briefing->only('id', 'data', 'hora', 'sala', 'especialidade'),
            'debriefing' => null,
        ]);
    }

    public function store(DebriefingRequest $request, Briefing $briefing): RedirectResponse
    {
        $briefing->debriefing()->create($request->validated());

        return redirect()->route('briefings.show', $briefing)
            ->with('success', 'Debriefing registado.');
    }

    public function edit(Briefing $briefing): Response
    {
        return Inertia::render('debriefings/form', [
            'briefing'   => $briefing->only('id', 'data', 'hora', 'sala', 'especialidade'),
            'debriefing' => $briefing->debriefing,
        ]);
    }

    public function update(DebriefingRequest $request, Briefing $briefing): RedirectResponse
    {
        $briefing->debriefing()->update($request->validated());

        return redirect()->route('briefings.show', $briefing)
            ->with('success', 'Debriefing actualizado.');
    }
}
