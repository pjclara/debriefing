<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('surgeries', function (Blueprint $table) {
            // Comorbidades
            $table->boolean('comorbidades')->default(false)->after('descricao_antecedentes');
            $table->text('descricao_comorbidades')->nullable()->after('comorbidades');

            // Variações técnicas
            $table->boolean('variacoes_tecnicas')->default(false)->after('descricao_comorbidades');
            $table->text('descricao_variacoes')->nullable()->after('variacoes_tecnicas');

            // Passos críticos
            $table->boolean('passos_criticos')->default(false)->after('descricao_variacoes');
            $table->text('descricao_passos')->nullable()->after('passos_criticos');
        });
    }

    public function down(): void
    {
        Schema::table('surgeries', function (Blueprint $table) {
            $table->dropColumn([
                'comorbidades',
                'descricao_comorbidades',
                'variacoes_tecnicas',
                'descricao_variacoes',
                'passos_criticos',
                'descricao_passos',
            ]);
        });
    }
};
