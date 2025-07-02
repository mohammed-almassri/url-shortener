<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SUrl extends Model
{
    protected $fillable = ['original_url', 'short_code', 'user_id'];

    /**
     * Generate a unique short code for the URL.
     *
     * @return string
     */
    public static function generateShortCode(): string
    {
        return substr(md5(uniqid(rand(), true)), 0, 6);
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->short_code = self::generateShortCode();
        });
    }

    public function clicks()
    {
        return $this->hasMany(Click::class);
    }
}
