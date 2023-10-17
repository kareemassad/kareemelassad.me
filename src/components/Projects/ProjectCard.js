import React from 'react';
import './ProjectCard.scss';

const ProjectCard = ({ project }) => {
    const { title, type, description, image, link } = project;
    return (
        <div className="project-card">
            <div className="project-image">
                <img src={image} alt={title} />
            </div>
            <div className="project-info">
                <h3 className="project-title">{title}</h3>
                <p className="project-type">{type}</p>
                <p className="project-description">{description}</p>
                <a className="project-link" href={link} target="_blank" rel="noopener noreferrer">
                    View Project
                </a>
            </div>
        </div>
    );
};

export default ProjectCard;
