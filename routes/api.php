<?php

use App\Http\Controllers\Api\SUrlController;
use Illuminate\Support\Facades\Route;

Route::post('/surls', SUrlController::class . '@store')
    ->name('surl.store');
