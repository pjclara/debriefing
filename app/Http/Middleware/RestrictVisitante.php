<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RestrictVisitante
{
    /**
     * Rotas acessíveis a um utilizador com o papel "visitante": apenas
     * páginas de estatísticas agregadas (sem dados identificativos de
     * doentes) e as suas próprias definições de conta.
     */
    private const ROTAS_PERMITIDAS = [
        'estatisticas',
        'user.dark-mode.update',
        'profile.edit',
        'profile.update',
        'profile.destroy',
        'user-password.edit',
        'user-password.update',
        'appearance.edit',
        'two-factor.show',
        'logout',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || $user->role !== 'visitante') {
            return $next($request);
        }

        $rota = $request->route()?->getName();

        // O login (Fortify) redireciona sempre para "dashboard" — em vez de
        // bloquear esse redireccionamento com um 403, envia o visitante
        // directamente para a página de estatísticas equivalente.
        if ($rota === 'dashboard') {
            return redirect()->route('estatisticas');
        }

        if (! in_array($rota, self::ROTAS_PERMITIDAS, true)) {
            abort(403, 'O seu perfil de visitante só tem acesso a dados estatísticos.');
        }

        return $next($request);
    }
}
