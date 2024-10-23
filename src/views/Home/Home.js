import React from 'react';
import {useNavigate } from 'react-router-dom';
import homeCss from './../Home/Home.css';

function Home() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>spliteasy</h1>
      <button onClick={()=>navigate("/add-list")} className="get-started-btn">Get Started</button>
    </div>
  )
}

export default Home;