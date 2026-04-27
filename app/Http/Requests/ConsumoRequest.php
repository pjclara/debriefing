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
        $isUpdate = $this->isMethod('PUT') || $this->isMethod('PATCH');

        return [
            'stock_movimento_id' => $isUpdate ? ['sometimes', 'integer', 'exists:stock_movimentos,id'] : ['required', 'integer', 'exists:stock_movimentos,id'],
            'quantidade'         => ['sometimes', 'integer', 'min:1'],
            'observacoes'        => ['nullable', 'string'],
        ];
    }
}
