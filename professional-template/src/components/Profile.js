// professional-template/src/components/Profile.js
import React, { useEffect, useRef } from 'react';

const Profile = ({ name, contact }) => {
  const typingTextRef = useRef(null);
  
  // Professional titles based on experience data or default to generic professional titles
  const titles = [
    "Professional Portfolio",
    "Digital Curriculum Vitae", 
    "Career Showcase"
  ];
  
  useEffect(() => {
    if (!typingTextRef.current) return;
    
    let currentTitleIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typingSpeed = 150;
    
    const type = () => {
      const currentTitle = titles[currentTitleIndex];
      
      if (isDeleting) {
        typingTextRef.current.textContent = currentTitle.substring(0, currentCharIndex - 1);
        currentCharIndex--;
        typingSpeed = 50;
      } else {
        typingTextRef.current.textContent = currentTitle.substring(0, currentCharIndex + 1);
        currentCharIndex++;
        typingSpeed = 150;
      }
      
      if (!isDeleting && currentCharIndex === currentTitle.length) {
        isDeleting = true;
        typingSpeed = 1500; // Wait before deleting
      } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentTitleIndex = (currentTitleIndex + 1) % titles.length;
        typingSpeed = 500; // Wait before typing next title
      }
      
      setTimeout(type, typingSpeed);
    };
    
    const typingTimer = setTimeout(type, 1000);
    
    return () => clearTimeout(typingTimer);
  }, []);
  
  const handleContactClick = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      window.scrollTo({
        top: contactSection.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };
  
  const handleResumeClick = () => {
    // This would typically download a resume or open a modal
    alert('In a real implementation, this would download your resume or CV.');
  };
  
  return (
    <section id="profile" className="wp-profile-section">
      <div className="container">
        <div className="wp-profile-container">
          <div className="wp-profile-content">
            <div className="wp-profile-hello">Welcome, I'm</div>
            <h1 className="wp-profile-name">{name}</h1>
            <span className="wp-profile-title">
              <span ref={typingTextRef}></span><span className="cursor">|</span>
            </span>
            
            <p className="wp-profile-description">
              A passionate professional based in {contact.location}.
              I specialize in crafting exceptional digital experiences and
              innovative solutions.
            </p>
            
            <div className="wp-profile-buttons">
              <button className="wp-button wp-button-large" onClick={handleContactClick}>
                Get In Touch
              </button>
              <button className="wp-button wp-button-secondary wp-button-large" onClick={handleResumeClick}>
                Download CV
              </button>
            </div>
            
            <div className="wp-profile-social">
              <a href="#" className="wp-social-link" aria-label="LinkedIn">
                in
              </a>
              <a href="#" className="wp-social-link" aria-label="GitHub">
                GH
              </a>
              <a href="#" className="wp-social-link" aria-label="Twitter">
                T
              </a>
            </div>
          </div>
          
          <div className="wp-profile-image">
            <div className="wp-profile-avatar">
              <div className="wp-profile-initial">{name.charAt(0)}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;