<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@robot.local'],
            [
                'name'     => 'Administrador',
                'password' => \Illuminate\Support\Facades\Hash::make('admin1234'),
                'role'     => 'admin',
                'email_verified_at' => now(),
            ]
        );

        // user
            User::firstOrCreate(
                ['email' => 'user@robot.local'],
                [
                    'name'     => 'Utilizador',
                    'password' => \Illuminate\Support\Facades\Hash::make('user1234'),
                    'role'     => 'user',
                    'email_verified_at' => now(),
                ]
            );

        $this->call(ServiceSeeder::class);
        $this->call(ConsumivelTipoSeeder::class);
        //$this->call(ProcedureSeeder::class);
        //$this->call(StockMovimentoSeeder::class);
    }
}
