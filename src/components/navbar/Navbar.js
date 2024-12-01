import React, { useState } from 'react';
import "./../navbar/Navbar.css";

const SplitEasyNavbar = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <a href="/"><h1>Split Easy</h1></a>
            </div>

            <button
                className={`menu-toggle ${isDrawerOpen ? "active" : ""}`}
                onClick={toggleDrawer}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            {/* Drawer */}
            <div className={`drawer ${isDrawerOpen ? "active" : ""}`}>
                <a href="/">Home</a>
                <a href="add-list">Add List</a>
                <a href="list-page">Listings</a>
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
