import React from "react";
import Header from "./Header";
import homePageImg from "../images/homePageImg.png";
import "../css/HomePage.css";
import "../css/Header.css";
import { useState } from "react";
export default function HomePage() {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleMouseEnter = () => {
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    setShowDropdown(false);
  };
  return (
    <div className="homePageContainer">
        
      <div className="landingPage">
        <Header
          onHover={() => setShowDropdown(true)}
          onNotHover={() => setShowDropdown(false)}
        />

        {/* {showDropdown && (
          <div className="dropdown">
            <ul>
              <li>Option 1</li>
              <li>Option 2</li>
              <li>Option 3</li>
            </ul>
          </div>
        )} */}
      </div>
    </div>
  );
}
