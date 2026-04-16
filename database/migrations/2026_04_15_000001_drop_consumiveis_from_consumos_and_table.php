<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Remover consumivel_id de consumos
        if (Schema::hasTable('consumos') && Schema::hasColumn('consumos', 'consumivel_id')) {
            Schema::table('consumos', function (Blueprint $table) {
                // Remover FK se existir
                $fks = collect(DB::select("SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
                    WHERE TABLE_SCHEMA = DATABASE()
                      AND TABLE_NAME = 'consumos'
                      AND COLUMN_NAME = 'consumivel_id'
                      AND REFERENCED_TABLE_NAME IS NOT NULL"))
                    ->pluck('CONSTRAINT_NAME');

                foreach ($fks as $fk) {
                    DB::statement("ALTER TABLE consumos DROP FOREIGN KEY `{$fk}`");
                }

                $table->dropColumn('consumivel_id');
            });
        }

        // Remover consumivel_id de stock_movimentos
        if (Schema::hasTable('stock_movimentos') && Schema::hasColumn('stock_movimentos', 'consumivel_id')) {
            Schema::table('stock_movimentos', function (Blueprint $table) {
                $fks = collect(DB::select("SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
                    WHERE TABLE_SCHEMA = DATABASE()
                      AND TABLE_NAME = 'stock_movimentos'
                      AND COLUMN_NAME = 'consumivel_id'
                      AND REFERENCED_TABLE_NAME IS NOT NULL"))
                    ->pluck('CONSTRAINT_NAME');

                foreach ($fks as $fk) {
                    DB::statement("ALTER TABLE stock_movimentos DROP FOREIGN KEY `{$fk}`");
                }

                $table->dropColumn('consumivel_id');
            });
        }

        // Remover tabela consumiveis
        Schema::dropIfExists('consumiveis');
    }

    public function down(): void
    {
        // Recriar tabela consumiveis
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

        // Readicionar consumivel_id a consumos
        Schema::table('consumos', function (Blueprint $table) {
            $table->foreignId('consumivel_id')
                  ->nullable()
                  ->after('surgery_id')
                  ->constrained('consumiveis')
                  ->nullOnDelete();
        });
    }
};
