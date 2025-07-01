<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Click extends Model
{
    protected $fillable = [
        's_url_id',
        'ip_address',
        'user_agent',
        'referrer',
        'country',
        'created_at',
    ];

    public function sUrl()
    {
        return $this->belongsTo(SUrl::class);
    }
}
