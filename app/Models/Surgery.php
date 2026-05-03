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

        'prep_inicio',
        'prep_fim',
        'docking',
        'consola_inicio',
        'consola_fim',

        'antecedentes_relevantes',
        'descricao_antecedentes',
        'comorbidades',
        'descricao_comorbidades',
        'variacoes_tecnicas',
        'descricao_variacoes',
        'passos_criticos',
        'descricao_passos',

        'consentimento',
        'lateralidade',
        'lateralidade_lado',
        'lateralidade_marcacao',
        'medicacao_suspensa',
        'medicacao_qual',
        'antibiotico',
        'antibioterapia',
        'profilaxia',
        'profilaxia_tipo',
        'perdas_estimadas',
        'reserva_ativa',
        'reserva_estado',
        'reserva_unidades',

        'trocares',
        'trocares_roboticos',
        'trocares_roboticos_tamanhos',
        'trocares_nao_roboticos',
        'trocares_nao_roboticos_tamanhos',
        'otica',
        'posicionamento',
        'docking_lado',
        'co2_parametros',
        'monopolar_coag_watts',
        'monopolar_coag_tipo',
        'monopolar_cut_watts',
        'monopolar_cut_tipo',
        'bipolar_coag_watts',
        'bipolar_coag_tipo',
        'b1',
        'b2',
        'b3',
        'b4',
        'equipamento_extra',
    ];

    protected $casts = [
        'prep_inicio'             => 'datetime',
        'prep_fim'                => 'datetime',
        'consola_inicio'          => 'datetime',
        'consola_fim'             => 'datetime',
        'b1'                      => 'array',
        'b2'                      => 'array',
        'b3'                      => 'array',
        'b4'                      => 'array',
        'equipamento_extra'       => 'array',
        'trocares_roboticos_tamanhos'    => 'array',
        'trocares_nao_roboticos_tamanhos' => 'array',
        'antecedentes_relevantes' => 'boolean',
        'comorbidades'            => 'boolean',
        'variacoes_tecnicas'      => 'boolean',
        'passos_criticos'         => 'boolean',
        'consentimento'           => 'boolean',
        'lateralidade_marcacao'   => 'boolean',
        'antibioterapia'          => 'boolean',
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