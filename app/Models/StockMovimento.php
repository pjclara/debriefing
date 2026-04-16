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
        'vidas_inicial',
        'vidas_atual',
        'unidades_inicial',
        'unidades_atual',
        'data_entrada',
        'data_saida',
        'motivo',
        'observacoes',
    ];

    protected $casts = [
        'data_entrada'  => 'date',
        'data_saida'    => 'date',
        'vidas_inicial'    => 'integer',
        'vidas_atual'     => 'integer',
        'unidades_inicial' => 'integer',
        'unidades_atual'   => 'integer',
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

    public function consumivelTipo(): BelongsTo
    {
        return $this->belongsTo(ConsumivelTipo::class, 'consumivel_tipo_id');
    }

    /**
     * Indica se este movimento usa vidas (categoria robotico_vidas)
     * em vez de número de unidades.
     */
    public function usaVidas(): bool
    {
        return ($this->consumivelTipo->categoria ?? null) === ConsumivelTipo::CAT_ROBOTICO_VIDAS;
    }

    /**
     * Quantidade relevante: vidas_atual para robóticos com vidas,
     * unidades para os restantes.
     */
    public function getQuantidadeAttribute(): ?int
    {
        return $this->usaVidas() ? $this->vidas_atual : $this->unidades_atual;
    }
}
