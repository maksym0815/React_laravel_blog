<?php

namespace App\Http\Resources;

use App\Models\Article;
use App\Http\Resources\ApiResourceCollection;
use App\Http\Resources\ArticleResource;

class ArticleCollection extends ApiResourceCollection
{
    public $article = Article::class;
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        
        // Transforms the collection to match format in ArticleResource.
        //$this->collection->transform(function (Article $article) {
        $this->collection->transform(function ($article) {
            return (new ArticleResource($article));
        });

        return parent::toArray($request);
    }
}