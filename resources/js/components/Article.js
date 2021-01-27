import React, { useState, useEffect } from "react";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeartBroken } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Http from "../Http";

const api = "/api/v1/like";

const Article = ({ article }) => {
    const { id, title, content, image_url, created_at, slug } = article;
    const [like, setLike] = useState(false);
    const [error, setError] = useState(false);
    const [dataState, setData] = useState({});

    useEffect(() => {
        if (id) {
            Http.get(`${api}/${id}`)
                .then((response) => {
                    const { data } = response.data;
                    console.log(data);
                    setData(data);
                    setLike(data?.like ?? false);
                    setError(false);
                })
                .catch((err) => {
                    console.log(err);
                    setLike(false);
                });
        }
    }, [id]);

    const toggle = () => {
        setLike(!like);
        setData({ like: !like, ...dataState });
        let objRequest = { like: !like, article_id: id, ...dataState };

        if (dataState?.id) {
            Http.patch(`${api}/${dataState.id}`, objRequest)
                .then((response) => {
                    console.log(response);
                    setError(false);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            Http.post(api, objRequest)
                .then(({ response }) => {
                    setData({ id: response.id, ...dataState });
                    setError(false);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
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
                            {like ? (
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
