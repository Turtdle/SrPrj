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
        
        {/* Full Education Section */}
        {hasEducation && (
          <div className="education-section">
            <div className="section-header" style={{marginTop: '60px', marginBottom: '30px'}}>
              <h2>Education</h2>
              <div className="section-bar"></div>
            </div>
            
            <div className="education-container">
              {education.map((edu, index) => (
                <div className="education-card" key={index} style={{
                  background: 'var(--white)',
                  borderRadius: 'var(--border-radius)',
                  padding: '25px',
                  boxShadow: 'var(--box-shadow)',
                  marginBottom: '25px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '20px',
                  transition: 'all 0.3s ease'
                }}>
                  <div className="education-icon" style={{
                    width: '50px',
                    height: '50px',
                    background: 'var(--light)',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '1.5rem',
                    flexShrink: '0'
                  }}>
                    <i className="edu-icon">🎓</i>
                  </div>
                  
                  <div className="education-details" style={{
                    flex: '1'
                  }}>
                    <h4 style={{
                      color: 'var(--dark)',
                      marginBottom: '8px',
                      fontSize: '1.3rem'
                    }}>{edu.institution}</h4>
                    <p className="degree" style={{
                      color: 'var(--primary)',
                      fontWeight: '500',
                      marginBottom: '10px'
                    }}>{edu.degree}</p>
                    <p className="graduation" style={{
                      color: 'var(--text-light)',
                      marginBottom: '5px'
                    }}>Graduation: {edu.graduation_date}</p>
                    {edu.gpa && <p className="gpa" style={{
                      color: 'var(--text-light)'
                    }}>GPA: {edu.gpa}</p>}
                    
                    {edu.relevant_coursework && edu.relevant_coursework.length > 0 && (
                      <div className="coursework" style={{marginTop: '15px'}}>
                        <h5 style={{marginBottom: '10px', color: 'var(--dark)'}}>Relevant Coursework:</h5>
                        <ul style={{paddingLeft: '20px'}}>
                          {edu.relevant_coursework.map((course, courseIndex) => (
                            <li key={courseIndex} style={{marginBottom: '5px', color: 'var(--text-light)'}}>{course}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default About;