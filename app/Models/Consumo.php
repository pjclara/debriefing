<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Consumo extends Model
{
    protected $fillable = [
        'surgery_id',
        'consumivel_id',
        'designacao',
        'referencia',
        'quantidade',
        'unidade',
        'observacoes',
    ];

    protected $casts = [
        'quantidade' => 'float',
    ];

    public function surgery(): BelongsTo
    {
        return $this->belongsTo(Surgery::class);
    }

    public function consumivel(): BelongsTo
    {
        return $this->belongsTo(Consumivel::class);
    }
}
