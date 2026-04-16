<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('stock_movimentos', function (Blueprint $table) {
            $table->foreignId('consumivel_tipo_id')
                  ->nullable()
                  ->after('id')
                  ->constrained('consumivel_tipos')
                  ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('stock_movimentos', function (Blueprint $table) {
            $table->dropForeign(['consumivel_tipo_id']);
            $table->dropColumn('consumivel_tipo_id');
        });
    }
};
