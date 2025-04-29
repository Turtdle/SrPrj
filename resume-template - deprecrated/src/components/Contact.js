
import React, { useState } from 'react';

const Contact = ({ contact }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real implementation, this would submit the form data to a backend
    // Since we don't have a backend, we'll just simulate a successful submission
    console.log("Form submitted:", formData);
    setFormSubmitted(true);
    
    // Reset form after submission
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setFormSubmitted(false);
    }, 5000);
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <div className="section-header">
          <h2>Contact Me</h2>
          <div className="section-bar"></div>
        </div>
        
        <div className="contact-container">
          <div className="contact-info">
            <h3>Get In Touch</h3>
            <p>I'm always open to new opportunities and collaborations. Feel free to reach out!</p>
            
            <div className="info-items">
              <div className="info-item">
                <div className="info-icon">
                  <i>📍</i>
                </div>
                <div className="info-content">
                  <h4>Location</h4>
                  <p>{contact.location}</p>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon">
                  <i>📧</i>
                </div>
                <div className="info-content">
                  <h4>Email</h4>
                  <p><a href={`mailto:${contact.email}`}>{contact.email}</a></p>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon">
                  <i>📱</i>
                </div>
                <div className="info-content">
                  <h4>Phone</h4>
                  <p><a href={`tel:${contact.phone}`}>{contact.phone}</a></p>
                </div>
              </div>
            </div>
            
            <div className="social-links">
              <a href="#" className="social-icon" aria-label="LinkedIn">
                <i>in</i>
              </a>
              <a href="#" className="social-icon" aria-label="GitHub">
                <i>GH</i>
              </a>
              <a href="#" className="social-icon" aria-label="Twitter">
                <i>T</i>
              </a>
            </div>
          </div>
          
          <div className="contact-form-container">
            <h3>Send A Message</h3>
            
            {formSubmitted ? (
              <div className="success-message">
                <div className="success-icon">✓</div>
                <h4>Message Sent!</h4>
                <p>Thank you for reaching out. I'll get back to you as soon as possible.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                
                <button type="submit" className="submit-btn">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;