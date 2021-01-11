import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Http from '../Http';

const api = '/api/v1/article';

const Archive = () => {

  const [loading, setLoading] = useState(false)
  const [responseState, setResponseState] = useState({ error: false, message: '', articles: []})
  const [moreLoaded, setMoreLoaded] = useState(false)
  const [apiMore, setApiMore] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    Http.get(api)
    .then((response) => {
      const { data } = response.data;
      const apiM = response.data.links.next;
      setResponseState(data)
      setLoading(false)
      setError(false)
      setApiMore(apiM)
    })
    .catch(() => {
     setError('Unable to fetch data.');
    });
  }, []);

  const loadMore = () => {
    setLoading(true);
    Http.get(apiMore)
      .then((response) => {
        const { data } = response.data;
        const apiM = response.data.links.next;
        const dataMore = responseState.concat(data);
        setResponse(dataMore);
        setApiMore(apiM);
        setLoading(false);
        setError(false);
        setMoreLoaded(true);
      })
      .catch(() => {
        setError('Unable to fetch data.')
        setLoading(false);
      });
  };

  const deleteArticle = (e) => {
    const { key } = e.target.dataset;
    const { articles } = responseState;

    Http.delete(`${api}/${key}`)
      .then((response) => {
        if (response.status === 204) {
          const index = articles.findIndex(
            (article) => parseInt(article.id, 10) === parseInt(key, 10),
          );
          const update = [...articles.slice(0, index), ...articles.slice(index + 1)];
          setResponse(update)
        }
      })
      .catch((error) => {
        console.log(error);
        setError('There was an error processing.')
      });
  };
    return (
      <div className="container py-5">
      <h1 className="text-center mb-4">Article Archive</h1>

      {error && (
        <div className="text-center">
          <p>{error}</p>
        </div>
      )}

      <table className="table">
        <tbody>
          <tr>
            <th>Time</th>
            <th>Article</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
          {responseState.length>0 && responseState.map((article) => (
            <tr key={article.id}>
              <td>{article.created_at}</td>
              <td>{article.content}</td>
              <td>{article.status}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={deleteArticle}
                  data-key={article.id}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {apiMore && (
        <div className="text-center">
          <button
            className={classNames('btn btn-primary', {
              'btn-loading': loading,
            })}
            onClick={loadMore}
          >
            Load More
          </button>
        </div>
      )}

      {!apiMore && moreLoaded === true && (
        <div className="text-center">
          <p>Everything loaded.</p>
        </div>
      )}
    </div>
    )
}

Archive.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.Auth.isAuthenticated,
  user: state.Auth.user,
});

export default connect(mapStateToProps)(Archive);