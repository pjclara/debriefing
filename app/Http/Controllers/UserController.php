<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        $users = User::orderBy('name')->get(['id', 'name', 'email', 'role', 'created_at', 'email_verified_at']);

        return Inertia::render('users/index', [
            'users' => $users,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('users/form');
    }

    public function store(UserRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['password'] = Hash::make($data['password']);
        unset($data['password_confirmation']);

        User::create($data);

        return redirect()->route('users.index')
            ->with('success', 'Utilizador criado com sucesso.');
    }

    public function edit(User $user): Response
    {
        return Inertia::render('users/form', [
            'user' => $user->only('id', 'name', 'email', 'role'),
        ]);
    }

    public function update(UserRequest $request, User $user): RedirectResponse
    {
        $data = $request->validated();
        unset($data['password_confirmation']);

        if (empty($data['password'])) {
            unset($data['password']);
        } else {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);

        return redirect()->route('users.index')
            ->with('success', 'Utilizador actualizado com sucesso.');
    }

    public function destroy(User $user): RedirectResponse
    {
        if ($user->id === auth()->id()) {
            return redirect()->route('users.index')
                ->with('error', 'Não pode eliminar a sua própria conta.');
        }

        $user->delete();

        return redirect()->route('users.index')
            ->with('success', 'Utilizador eliminado.');
    }
}
