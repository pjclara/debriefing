<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DebriefingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'complicacoes'            => ['boolean'],
            'descricao_complicacoes'  => ['nullable', 'string'],

            'falha_sistema'           => ['boolean'],
            'descricao_falha_sistema' => ['nullable', 'string'],
            'falha_solucionada'       => ['boolean'],
            'falha_reportada'         => ['boolean'],
            'falha_reportada_a_quem'  => ['nullable', 'string', 'max:255'],

            'inicio_a_horas'          => ['boolean'],
            'descricao_inicio'        => ['nullable', 'string'],
            'fim_a_horas'             => ['boolean'],
            'descricao_fim'           => ['nullable', 'string'],

            'correu_bem'              => ['nullable', 'string'],
            'melhorar'                => ['nullable', 'string'],
            'falha_comunicacao'       => ['nullable', 'string'],

            'evento_adverso'          => ['boolean'],
            'descricao_evento'        => ['nullable', 'string'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $booleans = [
            'complicacoes', 'falha_sistema', 'falha_solucionada', 'falha_reportada',
            'inicio_a_horas', 'fim_a_horas', 'evento_adverso',
        ];

        $this->merge(array_map(
            fn ($v) => filter_var($v, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? false,
            array_intersect_key($this->all(), array_flip($booleans))
        ));
    }
}
