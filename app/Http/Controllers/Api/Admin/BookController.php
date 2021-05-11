<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Book;

class BookController extends Controller
{
    // Get Booking History for a loggedin User.
    public function getBooks(){

        //$data = Book::all();
        $data = Book::with('user')->get();

        return response($data);
    }
}
