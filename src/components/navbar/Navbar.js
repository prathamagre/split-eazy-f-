import React, { useState } from 'react';
import "./../navbar/Navbar.css";
import { useNavigate } from 'react-router-dom';

const SplitEasyNavbar = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const navigate = useNavigate();
    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <a href="/"><h1>SplitEasy</h1></a>
            </div>

            <button
                className={`menu-toggle ${isDrawerOpen ? "active" : ""}`}
                onClick={toggleDrawer}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            <ul className={`navbar-links ${isDrawerOpen ? "active" : ""}`}>
                <li onClick={() => navigate("/")}>Home</li>
                <li onClick={() => navigate("/add-list")}>Add List</li>
                <li onClick={() => navigate("/list-page")}>Listings</li>
            </ul>

             {/* Drawer */}
             <div className={`drawer ${isDrawerOpen ? "active" : ""}`}>
                <a onClick={() => navigate("/list-page")}>Home</a>
                <a onClick={() => navigate("/list-page")} href="add-list">Add List</a>
                <a onClick={() => navigate("/list-page")}href="list-page">Listings</a>
            </div>

            {/* Overlay */}
            <div
                className={`drawer-overlay ${isDrawerOpen ? "active" : ""}`}
                onClick={toggleDrawer}
            ></div>
        </nav>
    );
};

export default SplitEasyNavbar;
