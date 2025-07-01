<?php
namespace App\Console\Commands;

use App\Models\Click;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Redis;

class SyncClicks extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:sync-clicks';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync click logs from Redis to the database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        try {
            $redis     = Redis::connection('clicks');
            $batchSize = 100;

            \Log::info("Starting to process click logs...");

            while ($batch = $redis->lrange('click_logs', 0, $batchSize - 1)) {
                if (empty($batch)) {
                    \Log::info("No more click logs to process.");
                    break;
                }
                $clicks = array_map(fn($c) => json_decode($c, true), $batch);
                Click::insert($clicks);
                \Log::info("Inserted " . count($clicks) . " click(s) into the database.");

                $redis->ltrim('click_logs', count($batch), -1);

                \Log::info("Processed " . count($batch) . " click(s).");
            }

            \Log::info("Finished processing click logs.");
        } catch (\Exception $e) {
            \Log::error("Error processing click logs: " . $e->getMessage(), [
                'exception' => $e,
            ]);
        }
    }
}
