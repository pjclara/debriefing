<?php

namespace Database\Seeders;

use App\Models\Consumivel;
use App\Models\StockMovimento;
use Illuminate\Database\Seeder;

class StockMovimentoSeeder extends Seeder
{
    public function run(): void
    {
        // Dados de exemplo de movimentos de stock
        $movimentos = [
            // Itens Robóticos com Vidas
            [
                'designacao_consumivel'   => 'PROGRASP FORCEPS (PINÇA PROGRASP)',
                'tipo_mov'    => 'entrada',
                'referencia'  => 'PROGRASP-001',
                'codigo'      => '408414',
                'vidas_inicial' => 10,
                'vidas_atual' => 10,
                'data_entrada' => now()->subDays(30),
                'data_saida' => null,
                'motivo' => null,
                'observacoes' => 'Receção de encomenda fornecedor',
            ],
            [
                'designacao_consumivel'   => 'TIP-UP FENESTRATED GRASPER (PINÇA TIP-UP)',
                'tipo_mov'    => 'entrada',
                'referencia'  => 'TIPUP-001',
                'codigo'      => '408412',
                'vidas_inicial' => 5,
                'vidas_atual' => 5,
                'data_entrada' => now()->subDays(20),
                'data_saida' => null,
                'motivo' => null,
                'observacoes' => 'Receção de encomenda',
            ],
            [
                'designacao_consumivel'   => 'PROGRASP FORCEPS (PINÇA PROGRASP)',
                'tipo_mov'    => 'saida',
                'referencia'  => 'PROGRASP-001',
                'codigo'      => '408414',
                'vidas_inicial' => 10,
                'vidas_atual' => 8,
                'data_entrada' => now()->subDays(15),
                'data_saida' => now()->subDays(15),
                'motivo' => 'consumo_cirurgia',
                'observacoes' => 'Consumo em cirurgia',
            ],
            // Descartáveis
            [
                'designacao_consumivel'   => 'PANO CIRÚRGICO DO BRAÇO DE INSTRUMENTOS',
                'tipo_mov'    => 'entrada',
                'referencia'  => 'PANO-BRACO-001',
                'codigo'      => 'Z11451',
                'vidas_inicial' => null,
                'vidas_atual' => null,
                'data_entrada' => now()->subDays(10),
                'data_saida' => null,
                'motivo' => null,
                'observacoes' => 'Entrada de stock',
            ],
            [
                'designacao_consumivel'   => 'PANO CIRÚRGICO DO BRAÇO DE INSTRUMENTOS',
                'tipo_mov'    => 'saida',
                'referencia'  => 'PANO-BRACO-001',
                'codigo'      => 'Z11451',
                'vidas_inicial' => null,
                'vidas_atual' => null,
                'data_entrada' => now()->subDays(5),
                'data_saida' => now()->subDays(5),
                'motivo' => 'consumo',
                'observacoes' => 'Consumo',
            ],
            // Extras
            [
                'designacao_consumivel'   => 'ASPIRADOR/IRRIGADOR "ELEPHANT"',
                'tipo_mov'    => 'entrada',
                'referencia'  => 'ELEPHANT-001',
                'codigo'      => 'E001',
                'vidas_inicial' => null,
                'vidas_atual' => null,
                'data_entrada' => now()->subDays(45),
                'data_saida' => null,
                'motivo' => null,
                'observacoes' => 'Aquisição',
            ],
        ];

        foreach ($movimentos as $mov) {
            $consumivel = Consumivel::where('designacao', $mov['designacao_consumivel'])->first();
            
            if ($consumivel) {
                StockMovimento::create([
                    'consumivel_id' => $consumivel->id,
                    'tipo_mov'      => $mov['tipo_mov'],
                    'referencia'    => $mov['referencia'],
                    'codigo'        => $mov['codigo'],
                    'vidas_inicial' => $mov['vidas_inicial'],
                    'vidas_atual'   => $mov['vidas_atual'],
                    'data_entrada'  => $mov['data_entrada'],
                    'data_saida'    => $mov['data_saida'],
                    'motivo'        => $mov['motivo'],
                    'observacoes'   => $mov['observacoes'],
                ]);
            }
        }
    }
}
