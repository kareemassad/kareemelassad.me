// ProjectCard.js

import React from 'react';
import './ProjectCard.scss';

const ProjectCard = ({ image, title, link }) => { // Changed to individual props
    return (
        <div className="project-card">
            <img src={image} alt={title} className="project-image" />
            <div className="project-content">
                <h3 className="project-title">{title}</h3>
                <a href={link} target="_blank" rel="noopener noreferrer" className="project-link">View Project</a>
            </div>
        </div>
    );
};

export default ProjectCard;
