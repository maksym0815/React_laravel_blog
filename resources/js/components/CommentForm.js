import React, { useState } from "react";
import Http from "../Http";

const api = "/api/v1/comment";

const CommentForm = (props) => {
    const [error, setError] = useState(false);
    const [comment, setComment] = useState({
        message: "",
        name: "",
    });

    const { setData, dataState } = props;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setComment({
            ...comment,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (comment?.content.length > 0 && comment?.name.length > 0) {
            Http.post(api, comment)
                .then(({ data }) => {
                    let commentResponse = {
                        id: data.id,
                        time: data?.time,
                        ...comment,
                    };
                    const allComments = [commentResponse, ...dataState];
                    setData(allComments);
                    setComment({
                        message: "",
                        name: "",
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
                        value={comment.name}
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
                        value={comment.message}
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
