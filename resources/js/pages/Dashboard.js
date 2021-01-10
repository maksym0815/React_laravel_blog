import React, { Component } from 'react';
import { connect } from 'react-redux';
import Http from '../Http';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    // Initial state.
    this.state = {
      article: null,
      error: false,
      data: [],
    };

    // API endpoint.
    this.api = '/api/v1/article';
  }

  componentDidMount() {
    Http.get(`${this.api}?status=open`)
      .then((response) => {
        const { data } = response.data;
        this.setState({
          data,
          error: false,
        });
      })
      .catch(() => {
        this.setState({
          error: 'Unable to fetch data.',
        });
      });
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { article } = this.state;
    this.addArticle(article);
  };

  addArticle = (article) => {
    Http.post(this.api, { value: article })
      .then(({ data }) => {
        const newItem = {
          id: data.id,
          value: article,
        };
        const allArticles = [newItem, ...this.state.data];
        this.setState({ data: allArticles, article: null });
        this.articleForm.reset();
      })
      .catch(() => {
        this.setState({
          error: 'Sorry, there was an error saving your to do.',
        });
      });
  };

  closeArticle = (e) => {
    const { key } = e.target.dataset;
    const { data: articles } = this.state;

    Http.patch(`${this.api}/${key}`, { status: 'closed' })
      .then(() => {
        const updatedArticles = articles.filter(
          (article) => article.id !== parseInt(key, 10),
        );
        this.setState({ data: updatedArticles });
      })
      .catch(() => {
        this.setState({
          error: 'Sorry, there was an error closing your to do.',
        });
      });
  };

  render() {
    const { data, error } = this.state;

    return (
      <div className="container py-5">
        <div className="add-todos mb-5">
          <h1 className="text-center mb-4">Add a To Do</h1>
          <form
            method="post"
            onSubmit={this.handleSubmit}
            ref={(el) => {
              this.articleForm = el;
            }}
          >
            <div className="form-group">
              <label htmlFor="addArticle">Add a New To Do</label>
              <div className="d-flex">
                <input
                  id="addArticle"
                  name="article"
                  className="form-control mr-3"
                  placeholder="Build a To Do app..."
                  onChange={this.handleChange}
                />
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
          <h1 className="text-center mb-4">Open To Dos</h1>
          <table className="table table-striped">
            <tbody>
              <tr>
                <th>To Do</th>
                <th>Action</th>
              </tr>
              {data.map((article) => (
                <tr key={article.id}>
                  <td>{article.value}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={this.closeArticle}
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
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.Auth.isAuthenticated,
  user: state.Auth.user,
});

export default connect(mapStateToProps)(Dashboard);
