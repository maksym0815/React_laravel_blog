import React from "react";

const Comment = (props) => {
    const { name, message, created_at } = props.comment;

    return (
        <div className="media-body p-2 shadow-sm rounded bg-light border">
            <small className="float-right text-muted">{created_at}</small>
            <h6 className="mt-0 mb-1 text-muted">{name}</h6>
            {message}
        </div>
    );
};

export default Comment;
