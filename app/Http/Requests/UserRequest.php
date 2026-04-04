<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class UserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->route('user')?->id;
        $isUpdate = $this->isMethod('PUT') || $this->isMethod('PATCH');

        return [
            'name'                  => ['required', 'string', 'max:255'],
            'email'                 => ['required', 'email', 'max:255', "unique:users,email,{$userId}"],
            'role'                  => ['required', 'in:admin,user'],
            'password'              => $isUpdate
                ? ['nullable', 'string', Password::defaults(), 'confirmed']
                : ['required', 'string', Password::defaults(), 'confirmed'],
            'password_confirmation' => ['sometimes'],
        ];
    }

    public function attributes(): array
    {
        return [
            'name'     => 'nome',
            'email'    => 'email',
            'password' => 'palavra-passe',
        ];
    }
}
