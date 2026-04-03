<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Surgery extends Model
{
    protected $fillable = [
        'briefing_id',

        'processo',
        'procedimento',
        'destino',

        'antecedentes_relevantes',
        'descricao_antecedentes',

        'consentimento',
        'lateralidade',
        'medicacao_suspensa',
        'antibiotico',
        'profilaxia',
        'perdas_estimadas',
        'reserva_ativa',
        'reserva_unidades',

        'trocares',
        'otica',
        'monopolar_coag',
        'monopolar_cut',
        'bipolar_coag',
        'b1',
        'b2',
        'b3',
        'b4',
        'equipamento_extra',
    ];

    protected $casts = [
        'antecedentes_relevantes' => 'boolean',
        'consentimento'           => 'boolean',
        'medicacao_suspensa'      => 'boolean',
        'profilaxia'              => 'boolean',
        'reserva_ativa'           => 'boolean',
    ];

    public function briefing(): BelongsTo
    {
        return $this->belongsTo(Briefing::class);
    }

    public function consumos(): HasMany
    {
        return $this->hasMany(Consumo::class);
    }
}

