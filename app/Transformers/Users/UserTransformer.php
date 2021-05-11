<?php

namespace App\Transformers\Users;

use App\Models\User;
use League\Fractal\TransformerAbstract;
use App\Models\UserDetail;

/**
 * Class UserTransformer.
 */
class UserTransformer extends TransformerAbstract
{
    /**
     * @var array
     */
    protected $defaultIncludes = ['roles'];

    /**
     * @param \App\Model\User $model
     * @return array
     */
    public function transform(User $model)
    {
        // handsomedev19
        $user = User::where('uuid', $model->uuid)->first();
        $id = $user->id;
        $user_detail = UserDetail::where('user_id', $id)->first();
        if (!$user_detail){
            return [
                'id' => $model->uuid,
                'name' => $model->name,
                'email' => $model->email,
                'created_at' => $model->created_at->toIso8601String(),
                'updated_at' => $model->updated_at->toIso8601String(),
            ];
        } else {
            return [
                'id' => $model->uuid,
                'name' => $model->name,
                'email' => $model->email,
                'created_at' => $model->created_at->toIso8601String(),
                'updated_at' => $model->updated_at->toIso8601String(),
                'firstname' => $user_detail->firstname,
                'lastname' => $user_detail->lastname,
                'phonenumber' => $user_detail->phonenumber,
                'address' => $user_detail->address,
                'postalcode' => $user_detail->postalcode,
                'city' => $user_detail->city,
                'country' => $user_detail->country,
                'status' => $user_detail->status,
            ];
        }
        // /handsomedev19
        
    }

    /**
     * @param \App\Model\User $model
     * @return \League\Fractal\Resource\Collection
     */
    public function includeRoles(User $model)
    {
        return $this->collection($model->roles, new RoleTransformer());
    }
}
