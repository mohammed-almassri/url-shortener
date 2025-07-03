<?php
namespace App\Http\Controllers\Api;

use App\Helpers\Helpers;
use App\Http\Controllers\Controller;
use App\Models\SUrl;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ReportsController extends Controller
{
    public function countryReport(SUrl $surl)
    {
        if ($surl->user_id !== auth()->id()) {
            throw new NotFoundHttpException();
        }

        $data = $surl->countryReport();
        $data = $data->map(function ($item) {
            $item->code = Helpers::mapCountryToId($item->country);
            return $item;
        });

        return response()->json([
            'data'    => $data,
            'message' => 'Country report retrieved successfully.',
        ]);
    }
}
