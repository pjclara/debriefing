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
                'codigo' => 'PROC_APENDICECTOMIA',
                'department_id' => $departments->where('codigo', 'CIR_APENDICITE')->first()?->id,
            ],
            [
                'nome' => 'Drenagem de Abcesso',
                'descricao' => 'Drenagem de coleção purulenta abdominal',
                'codigo' => 'PROC_DRENAGEM_ABS',
                'department_id' => $departments->where('codigo', 'CIR_APENDICITE')->first()?->id,
            ],

            // Cirurgia Geral - Hérnia
            [
                'nome' => 'Herniotomia Aberta',
                'descricao' => 'Cirurgia tradicional para reparação de hérnia',
                'codigo' => 'PROC_HERNIOTOMIA_ABERTA',
                'department_id' => $departments->where('codigo', 'CIR_HERNIA')->first()?->id,
            ],
            [
                'nome' => 'Herniotomia Laparoscópica',
                'descricao' => 'Reparação de hérnia por via laparoscópica',
                'codigo' => 'PROC_HERNIOTOMIA_LAPA',
                'department_id' => $departments->where('codigo', 'CIR_HERNIA')->first()?->id,
            ],

            // Traumatologia - Reparação de Fractura
            [
                'nome' => 'Osteossíntese de Fémur',
                'descricao' => 'Fixação de fractura de fémur com placa e parafusos',
                'codigo' => 'PROC_OSTEOSSINT_FEMUR',
                'department_id' => $departments->where('codigo', 'TRAUMA_FRATURA')->first()?->id,
            ],
            [
                'nome' => 'Osteossíntese de Tíbia',
                'descricao' => 'Fixação de fractura de tíbia',
                'codigo' => 'PROC_OSTEOSSINT_TIBIA',
                'department_id' => $departments->where('codigo', 'TRAUMA_FRATURA')->first()?->id,
            ],
            [
                'nome' => 'Redução e Imobilização',
                'descricao' => 'Redução de fractura com imobilização externa',
                'codigo' => 'PROC_REDUCAO_IMOBIL',
                'department_id' => $departments->where('codigo', 'TRAUMA_FRATURA')->first()?->id,
            ],

            // Traumatologia - Artroscopia
            [
                'nome' => 'Artroscopia do Joelho',
                'descricao' => 'Inspeção e tratamento artroscópico do joelho',
                'codigo' => 'PROC_ARTROSCOPIA_JOELHO',
                'department_id' => $departments->where('codigo', 'TRAUMA_ARTROSCOPIA')->first()?->id,
            ],
            [
                'nome' => 'Meniscectomia',
                'descricao' => 'Remoção ou reparação meniscal',
                'codigo' => 'PROC_MENISCECTOMIA',
                'department_id' => $departments->where('codigo', 'TRAUMA_ARTROSCOPIA')->first()?->id,
            ],
            [
                'nome' => 'Reconstrução do Ligamento Cruzado',
                'descricao' => 'Reconstrução do LCA do joelho',
                'codigo' => 'PROC_RECONS_LCA',
                'department_id' => $departments->where('codigo', 'TRAUMA_ARTROSCOPIA')->first()?->id,
            ],

            // Cardiologia - Angioplastia
            [
                'nome' => 'Angioplastia Coronária com Stent',
                'descricao' => 'Desobstrução de artéria coronária com colocação de stent',
                'codigo' => 'PROC_ANGIOPLASTIA_STENT',
                'department_id' => $departments->where('codigo', 'CARDIO_ANGIOPLASTIA')->first()?->id,
            ],
            [
                'nome' => 'Aterectomia Coronária',
                'descricao' => 'Remoção de placa aterosclerótica',
                'codigo' => 'PROC_ATERECTOMIA_CORONARIA',
                'department_id' => $departments->where('codigo', 'CARDIO_ANGIOPLASTIA')->first()?->id,
            ],

            // Cardiologia - Bypass Coronário
            [
                'nome' => 'Bypass Coronário Artéria Mamária',
                'descricao' => 'Bypass coronário com enxerto de artéria mamária',
                'codigo' => 'PROC_BYPASS_IMA',
                'department_id' => $departments->where('codigo', 'CARDIO_BYPASS')->first()?->id,
            ],
            [
                'nome' => 'Bypass Coronário Veia Safena',
                'descricao' => 'Bypass coronário com enxerto de veia safena',
                'codigo' => 'PROC_BYPASS_SAFENA',
                'department_id' => $departments->where('codigo', 'CARDIO_BYPASS')->first()?->id,
            ],
        ];

        // Apenas criar procedimentos se o departament_id existir
        foreach ($procedures as $proc) {
            if ($proc['department_id']) {
                Procedure::create([
                    'nome' => $proc['nome'],
                    'descricao' => $proc['descricao'],
                    'codigo' => $proc['codigo'],
                    'department_id' => $proc['department_id'],
                    'ativo' => true,
                ]);
            }
        }
    }
}
