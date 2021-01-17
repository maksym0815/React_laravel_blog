<?php

namespace App\Http\Controllers;

use App\Models\Likes;
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
                'article_id' => $article->id,
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
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        // Get user from $request token.
        if (! $user = auth()->setRequest($request)->user()) {
            return $this->responseUnauthorized();
        }

        $like = Likes::where('_id', $id)->firstOrFail();
        // User can only acccess their own data.
        if ($like['user_id'] === $user->id && $like['article_id'] === $article->id) {
            return $this->responseUnauthorized();
        }
        return new LikesResource($like);
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
        if (! $user = auth()->setRequest($request)->user()) {
            return $this->responseUnauthorized();
        }

        try {
            $like = Likes::where('_id', $id)->firstOrFail();
            if ($like['user_id'] === $user->id && $like['article_id'] === $article->id) {
                if (request('like')) {
                    $like->like = request('like');
                }
                $like->save();
                return $this->responseResourceUpdated();
            } else {
                return $this->responseUnauthorized();
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
    public function destroy(Request $request, $id)
    {
        // Get user from $request token.
        if (! $user = auth()->setRequest($request)->user()) {
            return $this->responseUnauthorized();
        }
        $like = Likes::where('_id', $id)->firstOrFail();
        // User can only delete their own data.
        if ($like['user_id'] !== $user->id || $like['article_id'] !== $article->id) {
            return $this->responseUnauthorized();
        }

        try {
            $like->delete();
            return $this->responseResourceDeleted();
        } catch (Exception $e) {
            return $this->responseServerError('Error deleting resource.');
        }
    }
}