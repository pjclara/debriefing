<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('surgeries', function (Blueprint $table) {
            $table->dropColumn(['trocares_roboticos_tamanho', 'trocares_nao_roboticos_tamanho']);
        });

        Schema::table('surgeries', function (Blueprint $table) {
            $table->json('trocares_roboticos_tamanhos')->nullable()->after('trocares_roboticos');
            $table->json('trocares_nao_roboticos_tamanhos')->nullable()->after('trocares_nao_roboticos');
        });
    }

    public function down(): void
    {
        Schema::table('surgeries', function (Blueprint $table) {
            $table->dropColumn(['trocares_roboticos_tamanhos', 'trocares_nao_roboticos_tamanhos']);
        });

        Schema::table('surgeries', function (Blueprint $table) {
            $table->string('trocares_roboticos_tamanho')->nullable()->after('trocares_roboticos');
            $table->string('trocares_nao_roboticos_tamanho')->nullable()->after('trocares_nao_roboticos');
        });
    }
};
