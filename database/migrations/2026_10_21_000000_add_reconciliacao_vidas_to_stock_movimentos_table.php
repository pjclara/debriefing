<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('stock_movimentos', function (Blueprint $table) {
            // Permite a um admin confirmar manualmente que um desvio entre
            // "vidas_atual" e o valor calculado a partir dos consumos
            // registados é conhecido e correto (ex.: uso real não logado
            // durante um período em que o instrumento ficou invisível na
            // lista de seleção), deixando de ser assinalado no alerta de
            // inconsistências. Qualquer novo consumo a partir daqui volta
            // a ser comparado normalmente com este ponto de partida.
            $table->timestamp('vidas_reconciliado_em')->nullable()->after('vidas_atual');
            $table->integer('vidas_atual_na_reconciliacao')->nullable()->after('vidas_reconciliado_em');
            $table->integer('consumos_na_reconciliacao')->nullable()->after('vidas_atual_na_reconciliacao');
        });
    }

    public function down(): void
    {
        Schema::table('stock_movimentos', function (Blueprint $table) {
            $table->dropColumn([
                'vidas_reconciliado_em',
                'vidas_atual_na_reconciliacao',
                'consumos_na_reconciliacao',
            ]);
        });
    }
};
