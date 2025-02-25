// src/components/layouts/Header.js
import React from 'react';
import { Container, Navbar, Nav, Dropdown } from 'react-bootstrap';
import { FaUserCircle, FaBell, FaCog } from 'react-icons/fa';

const Header = () => {
    return (
        <Navbar bg="white" expand="lg" className="border-bottom">
            <Container fluid>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav>
                        <Nav.Link href="#notifications">
                            <FaBell />
                        </Nav.Link>
                        <Dropdown align="end">
                            <Dropdown.Toggle variant="link" id="user-dropdown" className="nav-link p-0">
                                <FaUserCircle size={20} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item href="#profile">Profile</Dropdown.Item>
                                <Dropdown.Item href="#settings">
                                    <FaCog className="me-2" /> Settings
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item href="#logout">Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;