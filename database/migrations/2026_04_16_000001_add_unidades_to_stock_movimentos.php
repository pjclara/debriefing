<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('stock_movimentos', function (Blueprint $table) {
            // Usado para consumíveis sem vidas (robotico_descartavel, extra)
            $table->integer('unidades')->nullable()->after('vidas_atual');
        });
    }

    public function down(): void
    {
        Schema::table('stock_movimentos', function (Blueprint $table) {
            $table->dropColumn('unidades');
        });
    }
};
