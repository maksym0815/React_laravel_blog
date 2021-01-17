<?php

namespace App\Http\Resources;

use App\Models\Likes;
use App\Http\Resources\ApiResourceCollection;
use App\Http\Resources\LikesResource;

class LikesCollection extends ApiResourceCollection
{
    public $like = Likes::class;
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $this->collection->transform(function ($like) {
            return (new LikesResource($like));
        });

        return parent::toArray($request);
    }
}