import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import classNames from "classnames";
import AuthService from "../services";
import { useForm } from "react-hook-form";

const ForgotPassword = (props) => {
    const { register, handleSubmit, watch, errors } = useForm();
    const [stateForm, setStateForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState({ error: false, message: "" });
    const [success, setSuccess] = useState(false);

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
        const { email } = stateForm;
        const credentials = {
            email,
        };
        setLoading(true);
        submit(credentials);
    };

    const submit = (credentials) => {
        props
            .dispatch(AuthService.resetPassword(credentials))
            .then((res) => {
                const responses = {
                    error: false,
                    message: res.message,
                };
                setResponse(responses);
                setLoading(false);
                setSuccess(success);
            })
            .catch((err) => {
                const errorss = Object.values(err.errors);
                errorss.join(" ");
                const responses = {
                    error: true,
                    message: errorss[0],
                };
                setResponse(responses);
                setLoading(false);
            });
    };

    return (
        <>
            {isAuthenticated && <Redirect to={from} />}
            <div className="d-flex flex-column flex-row align-content-center py-5">
                <div className="container">
                    <div className="row">
                        <div className="section-login col-lg-6 ml-auto mr-auto">
                            <h4>Request Password Reset</h4>

                            <div className="card-login card mb-3">
                                <div className="card-body">
                                    {success && (
                                        <div
                                            className="alert alert-success text-center"
                                            role="alert"
                                        >
                                            A password reset link has been sent!
                                        </div>
                                    )}

                                    {response.error && (
                                        <div
                                            className="alert alert-danger text-center"
                                            role="alert"
                                        >
                                            {response.message}
                                        </div>
                                    )}

                                    {!success && (
                                        <form
                                            className="form-horizontal"
                                            method="POST"
                                            onSubmit={handleSubmit(onSubmit)}
                                        >
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
                                                                "email" in
                                                                errors,
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
                                                    Send Password Reset Email
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

ForgotPassword.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.Auth.isAuthenticated,
});

export default connect(mapStateToProps)(ForgotPassword);
