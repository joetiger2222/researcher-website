import React from "react";
import Header from "./Header";
import homePageImg from "../images/homePageImg.png";
import "../css/HomePage.css";
import "../css/Header.css";
import { useState } from "react";
import badge from "../images/badge.png";
import quiz from "../images/quiz.png";
import CourseCard from "./CourseCard";
import coin from "../images/coin.png";
import quizCartoon from "../images/quizCartoon.png";
import Footer from "./Footer";
import research from "../images/research.png";
import SideBar from "./SideBar";
import { useLocation } from "react-router-dom";
export default function HomePage() {
  const [sideBarVisible, setSideBarVisible] = useState(false);
  const location=useLocation();
  // console.log('hello from home page',location.state.data)

  function renderSideBar() {
    if (sideBarVisible) {
      return <SideBar />;
    }
  }

  function renderSideBarIcon() {
    if (sideBarVisible) {
      return (
        <svg
          className="closeSvg"
          stroke="currentColor"
          fill="white"
          stroke-width="0"
          viewBox="0 0 24 24"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g>
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"></path>
          </g>
        </svg>
      );
    } else {
      return (
        <svg
          className="closeSvg"
          stroke="currentColor"
          fill="none"
          stroke-width="0"
          viewBox="0 0 24 24"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      );
    }
  }

  return (
    <div className="homePageContainer">
      <div className="landingPage">
        <Header />
        {renderSideBar()}
        <div
          style={{
            display: "none",
            position: "fixed",
            top: "20px",
            right: "50px",
            zIndex: "200",
          }}
          onClick={() => setSideBarVisible(!sideBarVisible)}
          class="sidebarClodeIcon"
        >
          {renderSideBarIcon()}
        </div>
        <div className="landingData">
          <h3>Hello Students, Researchers</h3>
          <h1>Welcome To Education</h1>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book
          </p>
          <button>Join Us Now!</button>
        </div>
      </div>
      <div className="badgesDivContainer">
        <div className="badgeDiv">
          <img src={badge} />
          <h1>Best Students</h1>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </p>
        </div>

        <div className="badgeDiv">
          <img src={badge} />
          <h1>Best Students</h1>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </p>
        </div>

        <div className="badgeDiv">
          <img src={badge} />
          <h1>Best Students</h1>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </p>
        </div>
      </div>

      <div className="quizContainer">
        <div>
          <div>
            <h1>Take A Quiz</h1>
            <img src={quizCartoon} />
          </div>

          <img className="quizImg" src={quiz} />
        </div>
      </div>

      <div className="earnPointsContainer">
        <h1>After Passing The Quiz You Earn Points</h1>
        <img src={coin} />
        <h3>These Points Qualify You To Be A Researcher</h3>
      </div>

      <div className="coursesBigDiv">
        <h3>Couldn't Solve it?, No Problem. Take A Look On Our Courses</h3>
        <h1>Our Courses</h1>
        <div className="coursesContainer">
          <CourseCard />
          <CourseCard />
          <CourseCard />
          <CourseCard />
        </div>
      </div>

      <div className="researchContainer">
        <div>
          <div>
            <h1>Take A Quiz</h1>
            <img src={research} />
          </div>

          <img className="quizImg" src={quiz} />
        </div>
      </div>

      <Footer />
    </div>
  );
}
