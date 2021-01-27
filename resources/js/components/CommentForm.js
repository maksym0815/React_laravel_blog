import React, { useState } from "react";
import Http from "../Http";

const api = "/api/v1/comments";

const CommentForm = (props) => {
    const [error, setError] = useState(false);
    const [commentState, setComment] = useState({
        message: "",
        name: "",
        article_id: props.article_id,
    });

    const { setData, dataState } = props;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setComment({
            ...commentState,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (commentState.message.length > 0 && commentState.name.length > 0) {
            Http.post(api, commentState)
                .then(({ data }) => {
                    console.log("Data:", data);
                    const { comment } = data;
                    let commentResponse = {
                        id: comment._id,
                        created_at: comment?.created_at,
                        ...commentState,
                    };
                    const allComments = [commentResponse, ...dataState];
                    setData(allComments);
                    setComment({
                        message: "",
                        name: "",
                        article_id: props.article_id,
                    });
                    setError(false);
                })
                .catch(() => {
                    setError("Sorry, there was an error saving your article.");
                });
        }
    };

    return (
        <div className="add-todos mb-5">
            <form method="post" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Your Name</label>
                    <input
                        id="name"
                        type="name"
                        name="name"
                        className="form-control mr-3"
                        placeholder="Mr.William"
                        required
                        onChange={handleChange}
                        value={commentState.name}
                        maxLength={30}
                        minLength={5}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                        name="message"
                        id="message"
                        name="message"
                        required
                        maxLength={200}
                        className="form-control mr-3"
                        placeholder="Write your message right here..."
                        onChange={handleChange}
                        value={commentState.message}
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-block btn-outline-primary"
                >
                    Comment
                </button>
            </form>
        </div>
    );
};

export default CommentForm;
