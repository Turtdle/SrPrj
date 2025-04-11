import React from 'react';

const Education = ({ education }) => {
  // Handle empty education array
  if (!education || !education.length) {
    return (
      <section id="education" className="education-section section-alt">
        <div className="container">
          <div className="section-title">
            <h2>Educational Background</h2>
            <p>Academic achievements and qualifications</p>
          </div>
          
          <div className="no-content-message">
            <p>No educational information available.</p>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section id="education" className="education-section section-alt">
      <div className="container">
        <div className="section-title">
          <h2>Educational Background</h2>
          <p>Academic achievements and qualifications</p>
        </div>
        
        <div className="education-cards">
          {education.map((edu, index) => (
            <div className="education-card" key={index}>
              <div className="education-icon">
                <span className="icon">🎓</span>
              </div>
              
              <div className="education-content">
                <div className="education-period">{edu.graduation_date}</div>
                <h3 className="education-degree">{edu.degree}</h3>
                <h4 className="education-institution">{edu.institution}</h4>
                
                {edu.gpa && (
                  <div className="education-gpa">
                    <span className="gpa-label">GPA:</span> {edu.gpa}
                  </div>
                )}
                
                {edu.relevant_coursework && edu.relevant_coursework.length > 0 && (
                  <div className="education-coursework">
                    <h5>Relevant Coursework:</h5>
                    <ul className="coursework-list">
                      {edu.relevant_coursework.map((course, idx) => (
                        <li key={idx}>{course}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="education-note">
          <div className="note-content">
            <h3>Commitment to Learning</h3>
            <p>
              Education has been the foundation of my professional development. I am committed to 
              continuous learning and regularly enhance my skills through professional development 
              opportunities, workshops, and industry certifications.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;