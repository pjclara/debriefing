<?php

namespace App\Http\Controllers;

use App\Models\Consumo;
use App\Models\ConsumivelTipo;
use App\Models\Stock;
use App\Models\StockMovimento;
use Illuminate\Support\Facades\DB;
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
            'inconsistencias' => $this->detetarInconsistenciasDeVidas(),
        ]);
    }

    /**
     * Compara, para cada instrumento com vidas, o valor guardado em
     * "vidas_atual" com o valor esperado (vidas_inicial - soma dos
     * consumos realmente registados). Um instrumento com vidas esgotadas
     * desaparece da lista de seleção de consumos, pelo que uma
     * desincronização aqui pode passar despercebida durante meses — este
     * alerta torna-a visível de imediato, em vez de só ser descoberta
     * quando um fabricante reporta um desvio nas vidas reais.
     */
    private function detetarInconsistenciasDeVidas()
    {
        $consumidos = Consumo::select('stock_movimento_id', DB::raw('SUM(quantidade) as total'))
            ->groupBy('stock_movimento_id')
            ->pluck('total', 'stock_movimento_id');

        return StockMovimento::with('consumivelTipo')
            ->whereHas('consumivelTipo', fn ($q) => $q->where('categoria', ConsumivelTipo::CAT_ROBOTICO_VIDAS))
            ->whereNotNull('vidas_inicial')
            ->get()
            ->map(function (StockMovimento $m) use ($consumidos) {
                $consumido = (int) ($consumidos[$m->id] ?? 0);

                if ($m->vidas_reconciliado_em !== null) {
                    // Desvio já confirmado manualmente: o ponto de partida
                    // passa a ser o estado registado nesse momento, e só
                    // novos consumos desde então contam para o esperado.
                    $novosConsumos = max(0, $consumido - (int) $m->consumos_na_reconciliacao);
                    $esperado = max(0, (int) $m->vidas_atual_na_reconciliacao - $novosConsumos);
                } else {
                    $esperado = max(0, (int) $m->vidas_inicial - $consumido);
                }

                return [
                    'movimento'        => $m,
                    'consumido'        => $consumido,
                    'vidas_esperadas'  => $esperado,
                ];
            })
            ->filter(fn ($row) => (int) ($row['movimento']->vidas_atual ?? 0) !== $row['vidas_esperadas'])
            ->map(fn ($row) => [
                'id'               => $row['movimento']->id,
                'consumivel_nome'  => $row['movimento']->consumivelTipo->nome,
                'codigo'           => $row['movimento']->codigo,
                'referencia'       => $row['movimento']->referencia,
                'vidas_inicial'    => $row['movimento']->vidas_inicial,
                'vidas_atual'      => $row['movimento']->vidas_atual,
                'vidas_esperadas'  => $row['vidas_esperadas'],
                'consumos_registados' => $row['consumido'],
                'reconciliado_em'  => $row['movimento']->vidas_reconciliado_em,
            ])
            ->values();
    }
}

