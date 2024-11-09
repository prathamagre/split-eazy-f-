import React from 'react';
import {useNavigate } from 'react-router-dom';
import "./../Home/Home.css"
import Navabar from "./../../components/navbar/Navbar";

function Home() {
  const navigate = useNavigate();
  return (
    <div>
      <Navabar/>
      <div>
        <div>
        <img></img>
        </div>
        <div>
          <h2>Spliteasy</h2>
          <p>Manage Group Expenses Without the Math Headache!</p>
        <button onClick={()=>navigate("/add-list")} className="get-started-btn">Get Started</button>
        </div>

      
      </div>
    </div>
  )
}

export default Home;