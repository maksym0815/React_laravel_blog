<?php

namespace App\Http\Resources;

use App\Models\Comments;
use App\Http\Resources\ApiResourceCollection;
use App\Http\Resources\CommentsResource;

class CommentsCollection extends ApiResourceCollection
{
    public $comment = Comments::class;
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        
        $this->collection->transform(function ($comment) {
            return (new CommentsResource($comment));
        });

        return parent::toArray($request);
    }
}