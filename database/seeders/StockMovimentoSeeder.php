<?php

namespace Database\Seeders;

use App\Models\ConsumivelTipo;
use App\Models\StockMovimento;
use Illuminate\Database\Seeder;

class StockMovimentoSeeder extends Seeder
{
    public function run(): void
    {
        // [nome, referencia, codigo, vidas_inicial, vidas_atual, unidades_inicial, unidades_atual, data_entrada]
        $rows = [
            // ── Lentes ────────────────────────────────────────────────────────────────
            ['LENTE ROBÓTICA 0 GRAUS',  '470056', '00886874116562 10789426', 1,  1,  null, null, '2025-12-27'],
            ['LENTE ROBÓTICA 0 GRAUS',  '470056', '00886874116562 19785762', 1,  1,  null, null, '2025-12-27'],
            ['LENTE ROBÓTICA 30 GRAUS', '470057', '00886874116555 10780315', 1,  1,  null, null, '2025-12-27'],
            ['LENTE ROBÓTICA 30 GRAUS', '470057', '00886874116555 10780300', 1,  1,  null, null, '2025-12-27'],

            // ── Cabo Monopolar ────────────────────────────────────────────────────────
            ['CABO MONOPOLAR', '470384', '00886874112595 0612', 20, 9,  null, null, '2025-12-27'],
            ['CABO MONOPOLAR', '470384', '00886874112595 1044', 20, 13, null, null, '2025-12-27'],
            ['CABO MONOPOLAR', '470384', '00886874112595 0609', 20, 20, null, null, '2025-12-27'],
            ['CABO MONOPOLAR', '470384', '00886874112595 0626', 20, 13, null, null, '2025-12-27'],

            // ── Cabo Bipolar ──────────────────────────────────────────────────────────
            ['CABO BIPOLAR', '470383', '00886874112601 0640', 20, 9,  null, null, '2025-12-27'],
            ['CABO BIPOLAR', '470383', '00886874112601 1423', 20, 13, null, null, '2025-12-27'],
            ['CABO BIPOLAR', '470383', '00886874112601 0643', 20, 20, null, null, '2025-12-27'],
            ['CABO BIPOLAR', '470383', '00886874112601 0636', 20, 13, null, null, '2025-12-27'],

            // ── Prograsp Forceps ──────────────────────────────────────────────────────
            ['PROGRASP FORCEPS (PINÇA PROGRASP)', '471093', '00886874119785 0312', 18, 6,  null, null, '2025-12-27'],
            ['PROGRASP FORCEPS (PINÇA PROGRASP)', '471093', '00886874119785 0150', 18, 13, null, null, '2025-12-27'],
            ['PROGRASP FORCEPS (PINÇA PROGRASP)', '471093', '00886874119785 0112', 18, 18, null, null, '2026-03-26'],
            ['PROGRASP FORCEPS (PINÇA PROGRASP)', '471093', '00886874119785 0062', 18, 18, null, null, '2026-03-26'],
            ['PROGRASP FORCEPS (PINÇA PROGRASP)', '471093', '00886874119785 0157', 18, 18, null, null, '2026-03-26'],
            ['PROGRASP FORCEPS (PINÇA PROGRASP)', '471093', '00886874119785 0148', 18, 18, null, null, '2026-03-26'],
            ['PROGRASP FORCEPS (PINÇA PROGRASP)', '471093', '00886874119785 0114', 18, 18, null, null, '2026-03-26'],
            ['PROGRASP FORCEPS (PINÇA PROGRASP)', '471093', '00886874119785 0109', 18, 18, null, null, '2026-03-26'],

            // ── Tip-Up Fenestrated Grasper ────────────────────────────────────────────
            ['TIP-UP FENESTRATED GRASPER (PINÇA TIP-UP)', '470347', '00886874112496 0036', 10, 5, null, null, '2025-12-27'],

            // ── Fenestrated Bipolar Forceps ───────────────────────────────────────────
            ['FENESTRATED BIPOLAR FORCEPS (PINÇA FENESTRADA BIPOLAR)', '471205', '00886874119808 0333', 14, 5,  null, null, '2025-12-27'],
            ['FENESTRATED BIPOLAR FORCEPS (PINÇA FENESTRADA BIPOLAR)', '471205', '00886874119808 0249', 14, 8,  null, null, '2025-12-27'],
            ['FENESTRATED BIPOLAR FORCEPS (PINÇA FENESTRADA BIPOLAR)', '471205', '00886874119808 0278', 14, 14, null, null, '2026-03-25'],
            ['FENESTRATED BIPOLAR FORCEPS (PINÇA FENESTRADA BIPOLAR)', '471205', '00886874119808 0267', 14, 14, null, null, '2026-03-25'],
            ['FENESTRATED BIPOLAR FORCEPS (PINÇA FENESTRADA BIPOLAR)', '471205', '00886874119808 0287', 14, 14, null, null, '2026-03-25'],
            ['FENESTRATED BIPOLAR FORCEPS (PINÇA FENESTRADA BIPOLAR)', '471205', '00886874119808 0286', 14, 14, null, null, '2026-03-25'],
            ['FENESTRATED BIPOLAR FORCEPS (PINÇA FENESTRADA BIPOLAR)', '471205', '00886874119808 0274', 14, 14, null, null, '2026-03-25'],
            ['FENESTRATED BIPOLAR FORCEPS (PINÇA FENESTRADA BIPOLAR)', '471205', '00886874119808 0358', 14, 13, null, null, '2026-03-25'],

            // ── Cadiere Forceps ───────────────────────────────────────────────────────
            ['CADIERE FORCEPS (PINÇA CADIERE)', '471049', '00886874119778 0415', 18, 18, null, null, '2026-03-25'],
            ['CADIERE FORCEPS (PINÇA CADIERE)', '471049', '00886874119778 0406', 18, 18, null, null, '2026-03-25'],
            ['CADIERE FORCEPS (PINÇA CADIERE)', '471049', '00886874119778 0391', 18, 18, null, null, '2026-03-25'],
            ['CADIERE FORCEPS (PINÇA CADIERE)', '471049', '00886874119778 0420', 18, 18, null, null, '2026-03-25'],
            ['CADIERE FORCEPS (PINÇA CADIERE)', '471049', '00886874119778 0414', 18, 18, null, null, '2026-03-25'],
            ['CADIERE FORCEPS (PINÇA CADIERE)', '471049', '00886874119778 0398', 18, 18, null, null, '2026-03-25'],

            // ── Maryland Bipolar Forceps ──────────────────────────────────────────────
            ['MARYLAND BIPOLAR FORCEPS (PINÇA BIPOLAR MARYLAND)', '471172', '00886874119792 0501', 14, 9,  null, null, '2025-12-27'],
            ['MARYLAND BIPOLAR FORCEPS (PINÇA BIPOLAR MARYLAND)', '471172', '00886874119792 0500', 14, 10, null, null, '2025-12-27'],
            ['MARYLAND BIPOLAR FORCEPS (PINÇA BIPOLAR MARYLAND)', '471172', '00886874119792 0428', 14, 14, null, null, '2026-03-25'],
            ['MARYLAND BIPOLAR FORCEPS (PINÇA BIPOLAR MARYLAND)', '471172', '00886874119792 0446', 14, 14, null, null, '2026-03-25'],
            ['MARYLAND BIPOLAR FORCEPS (PINÇA BIPOLAR MARYLAND)', '471172', '00886874119792 0436', 14, 14, null, null, '2026-03-25'],
            ['MARYLAND BIPOLAR FORCEPS (PINÇA BIPOLAR MARYLAND)', '471172', '00886874119792 0433', 14, 14, null, null, '2026-03-25'],
            ['MARYLAND BIPOLAR FORCEPS (PINÇA BIPOLAR MARYLAND)', '471172', '00886874119792 0447', 14, 14, null, null, '2026-03-25'],
            ['MARYLAND BIPOLAR FORCEPS (PINÇA BIPOLAR MARYLAND)', '471172', '00886874119792 0452', 14, 14, null, null, '2026-03-25'],

            // ── Monopolar Curved Scissors ─────────────────────────────────────────────
            ['MONOPOLAR CURVED SCISSORS (TESOURA MONOPOLAR)', '470179', '00886874112298 0194', 10, 0,  null, null, '2025-12-27'],
            ['MONOPOLAR CURVED SCISSORS (TESOURA MONOPOLAR)', '470179', '00886874112298 0181', 10, 6,  null, null, '2025-12-27'],
            ['MONOPOLAR CURVED SCISSORS (TESOURA MONOPOLAR)', '470179', '00886874112298 0193', 10, 7,  null, null, '2025-12-27'],
            ['MONOPOLAR CURVED SCISSORS (TESOURA MONOPOLAR)', '470179', '00886874112298 0204', 10, 9,  null, null, '2025-12-27'],
            ['MONOPOLAR CURVED SCISSORS (TESOURA MONOPOLAR)', '470179', '00886874112298 0061', 10, 10, null, null, '2026-03-25'],
            ['MONOPOLAR CURVED SCISSORS (TESOURA MONOPOLAR)', '470179', '00886874112298 0109', 10, 10, null, null, '2026-03-25'],
            ['MONOPOLAR CURVED SCISSORS (TESOURA MONOPOLAR)', '470179', '00886874112298 0106', 10, 10, null, null, '2026-03-25'],
            ['MONOPOLAR CURVED SCISSORS (TESOURA MONOPOLAR)', '470179', '00886874112298 0194', 10, 10, null, null, '2026-03-25'],
            ['MONOPOLAR CURVED SCISSORS (TESOURA MONOPOLAR)', '470179', '00886874112298 0105', 10, 10, null, null, '2026-03-25'],
            ['MONOPOLAR CURVED SCISSORS (TESOURA MONOPOLAR)', '470179', '00886874112298 0110', 10, 10, null, null, '2026-03-25'],

            // ── Large Needle Driver ───────────────────────────────────────────────────
            ['LARGE NEEDLE DRIVER (PORTA-AGULHAS GRANDE)', '471006', '00886874119754 0183', 15, 11, null, null, '2025-12-27'],
            ['LARGE NEEDLE DRIVER (PORTA-AGULHAS GRANDE)', '471006', '00886874119754 0110', 15, 10, null, null, '2025-12-27'],
            ['LARGE NEEDLE DRIVER (PORTA-AGULHAS GRANDE)', '471006', '00886874119754 0165', 15, 15, null, null, '2026-03-25'],
            ['LARGE NEEDLE DRIVER (PORTA-AGULHAS GRANDE)', '471006', '00886874119754 0153', 15, 15, null, null, '2026-03-25'],
            ['LARGE NEEDLE DRIVER (PORTA-AGULHAS GRANDE)', '471006', '00886874119754 0201', 15, 15, null, null, '2026-03-25'],
            ['LARGE NEEDLE DRIVER (PORTA-AGULHAS GRANDE)', '471006', '00886874119754 0195', 15, 15, null, null, '2026-03-25'],
            ['LARGE NEEDLE DRIVER (PORTA-AGULHAS GRANDE)', '471006', '00886874119754 0161', 15, 15, null, null, '2026-03-25'],
            ['LARGE NEEDLE DRIVER (PORTA-AGULHAS GRANDE)', '471006', '00886874119754 0180', 15, 15, null, null, '2026-03-25'],

            // ── Large Suture Cut Needle Driver ────────────────────────────────────────
            ['LARGE SUTURE CUT NEEDLE DRIVER (PORTA-AGULHAS GRANDE CORTA SUTURAS)', '471296', '00886874121504 0120', 15, 13, null, null, '2025-12-27'],
            ['LARGE SUTURE CUT NEEDLE DRIVER (PORTA-AGULHAS GRANDE CORTA SUTURAS)', '471296', '00886874121504 0259', 15, 15, null, null, '2026-03-25'],
            ['LARGE SUTURE CUT NEEDLE DRIVER (PORTA-AGULHAS GRANDE CORTA SUTURAS)', '471296', '00886874121504 0036', 15, 15, null, null, '2026-03-25'],
            ['LARGE SUTURE CUT NEEDLE DRIVER (PORTA-AGULHAS GRANDE CORTA SUTURAS)', '471296', '00886874121504 0045', 15, 15, null, null, '2026-03-25'],
            ['LARGE SUTURE CUT NEEDLE DRIVER (PORTA-AGULHAS GRANDE CORTA SUTURAS)', '471296', '00886874121504 0207', 15, 15, null, null, '2026-03-25'],
            ['LARGE SUTURE CUT NEEDLE DRIVER (PORTA-AGULHAS GRANDE CORTA SUTURAS)', '471296', '00886874121504 0033', 15, 15, null, null, '2026-03-25'],
            ['LARGE SUTURE CUT NEEDLE DRIVER (PORTA-AGULHAS GRANDE CORTA SUTURAS)', '471296', '00886874121504 0036', 15, 15, null, null, '2026-03-25'],

            // ── Mega Drivers ──────────────────────────────────────────────────────────
            ['MEGA NEEDLE DRIVER (MEGA PORTA-AGULHAS)',                             '470194', '00886874112342 0271', 1, 8,  null, null, '2025-12-27'],
            ['MEGA SUTURE CUT NEEDLE DRIVER (MEGA PORTA-AGULHAS CORTA SUTURAS)',    '471309', '00886864119815 0433', 1, 15, null, null, '2025-12-27'],

            // ── Large Clip Applier ────────────────────────────────────────────────────
            ['LARGE CLIP APPLIER (APLICADOR HEMOLOCK LARGE - ROXO)', '470230', '00886874112380 0349', null, null, 100, 88, '2025-12-27'],

            // ── Descartáveis (unidades) ───────────────────────────────────────────────
            ['INSTRUMENT ARM DRAPE (PANO CIRÚRGICO DO BRAÇO DE INSTRUMENTOS)',          '470015', null, null, null, 38, 38, '2025-12-27'],
            ['COLUMN DRAPE (PANO CIRÚRGICO DA COLUNA)',                                 '470341', null, null, null, 31, 31, '2025-12-27'],
            ['5-8MM CANNULA SEAL (VEDAÇÃO DE CÂNULA DE 5-8MM)',                         '470361', null, null, null, 74, 74, '2025-12-27'],
            ['8MM BLADELESS OBTURATOR (OBTURADOR SEM LÂMINA DE 8MM)',                   '470359', null, null, null, 15, 15, '2025-12-27'],
            ['TIP COVER ACCESSORY (ACESSÓRIO DE COBERTURA DA PONTA)',                   '400180', null, null, null, 28, 28, '2025-12-27'],
            ['12-8MM REDUCER (REDUTOR DE 12MM PARA 8MM)',                               '470381', null, null, null, 10, 10, '2025-12-27'],
            ['12MM & STAPLER CANNULA SEAL (VEDANTE DE CÂNULA DO AGRAFADOR DE 12MM)',    '470380', null, null, null, 11, 11, '2025-12-27'],
            ['SUREFORM 60 (AGRAFADOR SUREFORM 60)',                                     '480460', null, null, null, 12, 12, '2025-12-27'],
            ['SUREFORM 60 RELOAD, BLACK (RECARGA SUREFORM 60, PRETA 4.6MM)',            '48360T', null, null, null, 12, 12, '2025-12-27'],
            ['SUREFORM 60 RELOAD, GREEN (RECARGA SUREFORM 60, VERDE 4.3MM)',            '48360G', null, null, null, 12, 12, '2025-12-27'],
            ['SUREFORM 60 RELOAD, BLUE (RECARGA SUREFORM 60, AZUL 3.5MM)',             '48360B', null, null, null,  6,  6, '2025-12-27'],
            ['SUREFORM 60 RELOAD, WHITE (RECARGA SUREFORM 60, BRANCO 2.5MM)',          '48360W', null, null, null,  6,  6, '2025-12-27'],
            ['SUREFORM 45 (AGRAFADOR SUREFORM 45)',                                    '480445', null, null, null, 12, 12, '2026-03-25'],
            ['SUREFORM 45 RELOAD, GREEN (RECARGA SUREFORM 45, VERDE 4.3MM)',           '48345G', null, null, null, 24, 24, '2026-03-25'],
            ['SUREFORM 45 RELOAD, BLUE (RECARGA SUREFORM 45, AZUL 3.5MM)',             '48345B', null, null, null, 24, 24, '2026-03-25'],
            ['SYNCHROSEAL',                                                             '480440', null, null, null,  5,  5, '2025-12-27'],
            ['VESSEL SEALER EXTEND',                                                    '480422', null, null, null,  9,  9, '2026-03-25'],
            ['SUCTION IRRIGATOR (SUCÇÃO/IRRIGADOR)',                                    '480299', null, null, null, 16, 16, '2025-12-27'],
            ['KIT CAREPAD PARA POSICIONAMENTO DO PACIENTE EM TRENDELENBURG',         'PAD90503', null, null, null, 10, 10, '2026-03-25'],
            ['KIT INSUFLADOR CO2 8MM E CONJUNTO DE EVACUAÇÃO DE FUMOS',            '4100-08-XE', null, null, null, 21, 21, '2026-04-10'],
            ['KIT INSUFLADOR CO2 12MM E CONJUNTO DE EVACUAÇÃO DE FUMOS',           '4100-12-XE', null, null, null, 11, 11, '2026-03-25'],
        ];

        foreach ($rows as [$nome, $referencia, $codigo, $vidasInicial, $vidasAtual, $unidadesInicial, $unidadesAtual, $dataEntrada]) {
            $tipo = ConsumivelTipo::where('nome', $nome)->first();
            if (!$tipo) continue;

            StockMovimento::create([
                'consumivel_tipo_id' => $tipo->id,
                'tipo_mov'           => 'entrada',
                'referencia'         => $referencia ?: null,
                'codigo'             => $codigo ?: null,
                'vidas_inicial'      => $vidasInicial,
                'vidas_atual'        => $vidasAtual,
                'unidades_inicial'   => $unidadesInicial,
                'unidades_atual'     => $unidadesAtual,
                'data_entrada'       => $dataEntrada,
            ]);
        }
    }
}       