<?php

namespace App\Http\Controllers;

use App\Models\Comments;
use Illuminate\Http\Request;
use App\Http\Controllers\APIController;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\CommentsCollection;
use App\Http\Resources\CommentsResource;

class CommentsController extends ApiController
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
       // Get user from $request token.
       if (!$user = auth()->setRequest($request)->user()) {
            return $this->responseUnauthorized();
        }
        $collection = Comments::get();

        return new CommentsCollection($collection);
    }

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
        
        // Validate all the required parameters have been sent.
        $validator = Validator::make($request->all(), [
            'message' => 'required',
            'name' => 'required',
        ]);

        if ($validator->fails()) {
            return $this->responseUnprocessable($validator->errors());
        }

        // Warning: Data isn't being fully sanitized yet.
        try {
            $comment = Comments::create([
                'user_id' => $user->id,
                'message' => request('message'),
                'article_id' => $request->input('article_id'),
                'name' => request('name'),
            ]);
            return response()->json([
                'status' => 201,
                'message' => 'Resource created.',
                'comment' => $comment
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
         // Get user from $request token.
         if (! $user = auth()->setRequest($request)->user()) {
            return $this->responseUnauthorized();
        }
        $comments = Comments::where('article_id', $article_id)->get();
        return new CommentsCollection($comments);
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
            $comment = Comments::where('_id', $id)->firstOrFail();
            if ($comment['user_id'] === $user->id && $comment['article_id'] === $request->input('article_id')) {
                if (request('message')) {
                    $comment->message = request('message');
                }
                if (request('name')) {
                    $comment->name = request('name');
                }
                $comment->save();
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

        $comment = Comments::where('_id', $id)->firstOrFail();
        // User can only delete their own data.
        if ($comment['user_id'] !== $user->id || $comment['article_id'] !== $article_id) {
            return null;
        }
        try {
            $comment->delete();
            return $this->responseResourceDeleted();
        } catch (Exception $e) {
            return $this->responseServerError('Error deleting resource.');
        }
    }
}