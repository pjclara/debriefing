<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Limpar valores antigos que não existem no novo ENUM
        DB::statement("UPDATE surgeries SET monopolar_coag_tipo = NULL WHERE monopolar_coag_tipo NOT IN ('precise','flugurate','spray','low')");
        DB::statement("UPDATE surgeries SET monopolar_cut_tipo = NULL WHERE monopolar_cut_tipo NOT IN ('pure','blend')");
        DB::statement("UPDATE surgeries SET bipolar_coag_tipo = NULL WHERE bipolar_coag_tipo NOT IN ('low_with_autostop','low','standard','macro')");

        DB::statement("ALTER TABLE surgeries MODIFY COLUMN monopolar_coag_tipo ENUM('precise','flugurate','spray','low') NULL");
        DB::statement("ALTER TABLE surgeries MODIFY COLUMN monopolar_cut_tipo ENUM('pure','blend') NULL");
        DB::statement("ALTER TABLE surgeries MODIFY COLUMN bipolar_coag_tipo ENUM('low_with_autostop','low','standard','macro') NULL");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE surgeries MODIFY COLUMN monopolar_coag_tipo ENUM('pure','flugurate','soft') NULL");
        DB::statement("ALTER TABLE surgeries MODIFY COLUMN monopolar_cut_tipo ENUM('pure','flugurate','soft') NULL");
        DB::statement("ALTER TABLE surgeries MODIFY COLUMN bipolar_coag_tipo ENUM('pure','flugurate','soft') NULL");
    }
};
