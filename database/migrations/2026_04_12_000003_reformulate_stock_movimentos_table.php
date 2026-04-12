<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('stock_movimentos');
        
        Schema::create('stock_movimentos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('consumivel_id')->constrained('consumiveis')->cascadeOnDelete();
            
            // Tipo de movimento
            $table->enum('tipo_mov', [
                'entrada',      // Receção de encomenda
                'saida',        // Consumo em cirurgia
                'ajuste',       // Correção de inventário
                'encomenda',    // Encomenda registada
                'devolucao',    // Devolução ao fornecedor
            ]);
            
            // Detalhes do item
            $table->string('referencia')->nullable();      // Ex: PROGRASP-001
            $table->string('codigo')->nullable();          // Ex: 408414
            $table->integer('vidas_inicial')->nullable();  // Vidas ao receber
            $table->integer('vidas_atual')->nullable();    // Vidas actuais (após consumo)
            
            $table->date('data_entrada');
            $table->date('data_saida')->nullable();
            $table->string('motivo')->nullable();          // Razão da saída (consumo, devolução, etc)
            
            $table->text('observacoes')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_movimentos');
    }
};
