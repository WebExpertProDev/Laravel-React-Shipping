<?php

namespace App\Http\Controllers\APi\Tracking;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Dingo\Api\Routing\Helpers;
use App\Models\Postnord;
use App\Models\Bring;

/**
 *  Class Service Controller.
 * 
 *  @author Handsomedev19
 */
class TrackingController extends Controller
{
    use Helpers;

    protected $postnord;
    protected $bring;

    /**
     * 
     */

    public function __construct() {
        $this->postnord = new Postnord();
        $this->bring = new Bring();
    }

    public function test(){
        return $this->response->array([
            'status' => 'ok',
            'timestamp' => \Carbon\Carbon::now(),
            'host' => request()->ip(),
        ]);
    }

    public function index(Request $request) {
        // Get all input values from HTTP request.
        $input = $request->input();

        $result_empty = array();
        $result_empty['TrackingInformationResponse'] = array();
        $result_empty['TrackingInformationResponse']['shipments'] = array();

        // Get tracking info from Postnord.
        $result_postnord = $this->postnord->trackingShipment($input);
        if (count($result_postnord['TrackingInformationResponse']['shipments']) > 0){
            return response($result_postnord);
        }

        // Get tracking info from Bring.
        $result_bring = $this->bring->trackingShipment($input);
        if (count($result_bring['TrackingInformationResponse']['shipments']) > 0){
            return response($result_bring);
        }

        return response($result_empty);
    }
}
