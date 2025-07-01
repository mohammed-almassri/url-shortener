<?php

Schedule::call(function () {
    Artisan::call('app:sync-clicks');
})->everyMinute()
    ->name('sync.clicks')
    ->onOneServer()
    ->withoutOverlapping();
