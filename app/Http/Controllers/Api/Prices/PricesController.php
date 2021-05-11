<?php

namespace App\Http\Controllers\Api\Prices;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Dingo\Api\Routing\Helpers;
use App\Models\Postnord;

/**
 *  Class Service Controller.
 * 
 *  @author Handsomedev19
 */
class PricesController extends Controller
{
    use Helpers;
    
    protected $postnord;

    /**
     * 
     */

    public function __construct() {
        $this->postnord = new Postnord();
    }

    public function index(){
        return $this->response->array([
            'status' => 'ok',
            'timestamp' => \Carbon\Carbon::now(),
            'host' => request()->ip(),
        ]);
    }
}
