<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockMovimento extends Model
{
    protected $table = 'stock_movimentos';

    protected $fillable = [
        'consumivel_tipo_id',
        'tipo_mov',
        'referencia',
        'codigo',
        'vidas',
        'data_entrada',
        'observacoes',
    ];

    protected $casts = [
        'data_entrada' => 'date',
        'vidas'        => 'integer',
    ];

    public static array $tiposMovLabel = [
        'entrada'   => 'Entrada (receção)',
        'saida'     => 'Saída (consumo)',
        'ajuste'    => 'Ajuste de inventário',
        'encomenda' => 'Encomenda',
        'devolucao' => 'Devolução ao fornecedor',
    ];

    /**
     * Tipo de consumível associado
     */
    public function tipo(): BelongsTo
    {
        return $this->belongsTo(ConsumivelTipo::class, 'consumivel_tipo_id');
    }
}
