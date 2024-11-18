import React from 'react'
import "./../navbar/Navbar.css"

const SplitEasyNavbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
            <a href='/'><h1>Split Easy</h1></a>
            </div>
            <ul className="navbar-links">
                <li><a href="/">Home</a></li>
                <li><a href="add-list">Add List</a></li>
                <li><a href="list-page">Listings</a></li>
            </ul>
        </nav>
    );
};

export default SplitEasyNavbar;