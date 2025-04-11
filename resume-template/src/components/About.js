// resume-template/src/components/About.js
import React from 'react';

const About = ({ name, education, contact }) => {
  // Extract first name
  const firstName = name.split(' ')[0];
  
  // Get education details - now properly handles multiple education items
  const hasEducation = education && education.length > 0;
  
  // Get most recent graduation year for the experience badge
  const getMostRecentGradYear = () => {
    if (!hasEducation) return "";
    
    let mostRecentYear = "";
    education.forEach(edu => {
      const yearMatch = edu.graduation_date.match(/\d{4}/);
      if (yearMatch) {
        const year = yearMatch[0];
        if (!mostRecentYear || parseInt(year) > parseInt(mostRecentYear)) {
          mostRecentYear = year;
        }
      }
    });
    
    return mostRecentYear;
  };

  return (
    <section id="about" className="about-section">
      <div className="container">
        <div className="section-header">
          <h2>About Me</h2>
          <div className="section-bar"></div>
        </div>
        
        <div className="about-content">
          <div className="about-image">
            <div className="image-frame">
              <div className="profile-placeholder">
                <span>{name.charAt(0)}</span>
              </div>
            </div>
            <div className="experience-badge">
              <span className="experience-number">
                {getMostRecentGradYear()}
              </span>
              <span className="experience-text">GRAD</span>
            </div>
          </div>
          
          <div className="about-text">
            <h3>Who am I?</h3>
            <p className="intro-paragraph">
              I'm <strong>{name}</strong>, a passionate {hasEducation ? education[0].degree : 'Computer Science'} graduate
              {hasEducation ? ` from ${education[0].institution}` : ''}. 
              I specialize in building robust applications and solving complex problems through innovative technology solutions.
            </p>
            
            <p>
              Based in {contact.location}, I'm committed to creating clean, efficient, and user-centric applications. 
              My passion for technology drives me to continuously expand my knowledge and skills in the ever-evolving tech landscape.
            </p>
            
            {hasEducation && (
              <div className="education-highlight">
                <h4>Education</h4>
                <div className="education-list">
                  {education.map((edu, index) => (
                    <div 
                      className="education-card" 
                      key={index} 
                      style={{marginTop: index > 0 ? '20px' : '0', 
                             paddingTop: index > 0 ? '20px' : '0',
                             borderTop: index > 0 ? '1px solid var(--light-dark)' : 'none'}}
                    >
                      <div className="education-icon">
                        <i className="edu-icon">🎓</i>
                      </div>
                      <div className="education-details">
                        <h5>{edu.institution}</h5>
                        <p className="degree">{edu.degree}</p>
                        <p className="graduation">Graduation: {edu.graduation_date}</p>
                        {edu.gpa && <p className="gpa">GPA: {edu.gpa}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="personal-info">
              <div className="info-item">
                <span className="info-label">Location:</span>
                <span className="info-value">{contact.location}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{contact.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Phone:</span>
                <span className="info-value">{contact.phone}</span>
              </div>
            </div>
            
            <a href="#contact" className="contact-link" onClick={(e) => {
              e.preventDefault();
              document.getElementById('contact').scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}>
              Let's Connect
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;