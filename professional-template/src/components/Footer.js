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
    <footer className="site-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <div className="brand">
              <span className="logo-initial">{name.charAt(0)}</span>
              <span className="brand-name">{name.split(' ')[0]}</span>
            </div>
            <p className="footer-tagline">Professional Portfolio</p>
          </div>
          
          <div className="footer-links">
            <div className="footer-nav">
              <h4>Navigation</h4>
              <ul>
                <li><a href="#profile">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#experience">Experience</a></li>
                <li><a href="#education">Education</a></li>
                <li><a href="#skills">Skills</a></li>
                <li><a href="#portfolio">Portfolio</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            
            <div className="footer-social">
              <h4>Connect</h4>
              <div className="social-links">
                <a href="#" className="social-link" aria-label="LinkedIn">
                  <i className="social-icon linkedin">in</i>
                </a>
                <a href="#" className="social-link" aria-label="GitHub">
                  <i className="social-icon github">GH</i>
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <i className="social-icon twitter">T</i>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="copyright">
            &copy; {currentYear} {name}. All rights reserved.
          </p>
          <p className="attribution">
            Generated with Professional Resume Generator
          </p>
        </div>
        
        <button 
          className="back-to-top" 
          onClick={scrollToTop}
          aria-label="Back to top"
        >
          <span>↑</span>
        </button>
      </div>
    </footer>
  );
};

export default Footer;