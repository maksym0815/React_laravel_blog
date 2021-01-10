<?php

namespace App\Http\Resources;

use App\Custom\Hasher;

class ArticleResource extends ApiResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'created_at' => (string)$this->created_at->toDateTimeString(),
            'updated_at' => (string)$this->updated_at->toDateTimeString(),
            'id' => $this->id,
            'user' => Hasher::encode($this->user_id),
            'title' => $this->title,
            'content' => $this->content,
            'slug' => $this->slug,
            'status' => $this->status,
            'cat_id' => $this->cat_id,
            'image_url' => $this->image_url,
        ];
    }
}
