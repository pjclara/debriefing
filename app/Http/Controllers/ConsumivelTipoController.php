<?php

namespace App\Http\Controllers;

use App\Models\ConsumivelTipo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConsumivelTipoController extends Controller
{
    public function index()
    {
        $tipos = ConsumivelTipo::orderBy('categoria')
            ->orderBy('nome')
            ->get();

        return Inertia::render('consumivel_tipos/index', [
            'tipos' => $tipos,
            'categorias' => $this->getCategorias(),
        ]);
    }

    public function create()
    {
        return Inertia::render('consumivel_tipos/form', [
            'categorias' => $this->getCategorias(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => ['required', 'string', 'max:255', 'unique:consumivel_tipos,nome'],
            'categoria' => ['required', 'in:robotico_vidas,robotico_descartavel,extra'],
        ]);

        ConsumivelTipo::create($validated);

        return redirect('/consumivel_tipos')->with('success', 'Tipo de consumível criado com sucesso!');
    }

    public function edit(ConsumivelTipo $consumivel_tipo)
    {
        return Inertia::render('consumivel_tipos/form', [
            'tipo' => $consumivel_tipo,
            'categorias' => $this->getCategorias(),
        ]);
    }

    public function update(Request $request, ConsumivelTipo $consumivel_tipo)
    {
        $validated = $request->validate([
            'nome' => ['required', 'string', 'max:255', 'unique:consumivel_tipos,nome,' . $consumivel_tipo->id],
            'categoria' => ['required', 'in:robotico_vidas,robotico_descartavel,extra'],
        ]);

        $consumivel_tipo->update($validated);

        return redirect('/consumivel_tipos')->with('success', 'Tipo de consumível atualizado com sucesso!');
    }

    public function destroy(ConsumivelTipo $consumivel_tipo)
    {
        $consumivel_tipo->delete();

        return redirect('/consumivel_tipos')->with('success', 'Tipo de consumível eliminado com sucesso!');
    }

    private function getCategorias()
    {
        return [
            'robotico_vidas' => 'Robótico com Vidas',
            'robotico_descartavel' => 'Robótico Descartável',
            'extra' => 'Extra',
        ];
    }
}
