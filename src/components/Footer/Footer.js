import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Contact Information */}
        <div className="footer-section contact-info">
          <h4>Contact Us</h4>
          <p>Email: support@yogaedashboard.com</p>
          <p>Contact No: +1 234 567 890</p>
          <p>Toll-Free: 1800-YOGA-HELP</p>
        </div>

        {/* Social Media Links */}
        <div className="footer-section social-media">
          <h4>Follow Us</h4>
          <a href="https://facebook.com" target="_blank" rel="noreferrer">
            <img src="https://static.vecteezy.com/system/resources/previews/041/643/208/non_2x/facebook-logo-facebook-icon-transparent-white-background-free-png.png" alt="Facebook" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer">
            <img src="https://img.freepik.com/premium-photo/twitter-logo-icon-illustration-vector_895118-5886.jpg?size=338&ext=jpg&ga=GA1.1.1819120589.1728086400&semt=ais_hybrid" alt="Twitter" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOPHNIADKj_AmVxGiQO65lQCnJKhyf7Qx7GA&s" alt="Instagram" />
          </a>
        </div>

        {/* Useful Links */}
        <div className="footer-section useful-links">
          <h4>Useful Links</h4>
          <ul>
            <li><a href="/about-us">About Us</a></li>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="/terms-of-service">Terms of Service</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="footer-bottom">
        <p>&copy; 2024 Yoga E-Dashboard. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
