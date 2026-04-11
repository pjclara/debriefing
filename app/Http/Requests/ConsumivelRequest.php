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
            'referencia' => ['nullable', 'string', 'max:100', 'unique:consumiveis,referencia,' . ($this->consumivel->id ?? 'NULL')],
            'codigo'     => ['nullable', 'string', 'max:100', 'unique:consumiveis,codigo,' . ($this->consumivel->id ?? 'NULL')],
            'categoria'  => ['required', 'in:robotico_vidas,robotico_descartavel,extra'],
            'vidas'      => $this->input('categoria') === 'robotico_vidas' 
                ? ['required', 'integer', 'min:1'] 
                : ['nullable'],
            'ativo'      => ['boolean'],
        ];
    }
}
