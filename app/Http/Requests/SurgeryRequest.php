<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SurgeryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'processo'               => ['required', 'string', 'max:255'],
            'procedimento'           => ['required', 'string', 'max:255'],
            'destino'                => ['required', 'string', 'max:255'],

            'antecedentes_relevantes' => ['boolean'],
            'descricao_antecedentes'  => ['nullable', 'string'],

            'consentimento'          => ['boolean'],
            'lateralidade'           => ['required', 'in:N/A,Direito,Esquerdo'],
            'medicacao_suspensa'     => ['boolean'],
            'antibiotico'            => ['nullable', 'string', 'max:255'],
            'profilaxia'             => ['boolean'],
            'perdas_estimadas'       => ['nullable', 'integer', 'min:0'],
            'reserva_ativa'          => ['boolean'],
            'reserva_unidades'       => ['nullable', 'integer', 'min:0'],

            'trocares'               => ['nullable', 'integer', 'min:0'],
            'otica'                  => ['required', 'in:0,30'],
            'monopolar_coag'         => ['nullable', 'string', 'max:255'],
            'monopolar_cut'          => ['nullable', 'string', 'max:255'],
            'bipolar_coag'           => ['nullable', 'string', 'max:255'],
            'b1'                     => ['nullable', 'string', 'max:255'],
            'b2'                     => ['nullable', 'string', 'max:255'],
            'b3'                     => ['nullable', 'string', 'max:255'],
            'b4'                     => ['nullable', 'string', 'max:255'],
            'equipamento_extra'      => ['nullable', 'string'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $booleans = [
            'antecedentes_relevantes', 'consentimento', 'medicacao_suspensa', 'profilaxia', 'reserva_ativa',
        ];

        $this->merge(array_map(
            fn ($v) => filter_var($v, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? false,
            array_intersect_key($this->all(), array_flip($booleans))
        ));
    }
}

