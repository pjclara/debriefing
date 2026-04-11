<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('surgeries', function (Blueprint $table) {
            // Adicionar novos campos Monopolar Coag
            $table->integer('monopolar_coag_watts')->unsigned()->nullable()->after('equipamento_extra');
            $table->enum('monopolar_coag_tipo', ['pure', 'flugurate', 'soft'])->nullable()->after('monopolar_coag_watts');

            // Adicionar novos campos Monopolar Cut
            $table->integer('monopolar_cut_watts')->unsigned()->nullable()->after('monopolar_coag_tipo');
            $table->enum('monopolar_cut_tipo', ['pure', 'flugurate', 'soft'])->nullable()->after('monopolar_cut_watts');

            // Adicionar novos campos Bipolar Coag
            $table->integer('bipolar_coag_watts')->unsigned()->nullable()->after('monopolar_cut_tipo');
            $table->enum('bipolar_coag_tipo', ['pure', 'flugurate', 'soft'])->nullable()->after('bipolar_coag_watts');
        });
    }

    public function down(): void
    {
        Schema::table('surgeries', function (Blueprint $table) {
            $table->dropColumn([
                'monopolar_coag_watts',
                'monopolar_coag_tipo',
                'monopolar_cut_watts',
                'monopolar_cut_tipo',
                'bipolar_coag_watts',
                'bipolar_coag_tipo',
            ]);
        });
    }
};
