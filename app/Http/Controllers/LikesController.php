<?php

namespace App\Http\Controllers;

use App\Models\Likes;
use App\Models\Article;
use Illuminate\Http\Request;
use App\Http\Controllers\APIController;
use App\Http\Resources\LikesResource;

class LikesController extends ApiController
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Get user from $request token.
        if (! $user = auth()->setRequest($request)->user()) {
            return $this->responseUnauthorized();
        }

        // Warning: Data isn't being fully sanitized yet.
        try {
            $like = Likes::create([
                'user_id' => $user->id,
                'article_id' => $request->input('article_id'),
                'like' => request('like'),
            ]);
            return response()->json([
                'status' => 201,
                'message' => 'Resource created.',
                'id' => $like->id
            ], 201);
        } catch (Exception $e) {
            return $this->responseServerError('Error creating resource.');
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $article_id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $article_id)
    {
        $user = auth()->setRequest($request)->user();
      
        $like = Likes::where([['article_id', $article_id],['user_id', $user->id]])->firstOrFail();
        // User can only acccess their own data.
        if ($like['user_id'] === $user->id && $like['article_id'] === $article_id) {
            return new LikesResource($like);
        }

        return null;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        // Get user from $request token.
         $user = auth()->setRequest($request)->user();

        try {
            $like = Likes::where('_id', $id)->firstOrFail();
            if ($like['user_id'] === $user->id && $like['article_id'] === $request->input('article_id')) {
                if (request('like')) {
                    $like->like = request('like');
                }
                $like->save();
                return $this->responseResourceUpdated();
            } else {
                return null;
            }
        } catch (Exception $e) {
            return $this->responseServerError('Error updating resource.');
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id, $article_id)
    {
        // Get user from $request token.
        $user = auth()->setRequest($request)->user();

        $like = Likes::where('_id', $id)->firstOrFail();
        // User can only delete their own data.
        if ($like['user_id'] !== $user->id || $like['article_id'] !== $article_id) {
            return null;
        }
        try {
            $like->delete();
            return $this->responseResourceDeleted();
        } catch (Exception $e) {
            return $this->responseServerError('Error deleting resource.');
        }
    }
}