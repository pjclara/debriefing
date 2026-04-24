<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('surgeries', function (Blueprint $table) {
            $table->integer('trocares_roboticos')->nullable()->after('trocares');
            $table->string('trocares_roboticos_tamanho')->nullable()->after('trocares_roboticos');
            $table->integer('trocares_nao_roboticos')->nullable()->after('trocares_roboticos_tamanho');
            $table->string('trocares_nao_roboticos_tamanho')->nullable()->after('trocares_nao_roboticos');
        });
    }

    public function down(): void
    {
        Schema::table('surgeries', function (Blueprint $table) {
            $table->dropColumn([
                'trocares_roboticos',
                'trocares_roboticos_tamanho',
                'trocares_nao_roboticos',
                'trocares_nao_roboticos_tamanho',
            ]);
        });
    }
};
