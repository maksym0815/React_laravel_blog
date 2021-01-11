import React, { useState, useEffect } from 'react';
import Http from '../Http';
import { useForm } from "react-hook-form";

const api ='/api/v1/article';

const Dashboard = () => {
  const { register, handleSubmit, watch, errors } = useForm();
  const [dataState, setData] = useState([]);
  const [error, setError] = useState(false);
  const [stateForm, setStateForm] = useState({ content: ''})


  useEffect(() => {
    Http.get(`${api}?status=open`)
      .then((response) => {
        const { data } = response.data;
        setData(data)
      })
      .catch(() => {
        setError('Unable to fetch data.')
      });
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStateForm({
        ...stateForm,
        [ name ]: value
    });
  };

  const onSubmit = () => {
    addArticle(stateForm);
  };

  const addArticle = (article) => {
    Http.post(api,  article)
      .then(({ data }) => {
        const newItem = {
          id: data.id,
          article,
        };
        const allArticles = [newItem, ...dataState];
        setData(allArticles)
        setStateForm({content: ''})
      })
      .catch(() => {
        setError('Sorry, there was an error saving your article.')
      });
  };

const closeArticle = (e) => {
    const { key } = e.target.dataset;
    const { articles } = dataState;

    Http.patch(`${api}/${key}`, { status: 'closed' })
      .then(() => {
        const updatedArticles = articles.filter(
          (article) => article.id !== key,
        );
        setData(updatedArticles)
      })
      .catch(() => {
        setError('Sorry, there was an error saving your article.')
      });
  };
  return (
    <div className="container py-5">
        <div className="add-todos mb-5">
          <h1 className="text-center mb-4">Add an Article</h1>
          <form
            method="post"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="form-group">
              <label htmlFor="addArticle">Add a New Article</label>
              <div className="d-flex">
                <input
                  id="addArticle"
                  name="content"
                  className="form-control mr-3"
                  placeholder="Build a Blog app..."
                  onChange={handleChange}
                  ref={register()}
                />
                {errors.content && <span className="invalid-feedback">This field is required.</span>}
                <button type="submit" className="btn btn-primary">
                  Add
                </button>
              </div>
            </div>
          </form>
        </div>

        {error && (
          <div className="alert alert-warning" role="alert">
            {error}
          </div>
        )}

        <div className="todos">
          <h1 className="text-center mb-4">Open Articles</h1>
          <table className="table table-striped">
            <tbody>
              <tr>
                <th>Article</th>
                <th>Action</th>
              </tr>
              {dataState.length>0 && dataState.map((article) => (
                <tr key={article.id}>
                  <td>{article.value}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={closeArticle}
                      data-key={article.id}
                    >
                      Close
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  )
}

export default Dashboard
