import React, { Component } from 'react';
import './Projects.scss';
import ProjectDisplay from './ProjectDisplay';
import ProjectCard from './ProjectCard';


//imgs
import autonomousImg from '../../assets/images/autonomous.png';
import sudokuGif from '../../assets/gifs/full-gif-99comp.gif';
import allauthlogo from '../../assets/images/allauth.png';
import jukeboxImg from '../../assets/images/jukebox.jpg';

const projectList = [
    {
        title: 'Autonomous Vehicle Initiative: Real-time Object Detection',
        type: 'Software Engineering Capstone Project',
        description: 'Created a real-time object detection system that was capable of recognizing and differentiating between Barricades, Traffic Lights, Traffic Signs, and Potholes. The system was built using Python and YOLOv7, and deployed on a Raspberry Pi 4.',
        image: autonomousImg,
        link: 'https://bit.ly/3Lz7sjm',
        displayType: 'detailed'
    },
    {
        title: 'django-allauth Library: EBay Social Provider',
        type: 'Open Source',
        description: 'Added a new feature to the django-allauth package that allows users to login with EBay OAuth2. This feature is currently in the review process and will be merged into the package soon.',
        image: allauthlogo,
        link: 'https://github.com/kareemassad/django-allauth',
        displayType: 'detailed'
    },
    {
        title: 'Sudoku.com Solver',
        type: 'Personal Project',
        description: 'A Python application that uses a backtracking algorithm and Python Selenium to interface and solve puzzles on sudoku.com.',
        image: sudokuGif,
        link: 'https://github.com/kareemassad/sudoku.com-solver-py',
        displayType: 'detailed'
    },
    {
        title: 'NFC Jukebox',
        type: 'Personal Project',
        description: 'Used Python to interface with an MFRC522 microcontroller to read NFC tags and play music based on the tag that was scanned. The application was hosted on a Raspberry Pi and used the Spotify API to play music on Amazon Alexa.',
        image: "blank",
        link: 'https://github.com/kareemassad/NFC-jukebox/',
        displayType: 'card'
    },
    {
        title: 'NFC Jukebox',
        type: 'Personal Project',
        description: 'Used Python to interface with an MFRC522 microcontroller to read NFC tags and play music based on the tag that was scanned. The application was hosted on a Raspberry Pi and used the Spotify API to play music on Amazon Alexa.',
        image: "blank",
        link: 'https://github.com/kareemassad/NFC-jukebox/',
        displayType: 'card'
    },
    {
        title: 'NFC Jukebox',
        type: 'Personal Project',
        description: 'Used Python to interface with an MFRC522 microcontroller to read NFC tags and play music based on the tag that was scanned. The application was hosted on a Raspberry Pi and used the Spotify API to play music on Amazon Alexa.',
        image: "blank",
        link: 'https://github.com/kareemassad/NFC-jukebox/',
        displayType: 'card'
    },
    {
        title: 'NFC Jukebox',
        type: 'Personal Project',
        description: 'Used Python to interface with an MFRC522 microcontroller to read NFC tags and play music based on the tag that was scanned. The application was hosted on a Raspberry Pi and used the Spotify API to play music on Amazon Alexa.',
        image: "blank",
        link: 'https://github.com/kareemassad/NFC-jukebox/',
        displayType: 'card'
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
                    <h2>Detailed Projects</h2> {/* Heading for detailed projects */}
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