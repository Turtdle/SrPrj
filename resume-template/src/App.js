// resume-template/src/App.js - Simplified with robust error handling
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("App mounted, fetching data...");
    
    // Add timestamp to avoid caching issues
    const timestamp = new Date().getTime();
    fetch(`/data.json?t=${timestamp}`)
      .then(response => {
        console.log("Response status:", response.status);
        if (!response.ok) {
          throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }
        return response.text(); // Get as text first to debug JSON parsing issues
      })
      .then(text => {
        console.log("Received data (first 100 chars):", text.substring(0, 100));
        try {
          const data = JSON.parse(text);
          console.log("Successfully parsed JSON:", data);
          setResumeData(data);
          setLoading(false);
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          throw new Error(`JSON parse error: ${parseError.message}. Raw data: ${text.substring(0, 100)}...`);
        }
      })
      .catch(error => {
        console.error('Error loading resume data:', error);
        setError(error.toString());
        setLoading(false);
      });
  }, []);

  // Render a basic resume if we have data issues
  const renderFallbackResume = () => {
    // Create a basic resume structure for fallback
    const fallbackData = {
      name: "Resume",
      contact: {
        email: "example@example.com",
        phone: "555-123-4567",
        location: "Anytown, USA"
      },
      education: [
        {
          institution: "University Name",
          degree: "Degree Program",
          graduation_date: "Year",
          gpa: "4.0"
        }
      ],
      experience: [
        {
          position: "Position Title",
          company: "Company Name",
          duration: "Time Period",
          responsibilities: ["Responsibility description"]
        }
      ],
      skills: {
        languages: ["Skill 1", "Skill 2"],
        tools: ["Tool 1", "Tool 2"]
      }
    };

    return (
      <div className="resume-container">
        <header className="resume-header">
          <h1>{fallbackData.name}</h1>
          <div className="contact-info">
            <p>{fallbackData.contact.location}</p>
            <p>{fallbackData.contact.phone}</p>
            <p>{fallbackData.contact.email}</p>
          </div>
          <div className="error-notification">
            <p>Note: Using basic template due to data loading error.</p>
            <p>Error: {error}</p>
            <p><a href="/debug.html" target="_blank">View Debug Info</a></p>
          </div>
        </header>

        {/* Basic sections */}
        <section className="resume-section">
          <h2>Education</h2>
          {fallbackData.education.map((edu, index) => (
            <div key={index} className="education-item">
              <h3>{edu.institution}</h3>
              <p className="degree">{edu.degree}</p>
              <p>Graduation Date: {edu.graduation_date}</p>
              <p>GPA: {edu.gpa}</p>
            </div>
          ))}
        </section>

        <section className="resume-section">
          <h2>Experience</h2>
          {fallbackData.experience.map((exp, index) => (
            <div key={index} className="experience-item">
              <div className="experience-header">
                <h3>{exp.position}</h3>
                <p className="company">{exp.company}</p>
                <p className="duration">{exp.duration}</p>
              </div>
              <ul className="responsibilities-list">
                {exp.responsibilities.map((resp, i) => (
                  <li key={i}>{resp}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="resume-section">
          <h2>Skills</h2>
          {Object.entries(fallbackData.skills).map(([category, skillsList]) => (
            <div key={category} className="skills-category">
              <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
              <div className="skills-list">
                {skillsList.join(', ')}
              </div>
            </div>
          ))}
        </section>
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Loading resume...</div>;
  }

  if (!resumeData) {
    return renderFallbackResume();
  }

  // Standard resume render with actual data
  return (
    <div className="resume-container">
      <header className="resume-header">
        <h1>{resumeData.name}</h1>
        <div className="contact-info">
          <p>{resumeData.contact.location}</p>
          <p>{resumeData.contact.phone}</p>
          <p>{resumeData.contact.email}</p>
        </div>
      </header>

      <section className="resume-section">
        <h2>Education</h2>
        {resumeData.education.map((edu, index) => (
          <div key={index} className="education-item">
            <h3>{edu.institution}</h3>
            <p className="degree">{edu.degree}</p>
            <p>Graduation Date: {edu.graduation_date}</p>
            <p>GPA: {edu.gpa}</p>
            {edu.relevant_coursework && (
              <div>
                <p>Relevant Coursework:</p>
                <ul className="coursework-list">
                  {edu.relevant_coursework.map((course, i) => (
                    <li key={i}>{course}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </section>

      <section className="resume-section">
        <h2>Experience</h2>
        {resumeData.experience.map((exp, index) => (
          <div key={index} className="experience-item">
            <div className="experience-header">
              <h3>{exp.position}</h3>
              <p className="company">{exp.company}</p>
              <p className="duration">{exp.duration}</p>
            </div>
            <ul className="responsibilities-list">
              {exp.responsibilities.map((resp, i) => (
                <li key={i}>{resp}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {resumeData.projects && (
        <section className="resume-section">
          <h2>Projects</h2>
          {resumeData.projects.map((project, index) => (
            <div key={index} className="project-item">
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              {project.technologies && (
                <div className="technologies">
                  <span>Technologies: </span>
                  {project.technologies.join(', ')}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      <section className="resume-section">
        <h2>Skills</h2>
        {resumeData.skills && Object.entries(resumeData.skills).map(([category, skillsList]) => (
          <div key={category} className="skills-category">
            <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
            <div className="skills-list">
              {skillsList.join(', ')}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default App;