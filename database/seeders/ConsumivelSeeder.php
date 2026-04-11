<?php

namespace Database\Seeders;

use App\Models\Consumivel;
use Illuminate\Database\Seeder;

class ConsumivelSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            // ── Itens Robóticos com Vidas ─────────────────────────────────
            ['designacao' => 'PROGRASP FORCEPS (PINÇA PROGRASP)',                              'referencia' => 'PROGRASP-001', 'codigo' => '408414', 'categoria' => 'robotico_vidas', 'vidas' => 10],
            ['designacao' => 'TIP-UP FENESTRATED GRASPER (PINÇA TIP-UP)',                     'referencia' => 'TIPUP-001', 'codigo' => '408412', 'categoria' => 'robotico_vidas', 'vidas' => 5],
            ['designacao' => 'FENESTRATED BIPOLAR FORCEPS (PINÇA BIPOLAR FENESTRADA)',         'referencia' => 'FENEST-001', 'codigo' => '408413', 'categoria' => 'robotico_vidas', 'vidas' => 8],
            ['designacao' => 'MARYLAND BIPOLAR FORCEPS (PINÇA BIPOLAR MARYLAND)',              'referencia' => 'MARYLAND-001', 'codigo' => '408420', 'categoria' => 'robotico_vidas', 'vidas' => 6],
            ['designacao' => 'MONOPOLAR CURVED SCISSORS (TESOURA MONOPOLAR)',                  'referencia' => 'MONO-SCISSORS-001', 'codigo' => '408421', 'categoria' => 'robotico_vidas', 'vidas' => 5],
            ['designacao' => 'LARGE NEEDLE DRIVER (PORTA-AGULHAS GRANDE)',                     'referencia' => 'NEEDLE-LRG-001', 'codigo' => '408422', 'categoria' => 'robotico_vidas', 'vidas' => 10],
            ['designacao' => 'LARGE SUTURE CUT NEEDLE DRIVER (PORTA-AGULHAS GRANDE CORTA SUTURAS)', 'referencia' => 'NEEDLE-CUTLRG-001', 'codigo' => '408423', 'categoria' => 'robotico_vidas', 'vidas' => 10],
            ['designacao' => 'MEGA NEEDLE DRIVER (MEGA PORTA-AGULHAS)',                        'referencia' => 'NEEDLE-MEGA-001', 'codigo' => '408424', 'categoria' => 'robotico_vidas', 'vidas' => 10],
            ['designacao' => 'MEGA SUTURE CUT NEEDLE DRIVER (MEGA PORTA-AGULHAS CORTA SUTURAS)', 'referencia' => 'NEEDLE-MEGACUT-001', 'codigo' => '408425', 'categoria' => 'robotico_vidas', 'vidas' => 10],
            ['designacao' => 'LARGE CLIP APPLIER (APLICADOR HEMOLOCK LARGE - ROXO)',           'referencia' => 'CLIP-LARGE-001', 'codigo' => '408426', 'categoria' => 'robotico_vidas', 'vidas' => 5],
            ['designacao' => 'CABO MONOPOLAR',                                                  'referencia' => 'CABO-MONO-001', 'codigo' => '408410', 'categoria' => 'robotico_vidas', 'vidas' => 20],
            ['designacao' => 'CABO BIPOLAR',                                                    'referencia' => 'CABO-BI-001', 'codigo' => '408411', 'categoria' => 'robotico_vidas', 'vidas' => 20],

            // ── Consumíveis Robóticos Descartáveis ────────────────────────
            ['designacao' => 'PANO CIRÚRGICO DO BRAÇO DE INSTRUMENTOS',                        'referencia' => 'PANO-BRACO-001', 'codigo' => 'Z11451', 'categoria' => 'robotico_descartavel', 'vidas' => null],
            ['designacao' => 'PANO CIRÚRGICO DA COLUNA',                                       'referencia' => 'PANO-COLUNA-001', 'codigo' => 'Z11452', 'categoria' => 'robotico_descartavel', 'vidas' => null],
            ['designacao' => 'VEDAÇÃO DE CÂNULA DE 5-8MM',                                     'referencia' => 'VEDACAO-58-001', 'codigo' => 'Z11453', 'categoria' => 'robotico_descartavel', 'vidas' => null],
            ['designacao' => 'OBTURADOR SEM LÂMINA DE 8MM',                                    'referencia' => 'OBTURADOR-8-001', 'codigo' => 'Z11454', 'categoria' => 'robotico_descartavel', 'vidas' => null],
            ['designacao' => 'ACESSÓRIO DE COBERTURA DA PONTA DA TESOURA',                     'referencia' => 'COBERTURA-TESOURA-001', 'codigo' => 'Z11455', 'categoria' => 'robotico_descartavel', 'vidas' => null],
            ['designacao' => 'REDUTOR DE 12MM PARA 8MM',                                       'referencia' => 'REDUTOR-128-001', 'codigo' => 'Z11456', 'categoria' => 'robotico_descartavel', 'vidas' => null],
            ['designacao' => 'VEDAÇÃO DE CÂNULA DO AGRAFADOR DE 12MM',                         'referencia' => 'VEDACAO-AGRAF-001', 'codigo' => 'Z11457', 'categoria' => 'robotico_descartavel', 'vidas' => null],
            ['designacao' => 'AGRAFADOR SUREFORM 60',                                          'referencia' => 'SUREFORM-60-001', 'codigo' => 'Z11458', 'categoria' => 'robotico_descartavel', 'vidas' => null],
            ['designacao' => 'RECARGA SUREFORM 60 - PRETA 4.6',                               'referencia' => 'RECARGA-PRETA-46', 'codigo' => 'Z11459', 'categoria' => 'robotico_descartavel', 'vidas' => null],
            ['designacao' => 'RECARGA SUREFORM 60 - VERDE 4.3',                               'referencia' => 'RECARGA-VERDE-43', 'codigo' => 'Z11460', 'categoria' => 'robotico_descartavel', 'vidas' => null],
            ['designacao' => 'RECARGA SUREFORM 60 - AZUL 3.5',                                'referencia' => 'RECARGA-AZUL-35', 'codigo' => 'Z11461', 'categoria' => 'robotico_descartavel', 'vidas' => null],
            ['designacao' => 'RECARGA SUREFORM 60 - BRANCA 2.5',                              'referencia' => 'RECARGA-BRANCA-25', 'codigo' => 'Z11462', 'categoria' => 'robotico_descartavel', 'vidas' => null],
            ['designacao' => 'SYNCHROSEAL',                                                    'referencia' => 'SYNCHROSEAL-001', 'codigo' => 'Z11463', 'categoria' => 'robotico_descartavel', 'vidas' => null],
            ['designacao' => 'ASPIRADOR/IRRIGADOR ROBÓTICO',                                   'referencia' => 'ASPIRADOR-ROB-001', 'codigo' => 'Z11464', 'categoria' => 'robotico_descartavel', 'vidas' => null],

            // ── Extras ────────────────────────────────────────────────────
            ['designacao' => 'ASPIRADOR/IRRIGADOR "ELEPHANT"',                                 'referencia' => 'ELEPHANT-001', 'codigo' => 'E001', 'categoria' => 'extra', 'vidas' => null],
            ['designacao' => 'SISTEMA DE CO2 (INSUFLAÇÃO / ASPIRAÇÃO DE FUMOS)',               'referencia' => 'CO2-SYS-001', 'codigo' => 'CO2-001', 'categoria' => 'extra', 'vidas' => null],
            ['designacao' => 'KIT CAREPAD PARA POSICIONAMENTO',                                'referencia' => 'CAREPAD-001', 'codigo' => 'CP-001', 'categoria' => 'extra', 'vidas' => null],
        ];

        foreach ($items as $item) {
            Consumivel::firstOrCreate(
                ['designacao' => $item['designacao']],
                [
                    'referencia' => $item['referencia'],
                    'codigo' => $item['codigo'],
                    'categoria' => $item['categoria'],
                    'vidas' => $item['vidas'],
                    'tem_stock' => $item['categoria'] === 'robotico_vidas',
                    'ativo' => true
                ]
            );
        }
    }
}
