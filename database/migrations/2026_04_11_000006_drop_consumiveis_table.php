<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Remover a constraint foreign key usando raw SQL
        if (Schema::hasTable('consumos')) {
            DB::statement('ALTER TABLE consumos DROP FOREIGN KEY consumos_consumivel_id_foreign');
            
            // Remover coluna
            if (Schema::hasColumn('consumos', 'consumivel_id')) {
                Schema::table('consumos', function (Blueprint $table) {
                    $table->dropColumn('consumivel_id');
                });
            }
        }

        // Droppar tabela de consumíveis (legada)
        Schema::dropIfExists('consumiveis');
    }

    public function down(): void
    {
        // Recriar tabela (rollback)
        Schema::create('consumiveis', function (Blueprint $table) {
            $table->id();
            $table->string('designacao');
            $table->string('referencia')->nullable();
            $table->string('codigo')->nullable();
            $table->enum('categoria', ['robotico_vidas', 'robotico_descartavel', 'extra']);
            $table->integer('vidas')->nullable();
            $table->boolean('ativo')->default(true);
            $table->decimal('stock_atual', 8, 2)->default(0);
            $table->decimal('stock_minimo', 8, 2)->default(0);
            $table->timestamps();
        });
        
        // Re-adicionar coluna a consumos
        Schema::table('consumos', function (Blueprint $table) {
            $table->foreignId('consumivel_id')
                  ->nullable()
                  ->after('surgery_id')
                  ->constrained('consumiveis')
                  ->nullOnDelete();
        });
    }
};

