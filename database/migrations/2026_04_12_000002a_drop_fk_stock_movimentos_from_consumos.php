<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Remover a foreign key de consumos referenciando stock_movimentos
        if (Schema::hasTable('consumos')) {
            DB::statement('ALTER TABLE consumos DROP FOREIGN KEY consumos_stock_movimento_id_foreign');
        }
    }

    public function down(): void
    {
        // Recriar a foreign key (rollback)
        if (Schema::hasTable('consumos') && Schema::hasTable('stock_movimentos')) {
            Schema::table('consumos', function (Blueprint $table) {
                $table->foreign('stock_movimento_id')
                      ->references('id')
                      ->on('stock_movimentos')
                      ->nullOnDelete();
            });
        }
    }
};
