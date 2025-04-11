// resume-template/src/components/Education.js
import React, { useState } from 'react';

const Education = ({ education }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Handle case where no education data is provided
  if (!education || education.length === 0) {
    return (
      <section id="education" className="education-section">
        <div className="container">
          <div className="section-header">
            <h2>Education</h2>
            <div className="section-bar"></div>
          </div>
          <div className="no-education">
            <p>No education information available.</p>
          </div>
        </div>
      </section>
    );
  }

  const handleEducationClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <section id="education" className="education-section">
      <div className="container">
        <div className="section-header">
          <h2>Education</h2>
          <div className="section-bar"></div>
        </div>
        
        <div className="education-container">
          <div className="education-tabs">
            {education.map((edu, index) => (
              <div 
                key={index} 
                className={`education-tab ${index === activeIndex ? 'active' : ''}`}
                onClick={() => handleEducationClick(index)}
              >
                <div className="tab-content">
                  <div className="institution-name">{edu.institution}</div>
                  <div className="degree-title">{edu.degree.split(' ')[0]}</div>
                </div>
                <div className="education-indicator"></div>
              </div>
            ))}
          </div>
          
          <div className="education-details">
            {education[activeIndex] && (
              <div className="education-card" key={activeIndex}>
                <div className="education-header">
                  <div className="education-title">
                    <h3>{education[activeIndex].degree}</h3>
                    <div className="institution">{education[activeIndex].institution}</div>
                  </div>
                  <div className="education-meta">
                    <div className="graduation">
                      <i className="graduation-icon">📅</i>
                      <span>{education[activeIndex].graduation_date}</span>
                    </div>
                    {education[activeIndex].gpa && (
                      <div className="gpa">
                        <i className="gpa-icon">📊</i>
                        <span>GPA: {education[activeIndex].gpa}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {education[activeIndex].relevant_coursework && 
                 education[activeIndex].relevant_coursework.length > 0 && (
                  <div className="coursework">
                    <h4>Relevant Coursework</h4>
                    <ul>
                      {education[activeIndex].relevant_coursework.map((course, courseIndex) => (
                        <li key={courseIndex}>
                          <div className="course-bullet"></div>
                          <div className="course-text">{course}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;