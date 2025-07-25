<?php

use App\Http\Controllers\Api\ReportsController;
use App\Http\Controllers\Api\SUrlController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (! auth()->check() && ! request()->cookie('uuid')) {
        $uuid = (string) \Illuminate\Support\Str::uuid();
        cookie()->queue(cookie('uuid', $uuid, 60 * 24 * 365));
    }

    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::get('/urls/{id}', function () {
        return Inertia::render('surl/show', [
            'id' => request()->route('id'),
        ]);
    })->name('surl.show');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

Route::get('/api/surls', SUrlController::class . '@index')
    ->middleware('auth')
    ->name('api.surl.index');
Route::get('/api/surls/{surl}', SUrlController::class . '@show')
    ->middleware('auth')
    ->name('api.surl.show');
Route::post('/api/surls', SUrlController::class . '@store')
    ->name('api.surl.store');

Route::get('/api/reports/{surl}', ReportsController::class . '@countryReport')
    ->middleware('auth')
    ->name('api.surl.reports.country');

Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
})->name('health.check');

Route::get('/{shortCode}', action: \App\Http\Controllers\Web\SUrlController::class . '@show')
    ->name('surl.redirect');
