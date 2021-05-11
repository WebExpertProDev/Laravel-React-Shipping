<?php

namespace App\Http\Controllers\Api\Users;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UserDetail;
use App\Models\User;

class UserDetailsController extends Controller
{
    //
    
    public function store(Request $request){

        $uuid = $request->uuid;
        if ($uuid == null || $uuid == ''){
            return null;
        }
        $user = User::where('uuid', $uuid)->first();
        $id = $user->id;

        $user_detail = UserDetail::where('user_id', $id)->first();

        if(!$user_detail){
            $user_detail = new UserDetail;
        }

        $user_detail->id = $id;
        $user_detail->firstname = $request->firstname;
        $user_detail->lastname = $request->lastname;
        $user_detail->phonenumber = $request->phonenumber;
        $user_detail->address = $request->address;
        $user_detail->postalcode = $request->postalcode;
        $user_detail->city = $request->city;
        $user_detail->country = $request->country;
        $user_detail->countrycode = $request->country;
        $user_detail->status = 'active';
        $user_detail->user_id = $id;
        $user_detail->save();

        return response($user_detail);
        //return response($id);
    }
}
