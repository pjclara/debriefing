<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('surgeries', function (Blueprint $table) {
            // Docking em minutos
            $table->integer('docking')->unsigned()->nullable()->after('procedimento');

            // Início da consola
            $table->tinyInteger('hora_consola_inicio')->unsigned()->nullable()->after('docking');
            $table->tinyInteger('min_consola_inicio')->unsigned()->nullable()->after('hora_consola_inicio');

            // Fim da consola
            $table->tinyInteger('hora_consola_fim')->unsigned()->nullable()->after('min_consola_inicio');
            $table->tinyInteger('min_consola_fim')->unsigned()->nullable()->after('hora_consola_fim');
        });
    }

    public function down(): void
    {
        Schema::table('surgeries', function (Blueprint $table) {
            $table->dropColumn([
                'docking',
                'hora_consola_inicio',
                'min_consola_inicio',
                'hora_consola_fim',
                'min_consola_fim',
            ]);
        });
    }
};


