<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Tabela de tipos de consumíveis (definições)
        Schema::create('consumivel_tipos', function (Blueprint $table) {
            $table->id();
            $table->string('nome')->unique(); // Ex: PROGRASP FORCEPS
            $table->enum('categoria', ['robotico_vidas', 'robotico_descartavel', 'extra']);
            $table->boolean('ativo')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('consumivel_tipos');
    }
};
