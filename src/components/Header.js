import React from "react";
import "../css/Header.css";
import userImg from "../images/userImg.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Header({userData,resercherId}) {

  const navigate=useNavigate();





  return (
    <div className="headerParent">
      <div className="headerContainer">
        <div className="headerLeft">
          <h1>Logo</h1>
        </div>

        <div className="headerRight">
          <ul className="headerUl">
           {resercherId&&<li>MarketPlace</li>}
            
            <li class="dropdown">
              <a href="javascript:void(0)" class="dropbtn">
                Courses
              </a>
              <div class="dropdown-content">
                <a href="#">Link 1</a>
                <a href="#">Link 2</a>
                <a href="#">Link 3</a>
              </div>
            </li>

            <li>Research</li>
          </ul>
          {!userData&&<div className="headerBtnsContainer">
            <button className="headerSignBtn">Login</button>
            <button className="headerSignBtn">Signup</button>
          </div>}
          {/* <img src={userImg} className="userImgHeader" /> */}

          <li class="dropdown">
              <img src={userImg} class="dropbtn userImgHeader"/>
              <div class="dropdown-content">
                <a onClick={()=>navigate(`/Profile`,{state:{data:userData}})}>Profile</a>
                <a href="#">Link 2</a>
                <a href="#">Link 3</a>
              </div>
            </li>
        </div>
      </div>
    </div>
  );
}
