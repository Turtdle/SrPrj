// resume-template/src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data.json')
      .then(response => response.json())
      .then(data => {
        setResumeData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading resume data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading">Loading resume...</div>;
  }

  if (!resumeData) {
    return <div className="error">Error loading resume data</div>;
  }

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