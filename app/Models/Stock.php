<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Stock extends Model
{
    protected $table = 'stock';

    public $timestamps = false;
    public $incrementing = false;
    protected $keyType = 'string';
    protected $primaryKey = 'stock_key';

    protected $casts = [
        'stock_movimento_id'    => 'integer',
        'consumivel_tipo_id'    => 'integer',
        'quantidade_disponivel' => 'integer',
        'quantidade_inicial'    => 'integer',
    ];

    public function consumivelTipo(): BelongsTo
    {
        return $this->belongsTo(ConsumivelTipo::class, 'consumivel_tipo_id');
    }
}
