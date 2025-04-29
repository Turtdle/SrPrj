// resume-template/src/components/Skills.js
import React, { useState, useEffect, useRef } from 'react';

const Skills = ({ skills }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  
  // Skills categories
  const categories = [
    {
      name: 'Languages',
      icon: '💻',
      items: skills?.languages || []
    },
    {
      name: 'Tools & Platforms',
      icon: '🛠️',
      items: skills?.tools || []
    }
  ];
  
  // Check if section is in viewport to trigger animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  // Helper to determine if we have skills to display
  const hasSkills = 
    categories.some(category => category.items && category.items.length > 0);
  
  if (!hasSkills) {
    return (
      <section id="skills" className="skills-section">
        <div className="container">
          <div className="section-header">
            <h2>Skills</h2>
            <div className="section-bar"></div>
          </div>
          <div className="no-skills">
            <p>No skills information available.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="skills-section" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <h2>Skills</h2>
          <div className="section-bar"></div>
        </div>
        
        <div className="skills-container">
          {categories.map((category, catIndex) => 
            category.items && category.items.length > 0 ? (
              <div 
                className={`skill-category ${isVisible ? 'visible' : ''}`}
                key={catIndex}
                style={{ animationDelay: `${catIndex * 0.2}s` }}
              >
                <div className="category-header">
                  <span className="category-icon">{category.icon}</span>
                  <h3>{category.name}</h3>
                </div>
                
                <div className="skills-list">
                  {category.items.map((skill, skillIndex) => (
                    <div 
                      className="skill-item" 
                      key={skillIndex}
                      style={{ animationDelay: `${(catIndex * 0.2) + (skillIndex * 0.1)}s` }}
                    >
                      <div className="skill-name">{skill}</div>
                      <div className="skill-bar">
                        <div className="skill-progress"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null
          )}
        </div>
        
        <div className={`skills-circular-container ${isVisible ? 'visible' : ''}`}>
          {categories.flatMap(category => 
            category.items && category.items.map((skill, index) => (
              <div 
                className="skill-bubble"
                key={`${category.name}-${index}`}
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  animationDuration: `${Math.random() * 5 + 10}s` // Random duration
                }}
              >
                {skill}
              </div>
            ))
          ).filter(Boolean)}
        </div>
      </div>
    </section>
  );
};

export default Skills;