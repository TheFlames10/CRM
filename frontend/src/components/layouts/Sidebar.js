// src/components/layouts/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    FaHome,
    FaUsers,
    FaUserTie,
    FaHandshake,
    FaCalendarAlt,
    FaBoxOpen
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <div className="sidebar bg-dark text-white">
            <div className="sidebar-header p-3">
                <h4>CRM System</h4>
            </div>
            <ul className="nav flex-column">
                <li className="nav-item">
                    <NavLink to="/" className="nav-link text-white">
                        <FaHome className="me-2" /> Dashboard
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/customers" className="nav-link text-white">
                        <FaUsers className="me-2" /> Customers
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/contacts" className="nav-link text-white">
                        <FaUserTie className="me-2" /> Contacts
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/opportunities" className="nav-link text-white">
                        <FaHandshake className="me-2" /> Opportunities
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/activities" className="nav-link text-white">
                        <FaCalendarAlt className="me-2" /> Activities
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/products" className="nav-link text-white">
                        <FaBoxOpen className="me-2" /> Products
                    </NavLink>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;