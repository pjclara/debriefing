<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('surgeries', function (Blueprint $table) {
            // Início de preparação (adicionar no início dos horários)
            $table->tinyInteger('hora_prep_inicio')->unsigned()->nullable()->after('procedimento');
            $table->tinyInteger('min_prep_inicio')->unsigned()->nullable()->after('hora_prep_inicio');

            // Fim de preparação
            $table->tinyInteger('hora_prep_fim')->unsigned()->nullable()->after('min_prep_inicio');
            $table->tinyInteger('min_prep_fim')->unsigned()->nullable()->after('hora_prep_fim');
        });
    }

    public function down(): void
    {
        Schema::table('surgeries', function (Blueprint $table) {
            $table->dropColumn([
                'hora_prep_inicio',
                'min_prep_inicio',
                'hora_prep_fim',
                'min_prep_fim',
            ]);
        });
    }
};
