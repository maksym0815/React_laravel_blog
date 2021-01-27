import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import AuthService from "../services";
import classNames from "classnames";
import { useForm } from "react-hook-form";

const Home = (props) => {
    const { register, handleSubmit, watch, errors } = useForm();
    const [stateForm, setStateForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({ error: false, message: "" });

    // If user is already authenticated we redirect to entry location.
    const { from } = props.location.state || { from: { pathname: "/" } };
    const { isAuthenticated } = props;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStateForm({
            ...stateForm,
            [name]: value,
        });
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        // Avoid validation until input has a value.
        if (value === "") {
            return;
        }
    };

    const onSubmit = () => {
        //e.preventDefault();
        const { email, password } = stateForm;
        const credentials = {
            email,
            password,
        };
        setLoading(true);
        submit(credentials);
    };

    const submit = (credentials) => {
        props.dispatch(AuthService.login(credentials)).catch((err) => {
            console.log(err);
            const errorsCredentials = Object.values(err.errors);
            errorsCredentials.join(" ");
            const responses = {
                error: true,
                message: errorsCredentials[0],
            };
            setResponse(responses);
            setLoading(false);
        });
    };

    return (
        <>
            {isAuthenticated && <Redirect to={from} />}
            <div className="d-flex flex-column flex-md-row align-items-md-center py-5">
                <div className="container">
                    <div className="row">
                        <div className="section-about col-lg-6 mb-4 mb-lg-0">
                            <div>
                                <h2>Blog App - Sample</h2>
                                <p>
                                    Built with Laravel, React and MongoDB.
                                    Includes JWT auth, registration, login,
                                    routing and tests.
                                </p>
                                <p>
                                    <a href="https://github.com/danielhdz23/blog-laravel-react-mongodb">
                                        Source code and documentation on GitHub.
                                    </a>
                                </p>
                            </div>
                        </div>
                        <div className="section-login col-lg-6">
                            <h4>Log in to the App</h4>

                            <div className="card-login card mb-3">
                                <div className="card-body">
                                    <form
                                        className="form-horizontal"
                                        method="POST"
                                        onSubmit={handleSubmit(onSubmit)}
                                    >
                                        {response.error && (
                                            <div
                                                className="alert alert-danger"
                                                role="alert"
                                            >
                                                Credentials were incorrect. Try
                                                again!
                                            </div>
                                        )}

                                        <div className="form-group">
                                            <label htmlFor="email">
                                                Email Address
                                            </label>
                                            <input
                                                id="email"
                                                type="email"
                                                name="email"
                                                maxLength={50}
                                                className={classNames(
                                                    "form-control",
                                                    {
                                                        "is-invalid":
                                                            "email" in errors,
                                                    }
                                                )}
                                                placeholder="Enter email"
                                                required
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                disabled={loading}
                                                ref={register({
                                                    required: true,
                                                })}
                                            />
                                            {errors.email && (
                                                <span className="invalid-feedback">
                                                    This field is required
                                                </span>
                                            )}
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="password">
                                                Password
                                            </label>
                                            <input
                                                id="password"
                                                type="password"
                                                maxLength={15}
                                                minLength={6}
                                                className={classNames(
                                                    "form-control",
                                                    {
                                                        "is-invalid":
                                                            "password" in
                                                            errors,
                                                    }
                                                )}
                                                name="password"
                                                placeholder="Enter password"
                                                required
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                disabled={loading}
                                                ref={register({
                                                    required: true,
                                                })}
                                            />
                                            {errors.password && (
                                                <span className="invalid-feedback">
                                                    This field is required
                                                </span>
                                            )}
                                        </div>

                                        <div className="form-group text-center">
                                            <button
                                                type="submit"
                                                className={classNames(
                                                    "btn btn-primary",
                                                    {
                                                        "btn-loading": loading,
                                                    }
                                                )}
                                            >
                                                Sign In
                                            </button>
                                        </div>

                                        <div className="login-invite-text text-center">
                                            {"Don't have an account?"}{" "}
                                            <Link to="/register">Register</Link>
                                            .
                                        </div>
                                    </form>
                                </div>
                            </div>

                            <div className="password-reset-link text-center">
                                <Link to="/forgot-password">
                                    Forgot Your Password?
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

Home.propTypes = {
    dispatch: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.Auth.isAuthenticated,
});
export default connect(mapStateToProps)(Home);
