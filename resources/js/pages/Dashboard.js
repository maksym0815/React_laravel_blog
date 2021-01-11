import React, { useState, useEffect } from "react";
import Http from "../Http";
import { useForm } from "react-hook-form";

const api = "/api/v1/article";

const Dashboard = () => {
    const { register, handleSubmit, watch, errors } = useForm();
    const [dataState, setData] = useState([]);
    const [error, setError] = useState(false);
    const [stateForm, setStateForm] = useState({
        content: "",
        title: "",
        image_url: "",
        slug: "",
        cat_id: "",
    });

    useEffect(() => {
        Http.get(`${api}?status=open`)
            .then((response) => {
                const { data } = response.data;
                setData(data);
                setError(false);
            })
            .catch(() => {
                setError("Unable to fetch data.");
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStateForm({
            ...stateForm,
            [name]: value,
        });
    };

    const onSubmit = () => {
        addArticle(stateForm);
    };

    const addArticle = (article) => {
        Http.post(api, article)
            .then(({ data }) => {
                const newItem = {
                    id: data.id,
                    article,
                };
                const allArticles = [newItem, ...dataState];
                setData(allArticles);
                setStateForm({
                    content: "",
                    title: "",
                    image_url: "",
                    slug: "",
                    cat_id: "",
                });
                setError(false);
            })
            .catch(() => {
                setError("Sorry, there was an error saving your article.");
            });
    };

    const closeArticle = (e) => {
        const { key } = e.target.dataset;
        const { articles } = dataState;

        Http.patch(`${api}/${key}`, { status: "closed" })
            .then(() => {
                const updatedArticles = articles.filter(
                    (article) => article.id !== key
                );
                setData(updatedArticles);
                setError(false);
            })
            .catch(() => {
                setError("Sorry, there was an error saving your article.");
            });
    };
    return (
        <div className="container py-5">
            <div className="row">
                <div className="col">
                    <div className="add-todos mb-5">
                        <h1 className="text-center mb-4">Add an Article</h1>
                        <form method="post" onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-group">
                                <label htmlFor="title">Title </label>
                                <input
                                    id="title"
                                    type="title"
                                    name="title"
                                    className="form-control mr-3"
                                    placeholder="Title..."
                                    required
                                    onChange={handleChange}
                                    value={stateForm.title}
                                    ref={register({ required: true })}
                                />
                                {errors.title && (
                                    <span className="invalid-feedback">
                                        This field is required
                                    </span>
                                )}
                            </div>
                            <div className="form-group">
                                <label htmlFor="addArticle">Content</label>
                                <textarea
                                    name="content"
                                    id="content"
                                    name="content"
                                    className="form-control mr-3"
                                    placeholder="Build a Blog app..."
                                    onChange={handleChange}
                                    value={stateForm.content}
                                    ref={register()}
                                />

                                {errors.content && (
                                    <span className="invalid-feedback">
                                        This field is required.
                                    </span>
                                )}
                            </div>
                            <div className="form-group">
                                <label htmlFor="image_url">Image Url</label>
                                <input
                                    id="image_url"
                                    name="image_url"
                                    className="form-control mr-3"
                                    placeholder=""
                                    onChange={handleChange}
                                    value={stateForm.image_url}
                                    ref={register()}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="slug">Slug</label>
                                <input
                                    id="slug"
                                    name="slug"
                                    className="form-control mr-3"
                                    placeholder="Nice!"
                                    onChange={handleChange}
                                    value={stateForm.slug}
                                    ref={register()}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="cat_id">Category</label>
                                <input
                                    id="cat_id"
                                    name="cat_id"
                                    className="form-control mr-3"
                                    placeholder="Nice!"
                                    onChange={handleChange}
                                    value={stateForm.cat_id}
                                    ref={register()}
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-block btn-outline-primary"
                            >
                                Add
                            </button>
                        </form>
                    </div>
                    {error && (
                        <div className="alert alert-warning" role="alert">
                            {error}
                        </div>
                    )}
                </div>
                <div className="col">
                    <div className="todos">
                        <h1 className="text-center mb-4">Preview Articles</h1>
                        <table className="table table-striped">
                            <tbody>
                                <tr>
                                    <th>Title</th>
                                    <th>Content</th>
                                    <th>Image</th>
                                    <th>Slug</th>
                                    <th>Category</th>
                                    <th>Action</th>
                                </tr>
                                {dataState.length > 0 &&
                                    dataState.map((article) => (
                                        <tr key={article.id}>
                                            <td>{article.article.title}</td>
                                            <td>
                                                {article.article.content
                                                    .slice(0, 30)
                                                    .concat("...")}
                                            </td>
                                            <td>
                                                <img
                                                    src={
                                                        article.article
                                                            .image_url
                                                    }
                                                    className="rounded mx-auto d-block"
                                                    alt={article.article.slug}
                                                ></img>
                                            </td>
                                            <td>{article.article.slug}</td>
                                            <td>{article.article.cat_id}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary btn-sm"
                                                    onClick={closeArticle}
                                                    data-key={article.id}
                                                >
                                                    Approve
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
