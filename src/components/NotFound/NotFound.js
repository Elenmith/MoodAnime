import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found__content">
        <img
          src="/images/sad-anime.png" // wrzuć np. do public/images/
          alt="Sad chibi character"
          className="not-found__image"
        />
        <h1>404 - Page Not Found</h1>
        <p>Looks like this anime got lost in another dimension...</p>
        <Link to="/" className="not-found__button">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
