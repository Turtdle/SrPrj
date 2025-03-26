// resume-template/src/components/About.js
import React from 'react';

const About = ({ name, education, contact }) => {
  // Extract first name
  const firstName = name.split(' ')[0];
  
  // Get education details
  const universityEducation = education && education.length > 0 ? education[0] : null;
  
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
              <span className="experience-number">{education && education.length > 0 ? education[0].graduation_date.slice(-4) : ""}</span>
              <span className="experience-text">GRAD</span>
            </div>
          </div>
          
          <div className="about-text">
            <h3>Who am I?</h3>
            <p className="intro-paragraph">
              I'm <strong>{name}</strong>, a passionate {universityEducation ? universityEducation.degree : 'Computer Science'} graduate{universityEducation ? ` from ${universityEducation.institution}` : ''}. 
              I specialize in building robust applications and solving complex problems through innovative technology solutions.
            </p>
            
            <p>
              Based in {contact.location}, I'm committed to creating clean, efficient, and user-centric applications. 
              My passion for technology drives me to continuously expand my knowledge and skills in the ever-evolving tech landscape.
            </p>
            
            {universityEducation && (
              <div className="education-highlight">
                <h4>Education</h4>
                <div className="education-card">
                  <div className="education-icon">
                    <i className="edu-icon">🎓</i>
                  </div>
                  <div className="education-details">
                    <h5>{universityEducation.institution}</h5>
                    <p className="degree">{universityEducation.degree}</p>
                    <p className="graduation">Graduation: {universityEducation.graduation_date}</p>
                    {universityEducation.gpa && <p className="gpa">GPA: {universityEducation.gpa}</p>}
                  </div>
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