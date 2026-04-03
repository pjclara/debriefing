<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('consumos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('surgery_id')->constrained()->cascadeOnDelete();

            $table->string('designacao');          // nome do consumível
            $table->string('referencia')->nullable(); // ref. interna / catálogo
            $table->decimal('quantidade', 8, 2)->default(1);
            $table->string('unidade')->default('un'); // un, cx, rolo, ...
            $table->text('observacoes')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('consumos');
    }
};
