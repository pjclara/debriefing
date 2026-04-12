<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Limpar os campos para garantir dados válidos
        DB::table('surgeries')->update([
            'b1' => null,
            'b2' => null,
            'b3' => null,
            'b4' => null,
        ]);

        Schema::table('surgeries', function (Blueprint $table) {
            // Converter campos de texto para JSON (IDs de consumíveis)
            $table->json('b1')->nullable()->change();
            $table->json('b2')->nullable()->change();
            $table->json('b3')->nullable()->change();
            $table->json('b4')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('surgeries', function (Blueprint $table) {
            // Converter back para string
            $table->string('b1')->nullable()->change();
            $table->string('b2')->nullable()->change();
            $table->string('b3')->nullable()->change();
            $table->string('b4')->nullable()->change();
        });
    }
};
