import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} AnimeMood. All rights reserved.</p>
        <div className="footer-links">
          <Link to="/about" className="footer-link">
            About Us
          </Link>
          <a href="/contact" className="footer-link">
            Contact
          </a>
          <a href="/privacy" className="footer-link">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
