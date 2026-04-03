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
            'tipo'           => ['required', 'in:entrada,saida,ajuste,encomenda,devolucao'],
            'quantidade'     => ['required', 'numeric', 'min:0.01'],
            'data_movimento' => ['required', 'date'],
            'referencia_doc' => ['nullable', 'string', 'max:255'],
            'fornecedor'     => ['nullable', 'string', 'max:255'],
            'observacoes'    => ['nullable', 'string'],
        ];
    }
}
