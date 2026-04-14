<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockMovimento extends Model
{
    protected $table = 'stock_movimentos';

    protected $fillable = [
        'consumivel_id',
        'tipo_mov',
        'referencia',
        'codigo',
        'vidas_inicial',
        'vidas_atual',
        'data_entrada',
        'data_saida',
        'motivo',
        'observacoes',
    ];

    protected $casts = [
        'data_entrada' => 'date',
        'data_saida'   => 'date',
        'vidas_inicial' => 'integer',
        'vidas_atual'   => 'integer',
    ];

    public static array $tiposMovLabel = [
        'entrada'   => 'Entrada (receção)',
        'saida'     => 'Saída (consumo)',
        'ajuste'    => 'Ajuste de inventário',
        'encomenda' => 'Encomenda',
        'devolucao' => 'Devolução ao fornecedor',
    ];

    public const TIPOS_ENTRADA = ['entrada', 'ajuste'];
    public const TIPOS_SAIDA = ['saida', 'devolucao'];

    protected static function booted(): void
    {
        static::saved(function (StockMovimento $movimento) {
            if ($movimento->consumivel) {
                $movimento->consumivel->recalcularStock();
            }
        });

        static::deleted(function (StockMovimento $movimento) {
            if ($movimento->consumivel) {
                $movimento->consumivel->recalcularStock();
            }
        });
    }

    /**
     * Consumível associado
     */
    public function consumivel(): BelongsTo
    {
        return $this->belongsTo(Consumivel::class, 'consumivel_id');
    }
}
