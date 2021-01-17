import React, { useState } from "react";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeartBroken } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Article = ({ article }) => {
    const { title, content, image_url, created_at, slug } = article;
    const [like, setLike] = useState(false);
    const [error, setError] = useState(false);

    const toggle = () => {
        setLike(!like);
        if (like) handleLike();
    };
    const handleLike = async () => {
        /* Http.post()
            .then(({ data }) => {
                setError(false);
            })
            .catch(() => {
                setError("Sorry, there was an error saving your article.");
            });*/
    };
    return (
        <div className="card mb-3">
            {error && (
                <div className="alert alert-warning" role="alert">
                    {error}
                </div>
            )}
            <img className="card-img-top" src={image_url} alt={slug} />
            <div className="card-body">
                <h5 className="card-title">{title}</h5>
                <p className="card-text">{content}</p>
                <p className="card-text">
                    <small className="text-muted">{created_at}</small>
                </p>
            </div>
            <div className="card-footer">
                <div className="container">
                    <center>
                        <div
                            className="container"
                            style={{ border: "1px solid black", width: "15%" }}
                            onClick={toggle}
                        >
                            {!like ? (
                                <FontAwesomeIcon icon={faHeart} />
                            ) : (
                                <FontAwesomeIcon icon={faHeartBroken} />
                            )}
                        </div>
                    </center>
                </div>
            </div>
        </div>
    );
};

export default Article;
