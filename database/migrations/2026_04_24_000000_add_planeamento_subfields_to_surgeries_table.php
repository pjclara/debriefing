<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('surgeries', function (Blueprint $table) {
            // Sub-campos de lateralidade
            $table->string('lateralidade_lado')->nullable()->after('lateralidade');
            $table->boolean('lateralidade_marcacao')->nullable()->after('lateralidade_lado');

            // medicacao_suspensa passa a string: 'Sim' | 'Não' | 'N/A'
            $table->string('medicacao_suspensa')->nullable()->default(null)->change();

            // Sub-campo de medicação (quando 'Não')
            $table->string('medicacao_qual')->nullable()->after('medicacao_suspensa');

            // Antibioterapia: boolean (true = Sim, false = N/A)
            $table->boolean('antibioterapia')->nullable()->after('antibiotico');

            // Sub-tipo de profilaxia: 'Farmacológica' | 'Mecânica'
            $table->string('profilaxia_tipo')->nullable()->after('profilaxia');

            // Estado reserva eritrócitos: 'Tem' | 'Necessita' | 'N/A'
            $table->string('reserva_estado')->nullable()->after('reserva_ativa');
        });
    }

    public function down(): void
    {
        Schema::table('surgeries', function (Blueprint $table) {
            $table->dropColumn([
                'lateralidade_lado',
                'lateralidade_marcacao',
                'medicacao_qual',
                'antibioterapia',
                'profilaxia_tipo',
                'reserva_estado',
            ]);
            $table->boolean('medicacao_suspensa')->nullable(false)->default(false)->change();
        });
    }
};
