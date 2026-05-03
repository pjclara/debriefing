<?php

namespace App\Http\Controllers;

use App\Models\Stock;
use Inertia\Inertia;
use Inertia\Response;

class StockController extends Controller
{
    public function index(): Response
    {
        $items = Stock::orderBy('consumivel_nome')
            ->orderBy('codigo')
            ->get();

        $vidas    = $items->where('tipo', 'vidas')->values();
        $unidades = $items->where('tipo', 'unidade')->values();

        return Inertia::render('stock/index', [
            'vidasItems'    => $vidas,
            'unidadeItems'  => $unidades,
        ]);
    }
}

