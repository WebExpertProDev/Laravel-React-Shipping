<?php

namespace App\Http\Controllers\Api\Books;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Dingo\Api\Routing\Helpers;
use App\Models\Postnord;
use App\Models\Bring;
use App\Models\DSV;
use App\Models\DHL;

/**
 *  Class Service Controller.
 * 
 *  @author Handsomedev19
 */
class GetServiceController extends Controller
{
    use Helpers;

    protected $postnord;
    protected $bring;
    protected $dsv;
    protected $dhl;

    /**
     * 
     */

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

    public function index(Request $request){

        // Get associative array from HTTP request.
        $input  = $request->input();

        $postnord_response_flag = true;
        $bring_response_flag = true;
        $dsv_response_flag = true;
        $dhl_response_flag = true;

        // Get services from Postnord API.
        $result_postnord = array();
        try {
            $result_postnord = $this->postnord->getServices($input);
        } catch (Exception $e){
            $postnord_response_flag = false;
        }
        
        // Get services from Bring API.
        $result_bring = array();
        try {
            $result_bring = $this->bring->getPriceTime($input);
        } catch (Exception $e){
            $bring_response_flag = false;
        }

        // Get services from DSV API.
        $result_dsv = array();
        try {
            $result_dsv = $this->dsv->getPriceTime($input);
        } catch (Exception $e){
            $dsv_response_flag = false;
        }

        // Get services from DSV API.
        $result_dhl = array();
        try {
            $result_dhl = $this->dhl->getPriceTime($input);
        } catch (Exception $e){
            $dhl_response_flag = false;
        }
        
        $result = array();
        if ($postnord_response_flag){
            foreach($result_postnord as $key => $value){
                $result[$key] = $value;
            }    
        }
        if ($bring_response_flag){
            foreach($result_bring as $key => $value){
                $result[$key] = $value;
            }
        }
        if ($dsv_response_flag){
            foreach($result_dsv as $key => $value){
                $result[$key] = $value;
            }
        }
        if ($dhl_response_flag){
            foreach($result_dhl as $key => $value){
                $result[$key] = $value;
            }
        }
        

        return response($result);
    }

}
