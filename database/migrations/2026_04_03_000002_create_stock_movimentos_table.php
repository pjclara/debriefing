<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_movimentos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('consumivel_id')->constrained('consumiveis')->cascadeOnDelete();

            // Tipo de movimento
            $table->enum('tipo', [
                'entrada',     // Receção de encomenda
                'saida',       // Consumo em cirurgia (manual ou via registo de consumo)
                'ajuste',      // Correção de inventário
                'encomenda',   // Encomenda registada (ainda não recebida)
                'devolucao',   // Devolução ao fornecedor
            ]);

            $table->decimal('quantidade', 8, 2);      // positivo = entrada, negativo = saída
            $table->decimal('stock_apos', 8, 2)->nullable(); // stock calculado após movimento
            $table->string('referencia_doc')->nullable();    // nº encomenda / fatura
            $table->string('fornecedor')->nullable();
            $table->date('data_movimento');
            $table->text('observacoes')->nullable();

            $table->timestamps();
        });

        // Coluna de stock actual na tabela consumiveis
        Schema::table('consumiveis', function (Blueprint $table) {
            $table->decimal('stock_atual', 8, 2)->default(0)->after('ativo');
            $table->decimal('stock_minimo', 8, 2)->default(0)->after('stock_atual');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_movimentos');
        Schema::table('consumiveis', function (Blueprint $table) {
            $table->dropColumn(['stock_atual', 'stock_minimo']);
        });
    }
};
