import React, { useState, useEffect } from "react";
import Http from "../Http";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

const api = "/api/v1/comments";

const CommentBox = (props) => {
    const [dataState, setData] = useState([]);
    const [error, setError] = useState(false);

    const { article_id } = props;

    useEffect(() => {
        Http.get(`${api}/${article_id}`)
            .then((response) => {
                const { data } = response.data;
                console.log(data);
                setData(data);
                setError(false);
            })
            .catch((err) => {
                setError("Unable to fetch data.");
            });
    }, []);

    return (
        <div className="container py-5">
            <h1 className="text-center mb-4">Comments</h1>
            <div className="row">
                <div className="col">
                    <CommentForm
                        dataState={dataState}
                        setData={setData}
                        article_id={article_id}
                    />
                </div>
                <div className="col">
                    <CommentList comments={dataState} />
                </div>
            </div>
        </div>
    );
};

export default CommentBox;
