<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ConsumoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'consumivel_id'       => ['nullable', 'integer', 'exists:consumiveis,id'],
            'stock_movimento_id'  => ['required', 'integer', 'exists:stock_movimentos,id'],
            'designacao'          => ['nullable', 'string', 'max:255'],
            'referencia'          => ['nullable', 'string', 'max:255'],
            'quantidade'          => ['nullable', 'numeric', 'min:0'],
            'unidade'             => ['nullable', 'string', 'max:50'],
            'observacoes'         => ['nullable', 'string'],
        ];
    }
}
