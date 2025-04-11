import React, { useState, useEffect, useRef } from 'react';

const Skills = ({ skills }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  
  // Set up intersection observer to trigger animations when section becomes visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  // Check if we have skills to display
  const hasLanguages = skills && skills.languages && skills.languages.length > 0;
  const hasTools = skills && skills.tools && skills.tools.length > 0;
  
  if (!hasLanguages && !hasTools) {
    return (
      <section id="skills" className="skills-section">
        <div className="container">
          <div className="section-title">
            <h2>Professional Skills</h2>
            <p>Expertise and technical competencies</p>
          </div>
          
          <div className="no-content-message">
            <p>No skills information available.</p>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section id="skills" className="skills-section" ref={sectionRef}>
      <div className="container">
        <div className="section-title">
          <h2>Professional Skills</h2>
          <p>Expertise and technical competencies</p>
        </div>
        
        <div className="skills-content">
          {hasLanguages && (
            <div className="skills-category">
              <h3>Languages</h3>
              <div className="skills-group">
                {skills.languages.map((lang, index) => (
                  <div className="progress-container" key={index}>
                    <div className="progress-label">
                      <span>{lang}</span>
                      <span className="progress-percent">
                        {/* We can use a random value between 80-100 for visual effect */}
                        {Math.floor(Math.random() * 20) + 80}%
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: isVisible 
                            ? `${Math.floor(Math.random() * 20) + 80}%` 
                            : '0%' 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {hasTools && (
            <div className="skills-category">
              <h3>Tools & Technologies</h3>
              <div className="skills-group">
                {skills.tools.map((tool, index) => (
                  <div className="progress-container" key={index}>
                    <div className="progress-label">
                      <span>{tool}</span>
                      <span className="progress-percent">
                        {Math.floor(Math.random() * 20) + 80}%
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: isVisible 
                            ? `${Math.floor(Math.random() * 20) + 80}%` 
                            : '0%' 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="skills-supplements">
          <div className="supplements-content">
            <h3>Professional Development</h3>
            <p>
              I continuously enhance my skill set through regular professional development, 
              staying current with industry trends and best practices. This commitment to 
              continuous learning ensures I can provide the highest level of expertise.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;