import React from 'react';
import PropTypes from 'prop-types';
import './ProjectDisplay.scss';

const ProjectDisplay = ({ image, title, type, description, link }) => {
    return (
        <div className="project-section">
            <div className="container">
                <div className="row justify-content-center align-items-center">

                    <div className="col-xl-6 order-lg-2">
                        <img src={image} className='project-image img-fluid' alt="Project" />
                    </div>

                    <div className="col-xl-6 order-lg-1 project-description">
                        <div className="project-name">
                            {title}
                        </div>
                        <div className="project-type">
                            {type}
                        </div>
                        <hr />
                        <div>
                            <p>
                                {description}
                            </p>
                            <a href={link} className="btn btn-dark">
                                Github <i className="fab fa-github github-icon"></i>
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

ProjectDisplay.propTypes = {
    image: PropTypes.string.isRequired, // Adjusted to match actual prop
    title: PropTypes.string.isRequired, // Adjusted to match actual prop
    type: PropTypes.string, // 'type' is not used in ProjectCard, so it's not required there. It remains required here in ProjectDisplay.
    description: PropTypes.string.isRequired, // Adjusted to match actual prop
    link: PropTypes.string.isRequired, // Adjusted to match actual prop
};

export default ProjectDisplay;