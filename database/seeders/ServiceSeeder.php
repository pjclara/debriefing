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
            ['nome' => 'Traumatologia', 'descricao' => 'Especialidade em traumatismos e fracturas', 'codigo' => 'TRAUMATOLOGIA'],
            ['nome' => 'Cardiologia', 'descricao' => 'Especialidade do coração e sistema circulatório', 'codigo' => 'CARDIOLOGIA'],
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
                'nome' => 'Cirurgia de Apendicite',
                'descricao' => 'Remoção de apêndice inflamado',
                'codigo' => 'CIR_APENDICITE',
                'service' => 0,
            ],
            [
                'nome' => 'Cirurgia de Hérnia',
                'descricao' => 'Correção de hérnia abdominal',
                'codigo' => 'CIR_HERNIA',
                'service' => 0,
            ],
            [
                'nome' => 'Reparação de Fractura',
                'descricao' => 'Cirurgia para reparação de fracturas ósseas',
                'codigo' => 'TRAUMA_FRATURA',
                'service' => 1,
            ],
            [
                'nome' => 'Artroscopia',
                'descricao' => 'Procedimento minimamente invasivo para articulações',
                'codigo' => 'TRAUMA_ARTROSCOPIA',
                'service' => 1,
            ],
            [
                'nome' => 'Angioplastia',
                'descricao' => 'Desobstrução de artérias',
                'codigo' => 'CARDIO_ANGIOPLASTIA',
                'service' => 2,
            ],
            [
                'nome' => 'Bypass Coronário',
                'descricao' => 'Cirurgia de bypass para doença coronária',
                'codigo' => 'CARDIO_BYPASS',
                'service' => 2,
            ],
        ];

        foreach ($departments as $dept) {
            Department::create([
                'nome' => $dept['nome'],
                'descricao' => $dept['descricao'],
                'codigo' => $dept['codigo'],
                'service_id' => $createdServices[$dept['service']]->id,
                'ativo' => true,
            ]);
        }
    }
}
