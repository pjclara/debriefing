<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('stock_movimentos', function (Blueprint $table) {
            $table->integer('unidades_inicial')->nullable()->after('vidas_atual');
            $table->integer('unidades_atual')->nullable()->after('unidades_inicial');
        });

        // Copiar o valor existente de unidades para ambos os novos campos
        DB::statement('UPDATE stock_movimentos SET unidades_inicial = unidades, unidades_atual = unidades WHERE unidades IS NOT NULL');

        Schema::table('stock_movimentos', function (Blueprint $table) {
            $table->dropColumn('unidades');
        });
    }

    public function down(): void
    {
        Schema::table('stock_movimentos', function (Blueprint $table) {
            $table->integer('unidades')->nullable()->after('vidas_atual');
        });

        DB::statement('UPDATE stock_movimentos SET unidades = unidades_atual WHERE unidades_atual IS NOT NULL');

        Schema::table('stock_movimentos', function (Blueprint $table) {
            $table->dropColumn(['unidades_inicial', 'unidades_atual']);
        });
    }
};
