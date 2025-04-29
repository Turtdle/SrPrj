// professional-template/src/components/Contact.js
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
    <section id="contact" className="wp-skills-section">
      <div className="container">
        <div className="wp-section-header">
          <h2>Contact Me</h2>
          <p>Get in touch for inquiries and opportunities</p>
        </div>
        
        <div className="wp-card" style={{marginBottom: '40px'}}>
          <div className="wp-card-header">
            <h3>Contact Information</h3>
          </div>
          <div className="wp-card-content">
            <div className="wp-contact-info">
              <div className="wp-contact-item">
                <div className="wp-contact-icon">📍</div>
                <div className="wp-contact-details">
                  <h4>Location</h4>
                  <p>{contact.location}</p>
                </div>
              </div>
              
              <div className="wp-contact-item">
                <div className="wp-contact-icon">📧</div>
                <div className="wp-contact-details">
                  <h4>Email</h4>
                  <p><a href={`mailto:${contact.email}`}>{contact.email}</a></p>
                </div>
              </div>
              
              <div className="wp-contact-item">
                <div className="wp-contact-icon">📱</div>
                <div className="wp-contact-details">
                  <h4>Phone</h4>
                  <p><a href={`tel:${contact.phone}`}>{contact.phone}</a></p>
                </div>
              </div>
              
              <div className="wp-contact-social">
                <h4>Connect on Social</h4>
                <div className="wp-profile-social">
                  <a href="#" className="wp-social-link" aria-label="LinkedIn">
                    in
                  </a>
                  <a href="#" className="wp-social-link" aria-label="GitHub">
                    GH
                  </a>
                  <a href="#" className="wp-social-link" aria-label="Twitter">
                    T
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="wp-card">
          <div className="wp-card-header">
            <h3>Send Me a Message</h3>
          </div>
          <div className="wp-card-content">
            {formSubmitted ? (
              <div className="wp-notice wp-notice-success">
                <h4>Message Sent Successfully!</h4>
                <p>
                  Thank you for reaching out. I'll respond to your inquiry as soon as possible.
                </p>
              </div>
            ) : (
              <form className="wp-form" onSubmit={handleSubmit}>
                {formError && (
                  <div className="wp-notice wp-notice-error">
                    <p>{formError}</p>
                  </div>
                )}
                
                <div className="wp-form-row">
                  <div className="wp-form-group">
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
                  
                  <div className="wp-form-group">
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
                </div>
                
                <div className="wp-form-group">
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
                
                <div className="wp-form-group">
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
                
                <button type="submit" className="wp-button">
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