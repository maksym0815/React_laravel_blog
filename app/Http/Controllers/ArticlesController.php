<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;

class ArticlesController extends Controller
{

    public function index()
    {
        return Blog::all();
    }
 
    public function show($id)
    {
        return Blog::find($id);
    }

    public function store(Request $request)
    {
        return Blog::create($request->all());
    }

    public function update(Request $request, $id)
    {
        $article = Blog::findOrFail($id);
        $article->update($request->all());

        return $article;
    }
    public function delete(Request $request, $id)
    {
        $article = Blog::findOrFail($id);
        $article->delete();

        return 204;
    }
}
