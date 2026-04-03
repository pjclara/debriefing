<?php

use App\Http\Controllers\BriefingController;
use App\Http\Controllers\DebriefingController;
use App\Http\Controllers\SurgeryController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::resource('briefings', BriefingController::class);

// Cirurgias aninhadas (shallow)
Route::resource('briefings.surgeries', SurgeryController::class)
    ->shallow()
    ->except(['index', 'show']);

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
});

require __DIR__.'/settings.php';
