import React, { Component } from 'react';
import './Projects.scss';
import ProjectDisplay from './ProjectDisplay';
import ProjectCard from './ProjectCard';


//imgs
import basil_img from '../../assets/images/basil-pic.png';
import autonomousImg from '../../assets/images/autonomous.png';
import sudokuGif from '../../assets/gifs/full-gif-99comp.gif';
import allauthlogo from '../../assets/images/allauth.png';
import jukeboxImg from '../../assets/images/jukebox.jpg';
import conuhacksImg from '../../assets/images/Arbitrading.png';
import jsimg from '../../assets/images/JavaScript-logo.png';
import empowerImg from '../../assets/images/empower.png';
import hevyImg from '../../assets/images/hevyimg.png';
import cuHackingimg from '../../assets/images/Button_go.gif';
import manhuntimg from '../../assets/images/portable-saw.jpg';
import cuimg from '../../assets/images/cu.png';
import me from '../../assets/images/meS.svg';

const projectList = [
    {
        title: 'My Personal Site',
        type: 'Personal Project',
        description: 'This site was built using React, JavaScript, HTML, and CSS. The site is hosted on GitHub Pages and uses a custom domain name.',
        image: me,
        link: 'https://kareemassad.github.io/kareemelassad.me/',
        displayType: 'card',
        technologies: ['React', 'JavaScript', 'HTML', 'CSS']
    },
    {
        title: 'Autonomous Vehicle Initiative: Real-time Object Detection',
        type: 'Software Engineering Capstone Project',
        description: 'Created a real-time object detection system that was capable of recognizing and differentiating between Barricades, Traffic Lights, Traffic Signs, and Potholes. The system was built using Python and YOLOv7, and deployed on a Raspberry Pi 4.',
        image: autonomousImg,
        link: 'https://bit.ly/3Lz7sjm',
        displayType: 'detailed',
        technologies: ['Python', 'YOLOv7', 'Raspberry Pi', 'OpenCV']
    },
    {
        title: 'django-allauth Library: EBay Social Provider',
        type: 'Open Source',
        description: 'Added a new feature to the django-allauth package that allows users to login with EBay OAuth2. This feature is currently in the review process and will be merged into the package soon.',
        image: allauthlogo,
        link: 'https://github.com/kareemassad/django-allauth',
        displayType: 'detailed',
        technologies: ['Python', 'Django']
    },
    {
        title: 'Sudoku.com Solver',
        type: 'Personal Project',
        description: 'A Python application that uses a backtracking algorithm and Python Selenium to interface and solve puzzles on sudoku.com.',
        image: sudokuGif,
        link: 'https://github.com/kareemassad/sudoku.com-solver-py',
        displayType: 'detailed',
        technologies: ['Python', 'Selenium']
    },
    {
        title: 'Carleton Software Engineering Repository',
        type: 'Personal Project',
        description: 'A repository that contains all the assignments and projects that I completed during my time at Carleton University. The repository contains projects that were built using Java, C, C++, Python, PHP, and JavaScript.',
        image: cuimg,
        link: 'https://github.com/kareemassad/carleton_software_engineering',
        displayType: 'card',
        technologies: ['Java', 'C', 'C++', 'Python', 'PHP', 'JavaScript']
    },
    {
        title: 'NFC Jukebox',
        type: 'Personal Project',
        description: 'Used Python to interface with an MFRC522 microcontroller to read NFC tags and play music based on the tag that was scanned. The application was hosted on a Raspberry Pi and used the Spotify API to play music on Amazon Alexa.',
        image: jukeboxImg,
        link: 'https://github.com/kareemassad/NFC-jukebox/',
        displayType: 'card',
        technologies: ['Python', 'MFRC522', 'Spotify API']
    },
    {
        title: 'ConUHacksVII: Arbitrading',
        type: 'Hackathon Project',
        description: 'Used Python, Flask, React, and MongoDB Atlas to process, analyze, and display a large scale of data from the stock market.',
        image: conuhacksImg,
        link: 'https://github.com/kareemassad/ConUHacksVII',
        displayType: 'card',
        technologies: ['Python', 'Flask', 'React', 'MongoDB Atlas']
    },
    {
        title: '30 Days of JavaScript Challenge',
        type: 'Challenge',
        description: 'Completed the 30 Days of JavaScript challenge by Wes Bos. The challenge consisted of 30 mini projects that were built using JavaScript.',
        image: jsimg,
        link: 'https://github.com/kareemassad/30-days-of-javascript',
        displayType: 'card',
        technologies: ['JavaScript']
    },
    {
        title: 'HackWestern 6: Empower',
        type: 'Hackathon Project',
        description: 'Empower is a web application that allows users to identify and post about local and global protests. The project was built using Python, Flask, MongoDB Atlas, and the Google Maps API.',
        image: empowerImg,
        link: 'https://github.com/kareemassad/Empower',
        displayType: 'card',
        technologies: ['Python', 'Flask', 'MongoDB Atlas', 'Google Maps API']
    },
    {
        title: 'uOttaHack 3: Basil',
        type: 'Hackathon Project',
        description: 'Basil takes ingredients you already have and suggests healthy recipes you can make. The project was built using JavaScript, React, Firebase.',
        image: basil_img,
        link: 'https://github.com/kareemassad/basil',
        displayType: 'card',
        technologies: ['JavaScript', 'React', 'Firebase']
    },
    {
        title: 'HevyAPI',
        type: 'Personal Project',
        description: 'Created an unoffical API using Python and FastAPI to retrieve and store data for the Hevy Gym application.',
        image: hevyImg,
        link: 'https://github.com/kareemassad/hevyAPI/tree/main',
        displayType: 'card',
        technologies: ['Python', 'FastAPI']
    },
    {
        title: 'CuHacking 2019: Assignment Sorter',
        type: 'Hackathon Project',
        description: 'The program prompts the user with a GUI which allows them to input several keywords. Those keywords are then used to parse and sort a set of files assigned by the user.',
        image: cuHackingimg,
        link: 'https://github.com/kareemassad/assignment-sorter',
        displayType: 'card',
        technologies: ['Python']
    },
    {
        title: 'Local Hack Day 2019: 4-player Manhunt Game',
        type: 'Hackathon Project',
        description: 'Inspired originally by the game mechanics of Pacman and the logic of the game manhunt, this game is a 4-player game that involves the hunters chasing prey until one team wins against the other.',
        image: manhuntimg,
        link: 'https://github.com/kareemassad/portable-manhunt',
        displayType: 'card',
        technologies: ['Java']
    }
]

export default class Projects extends Component {
    render() {
        const detailedProjects = projectList.filter(project => project.displayType === 'detailed');
        const cardProjects = projectList.filter(project => project.displayType === 'card');

        return (
            <div className="projects-wrapper">
                <div className="container">
                    <div className="row">
                        <div className="col projects-title">
                            Projects
                        </div>
                    </div>
                </div>
                {/* Detailed Projects Section */}
                <div className="container-projects detailed-projects">
                    <div className="detailed-section">
                        {detailedProjects.map((project, index) => (
                            <ProjectDisplay key={index} {...project} />
                        ))}
                    </div>
                </div>

                {/* Card-style Projects Section */}
                <div className="container-projects card-projects">
                    <h2>Other Projects</h2> {/* Heading for card projects */}
                    <div className="card-section">
                        {cardProjects.map((project, index) => (
                            <ProjectCard key={index} {...project} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}