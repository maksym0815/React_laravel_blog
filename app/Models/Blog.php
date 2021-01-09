<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model as Eloquent;


class Blog extends Eloquent
{
	protected $connection = 'mongodb';
	protected $collection = 'articles';


    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id', 'id_cat', 'title', 'slug', 'short_content', 'main_content', 'image_url', 'creation_date', 'updated_date', 'created_by', 'updated_by'
    ];

}