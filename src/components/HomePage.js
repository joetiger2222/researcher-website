import React from "react";
import Header from "./Header";
import homePageImg from "../images/homePageImg.png";
import "../css/HomePage.css";
import "../css/Header.css";
import { useState } from "react";
import badge from "../images/badge.png";
import quiz from '../images/quiz.png';
import CourseCard from "./CourseCard";
import coin from '../images/coin.png'
import quizCartoon from '../images/quizCartoon.png';

export default function HomePage() {
  return (
    <div className="homePageContainer">
      <div className="landingPage">
        <Header />
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
        <img  src={quizCartoon}/>
        </div>

        <img className="quizImg" src={quiz}/>
        </div>
        
      </div>
        
      <div className="earnPointsContainer">
        <h1>After Passing The Quiz You Earn Points</h1>
        <img src={coin}/>
        <h3>These Points Qualify You To Be A Researcher</h3>
        
      </div>



        <div className="coursesBigDiv">
        <h3>Couldn't Solve it?, No Problem. Take A Look On Our Courses</h3>
          <h1>Our Courses</h1>
      <div className="coursesContainer">
        
        <CourseCard/>
        <CourseCard/>
        <CourseCard/>
        <CourseCard/>

      </div>
      </div>


    </div>
  );
}
