<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Consumo extends Model
{
    protected $fillable = [
        'surgery_id',
        'stock_movimento_id',
        'observacoes',
    ];

    protected $casts = [];

    public function surgery(): BelongsTo
    {
        return $this->belongsTo(Surgery::class);
    }

    public function stockMovimento(): BelongsTo
    {
        return $this->belongsTo(StockMovimento::class, 'stock_movimento_id');
    }
}
