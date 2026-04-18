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
            ['nome' => 'LENTE ROBÓTICA 0 GRAUS',                                                              'categoria' => 'robotico_vidas'],
            ['nome' => 'LENTE ROBÓTICA 30 GRAUS',                                                             'categoria' => 'robotico_vidas'],
            ['nome' => 'CABO MONOPOLAR',                                                                       'categoria' => 'robotico_vidas'],
            ['nome' => 'CABO BIPOLAR',                                                                         'categoria' => 'robotico_vidas'],
            ['nome' => 'PROGRASP FORCEPS (PINÇA PROGRASP)',                                                    'categoria' => 'robotico_vidas'],
            ['nome' => 'TIP-UP FENESTRATED GRASPER (PINÇA TIP-UP)',                                           'categoria' => 'robotico_vidas'],
            ['nome' => 'FENESTRATED BIPOLAR FORCEPS (PINÇA FENESTRADA BIPOLAR)',                               'categoria' => 'robotico_vidas'],
            ['nome' => 'CADIERE FORCEPS (PINÇA CADIERE)',                                                      'categoria' => 'robotico_vidas'],
            ['nome' => 'MARYLAND BIPOLAR FORCEPS (PINÇA BIPOLAR MARYLAND)',                                    'categoria' => 'robotico_vidas'],
            ['nome' => 'MONOPOLAR CURVED SCISSORS (TESOURA MONOPOLAR)',                                        'categoria' => 'robotico_vidas'],
            ['nome' => 'LARGE NEEDLE DRIVER (PORTA-AGULHAS GRANDE)',                                           'categoria' => 'robotico_vidas'],
            ['nome' => 'LARGE SUTURE CUT NEEDLE DRIVER (PORTA-AGULHAS GRANDE CORTA SUTURAS)',                 'categoria' => 'robotico_vidas'],
            ['nome' => 'MEGA NEEDLE DRIVER (MEGA PORTA-AGULHAS)',                                              'categoria' => 'robotico_vidas'],
            ['nome' => 'MEGA SUTURE CUT NEEDLE DRIVER (MEGA PORTA-AGULHAS CORTA SUTURAS)',                    'categoria' => 'robotico_vidas'],
            ['nome' => 'LARGE CLIP APPLIER (APLICADOR HEMOLOCK LARGE - ROXO)',                                 'categoria' => 'robotico_vidas'],
            ['nome' => 'MEDIUM/LARGE CLIP APPLIER (APLICADOR HEMOLOCK MEDIUM/LARGE - VERDE)',                  'categoria' => 'robotico_vidas'],
            ['nome' => 'MONOPOLAR HOOK (GANCHO MONOPOLAR)',                                                    'categoria' => 'robotico_vidas'],
            ['nome' => 'INSTRUMENT ARM DRAPE (PANO CIRÚRGICO DO BRAÇO DE INSTRUMENTOS)',                      'categoria' => 'robotico_vidas'],

            // ── Consumíveis Robóticos Descartáveis ──────────────────────────────────
            ['nome' => 'COLUMN DRAPE (PANO CIRÚRGICO DA COLUNA)',                                              'categoria' => 'robotico_descartavel'],
            ['nome' => '5-8MM CANNULA SEAL (VEDAÇÃO DE CÂNULA DE 5-8MM)',                                     'categoria' => 'robotico_descartavel'],
            ['nome' => '8MM BLADELESS OBTURATOR (OBTURADOR SEM LÂMINA DE 8MM)',                               'categoria' => 'robotico_descartavel'],
            ['nome' => 'TIP COVER ACCESSORY (ACESSÓRIO DE COBERTURA DA PONTA)',                                'categoria' => 'robotico_descartavel'],
            ['nome' => '12-8MM REDUCER (REDUTOR DE 12MM PARA 8MM)',                                           'categoria' => 'robotico_descartavel'],
            ['nome' => '12MM & STAPLER CANNULA SEAL (VEDANTE DE CÂNULA DO AGRAFADOR DE 12MM)',                'categoria' => 'robotico_descartavel'],
            ['nome' => 'SUREFORM 60 (AGRAFADOR SUREFORM 60)',                                                  'categoria' => 'robotico_descartavel'],
            ['nome' => 'SUREFORM 60 RELOAD, BLACK (RECARGA SUREFORM 60, PRETA 4.6MM)',                        'categoria' => 'robotico_descartavel'],
            ['nome' => 'SUREFORM 60 RELOAD, GREEN (RECARGA SUREFORM 60, VERDE 4.3MM)',                        'categoria' => 'robotico_descartavel'],
            ['nome' => 'SUREFORM 60 RELOAD, BLUE (RECARGA SUREFORM 60, AZUL 3.5MM)',                          'categoria' => 'robotico_descartavel'],
            ['nome' => 'SUREFORM 60 RELOAD, WHITE (RECARGA SUREFORM 60, BRANCO 2.5MM)',                       'categoria' => 'robotico_descartavel'],
            ['nome' => 'SUREFORM 45 (AGRAFADOR SUREFORM 45)',                                                  'categoria' => 'robotico_descartavel'],
            ['nome' => 'SUREFORM 45 RELOAD, BLACK (RECARGA SUREFORM 45, PRETA 4.6MM)',                        'categoria' => 'robotico_descartavel'],
            ['nome' => 'SUREFORM 45 RELOAD, GREEN (RECARGA SUREFORM 45, VERDE 4.3MM)',                        'categoria' => 'robotico_descartavel'],
            ['nome' => 'SUREFORM 45 RELOAD, BLUE (RECARGA SUREFORM 45, AZUL 3.5MM)',                          'categoria' => 'robotico_descartavel'],
            ['nome' => 'SUREFORM 45 RELOAD, WHITE (RECARGA SUREFORM 45, BRANCO 2.5MM)',                       'categoria' => 'robotico_descartavel'],
            ['nome' => 'SUREFORM 45 RELOAD, GREY (RECARGA SUREFORM 45, CINZA 2.0MM)',                         'categoria' => 'robotico_descartavel'],
            ['nome' => 'SYNCHROSEAL',                                                                          'categoria' => 'robotico_descartavel'],
            ['nome' => 'VESSEL SEALER EXTEND',                                                                 'categoria' => 'robotico_descartavel'],
            ['nome' => 'SUCTION IRRIGATOR (SUCÇÃO/IRRIGADOR)',                                                 'categoria' => 'robotico_descartavel'],
            ['nome' => 'KIT CAREPAD PARA POSICIONAMENTO DO PACIENTE EM TRENDELENBURG',                        'categoria' => 'robotico_descartavel'],
            ['nome' => 'KIT INSUFLADOR CO2 8MM E CONJUNTO DE EVACUAÇÃO DE FUMOS',                             'categoria' => 'robotico_descartavel'],
            ['nome' => 'KIT INSUFLADOR CO2 12MM E CONJUNTO DE EVACUAÇÃO DE FUMOS',                            'categoria' => 'robotico_descartavel'],
        ];

        foreach ($tipos as $tipo) {
            ConsumivelTipo::firstOrCreate(
                ['nome' => $tipo['nome']],
                ['categoria' => $tipo['categoria'], 'ativo' => true]
            );
        }
    }
}
