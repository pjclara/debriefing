<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LibraryDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'titulo' => 'required|string|max:255',
            'descricao' => 'nullable|string',
            'category' => 'required|in:instrucoes_trabalho,manuais,artigos_revisao,outros',
        ];

        if ($this->isMethod('post')) {
            $rules['file'] = 'required|file|mimes:pdf|max:20480';
        }

        return $rules;
    }
}
