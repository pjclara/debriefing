<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('surgeries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('briefing_id')->constrained()->cascadeOnDelete();

            // Identificação do doente
            $table->string('processo');
            $table->string('procedimento');
            $table->string('destino');

            // Antecedentes / comorbidades
            $table->boolean('antecedentes_relevantes')->default(false);
            $table->text('descricao_antecedentes')->nullable();

            // Planeamento
            $table->boolean('consentimento')->default(false);
            $table->string('lateralidade')->default('N/A');
            $table->boolean('medicacao_suspensa')->default(false);
            $table->string('antibiotico')->nullable();
            $table->boolean('profilaxia')->default(false);
            $table->integer('perdas_estimadas')->nullable();
            $table->boolean('reserva_ativa')->default(false);
            $table->integer('reserva_unidades')->nullable();

            // Robótico
            $table->integer('trocares')->nullable();
            $table->string('otica')->default('0');
            $table->string('monopolar_coag')->nullable();
            $table->string('monopolar_cut')->nullable();
            $table->string('bipolar_coag')->nullable();
            $table->string('b1')->nullable();
            $table->string('b2')->nullable();
            $table->string('b3')->nullable();
            $table->string('b4')->nullable();
            $table->text('equipamento_extra')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('surgeries');
    }
};
