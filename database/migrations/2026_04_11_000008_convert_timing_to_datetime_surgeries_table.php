<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('surgeries', function (Blueprint $table) {
            // Adicionar os novos campos datetime
            $table->dateTime('prep_inicio')->nullable()->after('procedimento');
            $table->dateTime('prep_fim')->nullable()->after('prep_inicio');
            $table->dateTime('consola_inicio')->nullable()->after('docking');
            $table->dateTime('consola_fim')->nullable()->after('consola_inicio');
        });

        // Converter dados dos campos antigos para os novos (se houver dados)
        // Obtém a data de hoje como padrão
        $today = date('Y-m-d');

        DB::table('surgeries')->whereNotNull('hora_prep_inicio')->orWhereNotNull('min_prep_inicio')
            ->update([
                'prep_inicio' => DB::raw("CONCAT('$today', ' ', CONCAT(LPAD(COALESCE(hora_prep_inicio, 0), 2, '0'), ':', LPAD(COALESCE(min_prep_inicio, 0), 2, '0'), ':00'))"),
            ]);

        DB::table('surgeries')->whereNotNull('hora_prep_fim')->orWhereNotNull('min_prep_fim')
            ->update([
                'prep_fim' => DB::raw("CONCAT('$today', ' ', CONCAT(LPAD(COALESCE(hora_prep_fim, 0), 2, '0'), ':', LPAD(COALESCE(min_prep_fim, 0), 2, '0'), ':00'))"),
            ]);

        DB::table('surgeries')->whereNotNull('hora_consola_inicio')->orWhereNotNull('min_consola_inicio')
            ->update([
                'consola_inicio' => DB::raw("CONCAT('$today', ' ', CONCAT(LPAD(COALESCE(hora_consola_inicio, 0), 2, '0'), ':', LPAD(COALESCE(min_consola_inicio, 0), 2, '0'), ':00'))"),
            ]);

        DB::table('surgeries')->whereNotNull('hora_consola_fim')->orWhereNotNull('min_consola_fim')
            ->update([
                'consola_fim' => DB::raw("CONCAT('$today', ' ', CONCAT(LPAD(COALESCE(hora_consola_fim, 0), 2, '0'), ':', LPAD(COALESCE(min_consola_fim, 0), 2, '0'), ':00'))"),
            ]);

        // Remover os campos antigos
        Schema::table('surgeries', function (Blueprint $table) {
            $table->dropColumn([
                'hora_prep_inicio',
                'min_prep_inicio',
                'hora_prep_fim',
                'min_prep_fim',
                'hora_consola_inicio',
                'min_consola_inicio',
                'hora_consola_fim',
                'min_consola_fim',
            ]);
        });
    }

    public function down(): void
    {
        Schema::table('surgeries', function (Blueprint $table) {
            // Recriar os campos antigos
            $table->tinyInteger('hora_prep_inicio')->unsigned()->nullable()->after('procedimento');
            $table->tinyInteger('min_prep_inicio')->unsigned()->nullable()->after('hora_prep_inicio');
            $table->tinyInteger('hora_prep_fim')->unsigned()->nullable()->after('min_prep_inicio');
            $table->tinyInteger('min_prep_fim')->unsigned()->nullable()->after('hora_prep_fim');
            $table->tinyInteger('hora_consola_inicio')->unsigned()->nullable()->after('docking');
            $table->tinyInteger('min_consola_inicio')->unsigned()->nullable()->after('hora_consola_inicio');
            $table->tinyInteger('hora_consola_fim')->unsigned()->nullable()->after('min_consola_inicio');
            $table->tinyInteger('min_consola_fim')->unsigned()->nullable()->after('hora_consola_fim');

            // Converter de volta dos datetimes para hora/minuto
            $today = date('Y-m-d');

            DB::table('surgeries')->whereNotNull('prep_inicio')
                ->update([
                    'hora_prep_inicio' => DB::raw("HOUR(prep_inicio)"),
                    'min_prep_inicio' => DB::raw("MINUTE(prep_inicio)"),
                ]);

            DB::table('surgeries')->whereNotNull('prep_fim')
                ->update([
                    'hora_prep_fim' => DB::raw("HOUR(prep_fim)"),
                    'min_prep_fim' => DB::raw("MINUTE(prep_fim)"),
                ]);

            DB::table('surgeries')->whereNotNull('consola_inicio')
                ->update([
                    'hora_consola_inicio' => DB::raw("HOUR(consola_inicio)"),
                    'min_consola_inicio' => DB::raw("MINUTE(consola_inicio)"),
                ]);

            DB::table('surgeries')->whereNotNull('consola_fim')
                ->update([
                    'hora_consola_fim' => DB::raw("HOUR(consola_fim)"),
                    'min_consola_fim' => DB::raw("MINUTE(consola_fim)"),
                ]);
        });

        // Remover os novos campos datetime
        Schema::table('surgeries', function (Blueprint $table) {
            $table->dropColumn([
                'prep_inicio',
                'prep_fim',
                'consola_inicio',
                'consola_fim',
            ]);
        });
    }
};
