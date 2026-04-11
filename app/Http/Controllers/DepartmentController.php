<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    public function index()
    {
        $departments = Department::with('service')
            ->orderBy('nome')
            ->get();

        return Inertia::render('departments/index', [
            'departments' => $departments,
        ]);
    }

    public function create()
    {
        $services = Service::orderBy('nome')->get();
        return Inertia::render('departments/create', [
            'services' => $services,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255|unique:departments',
            'descricao' => 'nullable|string',
            'codigo' => 'nullable|string|unique:departments',
            'service_id' => 'required|integer|exists:services,id',
            'ativo' => 'boolean',
        ]);

        Department::create($validated);

        return redirect()->route('departments.index')
            ->with('success', 'Departamento criado com sucesso.');
    }

    public function edit(Department $department)
    {
        $services = Service::orderBy('nome')->get();
        return Inertia::render('departments/edit', [
            'department' => $department,
            'services' => $services,
        ]);
    }

    public function update(Request $request, Department $department)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255|unique:departments,nome,' . $department->id,
            'descricao' => 'nullable|string',
            'codigo' => 'nullable|string|unique:departments,codigo,' . $department->id,
            'service_id' => 'required|integer|exists:services,id',
            'ativo' => 'boolean',
        ]);

        $department->update($validated);

        return redirect()->route('departments.index')
            ->with('success', 'Departamento atualizado com sucesso.');
    }


}
