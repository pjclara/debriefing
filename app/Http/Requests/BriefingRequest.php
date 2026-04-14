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

        $processed = [];
        foreach ($booleans as $field) {
            if ($this->has($field)) {
                // Converter valor para boolean de forma segura
                $value = $this->input($field);
                // Aceita true/false boolean, strings "true"/"false"/"1"/"0", ou 1/0
                if (is_bool($value)) {
                    $processed[$field] = $value;
                } else {
                    $processed[$field] = filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? false;
                }
            }
        }
        
        if (!empty($processed)) {
            $this->merge($processed);
        }
    }
}
