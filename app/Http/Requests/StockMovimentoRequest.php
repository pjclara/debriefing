<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StockMovimentoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'consumivel_tipo_id' => ['required', 'integer', 'exists:consumivel_tipos,id'],
            'tipo_mov'        => ['required', 'in:entrada,saida,ajuste,encomenda,devolucao'],
            'referencia'      => ['nullable', 'string', 'max:100'],
            'codigo'          => ['nullable', 'string', 'max:100'],
            'vidas_inicial'    => ['nullable', 'integer', 'min:1'],
            'vidas_atual'      => ['nullable', 'integer', 'min:0'],
            'unidades_inicial' => ['nullable', 'integer', 'min:0'],
            'unidades_atual'   => ['nullable', 'integer', 'min:0'],
            'data_entrada'    => ['required', 'date'],
            'data_saida'      => ['nullable', 'date', 'after_or_equal:data_entrada'],
            'motivo'          => ['nullable', 'in:consumo,dano,outro'],
            'observacoes'     => ['nullable', 'string'],
        ];
    }

    protected function prepareForValidation(): void
    {
        // Preencher campos com defaults quando não enviados pelo inline form
        if (!$this->has('tipo_mov')) {
            $this->merge(['tipo_mov' => 'entrada']);
        }
        if (!$this->has('data_entrada')) {
            $this->merge(['data_entrada' => now()->toDateString()]);
        }
    }
}
