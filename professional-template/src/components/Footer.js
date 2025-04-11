// professional-template/src/components/Footer.js
import React from 'react';

const Footer = ({ name }) => {
  const currentYear = new Date().getFullYear();
  
  // Handle scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <footer className="wp-footer">
      <div className="container">
        <div className="wp-footer-widgets">
          <div className="wp-footer-widget">
            <div className="wp-footer-logo">
              <div className="wp-logo">{name.charAt(0)}</div>
              <div className="wp-site-title">{name.split(' ')[0]}'s Portfolio</div>
            </div>
            <p className="wp-footer-tagline">
              Professional portfolio showcasing my work, skills, and experience.
            </p>
          </div>
          
          <div className="wp-footer-widget">
            <h3 className="wp-footer-widget-title">Navigation</h3>
            <ul className="wp-footer-menu">
              <li><a href="#profile">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#experience">Experience</a></li>
              <li><a href="#education">Education</a></li>
              <li><a href="#skills">Skills</a></li>
              <li><a href="#portfolio">Portfolio</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          
          <div className="wp-footer-widget">
            <h3 className="wp-footer-widget-title">Connect</h3>
            <div className="wp-footer-social">
              <a href="#" className="wp-social-link" aria-label="LinkedIn">in</a>
              <a href="#" className="wp-social-link" aria-label="GitHub">GH</a>
              <a href="#" className="wp-social-link" aria-label="Twitter">T</a>
            </div>
            <p className="wp-footer-contact">
              Email: <a href="mailto:contact@example.com">contact@example.com</a><br />
              Phone: <a href="tel:1234567890">123-456-7890</a>
            </p>
          </div>
        </div>
        
        <div className="wp-footer-bottom">
          <p className="wp-copyright">
            &copy; {currentYear} {name}. All rights reserved.
          </p>
          <p className="wp-footer-credits">
            Powered by Professional Resume Generator
          </p>
        </div>
        
        <button 
          className="wp-to-top" 
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          ↑
        </button>
      </div>
    </footer>
  );
};

export default Footer;