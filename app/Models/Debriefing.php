<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Debriefing extends Model
{
    protected $fillable = [
        'briefing_id',

        'complicacoes',
        'descricao_complicacoes',

        'falha_sistema',
        'descricao_falha_sistema',
        'falha_solucionada',
        'falha_reportada',
        'falha_reportada_a_quem',

        'inicio_a_horas',
        'descricao_inicio',
        'fim_a_horas',
        'descricao_fim',

        'correu_bem',
        'melhorar',
        'falha_comunicacao',

        'evento_adverso',
        'descricao_evento',
    ];

    protected $casts = [
        'complicacoes'      => 'boolean',
        'falha_sistema'     => 'boolean',
        'falha_solucionada' => 'boolean',
        'falha_reportada'   => 'boolean',
        'inicio_a_horas'    => 'boolean',
        'fim_a_horas'       => 'boolean',
        'evento_adverso'    => 'boolean',
    ];

    public function briefing(): BelongsTo
    {
        return $this->belongsTo(Briefing::class);
    }
}
