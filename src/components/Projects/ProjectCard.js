// ProjectCard.js

import React from 'react';
import './ProjectCard.scss';

const ProjectCard = ({ image, title, link, technologies }) => {
    return (
        <div className="project-card">
            <div className="card-inner">
                <div className="card-front">
                    <div className="project-image-wrapper">
                        <img src={image} alt={title} className="project-image" />
                    </div>
                    <div className="project-title-front">
                        <h3>{title}</h3>
                    </div>
                    {/* ... rest of the front content ... */}
                </div>
                <div className="card-back">
                    <h3 className="tech-title">Technologies Used:</h3>
                    <p className="tech-list">{technologies.join(", ")}</p>
                    <a href={link} target="_blank" rel="noopener noreferrer" className="btn btn-dark">
                        GitHub <i className="fab fa-github github-icon"></i>
                    </a>
                </div>
            </div>
        </div>
    );
};




export default ProjectCard;
