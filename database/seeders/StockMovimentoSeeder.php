<?php

namespace Database\Seeders;

use App\Models\ConsumivelTipo;
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
                'nome_tipo'   => 'PROGRASP FORCEPS (PINÇA PROGRASP)',
                'tipo_mov'    => 'entrada',
                'referencia'  => 'PROGRASP-001',
                'codigo'      => '408414',
                'vidas'       => 10,
                'data_entrada' => now()->subDays(30),
                'observacoes' => 'Receção de encomenda fornecedor',
            ],
            [
                'nome_tipo'   => 'TIP-UP FENESTRATED GRASPER (PINÇA TIP-UP)',
                'tipo_mov'    => 'entrada',
                'referencia'  => 'TIPUP-001',
                'codigo'      => '408412',
                'vidas'       => 5,
                'data_entrada' => now()->subDays(20),
                'observacoes' => 'Receção de encomenda',
            ],
            [
                'nome_tipo'   => 'PROGRASP FORCEPS (PINÇA PROGRASP)',
                'tipo_mov'    => 'saida',
                'referencia'  => 'PROGRASP-001',
                'codigo'      => '408414',
                'vidas'       => 10,
                'data_entrada' => now()->subDays(15),
                'observacoes' => 'Consumo em cirurgia',
            ],
            // Descartáveis
            [
                'nome_tipo'   => 'PANO CIRÚRGICO DO BRAÇO DE INSTRUMENTOS',
                'tipo_mov'    => 'entrada',
                'referencia'  => 'PANO-BRACO-001',
                'codigo'      => 'Z11451',
                'vidas'       => null,
                'data_entrada' => now()->subDays(10),
                'observacoes' => 'Entrada de stock',
            ],
            [
                'nome_tipo'   => 'PANO CIRÚRGICO DO BRAÇO DE INSTRUMENTOS',
                'tipo_mov'    => 'saida',
                'referencia'  => 'PANO-BRACO-001',
                'codigo'      => 'Z11451',
                'vidas'       => null,
                'data_entrada' => now()->subDays(5),
                'observacoes' => 'Consumo',
            ],
            // Extras
            [
                'nome_tipo'   => 'ASPIRADOR/IRRIGADOR "ELEPHANT"',
                'tipo_mov'    => 'entrada',
                'referencia'  => 'ELEPHANT-001',
                'codigo'      => 'E001',
                'vidas'       => null,
                'data_entrada' => now()->subDays(45),
                'observacoes' => 'Aquisição',
            ],
        ];

        foreach ($movimentos as $mov) {
            $tipo = ConsumivelTipo::where('nome', $mov['nome_tipo'])->first();
            
            if ($tipo) {
                StockMovimento::create([
                    'consumivel_tipo_id' => $tipo->id,
                    'tipo_mov'           => $mov['tipo_mov'],
                    'referencia'         => $mov['referencia'],
                    'codigo'             => $mov['codigo'],
                    'vidas'              => $mov['vidas'],
                    'data_entrada'       => $mov['data_entrada'],
                    'observacoes'        => $mov['observacoes'],
                ]);
            }
        }
    }
}
