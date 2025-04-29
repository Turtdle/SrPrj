// professional-template/src/components/About.js
import React from 'react';

const About = ({ name }) => {
  // Extract first name for more personal touch
  const firstName = name.split(' ')[0];
  
  return (
    <section id="about" className="wp-about-section">
      <div className="container">
        <div className="wp-section-header">
          <h2>About Me</h2>
          <p>Professional background and personal approach</p>
        </div>
        
        <div className="wp-about-container">
          <div className="wp-about-image">
            <div className="wp-about-avatar">
              <div className="wp-profile-initial">{name.charAt(0)}</div>
            </div>
          </div>
          
          <div className="wp-about-content">
            <h3 className="wp-about-title">Who am I?</h3>
            <p className="wp-about-lead">
              I'm a dedicated professional with a passion for excellence and continuous growth in my field.
            </p>
            
            <p className="wp-about-text">
              With a strong foundation in my area of expertise, I bring a unique perspective and a wealth of 
              experience to every project. I believe in a methodical, detail-oriented approach, balanced with 
              creative problem-solving and innovative thinking.
            </p>
            
            <p className="wp-about-text">
              My professional philosophy centers around delivering exceptional results while maintaining the 
              highest standards of integrity and professionalism. I'm committed to ongoing learning and adaptation 
              in an ever-evolving landscape.
            </p>
            
            <div className="wp-about-features">
              <div className="wp-feature-item">
                <div className="wp-feature-icon">🎯</div>
                <div className="wp-feature-content">
                  <h4>Mission-Driven</h4>
                  <p>I approach each project with clear objectives and unwavering dedication.</p>
                </div>
              </div>
              
              <div className="wp-feature-item">
                <div className="wp-feature-icon">💡</div>
                <div className="wp-feature-content">
                  <h4>Innovative Approach</h4>
                  <p>I combine analytical thinking with creative solutions to address complex challenges.</p>
                </div>
              </div>
              
              <div className="wp-feature-item">
                <div className="wp-feature-icon">🤝</div>
                <div className="wp-feature-content">
                  <h4>Collaborative Spirit</h4>
                  <p>I thrive in both independent and team environments, valuing diverse perspectives.</p>
                </div>
              </div>
            </div>
            
            <div className="wp-profile-buttons">
              <a href="#contact" className="wp-button">Let's Connect</a>
              <a href="#experience" className="wp-button wp-button-secondary">View Experience</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;