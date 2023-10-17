import React from 'react';
import PropTypes from 'prop-types';
import './ProjectDisplay.scss';

const ProjectDisplay = ({ image, title, type, description, link }) => {
    return (
        <div className="project-section">
            <div className="container">
                <div className="row justify-content-center align-items-center">

                    <div className="col-md-6 order-md-2">
                        <img src={image} className='project-image img-fluid' alt="Project" />
                    </div>

                    <div className="col-md-6 order-md-1 project-description">
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
    imageSrc: PropTypes.string.isRequired,
    projectName: PropTypes.string.isRequired,
    projectType: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
};

export default ProjectDisplay;
