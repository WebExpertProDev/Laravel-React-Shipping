<?php

namespace App\Http\Controllers\Api\Books;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Book;

class BookController extends Controller
{
    // Get Booking History for a loggedin User.
    public function getBooksForUser(Request $request, $uuid){
        if ($uuid == null || $uuid == ''){
            return null;
        }
        $user = User::where('uuid', $uuid)->first();
        $id = $user->id;

        $books = Book::where('user_id', $id)->get();

        return response($books);
    }
}
