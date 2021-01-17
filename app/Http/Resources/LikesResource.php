<?php

namespace App\Http\Resources;

class LikesResource extends ApiResource
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
            'user_id' => $this->user_id,
            'article_id' => $this->article_id,
            'like' => $this->like,
        ];
    }
}