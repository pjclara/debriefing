<?php
// fix-precos-consumiveis-2026-10.php — Grava os preços unitários do
// catálogo de consumíveis (folha de preços NE 2026), identificados por
// "nome" (não por id, para funcionar em qualquer base de dados). Seguro
// para correr mais do que uma vez (idempotente): só grava quando o nome
// existe e o preço ainda não está igual.
//
// Uso: php fix-precos-consumiveis-2026-10.php

require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\ConsumivelTipo;
use Illuminate\Support\Facades\DB;

DB::transaction(function () {
    $precos = [
        'SUREFORM 60 (AGRAFADOR SUREFORM 60)' => 644.03,
        'SUREFORM 45 (AGRAFADOR SUREFORM 45)' => 736.16,
        'LARGE CLIP APPLIER (APLICADOR HEMOLOCK LARGE - ROXO)' => 2686.55,
        'MEDIUM/LARGE CLIP APPLIER (APLICADOR HEMOLOCK MEDIUM/LARGE - VERDE)' => 3424.79,
        'SUREFORM 60 RELOAD, WHITE (RECARGA SUREFORM 60, BRANCO 2.5MM)' => 278.10,
        'SUREFORM 60 RELOAD, BLUE (RECARGA SUREFORM 60, AZUL 3.5MM)' => 278.10,
        'SUREFORM 60 RELOAD, GREEN (RECARGA SUREFORM 60, VERDE 4.3MM)' => 278.10,
        'SUREFORM 60 RELOAD, BLACK (RECARGA SUREFORM 60, PRETA 4.6MM)' => 278.10,
        'SUREFORM 45 RELOAD, GREY (RECARGA SUREFORM 45, CINZA 2.0MM)' => 329.33,
        'SUREFORM 45 RELOAD, WHITE (RECARGA SUREFORM 45, BRANCO 2.5MM)' => 329.33,
        'SUREFORM 45 RELOAD, BLUE (RECARGA SUREFORM 45, AZUL 3.5MM)' => 329.33,
        'SUREFORM 45 RELOAD, GREEN (RECARGA SUREFORM 45, VERDE 4.3MM)' => 329.33,
        'SUREFORM 45 RELOAD, BLACK (RECARGA SUREFORM 45, PRETA 4.6MM)' => 329.33,
        '8MM BLADELESS OBTURATOR (OBTURADOR SEM LÂMINA DE 8MM)' => 47.22,
        '12-8MM REDUCER (REDUTOR DE 12MM PARA 8MM)' => 51.34,
        '12MM & STAPLER CANNULA SEAL (VEDANTE DE CÂNULA DO AGRAFADOR DE 12MM)' => 32.78,
        'CABO MONOPOLAR' => 618.54,
        'CABO BIPOLAR' => 618.54,
        'TIP COVER ACCESSORY (ACESSÓRIO DE COBERTURA DA PONTA DA TESOURA)' => 37.99,
        'COLUMN DRAPE (PANO CIRÚRGICO DA COLUNA)' => 33.97,
        'INSTRUMENT ARM DRAPE (PANO CIRÚRGICO DO BRAÇO DE INSTRUMENTOS)' => 98.13,
        'PERMANENT CAUTERY HOOK (GANCHO MONOPOLAR)' => 4827.91,
        'KIT CAREPAD PARA POSICIONAMENTO DO PACIENTE EM TRENDELENBURG' => 128.94,
        'FENESTRATED BIPOLAR FORCEPS (PINÇA FENESTRADA BIPOLAR)' => 4339.74,
        'MARYLAND BIPOLAR FORCEPS (PINÇA BIPOLAR MARYLAND)' => 4339.74,
        'PROGRASP FORCEPS (PINÇA PROGRASP)' => 4812.68,
        'TIP-UP FENESTRATED GRASPER (PINÇA TIP-UP)' => 4179.08,
        'CADIERE FORCEPS (PINÇA CADIERE)' => 3766.57,
        'LARGE NEEDLE DRIVER (PORTA-AGULHAS GRANDE)' => 3556.02,
        'LARGE SUTURE CUT NEEDLE DRIVER (PORTA-AGULHAS GRANDE CORTA SUTURAS)' => 3966.33,
        'SYNCHROSEAL' => 999.15,
        'VESSEL SEALER EXTEND' => 1983.61,
        'MONOPOLAR CURVED SCISSORS (TESOURA MONOPOLAR)' => 6079.74,
        // correspondência por semelhança de nome (confiança menor)
        'ASPIRADOR/IRRIGADOR LAPAROSCOPICO 45CM' => 41.82,
        '5-8MM CANNULA SEAL (VEDAÇÃO DE CÂNULA DE 5-8MM)' => 34.08,
        'KIT INSUFLADOR CO2 12MM E CONJUNTO DE EVACUAÇÃO DE FUMOS' => 227.55,
        'KIT INSUFLADOR CO2 8MM E CONJUNTO DE EVACUAÇÃO DE FUMOS' => 227.55,
    ];

    $atualizados = 0;
    $jaCorreto   = 0;
    $naoEncontrados = [];

    foreach ($precos as $nome => $preco) {
        $tipo = ConsumivelTipo::where('nome', $nome)->first();

        if (! $tipo) {
            $naoEncontrados[] = $nome;
            continue;
        }

        if ((float) $tipo->preco_unitario === (float) $preco) {
            $jaCorreto++;
            continue;
        }

        echo "  [atualizado] {$nome}: " . ($tipo->preco_unitario ?? '—') . " -> {$preco}\n";
        $tipo->preco_unitario = $preco;
        $tipo->save();
        $atualizados++;
    }

    echo "Atualizados: {$atualizados} | Já corretos: {$jaCorreto}\n";
    if ($naoEncontrados) {
        echo "NAO ENCONTRADOS (verificar nome no catálogo): " . implode(' | ', $naoEncontrados) . "\n";
    }
});

echo "DONE\n";
