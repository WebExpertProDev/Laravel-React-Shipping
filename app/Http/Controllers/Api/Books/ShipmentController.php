<?php

namespace App\Http\Controllers\Api\Books;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Dingo\Api\Routing\Helpers;
use App\Models\Postnord;
use App\Models\Bring;
use Illuminate\Support\Facades\Config;
use App\Models\DSV;
use App\Models\DHL;

/**
 *  Class Shipment Controller.
 * 
 *  @author Handsomedev19
 */
class ShipmentController extends Controller
{
    use Helpers;

    //

    protected $postnord;
    protected $bring;
    protected $dsv;
    protected $dhl;

    public function __construct() {
        $this->postnord = new Postnord();
        $this->bring = new Bring();
        $this->dsv = new DSV();
        $this->dhl = new DHL();
    }

    public function test(){
        return $this->response->array([
            'status' => 'ok',
            'timestamp' => \Carbon\Carbon::now(),
            'host' => request()->ip(),
        ]);
    }

    public function store(Request $request){
        $input = $request->input();
        $serviceCompany = $input['serviceCompany'];
        $result = array();
        if ($serviceCompany == Config::get('constants.POSTNORD')){
            // Store shipment book to Postnord.
            $result = $this->postnord->storeShipmentBook($input);
        } else if ($serviceCompany == Config::get('constants.BRING')){
            // Store shipment book to Bring.
            $result = $this->bring->storeShipmentBook($input);
        } else if ($serviceCompany == Config::get('constants.DSV')){
            // Store shipment book to Bring.
            $result = $this->dsv->storeShipmentBook($input);
        } else if ($serviceCompany == Config::get('constants.DHL')){
            // Store shipment book to Bring.
            $result = $this->dhl->storeShipmentBook($input);
        }

        return response($result);
    }
}
