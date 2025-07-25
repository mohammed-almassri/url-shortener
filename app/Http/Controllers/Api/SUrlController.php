<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SUrl\CreateSUrl;
use App\Http\Resources\SUrl\SUrlResource;
use App\Models\SUrl;

class SUrlController extends Controller
{

    public function index()
    {
        $urls = Surl::where('user_id', auth()->id())
            ->withCount('clicks')
            ->orderBy('created_at', 'desc')
            ->paginate(10);
        return SUrlResource::collection($urls);
    }

    public function store(CreateSUrl $request)
    {
        $data = $request->validated();
        if (\Auth::check()) {
            $data['user_id'] = $request->user()->id;
        } else {
            $cookie = $request->cookie('uuid') ?? null;
            if ($cookie) {
                $data['user_id'] = $cookie;
            }
        }

        if (! preg_match('/^https?:\/\//i', $data['original_url'])) {
            $data['original_url'] = 'http://' . $data['original_url'];
        }

        $sUrl = SUrl::create($data);
        return new SUrlResource($sUrl);
    }

    public function show(SUrl $surl)
    {
        return new SUrlResource($surl->loadCount('clicks'));
    }
}
