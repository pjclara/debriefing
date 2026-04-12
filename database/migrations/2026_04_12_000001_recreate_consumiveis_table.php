<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Recriar tabela consumiveis com estrutura completa
        if (!Schema::hasTable('consumiveis')) {
            Schema::create('consumiveis', function (Blueprint $table) {
                $table->id();
                $table->string('designacao');
                $table->string('referencia', 100)->nullable()->unique();
                $table->string('codigo', 100)->nullable()->unique();
                $table->enum('categoria', ['robotico_vidas', 'robotico_descartavel', 'extra']);
                $table->integer('vidas')->nullable();
                $table->string('unidade')->default('un');
                $table->boolean('tem_stock')->default(true);
                $table->boolean('ativo')->default(true);
                $table->decimal('stock_atual', 8, 2)->default(0);
                $table->decimal('stock_minimo', 8, 2)->default(0);
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('consumiveis');
    }
};
