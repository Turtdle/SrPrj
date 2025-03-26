// resume-template/src/components/Header.js
import React, { useState, useEffect } from 'react';

const Header = ({ name, activeSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 70,
        behavior: 'smooth'
      });
    }
    setMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuOpen && e.target.closest('.mobile-menu-btn') === null && 
          e.target.closest('.mobile-menu') === null) {
        setMenuOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [menuOpen]);

  return (
    <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        <div className="logo">
          <span className="name-initial">{name.charAt(0)}</span>
          <span className="full-name">{name.split(' ')[0]}</span>
        </div>

        <nav className="desktop-nav">
          <ul>
            <li><a 
              href="#hero" 
              className={activeSection === 'hero' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}
            >Home</a></li>
            <li><a 
              href="#about" 
              className={activeSection === 'about' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}
            >About</a></li>
            <li><a 
              href="#experience" 
              className={activeSection === 'experience' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); scrollToSection('experience'); }}
            >Experience</a></li>
            <li><a 
              href="#projects" 
              className={activeSection === 'projects' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); scrollToSection('projects'); }}
            >Projects</a></li>
            <li><a 
              href="#skills" 
              className={activeSection === 'skills' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); scrollToSection('skills'); }}
            >Skills</a></li>
            <li><a 
              href="#contact" 
              className={activeSection === 'contact' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
            >Contact</a></li>
          </ul>
        </nav>

        <button 
          className="mobile-menu-btn"
          aria-label="Mobile Menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={`menu-icon ${menuOpen ? 'open' : ''}`}></span>
        </button>

        <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
          <ul>
            <li><a 
              href="#hero" 
              className={activeSection === 'hero' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}
            >Home</a></li>
            <li><a 
              href="#about" 
              className={activeSection === 'about' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}
            >About</a></li>
            <li><a 
              href="#experience" 
              className={activeSection === 'experience' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); scrollToSection('experience'); }}
            >Experience</a></li>
            <li><a 
              href="#projects" 
              className={activeSection === 'projects' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); scrollToSection('projects'); }}
            >Projects</a></li>
            <li><a 
              href="#skills" 
              className={activeSection === 'skills' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); scrollToSection('skills'); }}
            >Skills</a></li>
            <li><a 
              href="#contact" 
              className={activeSection === 'contact' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
            >Contact</a></li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;