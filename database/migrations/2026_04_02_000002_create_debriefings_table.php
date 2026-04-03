<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('debriefings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('briefing_id')->unique()->constrained()->cascadeOnDelete();

            // Complicações
            $table->boolean('complicacoes')->default(false);
            $table->text('descricao_complicacoes')->nullable();

            // Falha sistema Da Vinci Xi
            $table->boolean('falha_sistema')->default(false);
            $table->text('descricao_falha_sistema')->nullable();
            $table->boolean('falha_solucionada')->default(false);
            $table->boolean('falha_reportada')->default(false);
            $table->string('falha_reportada_a_quem')->nullable();

            // Lista operatória
            $table->boolean('inicio_a_horas')->default(false);
            $table->text('descricao_inicio')->nullable();
            $table->boolean('fim_a_horas')->default(false);
            $table->text('descricao_fim')->nullable();

            // Reflexão
            $table->text('correu_bem')->nullable();
            $table->text('melhorar')->nullable();
            $table->text('falha_comunicacao')->nullable();

            // Evento adverso
            $table->boolean('evento_adverso')->default(false);
            $table->text('descricao_evento')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('debriefings');
    }
};
