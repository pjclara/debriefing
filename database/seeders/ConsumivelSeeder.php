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
            ['designacao' => 'PROGRASP FORCEPS (PINÇA PROGRASP)',                              'categoria' => 'robotico_vidas'],
            ['designacao' => 'TIP-UP FENESTRATED GRASPER (PINÇA TIP-UP)',                     'categoria' => 'robotico_vidas'],
            ['designacao' => 'FENESTRATED BIPOLAR FORCEPS (PINÇA BIPOLAR FENESTRADA)',         'categoria' => 'robotico_vidas'],
            ['designacao' => 'MARYLAND BIPOLAR FORCEPS (PINÇA BIPOLAR MARYLAND)',              'categoria' => 'robotico_vidas'],
            ['designacao' => 'MONOPOLAR CURVED SCISSORS (TESOURA MONOPOLAR)',                  'categoria' => 'robotico_vidas'],
            ['designacao' => 'LARGE NEEDLE DRIVER (PORTA-AGULHAS GRANDE)',                     'categoria' => 'robotico_vidas'],
            ['designacao' => 'LARGE SUTURE CUT NEEDLE DRIVER (PORTA-AGULHAS GRANDE CORTA SUTURAS)', 'categoria' => 'robotico_vidas'],
            ['designacao' => 'MEGA NEEDLE DRIVER (MEGA PORTA-AGULHAS)',                        'categoria' => 'robotico_vidas'],
            ['designacao' => 'MEGA SUTURE CUT NEEDLE DRIVER (MEGA PORTA-AGULHAS CORTA SUTURAS)', 'categoria' => 'robotico_vidas'],
            ['designacao' => 'LARGE CLIP APPLIER (APLICADOR HEMOLOCK LARGE - ROXO)',           'categoria' => 'robotico_vidas'],
            ['designacao' => 'CABO MONOPOLAR',                                                  'categoria' => 'robotico_vidas'],
            ['designacao' => 'CABO BIPOLAR',                                                    'categoria' => 'robotico_vidas'],

            // ── Consumíveis Robóticos Descartáveis ────────────────────────
            ['designacao' => 'PANO CIRÚRGICO DO BRAÇO DE INSTRUMENTOS',                        'categoria' => 'robotico_descartavel'],
            ['designacao' => 'PANO CIRÚRGICO DA COLUNA',                                       'categoria' => 'robotico_descartavel'],
            ['designacao' => 'VEDAÇÃO DE CÂNULA DE 5-8MM',                                     'categoria' => 'robotico_descartavel'],
            ['designacao' => 'OBTURADOR SEM LÂMINA DE 8MM',                                    'categoria' => 'robotico_descartavel'],
            ['designacao' => 'ACESSÓRIO DE COBERTURA DA PONTA DA TESOURA',                     'categoria' => 'robotico_descartavel'],
            ['designacao' => 'REDUTOR DE 12MM PARA 8MM',                                       'categoria' => 'robotico_descartavel'],
            ['designacao' => 'VEDAÇÃO DE CÂNULA DO AGRAFADOR DE 12MM',                         'categoria' => 'robotico_descartavel'],
            ['designacao' => 'AGRAFADOR SUREFORM 60',                                          'categoria' => 'robotico_descartavel'],
            ['designacao' => 'RECARGA SUREFORM 60 - PRETA 4.6',                               'categoria' => 'robotico_descartavel'],
            ['designacao' => 'RECARGA SUREFORM 60 - VERDE 4.3',                               'categoria' => 'robotico_descartavel'],
            ['designacao' => 'RECARGA SUREFORM 60 - AZUL 3.5',                                'categoria' => 'robotico_descartavel'],
            ['designacao' => 'RECARGA SUREFORM 60 - BRANCA 2.5',                              'categoria' => 'robotico_descartavel'],
            ['designacao' => 'SYNCHROSEAL',                                                    'categoria' => 'robotico_descartavel'],
            ['designacao' => 'ASPIRADOR/IRRIGADOR ROBÓTICO',                                   'categoria' => 'robotico_descartavel'],

            // ── Extras ────────────────────────────────────────────────────
            ['designacao' => 'ASPIRADOR/IRRIGADOR "ELEPHANT"',                                 'categoria' => 'extra'],
            ['designacao' => 'SISTEMA DE CO2 (INSUFLAÇÃO / ASPIRAÇÃO DE FUMOS)',               'categoria' => 'extra'],
            ['designacao' => 'KIT CAREPAD PARA POSICIONAMENTO',                                'categoria' => 'extra'],
        ];

        foreach ($items as $item) {
            Consumivel::firstOrCreate(
                ['designacao' => $item['designacao']],
                ['categoria' => $item['categoria'], 'unidade' => 'un', 'ativo' => true]
            );
        }
    }
}
