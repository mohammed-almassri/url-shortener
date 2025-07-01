<?php
namespace App\Http\Resources\SUrl;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SUrlResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'original_url' => $this->original_url,
            'short_code'   => $this->short_code,
        ];
    }
}
