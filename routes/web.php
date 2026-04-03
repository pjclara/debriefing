<?php

use App\Http\Controllers\BriefingController;
use App\Http\Controllers\ConsumivelController;
use App\Http\Controllers\ConsumoController;
use App\Http\Controllers\DebriefingController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\SurgeryController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::resource('briefings', BriefingController::class);

// Catálogo de consumíveis
Route::resource('consumiveis', ConsumivelController::class)->except(['show']);

// Stock por consumível
Route::get('consumiveis/{consumivel}/stock', [StockController::class, 'index'])
    ->name('consumiveis.stock.index');
Route::post('consumiveis/{consumivel}/stock', [StockController::class, 'store'])
    ->name('consumiveis.stock.store');
Route::delete('consumiveis/{consumivel}/stock/{movimento}', [StockController::class, 'destroy'])
    ->name('consumiveis.stock.destroy');

// Cirurgias aninhadas (shallow)
Route::resource('briefings.surgeries', SurgeryController::class)
    ->shallow()
    ->except(['index', 'show']);

// Consumos — listagem global
Route::get('consumos', [ConsumoController::class, 'indexAll'])
    ->name('consumos.index');

// Consumos por cirurgia
Route::get('surgeries/{surgery}/consumos', [ConsumoController::class, 'index'])
    ->name('surgeries.consumos.index');
Route::post('surgeries/{surgery}/consumos', [ConsumoController::class, 'store'])
    ->name('surgeries.consumos.store');
Route::put('surgeries/{surgery}/consumos/{consumo}', [ConsumoController::class, 'update'])
    ->name('surgeries.consumos.update');
Route::delete('surgeries/{surgery}/consumos/{consumo}', [ConsumoController::class, 'destroy'])
    ->name('surgeries.consumos.destroy');

// Debriefing: 1 por sessão – create/store e edit/update sob briefing
Route::get('briefings/{briefing}/debriefing/create', [DebriefingController::class, 'create'])
    ->name('briefings.debriefing.create');
Route::post('briefings/{briefing}/debriefing', [DebriefingController::class, 'store'])
    ->name('briefings.debriefing.store');
Route::get('briefings/{briefing}/debriefing/edit', [DebriefingController::class, 'edit'])
    ->name('briefings.debriefing.edit');
Route::put('briefings/{briefing}/debriefing', [DebriefingController::class, 'update'])
    ->name('briefings.debriefing.update');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::resource('users', UserController::class)->except(['show']);
});

require __DIR__.'/settings.php';
