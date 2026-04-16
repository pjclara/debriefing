<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ConsumivelTipo extends Model
{
    protected $table = 'consumivel_tipos';

    // Valores possíveis de categoria
    public const CAT_ROBOTICO_VIDAS       = 'robotico_vidas';
    public const CAT_ROBOTICO_DESCARTAVEL = 'robotico_descartavel';
    public const CAT_EXTRA                = 'extra';

    protected $fillable = [
        'nome',
        'categoria',
        'ativo',
    ];

    protected $casts = [
        'ativo' => 'boolean',
    ];

    /**
     * Movimentos de stock deste tipo de consumível
     */
    public function movimentos(): HasMany
    {
        return $this->hasMany(StockMovimento::class, 'consumivel_tipo_id');
    }
}
