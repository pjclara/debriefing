<?php
// fix-stock-vidas-2026-10.php — Corrige os instrumentos com vidas
// desalinhadas identificados em outubro/2026 (relatório da Intuitive sobre
// o Mega SN 0271 e o Mega SN 0433, mais 5 outros desvios menores
// encontrados ao validar). Seguro para correr mais do que uma vez
// (idempotente): identifica os registos pelo "codigo" (nº de série), não
// por id, para funcionar em qualquer base de dados onde os ids possam
// diferir dos locais.
//
// Uso: php fix-stock-vidas-2026-10.php

require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Consumo;
use App\Models\StockMovimento;
use Illuminate\Support\Facades\DB;

DB::transaction(function () {
    // ── 1. Instrumentos cuja "vidas_atual" só precisa de ser recalculada a
    //       partir dos consumos realmente registados (sem uso real não
    //       logado) ───────────────────────────────────────────────────────
    $recalcularPorCodigo = [
        '00886874112601 1231', // CABO BIPOLAR
        '00886874112496 0184', // TIP-UP FENESTRATED GRASPER
        '00886874119808 0286', // FENESTRATED BIPOLAR FORCEPS
        '00886874112298 0010', // MONOPOLAR CURVED SCISSORS
        '00886874112380 0016', // LARGE CLIP APPLIER
    ];

    foreach ($recalcularPorCodigo as $codigo) {
        $m = StockMovimento::where('codigo', $codigo)->first();

        if (! $m) {
            echo "  [aviso] não encontrado: {$codigo}\n";
            continue;
        }

        $consumido = (int) Consumo::where('stock_movimento_id', $m->id)->sum('quantidade');
        $esperado  = max(0, (int) $m->vidas_inicial - $consumido);

        if ((int) $m->vidas_atual === $esperado) {
            echo "  [ok] {$codigo}: já está correto ({$esperado} vidas)\n";
            continue;
        }

        echo "  [corrigido] {$codigo}: {$m->vidas_atual} -> {$esperado} vidas\n";
        $m->vidas_atual = $esperado;
        $m->save();
    }

    // ── 2. Instrumentos cujo valor real (confirmado pela Intuitive) diverge
    //       do que os consumos registados permitem calcular, porque ficaram
    //       meses sem poder ser selecionados (vidas_atual chegou a 0 e
    //       desapareceram da lista) — usa-se o valor real e marca-se como
    //       reconciliado, para não voltar a ser assinalado como
    //       inconsistência a partir de agora ──────────────────────────────
    $reconciliarComValorReal = [
        '00886874112342 0271' => 4,  // MEGA NEEDLE DRIVER — Intuitive, 05/10/2026
        '00886864119815 0433' => 14, // MEGA SUTURE CUT NEEDLE DRIVER — Intuitive, 05/10/2026
    ];

    foreach ($reconciliarComValorReal as $codigo => $vidasReais) {
        $m = StockMovimento::where('codigo', $codigo)->first();

        if (! $m) {
            echo "  [aviso] não encontrado: {$codigo}\n";
            continue;
        }

        if ((int) $m->vidas_atual === $vidasReais && $m->vidas_reconciliado_em !== null) {
            echo "  [ok] {$codigo}: já reconciliado ({$vidasReais} vidas)\n";
            continue;
        }

        $consumido = (int) Consumo::where('stock_movimento_id', $m->id)->sum('quantidade');

        echo "  [corrigido+reconciliado] {$codigo}: {$m->vidas_atual} -> {$vidasReais} vidas\n";

        $m->update([
            'vidas_atual'                  => $vidasReais,
            'vidas_reconciliado_em'        => now(),
            'vidas_atual_na_reconciliacao' => $vidasReais,
            'consumos_na_reconciliacao'    => $consumido,
        ]);
    }
});

echo "DONE\n";
