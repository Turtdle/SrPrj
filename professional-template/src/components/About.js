import React from 'react';

const About = ({ name }) => {
  // Extract first name for more personal touch
  const firstName = name.split(' ')[0];
  
  return (
    <section id="about" className="about-section section-alt">
      <div className="container">
        <div className="section-title">
          <h2>About Me</h2>
          <p>Professional background and personal approach</p>
        </div>
        
        <div className="about-content">
          <div className="about-image">
            <div className="about-image-frame">
              <div className="about-avatar">
                <div className="initial">{name.charAt(0)}</div>
              </div>
            </div>
            <div className="about-image-caption">
              <span>{firstName}'s professional portrait</span>
            </div>
          </div>
          
          <div className="about-text">
            <h3>Who am I?</h3>
            <p className="lead-text">
              I'm a dedicated professional with a passion for excellence and continuous growth in my field.
            </p>
            
            <p>
              With a strong foundation in my area of expertise, I bring a unique perspective and a wealth of 
              experience to every project. I believe in a methodical, detail-oriented approach, balanced with 
              creative problem-solving and innovative thinking.
            </p>
            
            <p>
              My professional philosophy centers around delivering exceptional results while maintaining the 
              highest standards of integrity and professionalism. I'm committed to ongoing learning and adaptation 
              in an ever-evolving landscape.
            </p>
            
            <div className="about-highlights">
              <div className="highlight-item">
                <div className="highlight-icon">🎯</div>
                <div className="highlight-text">
                  <h4>Mission-Driven</h4>
                  <p>I approach each project with clear objectives and unwavering dedication.</p>
                </div>
              </div>
              
              <div className="highlight-item">
                <div className="highlight-icon">💡</div>
                <div className="highlight-text">
                  <h4>Innovative Approach</h4>
                  <p>I combine analytical thinking with creative solutions to address complex challenges.</p>
                </div>
              </div>
              
              <div className="highlight-item">
                <div className="highlight-icon">🤝</div>
                <div className="highlight-text">
                  <h4>Collaborative Spirit</h4>
                  <p>I thrive in both independent and team environments, valuing diverse perspectives.</p>
                </div>
              </div>
            </div>
            
            <div className="about-cta">
              <a href="#contact" className="btn btn-primary">Let's Connect</a>
              <a href="#experience" className="btn btn-outline">View Experience</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;