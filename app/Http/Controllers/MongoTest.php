<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use MongoDB\Client as Mongo;

class MongoTest extends Controller
{
    function mongoConnect(){
        $mongo =  new Mongo;
        $connection = $mongo->blogdb->user;
        return $connection->find()->toArray();
    }
}
