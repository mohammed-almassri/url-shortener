<?php
namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\SUrl;
use Illuminate\Support\Facades\Redis;
use Stevebauman\Location\Facades\Location;

class SUrlController extends Controller
{
    public function show(string $shortCode)
    {
        $surl = SUrl::where('short_code', $shortCode)->firstOrFail();

        $q       = Location::get(request()->ip());
        $country = $q->countryName ?? null;
        $region  = $q->regionName ?? null;

        Redis::connection('clicks')->rpush('click_logs', json_encode([
            's_url_id'   => $surl->id,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'referrer'   => request()->headers->get('referer'),
            'country'    => $country,
            'region'     => $region,
            'created_at' => now()->toDateTimeString(),
        ]));

        return redirect()->away($surl->original_url);
    }
}
