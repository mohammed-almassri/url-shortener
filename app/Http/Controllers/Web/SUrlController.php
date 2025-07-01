<?php
namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\SUrl;

class SUrlController extends Controller
{
    public function show(string $shortCode)
    {
        $surl = SUrl::where('short_code', $shortCode)->firstOrFail();
        return redirect()->away($surl->original_url);
    }
}
