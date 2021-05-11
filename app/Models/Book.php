<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\User;


class Book extends Model
{
    use HasFactory, SoftDeletes;




    /**
     * Get the user who has reserve this book.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
