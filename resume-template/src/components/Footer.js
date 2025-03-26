// resume-template/src/components/Footer.js
import React from 'react';

const Footer = ({ name }) => {
  const currentYear = new Date().getFullYear();
  
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
            <div className="logo">
              <span className="name-initial">{name.charAt(0)}</span>
              <span className="full-name">{name.split(' ')[0]}</span>
            </div>
            <p className="copyright">
              &copy; {currentYear} {name}. All rights reserved.
            </p>
          </div>
          
          <div className="footer-links">
            <div className="footer-nav">
              <h4>Navigation</h4>
              <ul>
                <li><a href="#hero">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#experience">Experience</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#skills">Skills</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            
            <div className="social-links">
              <h4>Connect</h4>
              <div className="social-icons">
                <a href="#" className="social-icon" aria-label="LinkedIn">
                  <i>in</i>
                </a>
                <a href="#" className="social-icon" aria-label="GitHub">
                  <i>GH</i>
                </a>
                <a href="#" className="social-icon" aria-label="Twitter">
                  <i>T</i>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="scroll-to-top" onClick={scrollToTop}>
          <span>↑</span>
        </div>
        
        <div className="footer-attribution">
          <p>Generated with Resume Website Generator</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;