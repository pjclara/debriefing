<?php
// nodeploy.php — Acerta vidas_atual e unidades_atual na tabela stock_movimentos
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

DB::transaction(function () {
    $movimentos = DB::table('stock_movimentos')->get();
    $vidasCorrigidos = 0;
    $unidadesCorrigidos = 0;

    foreach ($movimentos as $mov) {
        // --- vidas ---
        if ($mov->vidas_inicial !== null) {
            $consumidos = DB::table('consumos')
                ->where('stock_movimento_id', $mov->id)
                ->count();
            $vidasCalculado = max(0, $mov->vidas_inicial - $consumidos);
            if ($mov->vidas_atual !== $vidasCalculado) {
                DB::table('stock_movimentos')
                    ->where('id', $mov->id)
                    ->update(['vidas_atual' => $vidasCalculado]);
                echo "  [vidas]    ID={$mov->id} {$mov->referencia}: {$mov->vidas_atual} -> {$vidasCalculado} (consumidos: {$consumidos}, inicial: {$mov->vidas_inicial})\n";
                $vidasCorrigidos++;
            }
        }

        // --- unidades ---
        if ($mov->unidades_inicial !== null) {
            $consumidoQty = (int) DB::table('consumos')
                ->where('stock_movimento_id', $mov->id)
                ->sum('quantidade');
            $unidadesCalculado = max(0, $mov->unidades_inicial - $consumidoQty);
            if ($mov->unidades_atual !== $unidadesCalculado) {
                DB::table('stock_movimentos')
                    ->where('id', $mov->id)
                    ->update(['unidades_atual' => $unidadesCalculado]);
                echo "  [unidades] ID={$mov->id} {$mov->referencia}: {$mov->unidades_atual} -> {$unidadesCalculado} (consumidos: {$consumidoQty}, inicial: {$mov->unidades_inicial})\n";
                $unidadesCorrigidos++;
            }
        }
    }

    echo "Vidas corrigidas:    {$vidasCorrigidos}\n";
    echo "Unidades corrigidas: {$unidadesCorrigidos}\n";
});
