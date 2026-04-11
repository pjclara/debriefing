<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceController extends Controller
{
    public function index()
    {
        $services = Service::with('departments')
            ->orderBy('nome')
            ->get();

        $departments = Department::orderBy('nome')->get();

        return Inertia::render('services/index', [
            'services' => $services,
            'departments' => $departments,
        ]);
    }

    public function create()
    {
        return Inertia::render('services/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255|unique:services',
            'descricao' => 'nullable|string',
            'codigo' => 'required|string|max:255|unique:services',
            'ativo' => 'boolean',
        ]);

        Service::create($validated);

        return redirect()->route('services.index')
            ->with('success', 'Serviço criado com sucesso.');
    }

    public function edit(Service $service)
    {
        return Inertia::render('services/edit', [
            'service' => $service,
        ]);
    }

    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255|unique:services,nome,' . $service->id,
            'descricao' => 'nullable|string',
            'codigo' => 'required|string|max:255|unique:services,codigo,' . $service->id,
            'ativo' => 'boolean',
        ]);

        $service->update($validated);

        return redirect()->route('services.index')
            ->with('success', 'Serviço atualizado com sucesso.');
    }

    public function show(Service $service)
    {
        $service->load('departments');

        return Inertia::render('services/show', [
            'service' => $service,
        ]);
    }

    public function destroy(Service $service)
    {
        $service->delete();

        return redirect()->route('services.index')
            ->with('success', 'Serviço eliminado com sucesso.');
    }
}
