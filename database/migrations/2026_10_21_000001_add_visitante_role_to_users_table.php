<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin','user','visitante') NOT NULL DEFAULT 'user'");
    }

    public function down(): void
    {
        DB::statement("UPDATE users SET role = 'user' WHERE role = 'visitante'");
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin','user') NOT NULL DEFAULT 'user'");
    }
};
