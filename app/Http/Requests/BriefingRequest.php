<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BriefingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'data'                        => ['required', 'date'],
            'hora'                        => ['required', 'date_format:H:i'],
            'especialidade'               => ['required', 'string', 'max:255'],
            'sala'                        => ['required', 'string', 'max:255'],

            'equipa_segura'               => ['boolean'],
            'alteracao_equipa'            => ['boolean'],
            'descricao_alteracao_equipa'  => ['nullable', 'string'],

            'problemas_sala'              => ['boolean'],
            'descricao_problemas'         => ['nullable', 'string'],

            'equipamento_ok'              => ['boolean'],
            'descricao_equipamento'       => ['nullable', 'string'],

            'mesa_emparelhada'            => ['boolean'],

            'ordem_mantida'               => ['boolean'],
            'descricao_ordem'             => ['nullable', 'string'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $booleans = [
            'equipa_segura', 'alteracao_equipa', 'problemas_sala',
            'equipamento_ok', 'mesa_emparelhada', 'ordem_mantida',
        ];

        $this->merge(array_map(
            fn ($v) => filter_var($v, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? false,
            array_intersect_key($this->all(), array_flip($booleans))
        ));
    }
}
