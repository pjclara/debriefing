<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('consumos', function (Blueprint $table) {
            // Relação com consumível (tipo)
            $table->foreignId('consumivel_id')
                  ->nullable()
                  ->after('surgery_id')
                  ->constrained('consumiveis')
                  ->nullOnDelete();

            // Relação com item específico de stock
            $table->foreignId('stock_movimento_id')
                  ->nullable()
                  ->after('consumivel_id')
                  ->constrained('stock_movimentos')
                  ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('consumos', function (Blueprint $table) {
            $table->dropForeignIdColumns(['consumivel_id', 'stock_movimento_id']);
        });
    }
};
