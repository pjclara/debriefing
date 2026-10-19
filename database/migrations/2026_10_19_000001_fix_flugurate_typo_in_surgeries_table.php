<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE surgeries MODIFY COLUMN monopolar_coag_tipo ENUM('precise','flugurate','fulgurate','spray','low') NULL");

        DB::statement("UPDATE surgeries SET monopolar_coag_tipo = 'fulgurate' WHERE monopolar_coag_tipo = 'flugurate'");

        DB::statement("ALTER TABLE surgeries MODIFY COLUMN monopolar_coag_tipo ENUM('precise','fulgurate','spray','low') NULL");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE surgeries MODIFY COLUMN monopolar_coag_tipo ENUM('precise','fulgurate','flugurate','spray','low') NULL");

        DB::statement("UPDATE surgeries SET monopolar_coag_tipo = 'flugurate' WHERE monopolar_coag_tipo = 'fulgurate'");

        DB::statement("ALTER TABLE surgeries MODIFY COLUMN monopolar_coag_tipo ENUM('precise','flugurate','spray','low') NULL");
    }
};
