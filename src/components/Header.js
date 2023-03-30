import React from "react";
import "../css/Header.css";
import userImg from "../images/userImg.png";
import { useState } from "react";
export default function Header({ onHover, onNotHover }) {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleMouseEnter = () => {
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    setShowDropdown(false);
  };

  return (
    <div className="headerParent">
      <div className="headerContainer">
        <div className="headerLeft">
          <h1>test</h1>
        </div>

        <div className="headerRight">
          <ul className="headerUl">
            <li>MarketPlace</li>
            {/* <li
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}>   
              Courses
        {showDropdown && ( 
            <ul>
              <li>Option 1</li>
              <li>Option 2</li>
              <li>Option 3</li>
            </ul>

        )}
    
            </li> */}
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
          <div className="headerBtnsContainer">
            <button className="headerSignBtn">Login</button>
            <button className="headerSignBtn">Signup</button>
          </div>
          <img src={userImg} className="userImgHeader" />
        </div>
      </div>
    </div>
  );
}
