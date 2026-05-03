<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("
            CREATE OR REPLACE VIEW stock AS

            -- Instrumentos com vidas: uma linha por instrumento físico individual
            SELECT
                CONCAT('v-', sm.id)     AS stock_key,
                sm.id                   AS stock_movimento_id,
                sm.consumivel_tipo_id,
                ct.nome                 AS consumivel_nome,
                ct.categoria,
                sm.referencia,
                sm.codigo,
                sm.vidas_atual          AS quantidade_disponivel,
                sm.vidas_inicial        AS quantidade_inicial,
                'vidas'                 AS tipo
            FROM stock_movimentos sm
            JOIN consumivel_tipos ct ON ct.id = sm.consumivel_tipo_id
            WHERE ct.categoria = 'robotico_vidas'
              AND COALESCE(sm.vidas_atual, 0) > 0

            UNION ALL

            -- Material de uso único / descartável / extra: agrupado por (tipo + referencia)
            SELECT
                CONCAT('u-', sm.consumivel_tipo_id, '-', COALESCE(sm.referencia, '')) AS stock_key,
                NULL                            AS stock_movimento_id,
                sm.consumivel_tipo_id,
                ct.nome                         AS consumivel_nome,
                ct.categoria,
                sm.referencia,
                NULL                            AS codigo,
                SUM(COALESCE(sm.unidades_atual, 0))   AS quantidade_disponivel,
                SUM(COALESCE(sm.unidades_inicial, 0)) AS quantidade_inicial,
                'unidade'                       AS tipo
            FROM stock_movimentos sm
            JOIN consumivel_tipos ct ON ct.id = sm.consumivel_tipo_id
            WHERE ct.categoria != 'robotico_vidas'
            GROUP BY
                sm.consumivel_tipo_id,
                ct.nome,
                ct.categoria,
                sm.referencia
            HAVING SUM(COALESCE(sm.unidades_atual, 0)) > 0
        ");
    }

    public function down(): void
    {
        DB::statement('DROP VIEW IF EXISTS stock');
    }
};
