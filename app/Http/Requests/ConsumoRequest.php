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
            'stock_movimento_id' => ['required', 'integer', 'exists:stock_movimentos,id'],
            'quantidade'         => ['sometimes', 'integer', 'min:1'],
            'observacoes'        => ['nullable', 'string'],
        ];
    }
}
