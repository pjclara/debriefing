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
            'consumivel_id'   => ['required', 'integer', 'exists:consumiveis,id'],
            'tipo_mov'        => ['required', 'in:entrada,saida,ajuste,encomenda,devolucao'],
            'referencia'      => ['nullable', 'string', 'max:100'],
            'codigo'          => ['nullable', 'string', 'max:100'],
            'vidas_inicial'   => ['nullable', 'integer', 'min:1'],
            'vidas_atual'     => ['nullable', 'integer', 'min:0'],
            'data_entrada'    => ['required', 'date'],
            'data_saida'      => ['nullable', 'date', 'after_or_equal:data_entrada'],
            'motivo'          => ['nullable', 'string', 'max:255'],
            'observacoes'     => ['nullable', 'string'],
        ];
    }
}
