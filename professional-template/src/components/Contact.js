import React, { useState } from 'react';

const Contact = ({ contact }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulate form submission - in a real application, this would send data to a server
    try {
      // Simulate API call
      console.log('Form data submitted:', formData);
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Show success message
      setFormSubmitted(true);
      setFormError(null);
      
      // Reset form status after 5 seconds
      setTimeout(() => {
        setFormSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error('Form submission error:', error);
      setFormError('There was a problem sending your message. Please try again.');
    }
  };
  
  return (
    <section id="contact" className="contact-section section-alt">
      <div className="container">
        <div className="section-title">
          <h2>Contact Me</h2>
          <p>Get in touch for inquiries and opportunities</p>
        </div>
        
        <div className="contact-container">
          <div className="contact-info">
            <h3>Let's Connect</h3>
            <p>
              I'm interested in professional opportunities where I can contribute, learn, and grow.
              Don't hesitate to reach out if you have any questions or would like to discuss potential collaboration.
            </p>
            
            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-icon">
                  <i>📍</i>
                </div>
                <div className="contact-text">
                  <h4>Location</h4>
                  <p>{contact.location}</p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <i>✉️</i>
                </div>
                <div className="contact-text">
                  <h4>Email</h4>
                  <p><a href={`mailto:${contact.email}`}>{contact.email}</a></p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <i>📱</i>
                </div>
                <div className="contact-text">
                  <h4>Phone</h4>
                  <p><a href={`tel:${contact.phone}`}>{contact.phone}</a></p>
                </div>
              </div>
            </div>
            
            <div className="contact-social">
              <h4>Social Profiles</h4>
              <div className="social-links">
                <a href="#" className="social-link" aria-label="LinkedIn">
                  <i className="social-icon linkedin">in</i>
                </a>
                <a href="#" className="social-link" aria-label="GitHub">
                  <i className="social-icon github">GH</i>
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <i className="social-icon twitter">T</i>
                </a>
              </div>
            </div>
          </div>
          
          <div className="contact-form-container">
            <h3>Send a Message</h3>
            
            {formSubmitted ? (
              <div className="form-success-message">
                <div className="success-icon">✓</div>
                <h4>Message Sent Successfully!</h4>
                <p>
                  Thank you for reaching out. I'll respond to your inquiry as soon as possible.
                </p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                {formError && (
                  <div className="form-error-message">
                    <p>{formError}</p>
                  </div>
                )}
                
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input 
                    type="text" 
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
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
                    placeholder="john@example.com"
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
                    placeholder="How can I help you?"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Your Message</label>
                  <textarea 
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message here..."
                    rows="5"
                    required
                  ></textarea>
                </div>
                
                <button type="submit" className="btn btn-primary">
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