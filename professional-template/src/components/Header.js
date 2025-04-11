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
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          <div className="brand">
            <a href="#profile" onClick={() => scrollToSection('profile')}>
              <span className="logo-initial">{name.charAt(0)}</span>
              <span className="brand-name">{firstName}<span className="brand-last">Portfolio</span></span>
            </a>
          </div>
          
          <nav className="desktop-nav">
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
          
          <div 
            className={`mobile-menu-toggle ${menuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        
        <nav className={`mobile-nav ${menuOpen ? 'open' : ''}`}>
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