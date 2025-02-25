// src/components/layouts/Layout.js
import React from 'react';
import { Container } from 'react-bootstrap';
import Header from './Header';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = ({ children }) => {
    return (
        <div className="layout-container">
            <Sidebar />
            <div className="content-container">
                <Header />
                <Container fluid className="py-3">
                    {children}
                </Container>
            </div>
        </div>
    );
};

export default Layout;