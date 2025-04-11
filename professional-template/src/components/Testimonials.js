import React, { useState, useEffect } from 'react';

const Testimonials = () => {
  // In a real application, these would come from the resume data
  // For this template, we'll provide sample testimonials
  const testimonials = [
    {
      name: "Sarah Johnson",
      position: "Senior Director",
      company: "InnovaTech Solutions",
      content: "An exceptional professional who consistently delivers outstanding results. Their strategic insight and attention to detail have been invaluable to our projects."
    },
    {
      name: "Michael Chen",
      position: "Project Lead",
      company: "Global Dynamics",
      content: "A pleasure to work with—brings both technical expertise and creative problem-solving to every challenge. Always meets deadlines and exceeds expectations."
    },
    {
      name: "Emily Rodriguez",
      position: "VP of Operations",
      company: "Future Systems Inc.",
      content: "Demonstrates remarkable adaptability and forward-thinking. Their contributions have significantly enhanced our team's performance and project outcomes."
    }
  ];
  
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);
  
  // Handle manual navigation
  const goToTestimonial = (index) => {
    setActiveIndex(index);
  };
  
  return (
    <section id="testimonials" className="testimonials-section">
      <div className="container">
        <div className="section-title">
          <h2>Testimonials</h2>
          <p>What colleagues and clients say</p>
        </div>
        
        <div className="testimonials-carousel">
          <div className="testimonials-wrapper" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
            {testimonials.map((testimonial, index) => (
              <div className="testimonial-item" key={index}>
                <div className="testimonial-content">
                  <div className="quote-icon">"</div>
                  <p className="testimonial-text">{testimonial.content}</p>
                  <div className="testimonial-author">
                    <div className="author-initial">{testimonial.name[0]}</div>
                    <div className="author-info">
                      <h4 className="author-name">{testimonial.name}</h4>
                      <p className="author-position">
                        {testimonial.position}, {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="testimonial-controls">
            <div className="testimonial-dots">
              {testimonials.map((_, index) => (
                <button 
                  key={index} 
                  className={`dot ${activeIndex === index ? 'active' : ''}`}
                  onClick={() => goToTestimonial(index)}
                  aria-label={`Testimonial ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;