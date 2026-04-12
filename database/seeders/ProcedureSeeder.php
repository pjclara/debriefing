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
                'nome' => 'Apendicectomia',
                'descricao' => 'Remoção cirúrgica do apêndice inflamado',
                'department_id' => $departments->where('codigo', 'CIR_APENDICITE')->first()?->id,
            ],
            [
                'nome' => 'Drenagem de Abcesso',
                'descricao' => 'Drenagem de coleção purulenta abdominal',
                'department_id' => $departments->where('codigo', 'CIR_APENDICITE')->first()?->id,
            ],

            // Cirurgia Geral - Hérnia
            [
                'nome' => 'Herniotomia Aberta',
                'descricao' => 'Cirurgia tradicional para reparação de hérnia',
                'department_id' => $departments->where('codigo', 'CIR_HERNIA')->first()?->id,
            ],
            [
                'nome' => 'Herniotomia Laparoscópica',
                'descricao' => 'Reparação de hérnia por via laparoscópica',
                'department_id' => $departments->where('codigo', 'CIR_HERNIA')->first()?->id,
            ],

            // Traumatologia - Reparação de Fractura
            [
                'nome' => 'Osteossíntese de Fémur',
                'descricao' => 'Fixação de fractura de fémur com placa e parafusos',
                'department_id' => $departments->where('codigo', 'TRAUMA_FRATURA')->first()?->id,
            ],
            [
                'nome' => 'Osteossíntese de Tíbia',
                'descricao' => 'Fixação de fractura de tíbia',
                'department_id' => $departments->where('codigo', 'TRAUMA_FRATURA')->first()?->id,
            ],
            [
                'nome' => 'Redução e Imobilização',
                'descricao' => 'Redução de fractura com imobilização externa',
                'department_id' => $departments->where('codigo', 'TRAUMA_FRATURA')->first()?->id,
            ],

            // Traumatologia - Artroscopia
            [
                'nome' => 'Artroscopia do Joelho',
                'descricao' => 'Inspeção e tratamento artroscópico do joelho',
                'department_id' => $departments->where('codigo', 'TRAUMA_ARTROSCOPIA')->first()?->id,
            ],
            [
                'nome' => 'Meniscectomia',
                'descricao' => 'Remoção ou reparação meniscal',
                'department_id' => $departments->where('codigo', 'TRAUMA_ARTROSCOPIA')->first()?->id,
            ],
            [
                'nome' => 'Reconstrução do Ligamento Cruzado',
                'descricao' => 'Reconstrução do LCA do joelho',
                'department_id' => $departments->where('codigo', 'TRAUMA_ARTROSCOPIA')->first()?->id,
            ],

            // Cardiologia - Angioplastia
            [
                'nome' => 'Angioplastia Coronária com Stent',
                'descricao' => 'Desobstrução de artéria coronária com colocação de stent',
                'department_id' => $departments->where('codigo', 'CARDIO_ANGIOPLASTIA')->first()?->id,
            ],
            [
                'nome' => 'Aterectomia Coronária',
                'descricao' => 'Remoção de placa aterosclerótica',
                'department_id' => $departments->where('codigo', 'CARDIO_ANGIOPLASTIA')->first()?->id,
            ],

            // Cardiologia - Bypass Coronário
            [
                'nome' => 'Bypass Coronário Artéria Mamária',
                'descricao' => 'Bypass coronário com enxerto de artéria mamária',
                'department_id' => $departments->where('codigo', 'CARDIO_BYPASS')->first()?->id,
            ],
            [
                'nome' => 'Bypass Coronário Veia Safena',
                'descricao' => 'Bypass coronário com enxerto de veia safena',
                'department_id' => $departments->where('codigo', 'CARDIO_BYPASS')->first()?->id,
            ],
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
