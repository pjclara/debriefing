<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Consumo extends Model
{
    protected $fillable = [
        'surgery_id',
        'consumivel_id',
        'stock_movimento_id',
        'designacao',
        'referencia',
        'quantidade',
        'unidade',
        'observacoes',
    ];

    protected $casts = [
        'quantidade' => 'float',
    ];

    protected static function booted(): void
    {
        static::saved(function (Consumo $consumo) {
            // Recalcular stock do consumível quando um consumo é registado
            if ($consumo->consumivel) {
                $consumo->consumivel->recalcularStock();
            }
        });

        static::deleted(function (Consumo $consumo) {
            // Recalcular stock do consumível quando um consumo é eliminado
            if ($consumo->consumivel) {
                $consumo->consumivel->recalcularStock();
            }
        });
    }

    public function surgery(): BelongsTo
    {
        return $this->belongsTo(Surgery::class);
    }

    public function consumivel(): BelongsTo
    {
        return $this->belongsTo(Consumivel::class);
    }

    public function stockMovimento(): BelongsTo
    {
        return $this->belongsTo(StockMovimento::class, 'stock_movimento_id');
    }
}
