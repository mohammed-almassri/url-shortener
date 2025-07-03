<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Redis;

class HandleTopUrlsCache extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:handle-top-urls-cache';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $script = <<<LUA
        local key = KEYS[1]
        local factor = tonumber(ARGV[1])
        local members = redis.call('zrange', key, 0, -1, 'withscores')

        for i = 1, #members, 2 do
            local member = members[i]
            local score = tonumber(members[i+1]) * factor
            redis.call('zadd', key, score, member)
        end
        return true
        LUA;

        Redis::connection('clicks')->eval($script, 1, 'top_urls', 0.95);

        // Step 2: Trim to keep only top 1000, get removed members first
        $removed = Redis::connection('clicks')->zrange('top_urls', 0, -1001);
        Redis::connection('clicks')->zremrangebyrank('top_urls', 0, -1001);

        // Step 3: Delete cached URL keys for removed members
        foreach ($removed as $shortCode) {
            Redis::connection('clicks')->del("url_cache:{$shortCode}");
        }

        $expired = Redis::connection('clicks')->zrangebyscore('top_urls', '-inf', 0.999);
        if (! empty($expired)) {
            Redis::connection('clicks')->zrem('top_urls', ...$expired);

            foreach ($expired as $shortCode) {
                Redis::connection('clicks')->del("url_cache:{$shortCode}");
            }
        }
    }
}
