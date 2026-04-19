<?php

use App\Http\Controllers\BriefingController;
use App\Http\Controllers\ConsumivelTipoController;
use App\Http\Controllers\ConsumoController;
use App\Http\Controllers\DebriefingController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\ProcedureController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\StockMovimentoController;
use App\Http\Controllers\SurgeryController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Settings\DarkModeController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::inertia('/guide', 'guide')->name('guide');

Route::middleware(['auth'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // ── Dark Mode ───────────────────────────────────────────────────────────
    Route::post('api/user/dark-mode', [DarkModeController::class, 'update'])
        ->name('user.dark-mode.update');

    // ── Briefings (sem destroy — apenas admin pode eliminar) ────────────────
    Route::resource('briefings', BriefingController::class)->except(['destroy']);
    Route::get('briefings/{briefing}/print', [BriefingController::class, 'print'])
        ->name('briefings.print');

    // ── Cirurgias aninhadas (sem destroy) ───────────────────────────────────
    Route::resource('briefings.surgeries', SurgeryController::class)
        ->shallow()
        ->except(['index', 'show', 'destroy']);

    // ── Consumos por cirurgia ───────────────────────────────────────────────
    Route::get('consumos/historico', [ConsumoController::class, 'historico'])
        ->name('consumos.historico');
    Route::get('surgeries/{surgery}/consumos', [ConsumoController::class, 'index'])
        ->name('surgeries.consumos.index');
    Route::post('surgeries/{surgery}/consumos', [ConsumoController::class, 'store'])
        ->name('surgeries.consumos.store');
    Route::post('surgeries/{surgery}/consumos/batch', [ConsumoController::class, 'storeBatch'])
        ->name('surgeries.consumos.storeBatch');
    Route::put('surgeries/{surgery}/consumos/{consumo}', [ConsumoController::class, 'update'])
        ->name('surgeries.consumos.update');
    Route::delete('surgeries/{surgery}/consumos/{consumo}', [ConsumoController::class, 'destroy'])
        ->name('surgeries.consumos.destroy');

    // ── Debriefing ──────────────────────────────────────────────────────────
    Route::get('briefings/{briefing}/debriefing/create', [DebriefingController::class, 'create'])
        ->name('briefings.debriefing.create');
    Route::post('briefings/{briefing}/debriefing', [DebriefingController::class, 'store'])
        ->name('briefings.debriefing.store');
    Route::get('briefings/{briefing}/debriefing/edit', [DebriefingController::class, 'edit'])
        ->name('briefings.debriefing.edit');
    Route::put('briefings/{briefing}/debriefing', [DebriefingController::class, 'update'])
        ->name('briefings.debriefing.update');

    // ── Rotas exclusivas de admin ───────────────────────────────────────────
    Route::middleware('admin')->group(function () {
        // Eliminar briefing e cirurgia
        Route::delete('briefings/{briefing}', [BriefingController::class, 'destroy'])
            ->name('briefings.destroy');
        Route::delete('surgeries/{surgery}', [SurgeryController::class, 'destroy'])
            ->name('surgeries.destroy');

        // Movimentos de stock
        Route::resource('stock_movimentos', StockMovimentoController::class)->except(['show']);

        // Tipos de consumível
        Route::resource('consumivel_tipos', ConsumivelTipoController::class)->except(['show']);

        // Departamentos
        Route::resource('departments', DepartmentController::class)->except(['destroy', 'show']);

        // Serviços
        Route::resource('services', ServiceController::class);

        // Procedimentos
        Route::resource('procedures', ProcedureController::class)->except(['show']);

        // Utilizadores
        Route::resource('users', UserController::class)->except(['show']);
    });
});

require __DIR__.'/settings.php';
