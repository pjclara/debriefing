<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Consumivel extends Model
{
    protected $table = 'consumiveis';

    protected $fillable = [
        'designacao',
        'referencia',
        'codigo',
        'categoria',
        'vidas',
        'tem_stock',
        'ativo',
        'stock_atual',
        'stock_minimo',
    ];

    protected $casts = [
        'ativo'        => 'boolean',
        'tem_stock'    => 'boolean',
        'stock_atual'  => 'float',
        'stock_minimo' => 'float',
        'vidas'        => 'integer',
    ];

    // Labels legíveis para as categorias
    public static array $categorias = [
        'robotico_vidas'        => 'Itens Robóticos com Vidas',
        'robotico_descartavel'  => 'Consumíveis Robóticos Descartáveis',
        'extra'                 => 'Extras',
    ];

    public function stockMovimentos(): HasMany
    {
        return $this->hasMany(StockMovimento::class, 'consumivel_id');
    }

    /** Recalcula e persiste o stock actual com base em movimentos e consumos cirúrgicos. */
    public function recalcularStock(): void
    {
        $total = 0.0;
        foreach ($this->stockMovimentos()->orderBy('id')->get() as $m) {
            if (in_array($m->tipo, StockMovimento::TIPOS_ENTRADA)) {
                $total += $m->quantidade;
            } elseif (in_array($m->tipo, StockMovimento::TIPOS_SAIDA)) {
                $total -= $m->quantidade;
            }
            // 'encomenda' não afecta stock
        }

        // Subtrair consumos cirúrgicos ligados a este consumível
        $consumos = \App\Models\Consumo::where('consumivel_id', $this->id)->sum('quantidade');
        $total -= (float) $consumos;

        $this->update(['stock_atual' => max(0, $total)]);
    }
}
