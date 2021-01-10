<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MongoTest;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
/*
Route::get('/mongo', [MongoTest::class, 'mongoConnect']);
Route::get('/', function () {
    return view('welcome');
});
*/


// Named route required for SendsPasswordResetEmails.
Route::get('reset-password', function() {
    return view('index');
})->name('password.reset');

// Catches all other web routes.
Route::get('{slug}', function () {
    return view('index');
})->where('slug', '^(?!api).*$');