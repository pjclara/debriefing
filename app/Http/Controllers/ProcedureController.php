<?php

namespace App\Http\Controllers;

use App\Models\Procedure;
use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProcedureController extends Controller
{
    public function index()
    {
        $procedures = Procedure::with('department')
            ->orderBy('nome')
            ->get();

        $departments = Department::orderBy('nome')->get();

        return Inertia::render('procedures/index', [
            'procedures' => $procedures,
            'departments' => $departments,
        ]);
    }

    public function create()
    {
        $departments = Department::orderBy('nome')->get();

        return Inertia::render('procedures/create', [
            'departments' => $departments,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255|unique:procedures',
            'descricao' => 'nullable|string',
            'codigo' => 'required|string|max:255|unique:procedures',
            'department_id' => 'required|integer|exists:departments,id',
            'ativo' => 'boolean',
        ]);

        Procedure::create($validated);

        return redirect()->route('procedures.index')
            ->with('success', 'Procedimento criado com sucesso.');
    }

    public function edit(Procedure $procedure)
    {
        $departments = Department::orderBy('nome')->get();

        return Inertia::render('procedures/edit', [
            'procedure' => $procedure,
            'departments' => $departments,
        ]);
    }

    public function update(Request $request, Procedure $procedure)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255|unique:procedures,nome,' . $procedure->id,
            'descricao' => 'nullable|string',
            'codigo' => 'required|string|max:255|unique:procedures,codigo,' . $procedure->id,
            'department_id' => 'required|integer|exists:departments,id',
            'ativo' => 'boolean',
        ]);

        $procedure->update($validated);

        return redirect()->route('procedures.index')
            ->with('success', 'Procedimento atualizado com sucesso.');
    }

    public function destroy(Procedure $procedure)
    {
        $procedure->delete();

        return redirect()->route('procedures.index')
            ->with('success', 'Procedimento eliminado com sucesso.');
    }
}
