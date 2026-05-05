<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Briefing extends Model
{
    protected $fillable = [
        'data',
        'hora',
        'especialidade',
        'sala',

        'equipa_segura',
        'alteracao_equipa',
        'descricao_alteracao_equipa',

        'problemas_sala',
        'descricao_problemas',

        'equipamento_ok',
        'descricao_equipamento',

        'mesa_emparelhada',

        'ordem_mantida',
        'descricao_ordem',
    ];

    protected $casts = [
        'data'             => 'date:Y-m-d',
        'equipa_segura'    => 'boolean',
        'alteracao_equipa' => 'boolean',
        'problemas_sala'   => 'boolean',
        'equipamento_ok'   => 'boolean',
        'mesa_emparelhada' => 'boolean',
        'ordem_mantida'    => 'boolean',
    ];

    public function surgeries(): HasMany
    {
        return $this->hasMany(Surgery::class);
    }

    public function debriefing(): HasOne
    {
        return $this->hasOne(Debriefing::class);
    }

    /**
     * Indica se o briefing tem todos os campos de checklist preenchidos
     * e pelo menos uma cirurgia associada.
     */
    public function getIsCompletoAttribute(): bool
    {
        // Pelo menos uma cirurgia associada
        if ($this->surgeries_count < 1) {
            return false;
        }

        // Debriefing existente
        if ($this->debriefing === null) {
            return false;
        }

        return true;
    }
}
