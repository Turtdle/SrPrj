import React from 'react';

const Experience = ({ experiences }) => {
  // Function to handle empty experience array
  if (!experiences || !experiences.length) {
    return (
      <section id="experience" className="experience-section">
        <div className="container">
          <div className="section-title">
            <h2>Professional Experience</h2>
            <p>My professional journey and career highlights</p>
          </div>
          
          <div className="no-content-message">
            <p>No professional experience information available.</p>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section id="experience" className="experience-section">
      <div className="container">
        <div className="section-title">
          <h2>Professional Experience</h2>
          <p>My professional journey and career highlights</p>
        </div>
        
        <div className="timeline">
          {experiences.map((exp, index) => (
            <div className="timeline-item" key={index}>
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <span className="timeline-date">{exp.duration}</span>
                <h3 className="timeline-title">{exp.position}</h3>
                <h4 className="timeline-subtitle">{exp.company}</h4>
                <p className="timeline-location">{exp.location}</p>
                
                <div className="responsibilities">
                  <h5>Key Responsibilities:</h5>
                  <ul>
                    {exp.responsibilities.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="experience-summary">
          <div className="summary-content">
            <h3>Professional Approach</h3>
            <p>
              Throughout my career, I've consistently demonstrated a commitment to excellence, 
              adaptability, and continuous improvement. My professional experiences have equipped 
              me with a unique set of skills and perspectives that I bring to every new challenge.
            </p>
            <a href="#contact" className="btn btn-primary">Discuss Opportunities</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;