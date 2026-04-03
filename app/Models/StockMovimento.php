<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockMovimento extends Model
{
    protected $table = 'stock_movimentos';

    protected $fillable = [
        'consumivel_id',
        'tipo',
        'quantidade',
        'stock_apos',
        'referencia_doc',
        'fornecedor',
        'data_movimento',
        'observacoes',
    ];

    protected $casts = [
        'data_movimento' => 'date',
        'quantidade'     => 'float',
        'stock_apos'     => 'float',
    ];

    // Tipos que aumentam stock
    public const TIPOS_ENTRADA = ['entrada', 'devolucao'];
    // Tipos que reduzem stock
    public const TIPOS_SAIDA   = ['saida', 'ajuste'];
    // Tipos pendentes (não afectam stock imediatamente)
    public const TIPOS_PENDENTE = ['encomenda'];

    public static array $tiposLabel = [
        'entrada'   => 'Entrada (receção)',
        'saida'     => 'Saída',
        'ajuste'    => 'Ajuste de inventário',
        'encomenda' => 'Encomenda',
        'devolucao' => 'Devolução ao fornecedor',
    ];

    public function consumivel(): BelongsTo
    {
        return $this->belongsTo(Consumivel::class, 'consumivel_id');
    }
}
