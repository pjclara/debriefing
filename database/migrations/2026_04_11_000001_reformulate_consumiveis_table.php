<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('consumiveis', function (Blueprint $table) {
            // Referência (única por item, especialmente para descartáveis e extras)
            $table->string('referencia', 100)->nullable()->unique()->after('designacao');
            
            // Código (único para rastreamento)
            $table->string('codigo', 100)->nullable()->unique()->after('referencia');
            
            // Vidas (obrigatório para robotico_vidas, null para outros)
            $table->integer('vidas')->nullable()->after('codigo');
            
            // Flag para indicar se tem controlo de stock
            // robotico_vidas: true (tem stock_atual e stock_minimo)
            // robotico_descartavel: false (unidades independentes, sem stock agregado)
            // extra: false (unidades independentes, sem stock agregado)
            $table->boolean('tem_stock')->default(true)->after('categoria');
        });
    }

    public function down(): void
    {
        Schema::table('consumiveis', function (Blueprint $table) {
            $table->dropColumn(['referencia', 'codigo', 'vidas', 'tem_stock']);
        });
    }
};
