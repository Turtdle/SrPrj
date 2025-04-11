// professional-template/src/components/Profile.js
import React, { useEffect, useRef } from 'react';

const Profile = ({ name, contact, education }) => {
  const typingTextRef = useRef(null);
  
  // Generate professional titles based on education if available
  const generateTitles = () => {
    const defaultTitles = [
      "Professional Portfolio",
      "Digital Curriculum Vitae", 
      "Career Showcase"
    ];
    
    if (!education || education.length === 0) {
      return defaultTitles;
    }
    
    const educationTitles = [];
    
    // Generate titles based on highest education (assuming first is most recent)
    education.forEach(edu => {
      const degreeLower = edu.degree.toLowerCase();
      
      if (degreeLower.includes('computer science') || degreeLower.includes('software')) {
        educationTitles.push("Software Professional");
      }
      
      if (degreeLower.includes('master')) {
        educationTitles.push(`M${degreeLower.includes('science') ? 'S' : 'A'} Graduate`);
      } else if (degreeLower.includes('phd') || degreeLower.includes('doctor')) {
        educationTitles.push("PhD Professional");
      } else if (degreeLower.includes('bachelor')) {
        educationTitles.push(`B${degreeLower.includes('science') ? 'S' : 'A'} Graduate`);
      }
      
      // Add field-specific titles
      if (degreeLower.includes('artificial intelligence') || degreeLower.includes('ai')) {
        educationTitles.push("AI Specialist");
      } else if (degreeLower.includes('data')) {
        educationTitles.push("Data Professional");
      } else if (degreeLower.includes('engineering')) {
        educationTitles.push("Engineering Professional");
      } else if (degreeLower.includes('business')) {
        educationTitles.push("Business Professional");
      } else if (degreeLower.includes('marketing')) {
        educationTitles.push("Marketing Professional");
      }
    });
    
    // Return unique titles, with fallback to default titles if none generated
    const uniqueTitles = [...new Set(educationTitles)];
    return uniqueTitles.length > 0 ? uniqueTitles : defaultTitles;
  };
  
  const titles = generateTitles();
  
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
  }, [titles]);
  
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
  
  // Generate a professional description based on education
  const getDescription = () => {
    if (!education || education.length === 0) {
      return `A passionate professional based in ${contact.location}. I specialize in crafting exceptional digital experiences and innovative solutions.`;
    }
    
    // Get highest degree (assuming first in array is most recent/highest)
    const highestDegree = education[0].degree;
    const highestSchool = education[0].institution;
    
    // If they have multiple degrees, mention that
    const multipleDegreesText = education.length > 1 
      ? ` with multiple degrees including a ${education.map(e => e.degree.split(' ')[0]).join(' and a ')}`
      : '';
    
    return `A passionate professional based in ${contact.location}${multipleDegreesText}. I bring a strong educational background from ${highestSchool} to delivering exceptional solutions in my field.`;
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
              {getDescription()}
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