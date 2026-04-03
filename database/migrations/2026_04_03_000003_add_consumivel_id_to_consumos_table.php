<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('consumos', function (Blueprint $table) {
            $table->foreignId('consumivel_id')
                  ->nullable()
                  ->after('surgery_id')
                  ->constrained('consumiveis')
                  ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('consumos', function (Blueprint $table) {
            $table->dropForeignIdFor(\App\Models\Consumivel::class);
            $table->dropColumn('consumivel_id');
        });
    }
};
