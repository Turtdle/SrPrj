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
    // Ensure ref is attached and titles exist and are not empty
    if (!typingTextRef.current || !titles || titles.length === 0) {
      console.warn("Typing effect: Ref not available or no titles provided.");
      return; // Exit if no ref or no titles
    }

    let currentTitleIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typingSpeed = 150;
    let timeoutId = null; // Use a variable accessible within the effect's scope

    const type = () => {
      // --- Safety Check ---
      // Crucial: Check if the ref is still valid *inside* the timeout callback.
      // The component could have unmounted between scheduling and execution.
      if (!typingTextRef.current) {
        return; // Stop if the element is gone
      }

      const currentTitle = titles[currentTitleIndex];

      // Determine next text content and index
      if (isDeleting) {
        // Deleting
        typingTextRef.current.textContent = currentTitle.substring(0, currentCharIndex - 1);
        currentCharIndex--;
        typingSpeed = 50; // Faster deleting speed
      } else {
        // Typing
        typingTextRef.current.textContent = currentTitle.substring(0, currentCharIndex + 1);
        currentCharIndex++;
        typingSpeed = 150; // Normal typing speed
      }

      // --- State Transition Logic ---
      // Check if current action (typing/deleting) is complete
      if (!isDeleting && currentCharIndex === currentTitle.length) {
        // Finished typing the word
        isDeleting = true;
        typingSpeed = 1500; // Pause after typing before deleting
      } else if (isDeleting && currentCharIndex === 0) {
        // Finished deleting the word
        isDeleting = false;
        currentTitleIndex = (currentTitleIndex + 1) % titles.length; // Move to next title
        typingSpeed = 500; // Pause after deleting before typing next word
      }

      // Schedule the next step *and store its ID*
      timeoutId = setTimeout(type, typingSpeed);
    };

    // Start the effect after an initial delay (and store the ID)
    timeoutId = setTimeout(type, 1000); // Initial delay before starting

    // --- Cleanup Function ---
    return () => {
      // This function runs when the component unmounts or dependencies change.
      // Clear the *last scheduled* timeout.
      clearTimeout(timeoutId);

      // Optional: You might want to clear the text content on cleanup too
      // if (typingTextRef.current) {
      //   typingTextRef.current.textContent = '';
      // }
    };

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
          

        </div>
      </div>
    </section>
  );
};

export default Profile;