import React, { useState } from 'react';

const Portfolio = ({ projects }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  
  // If there are no projects, return a placeholder
  if (!projects || !projects.length) {
    return (
      <section id="portfolio" className="portfolio-section section-alt">
        <div className="container">
          <div className="section-title">
            <h2>Project Portfolio</h2>
            <p>Showcasing selected professional work</p>
          </div>
          
          <div className="no-content-message">
            <p>No project information available.</p>
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
    <section id="portfolio" className="portfolio-section section-alt">
      <div className="container">
        <div className="section-title">
          <h2>Project Portfolio</h2>
          <p>Showcasing selected professional work</p>
        </div>
        
        {/* Filter buttons - only show if we have technologies */}
        {allTechnologies.length > 0 && (
          <div className="portfolio-filters">
            {filterCategories.map((filter, index) => (
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
        
        {/* Projects grid */}
        <div className="portfolio-grid">
          {filteredProjects.map((project, index) => (
            <div className="portfolio-item" key={index}>
              <div className="portfolio-card">
                <div className="portfolio-img">
                  <div className="project-placeholder">
                    <span>{project.name.charAt(0)}</span>
                  </div>
                </div>
                <div className="portfolio-content">
                  <h3 className="portfolio-title">{project.name}</h3>
                  <p className="portfolio-excerpt">
                    {project.description?.substring(0, 100)}
                    {project.description?.length > 100 ? '...' : ''}
                  </p>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="portfolio-tags">
                      {project.technologies.map((tech, techIndex) => (
                        <span className="tag" key={techIndex}>{tech}</span>
                      ))}
                    </div>
                  )}
                  <button 
                    className="btn-view-project"
                    onClick={() => openProjectModal(project)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Project modal */}
        {modalOpen && selectedProject && (
          <div className="project-modal">
            <div className="modal-overlay" onClick={closeProjectModal}></div>
            <div className="modal-content">
              <button className="modal-close" onClick={closeProjectModal}>×</button>
              
              <div className="modal-header">
                <h2 className="modal-title">{selectedProject.name}</h2>
              </div>
              
              <div className="modal-body">
                <div className="project-image">
                  <div className="project-placeholder large">
                    <span>{selectedProject.name.charAt(0)}</span>
                  </div>
                </div>
                
                <div className="project-description">
                  <h3>Project Overview</h3>
                  <p>{selectedProject.description}</p>
                  
                  {selectedProject.technologies && selectedProject.technologies.length > 0 && (
                    <div className="project-technologies">
                      <h3>Technologies Used</h3>
                      <div className="technologies-list">
                        {selectedProject.technologies.map((tech, index) => (
                          <span className="technology-badge" key={index}>{tech}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={closeProjectModal}>
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