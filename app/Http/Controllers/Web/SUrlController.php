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
        $ip = request()->ip();
        if (app()->environment('production')) {
            $ip = request()->header('X-Forwarded-For') ?? $ip;
        }

        $q       = Location::get($ip);
        $country = $q->countryName ?? null;
        $region  = $q->regionName ?? null;

        // Try to get the original URL from cache
        $cache     = Redis::connection('clicks')->hmget("url_cache:{$shortCode}", ['original_url', 's_url_id']);
        $cachedUrl = $cache[0];
        $surlId    = $cache[1];
        // If not cached, fetch from DB and cache it
        if (! $cachedUrl) {
            $surl      = SUrl::where('short_code', $shortCode)->firstOrFail();
            $cachedUrl = $surl->original_url;
            $surlId    = $surl->id;
            Redis::connection('clicks')->hmset("url_cache:{$shortCode}", [
                'original_url' => $cachedUrl,
                's_url_id'     => $surlId,
            ]);
        }

        // Log the click and update the score regardless of cache hit
        Redis::connection('clicks')->rpush('click_logs', json_encode([
            's_url_id'   => $surlId,
            'ip_address' => $ip,
            'user_agent' => request()->userAgent(),
            'referrer'   => request()->headers->get('referer'),
            'country'    => $country,
            'region'     => $region,
            'created_at' => now()->toDateTimeString(),
        ]));

        Redis::connection('clicks')->zincrby('top_urls', 1, $shortCode);

        return redirect()->away($cachedUrl);
    }
}
