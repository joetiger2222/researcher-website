import React, { useEffect, useRef, useState } from "react";
import Header from "./Header";
import homePageImg from "../images/homePageImg.png";
import "../css/HomePage.css";
import "../css/Header.css";
import "../../src/App.css";
import badge from "../images/badge.png";
import quiz from "../images/quiz.png";
import { BsFillCircleFill } from "react-icons/bs";
import coin from "../images/coin.png";
import quizCartoon from "../images/quizCartoon.png";
import Footer from "./Footer";
import LOGOJPG from "../images/LogoJPG.jpg"
import SearchIconLogo from "../images/Logo.png"
import loGo from "../images/Logo.png"
import video from "../images/intro video in home.mp4"
import research from "../images/research.png";
import SideBar from "./SideBar";
import toastr from "toastr";
import 'toastr/build/toastr.min.css';
import { useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { MyContext } from '../Users/Redux';
import { FaSearch } from "react-icons/fa";
export default function HomePage() {
  const [sideBarVisible, setSideBarVisible] = useState(false);
  // const [resercherId, setResearcherId] = useState(null);
  const [courses, setAllCourses] = useState(null);
  const [allSkills, setAllSkills] = useState(null);
  const [skillId, setSkillId] = useState(null);
  const navigate = useNavigate();
  // const userData = useLocation().state?.data;
  const userData = useContext(MyContext);
  


//   const observer = new IntersectionObserver((entries) => {
//     entries.forEach((entry) =>{
//       if(entry.isIntersecting){
//         entry.target.classList.add("show")
//       }else{
//         entry.target.classList.remove("show")
//       }
//     })
//   })
// const hiddenElements = document.querySelectorAll(".hidden");
// hiddenElements.forEach((el)=>observer.observe(el));

const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);


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

  function getAllCourses() {
    fetch(`https://localhost:7187/api/Courses`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setAllCourses(data));
  }

  useEffect(() => {
    getAllCourses();
  }, [userData]);

  function getResearcherIdByStudentId() {
    fetch(
      `https://localhost:7187/api/Researchers/ResearcherId/${userData.userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      }
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          userData.roles = "Researcher";
          userData.resercherId = data.researcherId;
          userData.setResercherId(data.researcherId);
        }
      })
      .catch((error) => console.error(error));
  }
  // console.log(userData)

  function getAllSkills() {
    fetch(`https://localhost:7187/api/Researchers/Skills`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const uniqueArray = Array.from(new Set(data.map((obj) => obj.id))).map(
          (id) => {
            return data.find((obj) => obj.id === id);
          }
        );
        setAllSkills(uniqueArray);
      })
      .catch((error) => console.error(error));
  }

  function checkQuiz() {
    fetch(
      `https://localhost:7187/api/Quizes/IsSuccessedFinalQuiz/${skillId}?studentId=${userData.userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      }
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          if (data.isSuccessed) toastr.success("you already succeded in this exam !","Success");
          else navigate(`/FinalQuiz/${skillId}`);
        }
      });
  }

  useEffect(() => {
    getResearcherIdByStudentId();
    getAllSkills();
  }, [userData]);

  const CourseCard = ({ course }) => {
    return (
      <div className="courseCard ">
        <h1
        //  className="shakingText"
        className="scalingText"
        >{course.name}</h1>
        <h3
        //  className="shakingText"
        className="scalingText"
        >Skill : {course.skillObj.name}</h3>
        
        <div className="courseBtnAndPriceDiv">
          <button
          style={{gap:"5px"}}
          className="bn54"
            onClick={() =>
              navigate(`/CourseDetails/${course.id}`)
            }
          >            <img style={{width:"20px",height:"20px"}} src={loGo}/>

            Details
          </button>
          <h4>{course.price} EGP</h4>
        </div>
      </div>
    );
  };

  console.log('courses',courses)

  if(userData.userId===''){
    return (
      <div style={{display:'flex',width:'100%',minHeight:'100vh',justifyContent:'center',alignItems:'center',flexDirection:'column',rowGap:'20px'}}>
        <h1>Please Login First</h1>
        <button style={{width:'120px',height:'50px',borderRadius:'10px',backgroundColor:'rgb(21, 46, 125)',color:'white',fontSize:'20px',fontWeight:'bold'}} onClick={()=>navigate('/')}>Login</button>
      </div>
    )
  }

  return (
    <div className="homePageContainer">
      <Header userData={userData} />

      <div className="ContainerLandingAndBadges">
        <div className="landingPage">
        <div  className="sidebarCloseIcon">
        <img style={{width:"100%"}} src={SearchIconLogo}/>
        </div>
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
            {/* <h3>Hello Students, Researchers</h3> */}
            <h1>Education and participation</h1>
            <p>Learning is something we do almost every day</p>
            {/* <button className="buttonn">Join Us Now!</button> */}
          </div>
        </div>
        <div className="badgesDivContainer">
          <div className="badgeDiv">
            <div className="ContNum">
              <h2>01</h2>
            </div>
            <div style={{height:"170px" ,display:"flex",flexDirection:"column",gap:"5px"}}>

            <h3>Best Doctors</h3>
            <p style={{padding:"5px",maxHeight:"130px",overflow:"auto"}} className="custom-scrollbar">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </p>
                        </div>

          </div>

          <div className="badgeDiv">
            <div className="ContNum">
              <h2>02</h2>
            </div>
            <div style={{height:"170px" ,display:"flex",flexDirection:"column",gap:"5px"}}>

            <h3>Best Students</h3>
            <p style={{padding:"5px",maxHeight:"130px",overflow:"auto"}} className="custom-scrollbar">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </p>
                       </div>
 
          </div>
          <div className="badgeDiv">
            <div className="ContNum">
              <h2>03</h2>
            </div>
            <div style={{height:"170px" ,display:"flex",flexDirection:"column",gap:"5px"}}>

            <h3>Best Researchers</h3>
            <p style={{padding:"5px",maxHeight:"130px",overflow:"auto"}} className="custom-scrollbar">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </p>
                        </div>

          </div>
          <div className="badgeDiv">
            <div className="ContNum">
              <h2>04</h2>
            </div>
            <div style={{height:"170px" ,display:"flex",flexDirection:"column",gap:"5px"}}>
            <h3>Best Ideas</h3>
            <p style={{padding:"5px",maxHeight:"130px",overflow:"auto"}} className="custom-scrollbar">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </p>
            </div>
          </div>

          {/* <div className="badgeDiv">
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
        </div> */}
        </div>
      </div>

      <div className="ContSkillAndAchievePrize">
        <div className="ContShape2Skill">
          <div className="Shape3 "></div>
          <div className="Shape4 "></div>

          <div className="quizContainer">

            {/* <div>
            <div>
              <h1>Take A Quiz</h1>
              <img src={quizCartoon} />
            </div>

            <img className="quizImg" src={quiz} />
          </div> */}
            <h1>Choose Skill Then Take a Quiz</h1>
            <select
              onChange={(e) => {
                setSkillId(e.target.value * 1);
              }}
              className="selectboxSkill "
              name="skillId"
              id="skill"
            >
              <option  selected disabled value="">
                Choose a Skill 
              </option>
              {allSkills?.map((skill) => {
                return <option value={skill.id}>{skill.name}</option>;
              })}
            </select>
            {skillId && (
              <button className="btnSkillHome" style={{gap:"5px",alignItems:"center",display:"flex",justifyContent:"center"}} onClick={checkQuiz}>
                Take Quiz             <img style={{width:"20px",height:"20px"}} src={loGo}/>

              </button>
            )}
          </div>
          <div className="Shape2"></div>
          <div className="Shape5"></div>

        </div>

        <div className="videoContainer" style={{width:"30%"}}>
               <h2 style={{textAlign:"center",padding:"5px"}}>Demonstration Video</h2>
                <video
                 poster={LOGOJPG}
                  controls style={{width:"100%"}}>
                  <source src={video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
           </div>
      </div>

      <div className="ContainerCoursesShape">
        <div className="coursesBigDiv">
          <h3>Couldn't Solve it?, No Problem. Take A Look On Our Courses</h3>
          <h1 >Our Courses</h1>
          <div className="coursesContainer">
            {courses?.map((course) => {
              return (
                  <CourseCard course={course} />
              );
            })}
          </div>
          <span className="ShapeInCourses1"></span>

        </div>
      </div>

      {/* <div className="researchContainer">
        <div>
          <div>
            <h1>Take A Quiz</h1>
            <img src={research} />
          </div>

          <img className="quizImg" src={quiz} />
        </div>
      </div> */}

      <Footer  />
    </div>
  );
}
