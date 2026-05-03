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

        if ($isUpdate) {
            return [
                'quantidade'  => ['sometimes', 'integer', 'min:1'],
                'observacoes' => ['nullable', 'string'],
            ];
        }

        return [
            // Selector directo (instrumentos com vidas)
            'stock_movimento_id' => ['nullable', 'integer', 'exists:stock_movimentos,id'],
            // Selector agrupado (material de uso único)
            'consumivel_tipo_id' => ['nullable', 'integer', 'exists:consumivel_tipos,id'],
            'referencia'         => ['nullable', 'string', 'max:255'],
            'quantidade'         => ['sometimes', 'integer', 'min:1'],
            'observacoes'        => ['nullable', 'string'],
        ];
    }
}
