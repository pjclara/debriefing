<?php

namespace App\Http\Controllers;

use App\Http\Requests\SurgeryRequest;
use App\Models\Briefing;
use App\Models\Surgery;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class SurgeryController extends Controller
{
    public function create(Briefing $briefing): Response
    {
        return Inertia::render('surgeries/form', [
            'briefing' => $briefing->only('id', 'data', 'hora', 'sala', 'especialidade'),
        ]);
    }

    public function store(SurgeryRequest $request, Briefing $briefing): RedirectResponse
    {
        $briefing->surgeries()->create($request->validated());

        return redirect()->route('briefings.show', $briefing)
            ->with('success', 'Cirurgia adicionada.');
    }

    public function edit(Surgery $surgery): Response
    {
        return Inertia::render('surgeries/form', [
            'surgery' => $surgery,
            'briefing' => $surgery->briefing->only('id', 'data', 'hora', 'sala', 'especialidade'),
        ]);
    }

    public function update(SurgeryRequest $request, Surgery $surgery): RedirectResponse
    {
        $surgery->update($request->validated());

        return redirect()->route('briefings.show', $surgery->briefing_id)
            ->with('success', 'Cirurgia actualizada.');
    }

    public function destroy(Surgery $surgery): RedirectResponse
    {
        $briefingId = $surgery->briefing_id;
        $surgery->delete();

        return redirect()->route('briefings.show', $briefingId)
            ->with('success', 'Cirurgia eliminada.');
    }
}

