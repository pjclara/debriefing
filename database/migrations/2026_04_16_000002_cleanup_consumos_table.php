<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('consumos', function (Blueprint $table) {
            $table->dropColumn(['designacao', 'referencia', 'quantidade', 'unidade']);
        });
    }

    public function down(): void
    {
        Schema::table('consumos', function (Blueprint $table) {
            $table->string('designacao')->default('');
            $table->string('referencia')->nullable();
            $table->decimal('quantidade', 8, 2)->default(1);
            $table->string('unidade')->default('un');
        });
    }
};
