<?php

namespace Database\Seeders;

use App\Models\ConsumivelTipo;
use Illuminate\Database\Seeder;

class ConsumivelTipoSeeder extends Seeder
{
    public function run(): void
    {
        $tipos = [
            // ── Itens Robóticos com Vidas ──────────────────────────────────────────
            ['nome' => 'PROGRASP FORCEPS (PINÇA PROGRASP)',                              'categoria' => 'robotico_vidas'],
            ['nome' => 'TIP-UP FENESTRATED GRASPER (PINÇA TIP-UP)',                     'categoria' => 'robotico_vidas'],
            ['nome' => 'FENESTRATED BIPOLAR FORCEPS (PINÇA BIPOLAR FENESTRADA)',         'categoria' => 'robotico_vidas'],
            ['nome' => 'MARYLAND BIPOLAR FORCEPS (PINÇA BIPOLAR MARYLAND)',              'categoria' => 'robotico_vidas'],
            ['nome' => 'MONOPOLAR CURVED SCISSORS (TESOURA MONOPOLAR)',                  'categoria' => 'robotico_vidas'],
            ['nome' => 'LARGE NEEDLE DRIVER (PORTA-AGULHAS GRANDE)',                     'categoria' => 'robotico_vidas'],
            ['nome' => 'LARGE SUTURE CUT NEEDLE DRIVER (PORTA-AGULHAS GRANDE CORTA SUTURAS)', 'categoria' => 'robotico_vidas'],
            ['nome' => 'MEGA NEEDLE DRIVER (MEGA PORTA-AGULHAS)',                        'categoria' => 'robotico_vidas'],
            ['nome' => 'MEGA SUTURE CUT NEEDLE DRIVER (MEGA PORTA-AGULHAS CORTA SUTURAS)', 'categoria' => 'robotico_vidas'],
            ['nome' => 'LARGE CLIP APPLIER (APLICADOR HEMOLOCK LARGE - ROXO)',           'categoria' => 'robotico_vidas'],
            ['nome' => 'CABO MONOPOLAR',                                                  'categoria' => 'robotico_vidas'],
            ['nome' => 'CABO BIPOLAR',                                                    'categoria' => 'robotico_vidas'],

            // ── Consumíveis Robóticos Descartáveis ──────────────────────────────────
            ['nome' => 'PANO CIRÚRGICO DO BRAÇO DE INSTRUMENTOS',                        'categoria' => 'robotico_descartavel'],
            ['nome' => 'PANO CIRÚRGICO DA COLUNA',                                       'categoria' => 'robotico_descartavel'],
            ['nome' => 'VEDAÇÃO DE CÂNULA DE 5-8MM',                                     'categoria' => 'robotico_descartavel'],
            ['nome' => 'OBTURADOR SEM LÂMINA DE 8MM',                                    'categoria' => 'robotico_descartavel'],
            ['nome' => 'ACESSÓRIO DE COBERTURA DA PONTA DA TESOURA',                     'categoria' => 'robotico_descartavel'],
            ['nome' => 'REDUTOR DE 12MM PARA 8MM',                                       'categoria' => 'robotico_descartavel'],
            ['nome' => 'VEDAÇÃO DE CÂNULA DO AGRAFADOR DE 12MM',                         'categoria' => 'robotico_descartavel'],
            ['nome' => 'AGRAFADOR SUREFORM 60',                                          'categoria' => 'robotico_descartavel'],
            ['nome' => 'RECARGA SUREFORM 60 - PRETA 4.6',                               'categoria' => 'robotico_descartavel'],
            ['nome' => 'RECARGA SUREFORM 60 - VERDE 4.3',                               'categoria' => 'robotico_descartavel'],
            ['nome' => 'RECARGA SUREFORM 60 - AZUL 3.5',                                'categoria' => 'robotico_descartavel'],
            ['nome' => 'RECARGA SUREFORM 60 - BRANCA 2.5',                              'categoria' => 'robotico_descartavel'],
            ['nome' => 'SYNCHROSEAL',                                                    'categoria' => 'robotico_descartavel'],
            ['nome' => 'ASPIRADOR/IRRIGADOR ROBÓTICO',                                   'categoria' => 'robotico_descartavel'],

            // ── Extras ──────────────────────────────────────────────────────────────
            ['nome' => 'ASPIRADOR/IRRIGADOR "ELEPHANT"',                                 'categoria' => 'extra'],
            ['nome' => 'SISTEMA DE CO2 (INSUFLAÇÃO / ASPIRAÇÃO DE FUMOS)',               'categoria' => 'extra'],
            ['nome' => 'KIT CAREPAD PARA POSICIONAMENTO',                                'categoria' => 'extra'],
        ];

        foreach ($tipos as $tipo) {
            ConsumivelTipo::firstOrCreate(
                ['nome' => $tipo['nome']],
                ['categoria' => $tipo['categoria'], 'ativo' => true]
            );
        }
    }
}
