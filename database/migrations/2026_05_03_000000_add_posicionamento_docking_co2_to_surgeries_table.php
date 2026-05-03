<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('surgeries', function (Blueprint $table) {
            $table->string('posicionamento')->nullable()->after('otica');
            $table->string('docking_lado')->nullable()->after('posicionamento');
            $table->string('co2_parametros')->nullable()->after('docking_lado');
        });
    }

    public function down(): void
    {
        Schema::table('surgeries', function (Blueprint $table) {
            $table->dropColumn(['posicionamento', 'docking_lado', 'co2_parametros']);
        });
    }
};
