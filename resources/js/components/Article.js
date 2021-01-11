import React from "react";

const Article = ({ article }) => {
    const { title, content, image_url, updated_at, slug } = article;
    return (
        <div className="card mb-3">
            <img className="card-img-top" src={image_url} alt={slug} />
            <div className="card-body">
                <h5 className="card-title">{title}</h5>
                <p className="card-text">{content}</p>
                <p className="card-text">
                    <small className="text-muted">{updated_at}</small>
                </p>
            </div>
        </div>
    );
};

export default Article;
