<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Dingo\Api\Routing\Helpers;
use Buzz\Client\Curl;
use Nyholm\Psr7\Factory\Psr17Factory;
use Illuminate\Support\Facades\Config;

require_once (__DIR__ . "/../ApiSDK/Bring.php");
use App\ApiSDK\Client\Client;
/**
 *  Class Bring Model.
 * 
 *  This class is responsible for all actions of Bring.com API.
 * 
 *  @author Handsomedev19
 */
class Bring extends Model
{
    use Helpers;
    use HasFactory;

    protected $psr17Factory;
    protected $httpClient;
    protected $client;

    public function __construct() {
        $this->psr17Factory = new Psr17Factory();
        $this->httpClient = new Curl($this->psr17Factory);
        $apikey = Config::get('constants.BRING_APIKEY');
        $baseurl = Config::get('constants.BRING_BASE_URL');
        $loginID = Config::get('constants.BRING_LOGIN_ID');
        $this->client = new Client($this->httpClient, $this->psr17Factory, $this->psr17Factory, $apikey, $baseurl, $loginID);
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

        $nordic = array('NO', 'SE', 'DK', 'FI');

        if($shipmentType == 1){
            if (in_array($fromcountry, $nordic) && in_array($tocountry, $nordic)){
                $product = 'BUSINESS_PARCEL';
            } else {
                return array();
            }
        } else if ($shipmentType == 2) {
            if($fromcountry == 'NO' && $tocountry == 'NO'){
                $product = 'BUSINESS_PALLET';
            } else if($fromcountry == 'DK' && $tocountry == 'DK'){
                $product = 'BUSINESS_PALLET';
            } else if($fromcountry == 'FI' && $tocountry == 'FI'){
                $product = 'BUSINESS_PALLET';
            } else if($fromcountry == 'SE' && $tocountry == 'SE'){
                $product = 'BUSINESS_PALLET';
            } else {
                $product = 'BUSINESS_PALLET';
            }
        } else if ($shipmentType == 3) {
            if($fromcountry == 'NO' && $tocountry == 'NO'){
                $product = 'CARGO';
            } else if($fromcountry == 'DK' && $tocountry == 'DK'){
                $product = 'CARGO_INTERNATIONAL';
            } else if($fromcountry == 'FI' && $tocountry == 'FI'){
                $product = 'CARGO_INTERNATIONAL';
            } else if($fromcountry == 'SE' && $tocountry == 'SE'){
                $product = 'CARGO_INTERNATIONAL';
            } else {
                $product = 'CARGO_INTERNATIONAL';
            }

            if ($request['containerType'] == 2){
                $weight = 26300;
                $numberofpallets = 21;
                $length = 13;      //12.025;
                $width = 3;      //2.352;
                $height = 3;     //2.393;   
            } else {
                $weight = 25400;
                $numberofpallets = 10;
                $length = 6;      //5.898;
                $width = 3;       //2.352;
                $height = 3;      //2.393;
            }
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

        $result = $this->client->get($url, $params);
        
        $final = array();
        if($product != null && isset($result['consignments']) && count($result['consignments']) > 0){
            foreach($result['consignments'] as $mainKey => $mainValue) {
                if (count($mainValue['products']) > 0){
                    foreach($mainValue['products'] as $key => $value){
    
                        $serviceCode = $value['productionCode'];
    
                        $final[$serviceCode]['serviceCompany'] = Config::get('constants.BRING');
                        $final[$serviceCode]['serviceCode'] = $value['productionCode'];
                        if (isset($value['guiInformation'])){
                            $final[$serviceCode]['serviceName'] = $value['guiInformation']['mainDisplayCategory'];
                            $final[$serviceCode]['adnlServiceCode'] = array();
    
                            $final[$serviceCode]['mainDisplayCategory'] = $value['guiInformation']['mainDisplayCategory'];
                            $final[$serviceCode]['subDisplayCategory'] = $value['guiInformation']['subDisplayCategory'];
                            $final[$serviceCode]['displayName'] = $value['guiInformation']['displayName'];
                            $final[$serviceCode]['productName'] = $value['guiInformation']['productName'];
                            $final[$serviceCode]['descriptionText'] = $value['guiInformation']['descriptionText'];
                            $final[$serviceCode]['helpText'] = $value['guiInformation']['helpText'];
                            $final[$serviceCode]['shortName'] = $value['guiInformation']['shortName'];
                            $final[$serviceCode]['deliveryType'] = $value['guiInformation']['deliveryType'];
                            $final[$serviceCode]['maxWeightInKgs'] = $value['guiInformation']['maxWeightInKgs'];
                            $final[$serviceCode]['amountWithoutVAT'] = $value['price']['listPrice']['priceWithoutAdditionalServices']['amountWithoutVAT'];
                            $final[$serviceCode]['vat'] = $value['price']['listPrice']['priceWithoutAdditionalServices']['vat'];
                            $final[$serviceCode]['amountWithVAT'] = $value['price']['listPrice']['priceWithoutAdditionalServices']['amountWithVAT'];
                            $final[$serviceCode]['currencyCode'] = $value['price']['listPrice']['currencyCode'];
                            if (isset($value['expectedDelivery'])) {
                                $final[$serviceCode]['workingDays'] = $value['expectedDelivery']['workingDays'];
                                $final[$serviceCode]['formattedExpectedDeliveryDate'] = $value['expectedDelivery']['formattedExpectedDeliveryDate'];
                            } else {
                                $final[$serviceCode]['workingDays'] = 'Unkonwn';
                                $final[$serviceCode]['formattedExpectedDeliveryDate'] = 'Unknown';
                            }
                            $final[$serviceCode]['workingTimeType'] = 'Working Days';
                        } else {
                            unset($final[$serviceCode]);
                        }
                    }
                }
            }
        }


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
        $data['testIndicator'] = Config::get("constants.PRODUCTION_STATE");
        $data['schemaVersion'] = 1;
        $data['consignments'] = array();

        $consignment = array();
        $consignment['shippingDateTime'] = '2020-05-05T10:00:00';
        $consignment['customerSpecifiedDeliveryDateTime'] = '2020-05-11T10:00:00';
        $consignment['parties'] = array();
        $consignment['parties']['sender'] = array(
            'name' => 'Ola Nordmann',
            'addressLine' => 'Testsvingen 12',
            'addressLine2' => null,
            'postalCode' => '0263',
            'city' => 'OSLO',
            'countryCode' => 'no',
            'reference' => '1234',
            'additionalAddressInfo' => 'Hentes på baksiden etter klokken to',
            'contact' => array(
                'name' => 'Trond Nordmann',
                'email' => 'trond@nordmanntest.no',
                'phoneNumber' => '99999999'
            )
        );
        $consignment['parties']['recipient'] = array(
            'name' => 'Tore Mottaker',
            'addressLine' => 'Mottakerveien 14',
            'addressLine2' => 'c/o Tina Mottaker',
            'postalCode' => '0659',
            'city' => 'OSLO',
            'countryCode' => 'no',
            'reference' => '43242',
            'additionalAddressInfo' => 'Bruk ringeklokken',
            'contact' => array(
                'name' => 'Tore mottaker',
                'email' => 'tore@mottakertest.no',
                'phoneNumber' => '88888888'
            )
        );
        $consignment['parties']['pickupPoint'] = null;

        $consignment['product'] = array();
        $consignment['product']['id'] = 'PA_DOREN';
        $consignment['product']['customerNumber'] = '*********';
        $consignment['product']['additionalServices'] = array();      
        // $additionalService = array(
        //     'id' => 'DANGEROUS_GOODS',
        //     'unNumber' => 'ABC'
        // );
        $additionalService = array(
            'id' => 'DANGEROUS_GOODS',
            'unNumber' => 'ABC'
        );
        $consignment['product']['additionalServices'][] = $additionalService;

        $consignment['purchaseOrder'] = null;
        $consignment['correlationId'] = 'INTERNAL-123456';
        $consignment['packages'] = array();
        $package = array(
            'weightInKg' => 1.1,
            'goodsDescription' => 'Testing equipment',
            'dimensions' => array(
                'heightInCm' => 13,
                'widthInCm' => 23,
                'lengthInCm' => 10
            ),
            'containerId' => null,
            'packageType' => null,
            'numberOfItems' => null,
            'correlationId' => 'PACKAGE-123'
        );
        $consignment['packages'][] = $package;

        $data['consignments'][] = $consignment;

        $bring_book_shipment_success = true;
        try {
            //$result = $this->client->post($url, $params, $data);

            // fake data
            $result = array(
                "consignments" => array(
                  array(
                    "confirmation"=> array(
                        "consignmentNumber"=> "70438101268018539",
                        "productSpecificData"=> null,
                        "links"=> array(
                            "labels" => "https://www.mybring.com/booking/labels/2968466?auth-token=5cf1dcee-4f01-4c9a-9870-3ba6d9ba050b",
                            "waybill" => null,
                            "tracking" => "http://sporing.bring.no/sporing.html?q=70438101268018539"
                        ),
                        "dateAndTimes" => array(
                            "earliestPickup" => null,
                            "expectedDelivery" => 1436295739676
                        ),
                        "packages"=> array(
                            array(
                            "packageNumber"=> "370438101268058536",
                            "correlationId"=> "PACKAGE-123"
                            )
                        )
                    ),
                    "errors"=> null,
                    "correlationId"=> "INTERNAL-123456"
                  )
                )
            );


        } catch (Exception $e){
            $bring_book_shipment_success = false;
        }
        
        if($bring_book_shipment_success){
            $shipment = new Book;
            foreach($result['consignments'] as $consignment){
                $last_book = Book::orderBy('id', 'desc')->take(1)->get();
                if (count($last_book) > 0){
                    $shipment->orderId = Config::get('constants.SITE_NAME') . ($last_book[0]->id + 100001);
                } else {
                    $shipment->orderId = Config::get('constants.SITE_NAME') . (100000);
                }
                $shipment->companyOrderId = $consignment['confirmation']['consignmentNumber'];
                $shipment->pickupTime = $consignment['confirmation']['dateAndTimes']['expectedDelivery'];
                $shipment->companyName = Config::get('constants.BRING');
                
                $uuid = $request['id'];
                if ($uuid == null || $uuid == ''){
                    return null;
                }
                    $user = User::where('uuid', $uuid)->first();
                    $id = $user->id;
                    $shipment->user_id = $id;
                    $shipment->save();
             }
        }

        return $result;

    }

    public function trackingShipment($request){
        $apikey = Config::get('constants.BRING_APIKEY');
        $baseurl = Config::get('constants.BRING_BASE_URL_TRACKING');
        $loginID = Config::get('constants.BRING_LOGIN_ID');
        $this->client = new Client($this->httpClient, $this->psr17Factory, $this->psr17Factory, $apikey, $baseurl, $loginID);

        $url = '/api/v2/tracking.json';
        $params = array(
            'q' => $request['id']
        );
        $result = $this->client->get($url, $params);

        $final = array();
        $final['TrackingInformationResponse'] = array();
        $final['TrackingInformationResponse']['shipments'] = array();
        if(isset($result['consignmentSet']) && count($result['consignmentSet']) > 0){
            foreach($result['consignmentSet'] as $key => $consignment){
                $shipment = array();
                if(isset($consignment['packageSet']) && count($consignment['packageSet']) > 0){
                    $shipment['shipmentId'] = $consignment['consignmentId'];
                    $shipment['items'] = array();
                    foreach($consignment['packageSet'] as $subKey => $package){
                        $item = array();
                        $item['itemId'] = $package['packageNumber'];
                        $item['dropOffDate'] = $package['dateOfReturn'];
                        $item['typeOfItem'] = $package['productName'];
                        $item['statusText'] = array();
                        $item['statusText']['header'] = $package['statusDescription'];
                        $item['status'] = '';
                        $item['events'] = array();
                        foreach($package['eventSet'] as $eve){
                            $event = array();
                            $event['eventTime'] = $eve['displayDate'] . " : ". $eve['displayTime'];
                            $event['eventCode'] = '';
                            $event['status'] = $eve['status'];
                            $event['eventDescription'] = $eve['description'];
                            $event['location'] = array();
                            $event['location']['locationId'] = '';
                            $event['location']['displayName'] = '';
                            $event['location']['name'] = '';
                            $event['location']['country'] = $eve['country'];
                            $event['location']['city'] = $eve['city'];
                            $event['location']['postcode'] = '';

                            $item['events'][] = $event;
                        }
                        $shipment['items'][] = $item;
                    }
                    $final['TrackingInformationResponse']['shipments'][] = $shipment;
                }
            }
        }

        return $final;
    }
}
