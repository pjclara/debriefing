<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Procedure;
use Illuminate\Database\Seeder;

class ProcedureSeeder extends Seeder
{
    public function run(): void
    {
        // Obter todos os departamentos existentes
        $departments = Department::all();

        // Procedimentos para cada departamento
        $procedures = [
            // Cirurgia Geral - Apendicite
            [
                'nome' => 'Sigmoidectomia',
                'descricao' => 'Ressecção do sigmoide',
                'department_id' => 1,
            ],
            [
                'nome' => 'Colectomia esquerda',
                'descricao' => 'Ressecção da parte esquerda do cólon',
                'department_id' => 1,
            ],
            [
                'nome' => 'Colectomia direita',
                'descricao' => 'Ressecção da parte direita do cólon',
                'department_id' => 1,
            ],
            [
                'nome' => 'Colectomia total',
                'descricao' => 'Ressecção de todo o cólon',
                'department_id' => 1,
            ],
            [
                'nome' => 'Colectomia do transverso',
                'descricao' => 'Ressecção da parte transversa do cólon',
                'department_id' => 1,
            ],

            // Cirurgia Geral - Hepatobiliopancreática

            [
                'nome' => 'Hepatectomia',
                'descricao' => 'Ressecção de parte do fígado',
                'department_id' => 2,
            ],


            // Cirurgia Geral - Parede abdominal
            [
                'nome' => 'TAPP',
                'descricao' => 'Reparação de hérnia inguinal',
                'department_id' => 3,
            ]
            
        ];

        // Apenas criar procedimentos se o departament_id existir
        foreach ($procedures as $proc) {
            if ($proc['department_id']) {
                Procedure::create([
                    'nome' => $proc['nome'],
                    'descricao' => $proc['descricao'],
                    'department_id' => $proc['department_id'],
                    'ativo' => true,
                ]);
            }
        }
    }
}
