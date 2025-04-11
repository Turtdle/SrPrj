// resume-template/src/components/Education.js
import React from 'react';

const Education = ({ education }) => {
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

  return (
    <section id="education" className="education-section">
      <div className="container">
        <div className="section-header">
          <h2>Education</h2>
          <div className="section-bar"></div>
        </div>
        
        <div className="education-container">
          {education.map((edu, index) => (
            <div className="education-item" key={index}>
              <div className="education-icon">
                <div className="icon-container">🎓</div>
              </div>
              
              <div className="education-content">
                <h3 className="institution">{edu.institution}</h3>
                <div className="degree">{edu.degree}</div>
                <div className="education-meta">
                  <div className="graduation-date">
                    <i className="date-icon">📅</i>
                    <span>{edu.graduation_date}</span>
                  </div>
                  {edu.gpa && (
                    <div className="gpa">
                      <i className="gpa-icon">📊</i>
                      <span>GPA: {edu.gpa}</span>
                    </div>
                  )}
                </div>
                
                {edu.relevant_coursework && edu.relevant_coursework.length > 0 && (
                  <div className="coursework">
                    <h4>Relevant Coursework</h4>
                    <ul>
                      {edu.relevant_coursework.map((course, courseIndex) => (
                        <li key={courseIndex}>
                          <div className="course-bullet"></div>
                          <div className="course-name">{course}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;