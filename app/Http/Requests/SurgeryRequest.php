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
            'lateralidade_lado'        => ['nullable', 'in:Esquerda,Direita,Bilateral'],
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
            'posicionamento'              => ['nullable', 'array'],
            'posicionamento.*.tipo'       => ['required', 'string', 'in:Trendelenburg,Proclive,Jack-knife,Litotomia,Decúbito Lateral Direito,Decúbito Lateral Esquerdo'],
            'posicionamento.*.graus'      => ['required', 'numeric'],
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

    public function messages(): array
    {
        return [
            // Identificação
            'processo.required'                => 'O número de processo é obrigatório.',
            'processo.max'                     => 'O número de processo não pode exceder 255 caracteres.',
            'procedimento.required'            => 'O procedimento cirúrgico é obrigatório.',
            'procedimento.max'                 => 'O procedimento não pode exceder 255 caracteres.',
            'destino.required'                 => 'O destino pós-operatório é obrigatório.',
            'destino.in'                       => 'O destino deve ser UCPA, Enfermaria, SMI ou Outro.',

            // Tempos
            'prep_inicio.date_format'          => 'A data de início de preparação tem formato inválido.',
            'prep_fim.date_format'             => 'A data de fim de preparação tem formato inválido.',
            'docking.integer'                  => 'O tempo de docking deve ser um número inteiro.',
            'docking.min'                      => 'O tempo de docking não pode ser negativo.',
            'consola_inicio.date_format'       => 'A data de início de consola tem formato inválido.',
            'consola_fim.date_format'          => 'A data de fim de consola tem formato inválido.',

            // Clínicos
            'antecedentes_relevantes.required' => 'Indique se existem antecedentes de relevo.',
            'antecedentes_relevantes.boolean'  => 'O campo de antecedentes deve ser Sim ou Não.',
            'comorbidades.required'            => 'Indique se existem comorbidades.',
            'comorbidades.boolean'             => 'O campo de comorbidades deve ser Sim ou Não.',
            'variacoes_tecnicas.required'      => 'Indique se existem variações técnicas.',
            'variacoes_tecnicas.boolean'       => 'O campo de variações técnicas deve ser Sim ou Não.',
            'passos_criticos.required'         => 'Indique se existem passos críticos.',
            'passos_criticos.boolean'          => 'O campo de passos críticos deve ser Sim ou Não.',

            // Planeamento
            'consentimento.required'           => 'Indique se os consentimentos foram obtidos.',
            'consentimento.boolean'            => 'O campo de consentimento deve ser Sim ou Não.',
            'lateralidade.required'            => 'Indique a lateralidade da cirurgia.',
            'lateralidade.in'                  => 'A lateralidade deve ser N/A ou Sim.',
            'lateralidade_lado.in'             => 'O lado da lateralidade deve ser Esquerda, Direita ou Bilateral.',
            'medicacao_suspensa.in'            => 'A medicação suspensa deve ser Sim, Não ou N/A.',
            'antibioterapia.boolean'           => 'O campo de antibioterapia deve ser Sim ou Não.',
            'profilaxia.boolean'               => 'O campo de profilaxia deve ser Sim ou Não.',
            'perdas_estimadas.integer'         => 'As perdas estimadas devem ser um número inteiro.',
            'perdas_estimadas.min'             => 'As perdas estimadas não podem ser negativas.',
            'reserva_estado.in'                => 'O estado da reserva deve ser Tem, Necessita ou N/A.',
            'reserva_unidades.integer'         => 'As unidades de reserva devem ser um número inteiro.',
            'reserva_unidades.min'             => 'As unidades de reserva não podem ser negativas.',

            // Configuração cirúrgica
            'posicionamento.array'                 => 'O campo de posicionamento deve ser uma lista.',
            'posicionamento.*.tipo.required'       => 'Selecione o tipo de posicionamento.',
            'posicionamento.*.tipo.in'             => 'O tipo de posicionamento selecionado é inválido.',
            'posicionamento.*.graus.numeric'       => 'Os graus de inclinação devem ser um número.',
            'docking_lado.in'                      => 'O lado de docking deve ser Direito, Esquerdo ou Caudal.',
            'co2_parametros.numeric'               => 'Os parâmetros de CO₂ devem ser um número.',
            'co2_parametros.min'                   => 'Os parâmetros de CO₂ não podem ser negativos.',

            // Elementos robóticos
            'trocares.integer'                         => 'O número de trócares deve ser um inteiro.',
            'trocares.min'                             => 'O número de trócares não pode ser negativo.',
            'trocares_roboticos.integer'               => 'O número de trócares robóticos deve ser um inteiro.',
            'trocares_roboticos_tamanhos.*.n.required' => 'Indique o número do trócar robótico.',
            'trocares_roboticos_tamanhos.*.n.integer'  => 'O número do trócar robótico deve ser um inteiro.',
            'trocares_roboticos_tamanhos.*.tamanho.required' => 'Indique o tamanho do trócar robótico.',
            'trocares_nao_roboticos.integer'           => 'O número de trócares não robóticos deve ser um inteiro.',
            'trocares_nao_roboticos_tamanhos.*.n.required'      => 'Indique o número do trócar não robótico.',
            'trocares_nao_roboticos_tamanhos.*.tamanho.required' => 'Indique o tamanho do trócar não robótico.',
            'otica.required'                           => 'O campo de ótica é obrigatório.',
            'otica.in'                                 => 'A ótica deve ser 0° ou 30°.',
            'monopolar_coag_watts.integer'             => 'A potência monopolar coag deve ser um inteiro.',
            'monopolar_coag_watts.min'                 => 'A potência monopolar coag não pode ser negativa.',
            'monopolar_coag_tipo.in'                   => 'O tipo monopolar coag é inválido.',
            'monopolar_cut_watts.integer'              => 'A potência monopolar cut deve ser um inteiro.',
            'monopolar_cut_watts.min'                  => 'A potência monopolar cut não pode ser negativa.',
            'monopolar_cut_tipo.in'                    => 'O tipo monopolar cut é inválido.',
            'bipolar_coag_watts.integer'               => 'A potência bipolar coag deve ser um inteiro.',
            'bipolar_coag_watts.min'                   => 'A potência bipolar coag não pode ser negativa.',
            'bipolar_coag_tipo.in'                     => 'O tipo bipolar coag é inválido.',
            'b1.*.integer'                             => 'Os instrumentos do braço B1 são inválidos.',
            'b2.*.integer'                             => 'Os instrumentos do braço B2 são inválidos.',
            'b3.*.integer'                             => 'Os instrumentos do braço B3 são inválidos.',
            'b4.*.integer'                             => 'Os instrumentos do braço B4 são inválidos.',
            'equipamento_extra.*.integer'              => 'Os itens de equipamento extra são inválidos.',
        ];
    }
}

