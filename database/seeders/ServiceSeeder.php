<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        // Primeiro criar os serviços
        $services = [
            ['nome' => 'Cirurgia Geral', 'descricao' => 'Cirurgias de carácter geral', 'codigo' => 'CIRURGIA_GERAL'],
            ['nome' => 'Urologia', 'descricao' => 'Especialidade em urologia', 'codigo' => 'UROLOGIA'],
            ['nome' => 'Ginecologia', 'descricao' => 'Especialidade em ginecologia', 'codigo' => 'GINECOLOGIA'],
        ];

        $createdServices = [];
        foreach ($services as $service) {
            $createdServices[] = Service::create([
                'nome' => $service['nome'],
                'descricao' => $service['descricao'],
                'codigo' => $service['codigo'],
                'ativo' => true,
            ]);
        }

        // Depois criar os departamentos para cada serviço
        $departments = [
            [
                'nome' => 'Colo-Retal',
                'descricao' => 'Unidade de cirurgia colo-retal',
                'codigo' => 'CIR_COLO_RETAL',
                'service' => 1,
            ],
            [
                'nome' => 'HepatoBilioPancreática',
                'descricao' => 'Unidade de cirurgia hepato-bilio-pancreática',
                'codigo' => 'CIR_HEPATO_BILIO_PANCREATICA',
                'service' => 1,
            ],
            [
                'nome' => 'Parede Abdominal',
                'descricao' => 'Unidade de cirurgia de parede abdominal',
                'codigo' => 'CIR_PAREDE_ABDOMINAL',
                'service' => 1,
            ],
            [
                'nome' => 'Esofago-Gástrica',
                'descricao' => 'Unidade de cirurgia esofago-gástrica',
                'codigo' => 'CIR_ESOFAGO_GASTRICA',
                'service' => 1,
            ],
            [
                'nome' => 'Urologia Geral',
                'descricao' => 'Unidade de urologia geral',
                'codigo' => 'UROLOGIA_GERAL',
                'service' => 2,
            ],
            [
                'nome' => 'Ginecologia Geral',
                'descricao' => 'Unidade de ginecologia geral',
                'codigo' => 'GINECOLOGIA_GERAL',
                'service' => 3,
            ],

        ];

        foreach ($departments as $dept) {
            Department::create([
                'nome' => $dept['nome'],
                'descricao' => $dept['descricao'],
                'codigo' => $dept['codigo'],
                'service_id' => $createdServices[$dept['service'] - 1]->id,
                'ativo' => true,
            ]);
        }
    }
}
