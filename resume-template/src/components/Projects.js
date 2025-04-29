// resume-template/src/components/Projects.js
import React, { useState, useEffect } from 'react';

const Projects = ({ projects }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredProjects, setFilteredProjects] = useState(projects || []);
  const [visibleCount, setVisibleCount] = useState(4);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Extract all unique technologies from projects
  const allTechnologies = projects ? 
    [...new Set(projects.flatMap(project => project.technologies || []))] : [];
  
  const filters = ['all', ...allTechnologies.slice(0, 5)]; // Limit to top 5 technologies + 'all'
  
  // Handle filter change
  useEffect(() => {
    setIsAnimating(true);
    setTimeout(() => {
      if (activeFilter === 'all') {
        setFilteredProjects(projects || []);
      } else {
        setFilteredProjects(
          (projects || []).filter(project => 
            project.technologies && project.technologies.includes(activeFilter)
          )
        );
      }
      setIsAnimating(false);
    }, 300);
  }, [activeFilter, projects]);
  
  // Handle showing more projects
  const handleShowMore = () => {
    setVisibleCount(prevCount => prevCount + 3);
  };
  
  // If no projects, return placeholder
  if (!projects || !projects.length) {
    return (
      <section id="projects" className="projects-section">
        <div className="container">
          <div className="section-header">
            <h2>Projects</h2>
            <div className="section-bar"></div>
          </div>
          <div className="no-projects">
            <p>No projects information available.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="projects-section">
      <div className="container">
        <div className="section-header">
          <h2>Projects</h2>
          <div className="section-bar"></div>
        </div>
        
        {allTechnologies.length > 0 && (
          <div className="project-filters">
            {filters.map((filter, index) => (
              <button
                key={index}
                className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter === 'all' ? 'All Projects' : filter}
              </button>
            ))}
          </div>
        )}
        
        <div className={`projects-grid ${isAnimating ? 'animating' : ''}`}>
          {filteredProjects.slice(0, visibleCount).map((project, index) => (
            <div className="project-card" key={index}>
              <div className="project-content">
                <h3 className="project-title">{project.name}</h3>
                <p className="project-description">{project.description}</p>
                
                {project.technologies && project.technologies.length > 0 && (
                  <div className="project-technologies">
                    {project.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="technology-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="project-overlay">
                <div className="project-overlay-content">
                  <div className="project-icon">🚀</div>
                  <h3>{project.name}</h3>
                  <div className="overlay-actions">
                    <button className="project-details-btn">Details</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredProjects.length > visibleCount && (
          <div className="load-more">
            <button className="load-more-btn" onClick={handleShowMore}>
              Show More Projects
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;