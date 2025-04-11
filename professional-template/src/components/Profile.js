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
    <section id="profile" className="profile-section">
      <div className="container">
        <div className="profile-content">
          <div className="profile-text">
            <div className="profile-intro">Welcome, I'm</div>
            <h1 className="profile-name">{name}</h1>
            <div className="profile-titles">
              <span ref={typingTextRef}></span><span className="cursor">|</span>
            </div>
            
            <p className="profile-description">
              A passionate professional based in {contact.location}.
              I specialize in crafting exceptional digital experiences and
              innovative solutions.
            </p>
            
            <div className="profile-actions">
              <button className="btn btn-primary" onClick={handleContactClick}>
                Get In Touch
              </button>
              <button className="btn btn-outline" onClick={handleResumeClick}>
                Download CV
              </button>
            </div>
            
            <div className="profile-social">
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
          
          <div className="profile-image">
            <div className="profile-image-frame">
              <div className="profile-avatar">
                <div className="initial">{name.charAt(0)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="scroll-indicator">
        <div className="scroll-icon"></div>
        <span>Scroll Down</span>
      </div>
    </section>
  );
};

export default Profile;