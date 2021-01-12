<?php

namespace App\Models;
use Jenssegers\Mongodb\Eloquent\Model as Eloquent;
use App\Models\User;

class Article extends Eloquent
{
    protected $connection = 'mongodb';
    protected $collection = 'articles';
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id', 
        'cat_id', 
        'title', 
        'slug',  
        'content', 
        'image_url', 
        'creation_date', 
        'updated_date', 
        'status',
        'user_id'
    ];

    /**
     * The attributes that should be casted to native types.
     *
     * @var array
     */
    protected $casts = [
        'user_id' => 'string',
    ];

    /**
     * A Article belongs to a User.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}