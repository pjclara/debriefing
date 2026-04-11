<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('consumiveis', function (Blueprint $table) {
            $table->dropColumn('unidade');
        });
    }

    public function down(): void
    {
        Schema::table('consumiveis', function (Blueprint $table) {
            $table->string('unidade')->default('un')->after('vidas');
        });
    }
};
