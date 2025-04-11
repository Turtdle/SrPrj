// professional-template/src/components/Header.js
import React, { useState, useEffect } from 'react';

const Header = ({ name, activeSection, menuOpen, toggleMenu }) => {
  const [scrolled, setScrolled] = useState(false);
  const firstName = name.split(' ')[0];
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Navigate to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
    
    // Close menu if open
    if (menuOpen) toggleMenu();
  };
  
  return (
    <header className={`wp-admin-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="wp-admin-header-content">
          <div className="wp-brand">
            <a href="#profile" onClick={() => scrollToSection('profile')}>
              <div className="wp-logo">{name.charAt(0)}</div>
              <div className="wp-site-title">{firstName}'s Portfolio</div>
            </a>
          </div>
          
          <nav className="wp-admin-nav">
            <ul>
              <li>
                <a 
                  href="#profile"
                  className={activeSection === 'profile' ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('profile');
                  }}
                >
                  Home
                </a>
              </li>
              <li>
                <a 
                  href="#about"
                  className={activeSection === 'about' ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('about');
                  }}
                >
                  About
                </a>
              </li>
              <li>
                <a 
                  href="#experience"
                  className={activeSection === 'experience' ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('experience');
                  }}
                >
                  Experience
                </a>
              </li>
              <li>
                <a 
                  href="#education"
                  className={activeSection === 'education' ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('education');
                  }}
                >
                  Education
                </a>
              </li>
              <li>
                <a 
                  href="#skills"
                  className={activeSection === 'skills' ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('skills');
                  }}
                >
                  Skills
                </a>
              </li>
              <li>
                <a 
                  href="#portfolio"
                  className={activeSection === 'portfolio' ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('portfolio');
                  }}
                >
                  Portfolio
                </a>
              </li>
              <li>
                <a 
                  href="#contact"
                  className={activeSection === 'contact' ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('contact');
                  }}
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>
          
          <button 
            className={`wp-menu-toggle ${menuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        
        <nav className={`wp-mobile-nav ${menuOpen ? 'open' : ''}`}>
          <ul>
            <li>
              <a 
                href="#profile"
                className={activeSection === 'profile' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('profile');
                }}
              >
                Home
              </a>
            </li>
            <li>
              <a 
                href="#about"
                className={activeSection === 'about' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('about');
                }}
              >
                About
              </a>
            </li>
            <li>
              <a 
                href="#experience"
                className={activeSection === 'experience' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('experience');
                }}
              >
                Experience
              </a>
            </li>
            <li>
              <a 
                href="#education"
                className={activeSection === 'education' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('education');
                }}
              >
                Education
              </a>
            </li>
            <li>
              <a 
                href="#skills"
                className={activeSection === 'skills' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('skills');
                }}
              >
                Skills
              </a>
            </li>
            <li>
              <a 
                href="#portfolio"
                className={activeSection === 'portfolio' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('portfolio');
                }}
              >
                Portfolio
              </a>
            </li>
            <li>
              <a 
                href="#contact"
                className={activeSection === 'contact' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('contact');
                }}
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;