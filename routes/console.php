<?php

Schedule::call(function () {
    Artisan::call('app:sync-clicks');
})->everyMinute()
    ->name('sync.clicks')
    ->onOneServer()
    ->withoutOverlapping();

Schedule::call(function () {
    Artisan::call('app:handle-top-urls-cache');
})->everyMinute()
    ->name('top-urls-cache')
    ->onOneServer()
    ->withoutOverlapping();
