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
            'data'                        => ['required', 'date','before_or_equal:today'],
            'hora'                        => ['required', 'date_format:H:i'],
            'especialidade'               => ['required', 'string', 'max:255'],
            'sala'                        => ['required', 'string', 'max:2'],

            'equipa_segura'               => ['required', 'boolean'],
            'alteracao_equipa'            => ['required', 'boolean'],
            'descricao_alteracao_equipa'  => ['nullable', 'string'],

            'problemas_sala'              => ['required', 'boolean'],
            'descricao_problemas'         => ['nullable', 'string'],

            'equipamento_ok'              => ['required', 'boolean'],
            'descricao_equipamento'       => ['nullable', 'string'],

            'mesa_emparelhada'            => ['required', 'boolean'],

            'ordem_mantida'               => ['required', 'boolean'],
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
                    $processed[$field] = filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
                }
            }
        }
        
        if (!empty($processed)) {
            $this->merge($processed);
        }
    }

    public function messages(): array
    {
        return [
            'data.required'         => 'A data é obrigatória.',
            'data.before_or_equal'  => 'A data não pode ser superior à data atual.',
            'data.date'             => 'A data deve ser um formato de data válido.',
            'hora.required'         => 'A hora é obrigatória.',
            'hora.date_format'     => 'A hora deve estar no formato HH:MM.',
            'especialidade.required' => 'A especialidade é obrigatória.',
            'especialidade.string'   => 'A especialidade deve ser uma string.',
            'especialidade.max'      => 'A especialidade não pode exceder 255 caracteres.',
            'sala.required'         => 'A sala é obrigatória.',
            'sala.string'           => 'A sala deve ser uma string.',
            'sala.max'              => 'A sala não pode exceder 2 caracteres.',

            // Mensagens para os campos booleanos
            '*.boolean'             => 'O campo :attribute deve ser verdadeiro ou falso.',
        ];
    }
}
