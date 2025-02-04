import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="about-container">
      <div className="about-content">
        <h1>O mnie</h1>
        <p>Cześć! Jestem [Twoje Imię], programistą i designerem, który stworzył ten projekt. Uwielbiam tworzyć nowoczesne aplikacje webowe, łącząc kod z estetyką i użytecznością.</p>
        
        <h2>Moje umiejętności</h2>
        <ul>
          <li>⚡ Frontend: React, JavaScript, HTML, CSS</li>
          <li>⚡ Backend: Node.js, Express, MongoDB</li>
          <li>⚡ UI/UX: Projektowanie interfejsów, Figma</li>
        </ul>

        <h2>Kontakt</h2>
        <p>Chcesz porozmawiać? Znajdziesz mnie tutaj:</p>
        <a href="https://github.com/TWOJ_GITHUB" target="_blank" rel="noopener noreferrer">GitHub</a>
      </div>
    </div>
  );
};

export default About;
