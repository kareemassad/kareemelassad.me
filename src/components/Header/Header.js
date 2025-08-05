import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import './Header.scss';

const Header = () => {
    return (
        <header className='header'>
            <Navbar collapseOnSelect expand="lg" bg="danger" variant="dark" fixed='top'>
                <Container>
                    <Navbar.Brand href="#home">Kareem El Assad</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link href="#bell-collection">Teta's Bell Collection</Nav.Link>
                            {/* <Nav.Link href="#projects">Projects</Nav.Link> */}
                            {/* <Nav.Link href="#involvement">Involvement</Nav.Link> */}
                            <Nav.Link href="#resume">Resume</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
};

export default Header;
