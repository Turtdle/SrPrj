// resume-template/src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';

// Component imports
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    // Add timestamp to avoid caching issues
    const timestamp = new Date().getTime();
    fetch(`/data.json?t=${timestamp}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }
        return response.text();
      })
      .then(text => {
        try {
          const data = JSON.parse(text);
          setResumeData(data);
          setLoading(false);
        } catch (parseError) {
          throw new Error(`JSON parse error: ${parseError.message}`);
        }
      })
      .catch(error => {
        console.error('Error loading resume data:', error);
        setError(error.toString());
        setLoading(false);
      });
  }, []);

  // Track section visibility for scroll-based navigation highlighting
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      let current = '';
      
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
          current = section.getAttribute('id');
        }
      });
      
      if (current && current !== activeSection) {
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading portfolio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  // Ensure we have data
  if (!resumeData) {
    return <div className="error-container">No resume data available.</div>;
  }

  // Fix any missing or null values in resumeData
  const data = {
    ...resumeData,
    name: resumeData.name || (resumeData.contact && resumeData.contact.name) || "Your Name",
    contact: {
      ...resumeData.contact,
      email: (resumeData.contact && resumeData.contact.email) || "email@example.com",
      phone: (resumeData.contact && resumeData.contact.phone) || "123-456-7890",
      location: (resumeData.contact && resumeData.contact.location) || "City, State"
    },
    education: Array.isArray(resumeData.education) ? resumeData.education : [],
    experience: Array.isArray(resumeData.experience) ? resumeData.experience : [],
    projects: Array.isArray(resumeData.projects) ? resumeData.projects : [], 
    skills: resumeData.skills || { languages: [], tools: [] }
  };

  return (
    <div className="portfolio-app">
      <Header name={data.name} activeSection={activeSection} />
      
      <main>
        <Hero name={data.name} education={data.education} />
        
        <About name={data.name} education={data.education} contact={data.contact} />
        
        <Experience experiences={data.experience} />
        
        <Projects projects={data.projects} />
        
        <Skills skills={data.skills} />
        
        <Contact contact={data.contact} />
      </main>
      
      <Footer name={data.name} />
    </div>
  );
}

export default App;