<?php

namespace App\Http\Controllers;

use App\Http\Requests\SurgeryRequest;
use App\Models\Briefing;
use App\Models\ConsumivelTipo;
use App\Models\Department;
use App\Models\Procedure;
use App\Models\Surgery;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class SurgeryController extends Controller
{
    public function create(Briefing $briefing): Response
    {
        $department = Department::where('nome', $briefing->especialidade)->first();
        $procedures = $department
            ? Procedure::where('department_id', $department->id)
                ->where('ativo', true)
                ->orderBy('nome')
                ->get(['id', 'nome'])
            : [];

        $consumivel_tipos = ConsumivelTipo::orderBy('nome')->get(['id', 'nome', 'categoria']);
        $consumivel_tipos_extra = $consumivel_tipos->where('categoria', 'extra')->values();

        return Inertia::render('surgeries/form', [
            'briefing' => $briefing->only('id', 'data', 'hora', 'sala', 'especialidade'),
            'procedures' => $procedures,
            'consumivel_tipos' => $consumivel_tipos,
            'consumivel_tipos_extra' => $consumivel_tipos_extra,
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
        $briefing = $surgery->briefing;
        $department = Department::where('nome', $briefing->especialidade)->first();
        $procedures = $department
            ? Procedure::where('department_id', $department->id)
                ->where('ativo', true)
                ->orderBy('nome')
                ->get(['id', 'nome'])
            : [];

        $consumivel_tipos = ConsumivelTipo::orderBy('nome')->get(['id', 'nome', 'categoria']);
        $consumivel_tipos_extra = $consumivel_tipos->where('categoria', 'extra')->values();

        return Inertia::render('surgeries/form', [
            'surgery' => $surgery,
            'briefing' => $briefing->only('id', 'data', 'hora', 'sala', 'especialidade'),
            'procedures' => $procedures,
            'consumivel_tipos' => $consumivel_tipos,
            'consumivel_tipos_extra' => $consumivel_tipos_extra,
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

