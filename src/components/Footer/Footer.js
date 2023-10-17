import React from "react";
import './Footer.scss';

const Footer = () => {
    return (
        <footer className="footer-wrapper">
            <div className="say-hello">
                <h1>Say hello on any of these platforms!</h1>
            </div>
            <div className="social">
                <a className="no-underline icon-link" href="https://www.linkedin.com/in/kareem-el-assad-759113140/" aria-label="LinkedIn">
                    <i className="fab fa-linkedin"></i>
                </a>
                <a className="no-underline icon-link" href="https://github.com/kareemassad" aria-label="Github">
                    <i className="fab fa-github"></i>
                </a>
                <a className="no-underline icon-link" href="mailto:kareemassad5@gmail.com" aria-label="Email">
                    <i className="fas fa-envelope"></i>
                </a>
            </div>
            <div className="bottom-line"></div>
        </footer>
    );
};

export default Footer;
