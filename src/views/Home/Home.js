import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./../Home/Home.css"
import Navabar from "./../../components/navbar/Navbar";
import Homeimg from "./../../assests/home-img.webp"

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
    </div>
  )
}

export default Home;