// resume-template/src/components/Hero.js
import React, { useEffect, useRef } from 'react';

const Hero = ({ name, education }) => {
  const textRef = useRef(null);
  
  // Get highest degree from education
  const getHighestDegree = () => {
    if (!education || !education.length) return "Software Engineer";
    
    // Typically, master's or doctorate would be higher than bachelor's
    const degreePriority = {
      "doctorate": 4, 
      "phd": 4, 
      "doctor": 4,
      "master": 3,
      "ms": 3,
      "ma": 3,
      "bachelor": 2,
      "bs": 2,
      "ba": 2,
      "associate": 1,
      "as": 1,
      "aa": 1
    };
    
    let highestDegree = education[0].degree;
    let highestPriority = 0;
    
    education.forEach(edu => {
      const degreeLower = edu.degree.toLowerCase();
      
      // Check degree priority based on keywords
      for (const [keyword, priority] of Object.entries(degreePriority)) {
        if (degreeLower.includes(keyword) && priority > highestPriority) {
          highestDegree = edu.degree;
          highestPriority = priority;
        }
      }
    });
    
    return highestDegree;
  };
  
  const degree = getHighestDegree();

  useEffect(() => {
    // Simple typing animation for the role text
    const textElement = textRef.current;
    if (!textElement) return;
    
    const role = degree;
    let displayText = "";
    let i = 0;
    
    const typingInterval = setInterval(() => {
      if (i < role.length) {
        displayText += role.charAt(i);
        textElement.textContent = displayText;
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);
    
    return () => clearInterval(typingInterval);
  }, [degree]);

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      window.scrollTo({
        top: contactSection.offsetTop - 70,
        behavior: 'smooth'
      });
    }
  };

  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      window.scrollTo({
        top: projectsSection.offsetTop - 70,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="hero" className="hero-section">
      <div className="container hero-container">
        <div className="hero-content">
          <div className="animated-intro">
            <h1>
              <div className="hello-text">Hello, I'm</div>
              <div className="name-text">{name}</div>
              <div className="role-text">
                <span ref={textRef} className="typing-text"></span>
                <span className="cursor">|</span>
              </div>
            </h1>
            
            <div className="hero-details">
              <p>I build innovative digital solutions and create impactful technology.</p>
            </div>
            
            <div className="hero-buttons">
              <button 
                className="primary-btn" 
                onClick={scrollToContact}
              >
                Contact Me
              </button>
              <button 
                className="secondary-btn" 
                onClick={scrollToProjects}
              >
                View Projects
              </button>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="profile-shape">
              <span className="profile-initial">{name.charAt(0)}</span>
            </div>
            <div className="floating-shapes">
              <div className="shape shape-1"></div>
              <div className="shape shape-2"></div>
              <div className="shape shape-3"></div>
            </div>
          </div>
        </div>
        
        <div className="scroll-indicator">
          <div className="mouse">
            <div className="wheel"></div>
          </div>
          <div className="arrow-down">
            <span></span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;