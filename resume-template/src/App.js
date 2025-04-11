// professional-template/src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';

// Import components
import Header from './components/Header';
import Profile from './components/Profile';
import About from './components/About';
import Experience from './components/Experience';
import Education from './components/Education';
import Skills from './components/Skills';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('profile');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
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
          
          // Sort education by graduation date (most recent first)
          if (data.education && Array.isArray(data.education) && data.education.length > 0) {
            data.education.sort((a, b) => {
              // Extract years for comparison
              const yearA = a.graduation_date ? parseInt(a.graduation_date.match(/\d{4}/)?.[0] || "0") : 0;
              const yearB = b.graduation_date ? parseInt(b.graduation_date.match(/\d{4}/)?.[0] || "0") : 0;
              
              // Sort in descending order (most recent first)
              return yearB - yearA;
            });
          }
          
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

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200) && 
            window.scrollY < (sectionTop + sectionHeight - 200)) {
          setActiveSection(section.getAttribute('id'));
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle toggling mobile menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  if (loading) {
    return (
      <div className="wp-loading">
        <div className="wp-loading-spinner"></div>
        <p>Loading portfolio data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wp-error">
        <div className="wp-error-icon">!</div>
        <h2>Unable to load profile data</h2>
        <p>{error}</p>
        <button className="wp-button" onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="wp-error">
        <div className="wp-error-icon">!</div>
        <h2>No profile data available</h2>
        <p>Unable to load your professional profile information.</p>
        <button className="wp-button" onClick={() => window.location.reload()}>Refresh Page</button>
      </div>
    );
  }

  // Prepare normalized data structure with defaults
  const data = {
    ...resumeData,
    name: resumeData.name || "Professional Name",
    contact: {
      ...resumeData.contact,
      email: (resumeData.contact && resumeData.contact.email) || "email@example.com",
      phone: (resumeData.contact && resumeData.contact.phone) || "123-456-7890",
      location: (resumeData.contact && resumeData.contact.location) || "Location"
    },
    education: Array.isArray(resumeData.education) ? resumeData.education : [],
    experience: Array.isArray(resumeData.experience) ? resumeData.experience : [],
    projects: Array.isArray(resumeData.projects) ? resumeData.projects : [], 
    skills: {
      languages: (resumeData.skills && Array.isArray(resumeData.skills.languages)) 
        ? resumeData.skills.languages : [],
      tools: (resumeData.skills && Array.isArray(resumeData.skills.tools)) 
        ? resumeData.skills.tools : []
    }
  };

  return (
    <div className="wp-site">
      <Header 
        name={data.name} 
        activeSection={activeSection} 
        menuOpen={menuOpen}
        toggleMenu={toggleMenu}
      />
      
      <main className="wp-main">
        <Profile name={data.name} contact={data.contact} education={data.education} />
        <About name={data.name} />
        <Experience experiences={data.experience} />
        <Education education={data.education} />
        <Skills skills={data.skills} />
        <Portfolio projects={data.projects} />
        <Contact contact={data.contact} />
      </main>
      
      <Footer name={data.name} />
    </div>
  );
}

export default App;