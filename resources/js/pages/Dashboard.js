import React, { useState, useEffect } from "react";
import Http from "../Http";
import { useForm } from "react-hook-form";
import Dropdown from "../components/Dropdown";
import swal from "sweetalert";

const api = "/api/v1/article";

const options = [
    { value: "1", label: "Technology" },
    { value: "2", label: "Entertainment" },
    { value: "3", label: "Music" },
    { value: "4", label: "Fashion" },
    { value: "5", label: "Sports" },
    { value: "6", label: "Arts" },
    { value: "7", label: "Travel" },
    { value: "8", label: "Literature" },
    { value: "9", label: "Science" },
    { value: "10", label: "Politics" },
    { value: "11", label: "Economy" },
    { value: "12", label: "Nature" },
];

const Dashboard = () => {
    const session = JSON.parse(window.localStorage.getItem("user"));
    const { id } = session;
    const { register, handleSubmit, watch, errors } = useForm();
    const [dataState, setData] = useState([]);
    const [error, setError] = useState(false);
    const [stateForm, setStateForm] = useState({
        content: "",
        title: "",
        image_url: "",
        slug: "",
        cat_id: {},
    });

    useEffect(() => {
        //Http.get(`${api}?status=open`)
        Http.get(api)
            .then((response) => {
                const { data } = response.data;
                console.log(data);
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
        if (article?.id) {
            Http.patch(`${api}/${article.id}`, article)
                .then((response) => {
                    console.log(response);
                    let filterArticles = dataState.filter(
                        (art) => art.id !== article.id
                    );
                    filterArticles = [article, ...filterArticles];
                    setData(filterArticles);
                    setStateForm({
                        content: "",
                        title: "",
                        image_url: "",
                        slug: "",
                        cat_id: {},
                    });
                    setError(false);
                })
                .catch(() => {
                    setError("Sorry, there was an error saving your article.");
                });
        } else {
            Http.post(api, article)
                .then(({ data }) => {
                    article = { id: data.id, ...article };
                    const allArticles = [article, ...dataState];
                    setData(allArticles);
                    setStateForm({
                        content: "",
                        title: "",
                        image_url: "",
                        slug: "",
                        cat_id: {},
                    });
                    setError(false);
                })
                .catch(() => {
                    setError("Sorry, there was an error saving your article.");
                });
        }
    };

    const editArticle = (article) => {
        const { id } = article;
        let form = dataState.filter((art) => art.id === id);
        console.log(id, form);
        setStateForm(form[0]);
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

    const deleteArticle = (e) => {
        const { key } = e.target.dataset;
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this article!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                Http.delete(`${api}/${key}`)
                    .then((response) => {
                        console.log(key);
                        console.log(response);
                        if (response.status === 204) {
                            const updateState = dataState.filter(
                                (article) => article.id !== key
                            );
                            setError(false);
                            setData(updateState);
                            console.log("Articles:", updateState);
                            swal("The Article has been deleted!", {
                                icon: "success",
                            });
                        } else {
                            swal(
                                "Unable to Delete!",
                                "There was an error processing.",
                                { icon: "warning" }
                            );
                        }
                    })
                    .catch((errorResponse) => {
                        console.log(errorResponse);
                        console.log(errorResponse);
                        setError("There was an error processing.");
                        swal(
                            "Unable to Delete!",
                            "There was an error processing.",
                            { icon: "warning" }
                        );
                    });
            }
        });
    };
    return (
        <div className="container py-5">
            <div className="row">
                <div className="col">
                    <div className="add-todos mb-5">
                        <h1 className="text-center mb-4">
                            Add/Update an Article
                        </h1>
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
                                    maxLength={100}
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
                                    type="url"
                                    name="image_url"
                                    className="form-control mr-3"
                                    placeholder=""
                                    onChange={handleChange}
                                    maxLength={70}
                                    value={stateForm.image_url}
                                    ref={register()}
                                />
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                        <label htmlFor="slug">Slug</label>
                                        <input
                                            id="slug"
                                            name="slug"
                                            className="form-control mr-3"
                                            placeholder="Nice!"
                                            maxLength={12}
                                            onChange={handleChange}
                                            value={stateForm.slug}
                                            ref={register()}
                                        />
                                    </div>
                                </div>
                                <div className="col">
                                    <label htmlFor="category">
                                        Select a Category
                                    </label>
                                    <div className="form-group">
                                        <Dropdown
                                            title={
                                                stateForm?.cat_id?.label ??
                                                "Category"
                                            }
                                            options={options}
                                            setStateForm={setStateForm}
                                            stateForm={stateForm}
                                        />
                                    </div>
                                </div>
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
                                    <th>Approve</th>
                                    <th>Delete</th>
                                    <th>Edit</th>
                                </tr>
                                {dataState.length > 0 &&
                                    dataState.map((article) => (
                                        <tr key={article.id}>
                                            <td>{article.title}</td>
                                            <td>
                                                {article.content
                                                    .slice(0, 30)
                                                    .concat("...")}
                                            </td>
                                            <td>
                                                <img
                                                    src={article.image_url}
                                                    className="rounded mx-auto d-block"
                                                    alt={article.slug}
                                                ></img>
                                            </td>
                                            <td>
                                                <span className="badge badge-success">
                                                    {article.slug}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="badge badge-warning">
                                                    {article.cat_id.label}
                                                </span>
                                            </td>
                                            <td>
                                                <span
                                                    type="button"
                                                    className="badge badge-info"
                                                    onClick={
                                                        article.user_id === id
                                                            ? closeArticle
                                                            : () =>
                                                                  console.log(
                                                                      "Not an owner"
                                                                  )
                                                    }
                                                    data-key={article.id}
                                                >
                                                    Approve
                                                </span>
                                            </td>
                                            <td>
                                                <span
                                                    type="button"
                                                    className="badge badge-danger"
                                                    onClick={
                                                        article.user_id === id
                                                            ? deleteArticle
                                                            : () =>
                                                                  console.log(
                                                                      "Not an owner"
                                                                  )
                                                    }
                                                    data-key={article.id}
                                                >
                                                    Delete
                                                </span>
                                            </td>
                                            <td>
                                                <span
                                                    type="button"
                                                    className="badge badge-dark"
                                                    onClick={
                                                        article.user_id === id
                                                            ? () =>
                                                                  editArticle(
                                                                      article
                                                                  )
                                                            : () =>
                                                                  console.log(
                                                                      "Not an owner"
                                                                  )
                                                    }
                                                    data-key={article.id}
                                                >
                                                    Edit
                                                </span>
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
