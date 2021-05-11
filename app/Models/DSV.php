<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Dingo\Api\Routing\Helpers;
use Buzz\Client\Curl;
use Nyholm\Psr7\Factory\Psr17Factory;
use Illuminate\Support\Facades\Config;

require_once (__DIR__ . "/../ApiSDK/DSV.php");
use App\ApiSDK\DSV\Client\Client;

/**
 *  Class Dsv Model.
 * 
 *  This class is responsible for all actions of DSV.com API.
 * 
 *  @author Handsomedev19
 */
class DSV extends Model
{
    use HasFactory;
    use HasFactory;

    protected $psr17Factory;
    protected $httpClient;
    protected $client;

    public function __construct() {
        // $this->psr17Factory = new Psr17Factory();
        // $this->httpClient = new Curl($this->psr17Factory);
        // $apikey = Config::get('constants.BRING_APIKEY');
        // $baseurl = Config::get('constants.BRING_BASE_URL');
        // $loginID = Config::get('constants.BRING_LOGIN_ID');
        // $this->client = new Client($this->httpClient, $this->psr17Factory, $this->psr17Factory, $apikey, $baseurl, $loginID);
    }

    public function getPriceTime($request){
        
        $url = "/shippingguide/v2/products";

        $fromcountry = strtoupper($request['countryFrom']);
        $frompostalcode = $request['postalCodeFrom'];
        $nonstandardcourierservice = array_key_exists('nonstandardcourierservice', $request) ? $request['nonstandardcourierservice'] : 'CDA';
        $product = null;
        $tocountry = strtoupper($request['countryTo']);
        $topostalcode = $request['postalCodeTo'];
        
        $items = $request['items'];
        for($i = 0; $i < count($items); $i++){
            $units = $items[$i]['units'];
            $weight = $items[$i]['weight'];
            $length = $items[$i]['length'];
            $width = $items[$i]['width'];
            $height = $items[$i]['height'];
        }
        $shipmentType = intval($request['shipmentType']);

        $type_of_item = '';
        if($shipmentType == 1){
            $type_of_item = 'parcel';
        } else if ($shipmentType == 2) {
            $type_of_item = 'pallet';
        } else if ($shipmentType == 3) {
            $type_of_item = 'cargo';
        } else if ($shipmentType == 4) {
            $type_of_item = 'document';
        }

        $params = array(
            'fromcountry' => $fromcountry,
            'frompostalcode' => $frompostalcode,
            'nonstandardcourierservice' => $nonstandardcourierservice,
            'product' => $product,
            'tocountry' => $tocountry,
            'topostalcode' => $topostalcode,
            'length' => $length,
            'width' => $width,
            'height' => $height,
            'weight' => $weight
        );

        //$result = $this->client->get($url, $params);
        
        $final = array();
        //if($product != null && isset($result['consignments']) && count($result['consignments']) > 0){
            //foreach($result['consignments'] as $mainKey => $mainValue) {
                //if (count($mainValue['products']) > 0){
                    //foreach($mainValue['products'] as $key => $value){
    
                        $serviceCode = 'dsv';
    
                        $final[$serviceCode]['serviceCompany'] = Config::get('constants.DSV');
                        $final[$serviceCode]['serviceCode'] =  'dsv'; //$value['productionCode'];
                        //if (isset($value['guiInformation'])){
                            $final[$serviceCode]['serviceName'] = $type_of_item; //$value['guiInformation']['mainDisplayCategory'];
                            $final[$serviceCode]['adnlServiceCode'] = array('road', 'air', 'sea', 'rail');
    
                            $final[$serviceCode]['mainDisplayCategory'] = $type_of_item; //$value['guiInformation']['mainDisplayCategory'];
                            $final[$serviceCode]['subDisplayCategory'] =$type_of_item;//$value['guiInformation']['subDisplayCategory'];
                            $final[$serviceCode]['displayName'] = $type_of_item;//$value['guiInformation']['displayName'];
                            $final[$serviceCode]['productName'] = $type_of_item;//$value['guiInformation']['productName'];
                            $final[$serviceCode]['descriptionText'] = $type_of_item;//$value['guiInformation']['descriptionText'];
                            $final[$serviceCode]['helpText'] = $type_of_item;//$value['guiInformation']['helpText'];
                            $final[$serviceCode]['shortName'] = $type_of_item;//$value['guiInformation']['shortName'];
                            $final[$serviceCode]['deliveryType'] = $type_of_item;//$value['guiInformation']['deliveryType'];
                            $final[$serviceCode]['maxWeightInKgs'] = 'Unknown';//$value['guiInformation']['maxWeightInKgs'];
                            $final[$serviceCode]['amountWithoutVAT'] = 'Unknown';//$value['price']['listPrice']['priceWithoutAdditionalServices']['amountWithoutVAT'];
                            $final[$serviceCode]['vat'] = 'Unknown';//$value['price']['listPrice']['priceWithoutAdditionalServices']['vat'];
                            $final[$serviceCode]['amountWithVAT'] = 'Unknown';//$value['price']['listPrice']['priceWithoutAdditionalServices']['amountWithVAT'];
                            $final[$serviceCode]['currencyCode'] = 'SEK'; //$value['price']['listPrice']['currencyCode'];
                            //if (isset($value['expectedDelivery'])) {
                            //     $final[$serviceCode]['workingDays'] = $value['expectedDelivery']['workingDays'];
                            //     $final[$serviceCode]['formattedExpectedDeliveryDate'] = $value['expectedDelivery']['formattedExpectedDeliveryDate'];
                            // } else {
                                $final[$serviceCode]['workingDays'] = 'Unkonwn';
                                $final[$serviceCode]['formattedExpectedDeliveryDate'] = 'Unknown';
                            //}
                            $final[$serviceCode]['workingTimeType'] = 'Working Days';
                        //} else {
                            //unset($final[$serviceCode]);
                        //}
                    //}
               // }
            //}
        //}


        return $final;
    }

    public function storeShipmentBook($request){
        $url = '/booking/api/booking';

        $item_types = array('parcel', 'halfpallet', 'cage', 'pallet', 'specialpallet');
        $service_name = strtolower($request['typeOfItem']);
        $noUnits = 0;
        foreach($request['items'] as $item){
            $noUnits += $item['units'];
        }

        $params = array();  
        $data = array();
        
        $dsv_book_shipment_success = true;
        try {
            //$result = $this->client->post($url, $params, $data);

            // fake data
            $result = array(
                "type" => "object",
                "properties" => array(
                    "bookingId" => array(
                        "type" => "string",
                        "example" => 40257145990010780000,
                        "description" => "Booking identifier (GSIN)"
                    )
                ),
                "title" => "PlaceBookingResponse",
                "description" => "Contains information about submitted booking"
            );

        } catch (Exception $e){
            $dsv_book_shipment_success = false;
        }
        
        if($dsv_book_shipment_success){
            $shipment = new Book;
            
            $last_book = Book::orderBy('id', 'desc')->take(1)->get();
            if (count($last_book) > 0){
                $shipment->orderId = Config::get('constants.SITE_NAME') . ($last_book[0]->id + 100001);
            } else {
                $shipment->orderId = Config::get('constants.SITE_NAME') . (100000);
            }
            $shipment->companyOrderId = $result['properties']['bookingId']['example'];
            $shipment->pickupTime = 'Unknown';
            $shipment->companyName = Config::get('constants.DSV');
            
            $uuid = $request['id'];
            if ($uuid == null || $uuid == ''){
                return null;
            }
                $user = User::where('uuid', $uuid)->first();
                $id = $user->id;
                $shipment->user_id = $id;
                $shipment->save();
             
        }

        return $result;

    }
}
