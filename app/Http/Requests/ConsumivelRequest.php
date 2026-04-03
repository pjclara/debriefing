<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ConsumivelRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'designacao' => ['required', 'string', 'max:255'],
            'categoria'  => ['required', 'in:robotico_vidas,robotico_descartavel,extra'],
            'unidade'    => ['required', 'string', 'max:50'],
            'ativo'      => ['boolean'],
        ];
    }
}
