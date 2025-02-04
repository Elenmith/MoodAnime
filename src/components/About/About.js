import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="about-container">
      <div className="about-content">
        <h1>About me</h1>
        <p>Hi! I'm Radek, a programmer and designer who created this project. I love building modern web applications, combining code with aesthetics and usability.</p>
        
        <h2>My skills</h2>
        <ul>
          <li>⚡ Frontend: React, JavaScript, HTML, CSS</li>
          <li>⚡ Backend: Node.js, Express, MongoDB</li>
          <li>⚡ UI/UX: Design interfaces, Figma</li>
        </ul>

        <h2>Contact</h2>
        <p>Want to talk? You can find me here:</p>
        <a href="https://github.com/Elenmith" target="_blank" rel="noopener noreferrer">GitHub</a>
      </div>
    </div>
  );
};

export default About;
