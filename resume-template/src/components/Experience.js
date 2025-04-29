// resume-template/src/components/Experience.js
import React, { useState } from 'react';

const Experience = ({ experiences }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Return early if no experiences are provided
  if (!experiences || !experiences.length) {
    return (
      <section id="experience" className="experience-section">
        <div className="container">
          <div className="section-header">
            <h2>Experience</h2>
            <div className="section-bar"></div>
          </div>
          <div className="no-experience">
            <p>No work experience information available.</p>
          </div>
        </div>
      </section>
    );
  }

  const handleExperienceClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <section id="experience" className="experience-section">
      <div className="container">
        <div className="section-header">
          <h2>Experience</h2>
          <div className="section-bar"></div>
        </div>
        
        <div className="experience-container">
          <div className="experience-tabs">
            {experiences.map((exp, index) => (
              <div 
                key={index} 
                className={`experience-tab ${index === activeIndex ? 'active' : ''}`}
                onClick={() => handleExperienceClick(index)}
              >
                <div className="tab-content">
                  <div className="company-name">{exp.company}</div>
                  <div className="position-title">{exp.position}</div>
                </div>
                <div className="experience-indicator"></div>
              </div>
            ))}
          </div>
          
          <div className="experience-details">
            {experiences[activeIndex] && (
              <div className="experience-card" key={activeIndex}>
                <div className="experience-header">
                  <div className="experience-title">
                    <h3>{experiences[activeIndex].position}</h3>
                    <div className="company">{experiences[activeIndex].company}</div>
                  </div>
                  <div className="experience-meta">
                    <div className="duration">
                      <i className="duration-icon">⏱️</i>
                      <span>{experiences[activeIndex].duration}</span>
                    </div>
                    <div className="location">
                      <i className="location-icon">📍</i>
                      <span>{experiences[activeIndex].location}</span>
                    </div>
                  </div>
                </div>
                
                <div className="responsibilities">
                  <h4>Key Responsibilities</h4>
                  <ul>
                    {experiences[activeIndex].responsibilities.map((resp, respIndex) => (
                      <li key={respIndex}>
                        <div className="responsibility-bullet"></div>
                        <div className="responsibility-text">{resp}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;