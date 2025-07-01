<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SUrl\CreateSUrl;
use App\Http\Resources\SUrl\SUrlResource;

class SUrlController extends Controller
{
    public function store(CreateSUrl $request)
    {
        $sUrl = \App\Models\SUrl::create($request->validated());
        return new SUrlResource($sUrl);
    }
}
