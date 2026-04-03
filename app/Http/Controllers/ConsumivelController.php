<?php

namespace App\Http\Controllers;

use App\Http\Requests\ConsumivelRequest;
use App\Models\Consumivel;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class ConsumivelController extends Controller
{
    public function index(): Response
    {
        $consumiveis = Consumivel::orderBy('categoria')->orderBy('designacao')->get();

        return Inertia::render('consumiveis/index', [
            'consumiveis' => $consumiveis,
            'categorias'  => Consumivel::$categorias,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('consumiveis/form', [
            'categorias' => Consumivel::$categorias,
        ]);
    }

    public function store(ConsumivelRequest $request): RedirectResponse
    {
        Consumivel::create($request->validated());

        return redirect()->route('consumiveis.index')
            ->with('success', 'Consumível criado.');
    }

    public function edit(Consumivel $consumivel): Response
    {
        return Inertia::render('consumiveis/form', [
            'consumivel' => $consumivel,
            'categorias' => Consumivel::$categorias,
        ]);
    }

    public function update(ConsumivelRequest $request, Consumivel $consumivel): RedirectResponse
    {
        $consumivel->update($request->validated());

        return redirect()->route('consumiveis.index')
            ->with('success', 'Consumível actualizado.');
    }

    public function destroy(Consumivel $consumivel): RedirectResponse
    {
        $consumivel->delete();

        return redirect()->route('consumiveis.index')
            ->with('success', 'Consumível eliminado.');
    }
}
