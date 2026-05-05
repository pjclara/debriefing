<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Migrate existing string values to JSON array format
        DB::table('surgeries')
            ->whereNotNull('posicionamento')
            ->where('posicionamento', '!=', '')
            ->orderBy('id')
            ->each(function ($row) {
                $current = $row->posicionamento;
                // If already valid JSON array, skip
                $decoded = json_decode($current, true);
                if (is_array($decoded)) {
                    return;
                }
                // Convert legacy string to array of one entry
                $json = json_encode([['tipo' => $current, 'graus' => null]]);
                DB::table('surgeries')->where('id', $row->id)->update(['posicionamento' => $json]);
            });

        Schema::table('surgeries', function (Blueprint $table) {
            $table->json('posicionamento')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('surgeries', function (Blueprint $table) {
            $table->string('posicionamento')->nullable()->change();
        });
    }
};
