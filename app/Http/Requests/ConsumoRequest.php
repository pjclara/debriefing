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
            'designacao'    => ['required', 'string', 'max:255'],
            'referencia'    => ['nullable', 'string', 'max:255'],
            'quantidade'    => ['required', 'numeric', 'min:0.01'],
            'unidade'       => ['required', 'string', 'max:50'],
            'observacoes'   => ['nullable', 'string'],
        ];
    }
}
