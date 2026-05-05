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
            'destino'                => ['required', 'in:UCPA,Enfermaria,SMI,Outro'],

            'prep_inicio'            => ['nullable', 'date_format:Y-m-d H:i:s,Y-m-d H:i'],
            'prep_fim'               => ['nullable', 'date_format:Y-m-d H:i:s,Y-m-d H:i'],
            'docking'                => ['nullable', 'integer', 'min:0'],
            'consola_inicio'         => ['nullable', 'date_format:Y-m-d H:i:s,Y-m-d H:i'],
            'consola_fim'            => ['nullable', 'date_format:Y-m-d H:i:s,Y-m-d H:i'],

            'antecedentes_relevantes'  => ['required', 'boolean'],
            'descricao_antecedentes'   => ['nullable', 'string'],
            'comorbidades'             => ['required', 'boolean'],
            'descricao_comorbidades'   => ['nullable', 'string'],
            'variacoes_tecnicas'       => ['required', 'boolean'],
            'descricao_variacoes'      => ['nullable', 'string'],
            'passos_criticos'          => ['required', 'boolean'],
            'descricao_passos'         => ['nullable', 'string'],

            'consentimento'            => ['required', 'boolean'],
            'lateralidade'             => ['required', 'in:N/A,Sim'],
            'lateralidade_lado'        => ['nullable', 'in:Esquerdo,Direito,Bilateral'],
            'lateralidade_marcacao'    => ['nullable', 'boolean'],
            'medicacao_suspensa'       => ['nullable', 'in:Sim,Não,N/A'],
            'medicacao_qual'           => ['nullable', 'string', 'max:255'],
            'antibiotico'              => ['nullable', 'string', 'max:255'],
            'antibioterapia'           => ['nullable', 'boolean'],
            'profilaxia'               => ['nullable', 'boolean'],
            'profilaxia_tipo'          => ['nullable', 'string', 'max:255'],
            'perdas_estimadas'         => ['nullable', 'integer', 'min:0'],
            'reserva_ativa'            => ['nullable', 'boolean'],
            'reserva_estado'           => ['nullable', 'in:Tem,Necessita,N/A'],
            'reserva_unidades'         => ['nullable', 'integer', 'min:0'],

            'trocares'               => ['nullable', 'integer', 'min:0'],
            'trocares_roboticos'              => ['nullable', 'integer', 'min:0'],
            'trocares_roboticos_tamanhos'              => ['nullable', 'array'],
            'trocares_roboticos_tamanhos.*.n'          => ['required', 'integer', 'min:0'],
            'trocares_roboticos_tamanhos.*.tamanho'    => ['required', 'string', 'max:50'],
            'trocares_nao_roboticos'          => ['nullable', 'integer', 'min:0'],
            'trocares_nao_roboticos_tamanhos'          => ['nullable', 'array'],
            'trocares_nao_roboticos_tamanhos.*.n'      => ['required', 'integer', 'min:0'],
            'trocares_nao_roboticos_tamanhos.*.tamanho'=> ['required', 'string', 'max:50'],
            'otica'                  => ['required', 'in:0,30'],
            'posicionamento'         => ['nullable', 'in:Trendelenburg,Proclive,Jack-knife,Litotomia,Decúbito Lateral Direito,Decúbito Lateral Esquerdo'],
            'docking_lado'           => ['nullable', 'in:Direito,Esquerdo,Caudal'],
            'co2_parametros'         => ['nullable', 'numeric', 'min:0'],
            'monopolar_coag_watts'   => ['nullable', 'integer', 'min:0'],
            'monopolar_coag_tipo'    => ['nullable', 'in:precise,flugurate,spray,low'],
            'monopolar_cut_watts'    => ['nullable', 'integer', 'min:0'],
            'monopolar_cut_tipo'     => ['nullable', 'in:pure,blend'],
            'bipolar_coag_watts'     => ['nullable', 'integer', 'min:0'],
            'bipolar_coag_tipo'      => ['nullable', 'in:low_with_autostop,low,standard,macro'],
            'b1'                     => ['nullable', 'array'],
            'b1.*'                   => ['integer'],
            'b2'                     => ['nullable', 'array'],
            'b2.*'                   => ['integer'],
            'b3'                     => ['nullable', 'array'],
            'b3.*'                   => ['integer'],
            'b4'                     => ['nullable', 'array'],
            'b4.*'                   => ['integer'],
            'equipamento_extra'      => ['nullable', 'array'],
            'equipamento_extra.*'    => ['integer'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $booleans = [
            'antecedentes_relevantes', 'comorbidades', 'variacoes_tecnicas', 'passos_criticos',
            'consentimento', 'lateralidade_marcacao', 'antibioterapia', 'profilaxia', 'reserva_ativa',
        ];

        $this->merge(array_map(
            fn ($v) => filter_var($v, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE),
            array_intersect_key($this->all(), array_flip($booleans))
        ));

        // Converter campos numéricos vazios em null e strings vazias em null para watts/tipo
        $numericFields = [
            'docking', 'perdas_estimadas', 'reserva_unidades', 'trocares',
            'trocares_roboticos', 'trocares_nao_roboticos',
            'monopolar_coag_watts', 'monopolar_cut_watts', 'bipolar_coag_watts',
            'co2_parametros',
        ];

        $nullableFields = [
            'monopolar_coag_tipo', 'monopolar_cut_tipo', 'bipolar_coag_tipo',
        ];

        foreach ($numericFields as $field) {
            if ($this->has($field) && ($this->input($field) === '' || $this->input($field) === null)) {
                $this->merge([$field => null]);
            }
        }

        foreach ($nullableFields as $field) {
            if ($this->has($field) && $this->input($field) === '') {
                $this->merge([$field => null]);
            }
        }

        // Converter arrays vazios em null para B1-B4 e equipamento_extra
        foreach (['b1', 'b2', 'b3', 'b4', 'equipamento_extra'] as $field) {
            if ($this->has($field) && (empty($this->input($field)) || !is_array($this->input($field)))) {
                $this->merge([$field => []]);
            }
        }
    }
}

