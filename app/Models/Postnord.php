<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Dingo\Api\Routing\Helpers;
use Buzz\Client\Curl;
use Nyholm\Psr7\Factory\Psr17Factory;
use Setono\PostNord\Client\Client;
use Illuminate\Support\Facades\Config;
use App\Models\Book;

/**
 *  Class Postnord Model.
 * 
 *  This class is responsible for all actions of Postnord.com API.
 * 
 *  @author Handsomedev19
 */
class Postnord extends Model
{
    use Helpers;
    use HasFactory;

    protected $psr17Factory;
    protected $httpClient;
    protected $client;

    public function __construct() {
        $this->psr17Factory = new Psr17Factory();
        $this->httpClient = new Curl($this->psr17Factory);
        $apikey = Config::get('constants.POSTNORD_APIKEY');
        $baseurl = Config::get('constants.POSTNORD_BASE_URL');
        $this->client = new Client($this->httpClient, $this->psr17Factory, $this->psr17Factory, $apikey, $baseurl);
    }

    public function getTransportTime($request){
        $url = 'rest/transport/v1/transittime/getTransitTimeInformation.json';
        $params = array(
            'dateOfDeparture' => '2021-02-09',
            'serviceCode' => $request['serviceCode'],
            'serviceGroupCode' => 'SE',
            'fromAddressPostalCode' => $request['postalCodeFrom'],
            'fromAddressCountryCode' => strtoupper($request['countryFrom']),
            'toAddressPostalCode' => $request['postalCodeTo'],
            'toAddressCountryCode' => strtoupper($request['countryTo']),
            'responseContent' => 'simple'
        );

        $postnord_transport_time_success = true;
        try{
            $result = $this->client->get($url, $params);
        } catch (Exception $e){
            $postnord_transport_time_success = false;
        }
        $final = array();
        if ($postnord_transport_time_success){
            if(array_key_exists('deliveryTime', $result['se.posten.loab.lisp.notis.publicapi.serviceapi.TransitTimeSimpleResponse'])){
                $final = array(
                    'deliveryTime' => $result['se.posten.loab.lisp.notis.publicapi.serviceapi.TransitTimeSimpleResponse']['deliveryTime'],
                    'deliveryDate' => $result['se.posten.loab.lisp.notis.publicapi.serviceapi.TransitTimeSimpleResponse']['deliveryDate'],
                );
            }          
            return $final;
        } else {
            return null;
        }  
    }

    public function getServices($request){
        $url = 'rest/shipment/v3/edi/servicecodes/adnlservicecodes/combinations';
        $result = $this->client->get($url);

        $serviceName = intval($request['shipmentType']);
        $allowedConsigneeCountryCode = $request['countryTo'];
        $allowedConsigneeCountryPostalCode = $request['postalCodeTo'];
        $allowedConsignorCountryCode = $request['countryFrom'];
        $allowedConsignorCountryPostalCode = $request['postalCodeFrom'];
        $now = date("Y-m-d");
        
        $requestServiceCode = 0;
        if ($serviceName == 1) {
            $requestServiceCode = 18;
        } else if ($serviceName == 2){
            $requestServiceCode = 52;
        } else if ($serviceName == 3){
            $requestServiceCode = null;
            return array();
        } else if($serviceName == 4){
            $requestServiceCode = null;
            return array();
        }
        $request['serviceCode'] = $requestServiceCode;

        // Get Tranportaion Time from PostNord.com
        $workingDays = $this->getTransportTime($request);

        // Static Price List.
        $prices = array(
            'parcel' => array(
                array(
                    'weight' => '3',
                    'inclVAT' => '225',
                    'exclVAT' => '180'
                ),
                array(
                    'weight' => '5',
                    'inclVAT' => '270',
                    'exclVAT' => '216'
                ),
                array(
                    'weight' => '10',
                    'inclVAT' => '335',
                    'exclVAT' => '268'
                ),
                array(
                    'weight' => '15',
                    'inclVAT' => '385',
                    'exclVAT' => '308'
                ),
                array(
                    'weight' => '20',
                    'inclVAT' => '450',
                    'exclVAT' => '360'
                )
            ),
            'pallet' => array(
                'weight' => '300',
                'inclVAT' => '1264',
                'exclVAT' => '1264'
            )
        );
        $price_incl_vat = 'Unknown';
        $price_excl_vat = 'Unknown';
        $price_vat = 'Unknown';
        if ($serviceName == 1){
            foreach($request['items'] as $item){
                foreach($prices['parcel'] as $price){
                    if ($item['weight'] <= $price['weight']){
                        $price_incl_vat = $price['inclVAT'] * $item['units'];
                        $price_excl_vat = $price['exclVAT'] * $item['units'];
                        $price_vat = $price_incl_vat - $price_excl_vat;
                        break;
                    }
                }
            }
            if ($price_incl_vat == 'Unknown'){
                return array();
            }
        } else if ($serviceName == 2){
            foreach($request['items'] as $item){  
                $price_incl_vat = $prices['pallet']['inclVAT'] * $item['units'];
                $price_excl_vat = $prices['pallet']['exclVAT'] * $item['units'];
                $price_vat = $price_incl_vat - $price_excl_vat;  
            }
        }

        $final = array();
        if ($workingDays != null){
            if($result['data']) {
                foreach($result['data'] as $key => $value){
    
                    if ($value['adnlServiceCodeCombDetails']){
                        foreach($value['adnlServiceCodeCombDetails'] as $subKey => $subValue){
                            if (
                                $subValue['serviceCode'] == $requestServiceCode &&
                                    ($subValue['allowedConsigneeCountry'] == strtoupper($allowedConsigneeCountryCode) || $subValue['allowedConsigneeCountry'] == 'ALL') &&
                                    (strtoupper($subValue['allowedConsignorCountry']) == $allowedConsignorCountryCode || $subValue['allowedConsignorCountry'] == 'ALL') &&
                                    $subValue['validFrom'] < $now && $subValue['validTo'] > $now
                            ) {
                                
                                $serviceCode = $subValue['serviceCode'];
                                if(isset($final[$serviceCode])){ 
                                    $final[$serviceCode]['adnlServiceCode'][] = array(
                                        'adnlServiceCode' => $subValue['adnlServiceCode'],
                                        'adnlServiceName' => $subValue['adnlServiceName'],
                                        'allowedConsigneeCountry' => $subValue['allowedConsigneeCountry'],
                                        'allowedConsignorCountry' => $subValue['allowedConsignorCountry']
                                    );
                                } else {
                                    $final[$serviceCode]['serviceCompany'] = Config::get('constants.POSTNORD');
                                    $final[$serviceCode]['serviceCode'] = $subValue['serviceCode'];
                                    $final[$serviceCode]['serviceName'] = $subValue['serviceName'];
                                    $final[$serviceCode]['adnlServiceCode'] = array();
    
                                    $final[$serviceCode]['mainDisplayCategory'] = '';
                                    $final[$serviceCode]['subDisplayCategory'] = '';
                                    $final[$serviceCode]['displayName'] = '';
                                    $final[$serviceCode]['productName'] = '';
                                    $final[$serviceCode]['descriptionText'] = '';
                                    $final[$serviceCode]['helpText'] = '';
                                    $final[$serviceCode]['shortName'] = '';
                                    $final[$serviceCode]['deliveryType'] = '';
                                    $final[$serviceCode]['maxWeightInKgs'] = '';
                                    $final[$serviceCode]['amountWithoutVAT'] = $price_excl_vat;
                                    $final[$serviceCode]['vat'] = $price_vat;
                                    $final[$serviceCode]['amountWithVAT'] = $price_incl_vat;
                                    $final[$serviceCode]['workingDays'] = $workingDays['deliveryTime'];
                                    $final[$serviceCode]['workingTimeType'] = 'Working Hours';
                                    $final[$serviceCode]['formattedExpectedDeliveryDate'] = '';
                                    $final[$serviceCode]['currencyCode'] = 'SEK';
                                }
                            }                  
                        }
                    }
                }
            }
            return $final;
        } else {
            return array();
        }       
    }

    public function storeShipmentBook($request){
        $url = 'rest/order/v1/pickup/SE';

        $item_types = array('parcel', 'halfpallet', 'cage', 'pallet', 'specialpallet');
        $service_name = strtolower($request['typeOfItem']);
        $customerNumber = '123456';
        $contactName = 'Richard Stweart';
        $contactEmail = 'test@test.com';
        $phoneNumber = '123456';
        $smsNumber = '123456';
        $entryCode = '123456';
        $noUnits = 0;
        foreach($request['items'] as $item){
            $noUnits += $item['units'];
        }

        $data = array(
            'shipment' => array (
                'service' => array(
                    'basicServiceCode' => $request['basicServiceCode'],
                    'additionalServiceCode' => array($request['additionalServiceCode'])
                ),
                'items' => array(
                    373500489530470000
                )
            ),
            'location' => array(
                'place' => $request['receiverCompanyName'],
                'streetName' => $request['receiverStreetName'],
                'streetNumber' => $request['receiverStreetNumber'],
                'postalCode' => $request['receiverPostalCode'],
                'city' => $request['receiverCity'],
                'countryCode' => $request['receiverCountryCode']
            ),
            'order' => array(
                'customerNumber' => $customerNumber,
                'orderReference' => 'Ref-1212122A',
                'contactName' => $contactName,
                'contactEmail' => $contactEmail,
                'phoneNumber' => $phoneNumber,
                'smsNumber' => $smsNumber,
                'entryCode' => $entryCode,
            ),
            'pickup' => array(
                array(
                    'typeOfItem' => $service_name,
                    'noUnits' => $noUnits,
                )
            ),
            'dateAndTimes' => array(
                'readyPickupDate' => $request['readyPickupDate'],
                'latestPickupDate' => $request['latestPickupDate'],
                'earliestPickupDate' => $request['earliestPickupDate']
            )

        );
        $params = array();

        // Exception handling about API request to the PostNord.com

        $postnord_api_success = true;
        try {
            $result = $this->client->post($url, $params, $data);
        } catch(Exception $e) {
            $postnord_api_success = false;
            $message = $e->getMessage();
        }
        
        if($postnord_api_success){
            $shipment = new Book;
            $last_book = Book::orderBy('id', 'desc')->take(1)->get();
            if (count($last_book) > 0){
                $shipment->orderId = Config::get('constants.SITE_NAME') . ($last_book[0]->id + 100001);
            } else {
                $shipment->orderId = Config::get('constants.SITE_NAME') . (100000);
            }
            
            $shipment->companyOrderId = $result['orderId'];
            $shipment->pickupTime = $result['pickupTime'];
            $shipment->companyName = Config::get('constants.POSTNORD');
    
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
        //return $data;
    }

    public function trackingShipment($request){
        $url = 'rest/shipment/v5/trackandtrace/findByIdentifier.json';
        $params = array(
            'id' => $request['id'],
            'locale' => $request['locale']
        );
        $result = $this->client->get($url, $params);

        return $result;
    }

    public function checkHealth(){
        $url = 'rest/order/v1/pickup/SE/manage/health';
        $result = $this->client->get($url);
        return $result;
    }
}
