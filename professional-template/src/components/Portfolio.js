// professional-template/src/components/Portfolio.js
import React, { useState } from 'react';

const Portfolio = ({ projects }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  
  // If there are no projects, return a placeholder
  if (!projects || !projects.length) {
    return (
      <section id="portfolio" className="wp-portfolio-section">
        <div className="container">
          <div className="wp-section-header">
            <h2>Project Portfolio</h2>
            <p>Showcasing selected professional work</p>
          </div>
          
          <div className="wp-card">
            <div className="wp-card-content">
              <p>No project information available.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  // Extract all technologies for filter
  const allTechnologies = [...new Set(projects.flatMap(proj => 
    proj.technologies && proj.technologies.length > 0 ? proj.technologies : []
  ))];
  
  // Create filter buttons with 'All' as default
  const filterCategories = ['all', ...allTechnologies];
  
  // Filter projects based on selected category
  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(proj => 
        proj.technologies && proj.technologies.includes(activeFilter)
      );
  
  // Handle opening the project modal
  const openProjectModal = (project) => {
    setSelectedProject(project);
    setModalOpen(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };
  
  // Handle closing the project modal
  const closeProjectModal = () => {
    setModalOpen(false);
    // Restore body scroll
    document.body.style.overflow = 'auto';
  };
  
  return (
    <section id="portfolio" className="wp-portfolio-section">
      <div className="container">
        <div className="wp-section-header">
          <h2>Project Portfolio</h2>
          <p>Showcasing selected professional work</p>
        </div>
        
        {/* Filter buttons - only show if we have technologies */}
        {allTechnologies.length > 0 && (
          <div className="wp-portfolio-filters">
            {filterCategories.map((filter, index) => (
              <button 
                key={index} 
                className={`wp-filter-button ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter === 'all' ? 'All Projects' : filter}
              </button>
            ))}
          </div>
        )}
        
        {/* Projects grid */}
        <div className="wp-portfolio-grid">
          {filteredProjects.map((project, index) => (
            <div className="wp-portfolio-item" key={index}>
              <div className="wp-portfolio-image">
                <div className="wp-portfolio-placeholder">
                  {project.name.charAt(0)}
                </div>
              </div>
              <div className="wp-portfolio-content">
                <h3 className="wp-portfolio-title">{project.name}</h3>
                <p className="wp-portfolio-description">
                  {project.description}
                </p>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="wp-portfolio-tags">
                    {project.technologies.slice(0, 3).map((tech, techIndex) => (
                      <span className="wp-portfolio-tag" key={techIndex}>{tech}</span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="wp-portfolio-tag">+{project.technologies.length - 3} more</span>
                    )}
                  </div>
                )}
                <button 
                  className="wp-portfolio-button"
                  onClick={() => openProjectModal(project)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Project modal */}
        {modalOpen && selectedProject && (
          <div className="wp-portfolio-modal">
            <div className="wp-modal-content">
              <div className="wp-modal-header">
                <h2 className="wp-modal-title">{selectedProject.name}</h2>
                <button className="wp-modal-close" onClick={closeProjectModal}>×</button>
              </div>
              
              <div className="wp-modal-body">
                <div className="wp-modal-image">
                  <div className="wp-modal-placeholder">
                    {selectedProject.name.charAt(0)}
                  </div>
                </div>
                
                <div className="wp-modal-description">
                  <h3>Project Overview</h3>
                  <p>{selectedProject.description}</p>
                  
                  {selectedProject.technologies && selectedProject.technologies.length > 0 && (
                    <div className="wp-modal-technologies">
                      <h3>Technologies Used</h3>
                      <div className="wp-tech-list">
                        {selectedProject.technologies.map((tech, index) => (
                          <span className="wp-tech-badge" key={index}>{tech}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="wp-card-footer">
                <button className="wp-button" onClick={closeProjectModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Portfolio;