import React from "react";
import "./Contact.css";

const Contact = () => {
  return (
    <div className="contact-container">
      <div className="about-content">
        <h1>
          Hi! If you want to contact us, you can use any of the links below, or
          write to me directly on email:{" "}
        </h1>
        <a href="https:/visiblify.com" target="_blank">
          Visiblify
        </a>
        <br></br>
        <a href="https:/github.com/Elenmith" target="_blank">
          Github
        </a>
        <p>radekkowalczyk247@gmail.com</p>
      </div>
    </div>
  );
};

export default Contact;
