<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('briefings', function (Blueprint $table) {
            $table->id();

            // Sala / Dia
            $table->date('data');
            $table->time('hora');
            $table->string('especialidade');
            $table->string('sala');

            // Equipa
            $table->boolean('equipa_segura')->default(false);
            $table->boolean('alteracao_equipa')->default(false);
            $table->text('descricao_alteracao_equipa')->nullable();

            // Checklist sala operatória
            $table->boolean('problemas_sala')->default(false);
            $table->text('descricao_problemas')->nullable();

            // Equipamento
            $table->boolean('equipamento_ok')->default(false);
            $table->text('descricao_equipamento')->nullable();

            // Mesa
            $table->boolean('mesa_emparelhada')->default(false);

            // Plano cirúrgico
            $table->boolean('ordem_mantida')->default(false);
            $table->text('descricao_ordem')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('briefings');
    }
};
