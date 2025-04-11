// professional-template/src/components/Education.js
import React from 'react';

const Education = ({ education }) => {
  // Handle empty education array
  if (!education || !education.length) {
    return (
      <section id="education" className="wp-education-section">
        <div className="container">
          <div className="wp-section-header">
            <h2>Educational Background</h2>
            <p>Academic achievements and qualifications</p>
          </div>
          
          <div className="wp-card">
            <div className="wp-card-content">
              <p>No educational information available.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  // Function to determine the education type for styling
  const getEducationType = (degree) => {
    const degreeLower = degree.toLowerCase();
    if (degreeLower.includes('master') || degreeLower.includes('mba') || degreeLower.includes('ms') || degreeLower.includes('ma')) {
      return 'Masters';
    } else if (degreeLower.includes('phd') || degreeLower.includes('doctor') || degreeLower.includes('doctorate')) {
      return 'Doctorate';
    } else if (degreeLower.includes('bachelor') || degreeLower.includes('bs') || degreeLower.includes('ba')) {
      return 'Bachelors';
    } else if (degreeLower.includes('associate') || degreeLower.includes('as') || degreeLower.includes('aa')) {
      return 'Associates';
    } else if (degreeLower.includes('certificate') || degreeLower.includes('certification')) {
      return 'Certificate';
    } else {
      return 'Other';
    }
  };
  
  return (
    <section id="education" className="wp-education-section">
      <div className="container">
        <div className="wp-section-header">
          <h2>Educational Background</h2>
          <p>Academic achievements and qualifications</p>
        </div>
        
        <div className="wp-education-cards">
          {education.map((edu, index) => {
            const educationType = getEducationType(edu.degree);
            
            return (
              <div className="wp-education-card" key={index}>
                <div className="wp-education-icon">
                  <span>{educationType === 'Doctorate' ? '🎓' : educationType === 'Masters' ? '🎯' : '📚'}</span>
                </div>
                
                <div className="wp-education-content">
                  <div className="wp-education-date">{edu.graduation_date}</div>
                  <h3 className="wp-education-degree">{edu.degree}</h3>
                  <h4 className="wp-education-school">{edu.institution}</h4>
                  
                  {edu.gpa && (
                    <div className="wp-education-gpa">
                      <span className="gpa-label">GPA:</span> {edu.gpa}
                    </div>
                  )}
                  
                  {edu.relevant_coursework && edu.relevant_coursework.length > 0 && (
                    <div className="wp-education-courses">
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
            );
          })}
        </div>
        
        {education.length > 1 && (
          <div className="wp-notice" style={{marginTop: '40px'}}>
            <h3>Educational Journey</h3>
            <p>
              My academic background includes {education.length} degrees, reflecting my commitment to 
              continuous learning and comprehensive skill development. This diverse educational foundation has provided me 
              with a unique perspective that I bring to my professional work.
            </p>
          </div>
        )}
        
        {education.length === 1 && (
          <div className="wp-notice" style={{marginTop: '40px'}}>
            <h3>Commitment to Learning</h3>
            <p>
              Education has been the foundation of my professional development. I am committed to 
              continuous learning and regularly enhance my skills through professional development 
              opportunities, workshops, and industry certifications.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Education;