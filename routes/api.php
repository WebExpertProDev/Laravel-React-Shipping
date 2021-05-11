<?php

$api = app('Dingo\Api\Routing\Router');

$api->version('v1', function($api){

    $api->group(['middleware' => ['throttle:60,1', \Illuminate\Routing\Middleware\SubstituteBindings::class], 'namespace' => 'App\Http\Controllers'], function($api) {

        $api->get('ping', 'Api\PingController@index');

        $api->post('signup', 'Api\Users\UsersController@signup');

        $api->get('assets/{uuid}/render', 'Api\Assets\RenderFileController@show');

        $api->group(['middleware' => ['auth:api'], ], function ($api) {

            $api->group(['prefix' => 'users'], function ($api) {
                $api->get('/', 'Api\Users\UsersController@index');
                $api->post('/', 'Api\Users\UsersController@store');
                $api->get('/{uuid}', 'Api\Users\UsersController@show');
                $api->put('/{uuid}', 'Api\Users\UsersController@update');
                $api->patch('/{uuid}', 'Api\Users\UsersController@update');
                $api->delete('/{uuid}', 'Api\Users\UsersController@destroy');
            });

            $api->group(['prefix' => 'roles'], function ($api) {
                $api->get('/', 'Api\Users\RolesController@index');
                $api->post('/', 'Api\Users\RolesController@store');
                $api->get('/{uuid}', 'Api\Users\RolesController@show');
                $api->put('/{uuid}', 'Api\Users\RolesController@update');
                $api->patch('/{uuid}', 'Api\Users\RolesController@update');
                $api->delete('/{uuid}', 'Api\Users\RolesController@destroy');
            });

            $api->get('permissions', 'Api\Users\PermissionsController@index');

            $api->group(['prefix' => 'me'], function($api) {
                $api->get('/', 'Api\Users\ProfileController@index');
                $api->put('/', 'Api\Users\ProfileController@update');
                $api->patch('/', 'Api\Users\ProfileController@update');
                $api->put('/password', 'Api\Users\ProfileController@updatePassword');
            });

            $api->group(['prefix' => 'assets'], function($api) {
                $api->post('/', 'Api\Assets\UploadFileController@store');
            });

            $api->group(['prefix' => 'books'], function($api) {
                $api->post('/test', 'Api\Books\GetServiceController@test');
                $api->post('/service', 'Api\Books\GetServiceController@index');
                $api->post('/shipment', 'Api\Books\ShipmentController@store');
            });

            $api->group(['prefix' => 'tracking'], function($api) {
                $api->post('/', 'Api\Tracking\TrackingController@index');
            });

            $api->group(['prefix' => 'prices'], function($api) {
                $api->post('/', 'Api\Prices\PricesController@index');
            });

            $api->group(['prefix' => 'u'], function($api) {
                $api->post('/store', 'Api\Users\UserDetailsController@store');
                $api->get('/books/{uuid}', 'Api\Books\BookController@getBooksForUser');
            });

            $api->group(['prefix' => 'admin'], function($api) {
                $api->get('/books', 'Api\Admin\BookController@getBooks');
            });

        });

    });

});



