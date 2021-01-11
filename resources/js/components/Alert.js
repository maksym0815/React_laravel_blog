import React from "react";

const Alert = () => {
    return (
        <div className="alert alert-info" role="alert">
            <h4 className="alert-heading">Welcome!</h4>
            <p>Select an article from the right column.</p>
            <hr />
            <p className="mb-0">You can make your own articles too!.</p>
        </div>
    );
};

export default Alert;
