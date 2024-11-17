import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./../Home/Home.css";
import Navabar from "./../../components/navbar/Navbar";
import Homeimg from "./../../assests/home-img.webp";
import FeatImg1 from ".././../assests/tracking.png";
import FeatImg2 from "./../../assests/people.png";
import FeatImg3 from './../../assests/calculator.png';
import FeatImg4 from "./../../assests/data-entry.png";
import FeatImg5 from "./../../assests/financial-planning.png";
import FeatImg6 from "./../../assests/responsive-app.png";

function Home() {
  const navigate = useNavigate();
  return (
    <div>
      <Navabar />
      <div className='top-content'>

        <img className="home-img" src={Homeimg}></img>

        <div className='top-cont'>
          <h2 className='top-cont-txt'>Manage group expenses without the math headache with <span className='cont-name'>SplitEasy</span></h2>
          <button onClick={() => navigate("/add-list")} className="get-started-btn">Get Started</button>
        </div>
      </div>
      {/* features section */}
      <div className='features-section'>
        <h2 className='features-heading'>Features</h2>
        <div className='features-card-container'>
          <div className='feature-card'>
            <img className='feature-img' src={FeatImg1}></img>
            <h3>Expense Tracking</h3>
            <p>Allows users to track group expenses in a simple and organized manner.</p>
          </div>
          <div className='feature-card'>
            <img className='feature-img' src={FeatImg2}></img>
            <h3>Group Management</h3>
            <p>Users can create groups and add participants to each expense list.</p>
          </div>
          <div className='feature-card'>
            <img className='feature-img' src={FeatImg3}></img>
            <h3>Real-Time Calculations</h3>
            <p>Automatically calculates each participant’s share, ensuring transparency and fairness.</p>
          </div>
          <div className='feature-card'>
            <img className='feature-img' src={FeatImg4}></img>
            <h3>Easy Data Entry</h3>
            <p>Quick and intuitive interface for adding expenses, including descriptions, amounts, and participants.</p>
          </div>
          <div className='feature-card'>
            <img className='feature-img' src={FeatImg5}></img>
            <h3>Expense Summaries</h3>
            <p>Detailed breakdown of individual and group expenses.</p>
          </div>
          <div className='feature-card'>
            <img className='feature-img' src={FeatImg6}></img>
            <h3>Mobile-Friendly Design</h3>
            <p>Fully responsive layout, optimized for mobile devices, ensuring access anytime, anywhere.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;