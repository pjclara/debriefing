<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Reformular stock_movimentos para referenciar tipos de consumíveis
        Schema::dropIfExists('stock_movimentos');
        
        Schema::create('stock_movimentos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('consumivel_tipo_id')->constrained('consumivel_tipos')->cascadeOnDelete();
            
            // Tipo de movimento
            $table->enum('tipo_mov', [
                'entrada',      // Receção de encomenda
                'saida',        // Consumo em cirurgia
                'ajuste',       // Correção de inventário
                'encomenda',    // Encomenda registada
                'devolucao',    // Devolução ao fornecedor
            ]);
            
            // Detalhes do item
            $table->string('referencia')->nullable();  // Ex: PROGRASP-001
            $table->string('codigo')->nullable();      // Ex: 408414
            $table->integer('vidas')->nullable();      // Se aplicável (robotico_vidas)
            
            $table->date('data_entrada');
            $table->text('observacoes')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_movimentos');
    }
};
