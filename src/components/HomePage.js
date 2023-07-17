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
import LOGOJPG from "../images/LogoJPG.jpg";
import SearchIconLogo from "../images/Logo.png";
import loGo from "../images/Logo.png";
import video from "../images/intro video in home.mp4";
import research from "../images/research.png";
import SideBar from "./SideBar";
import toastr from "toastr";
import coursesSvg from "../images/coursesSvg.png";
import easyImg from "../images/easy.png";
import community from "../images/community.png";
import mentors from "../images/mentors.png";
import enroll from "../images/enroll.png";
import international from "../images/international.png";

import Beginner from "../images/Beginner.png";
import Expert from "../images/Expert.png";
import intermediate from "../images/intermediate.png";
import Professional from "../images/Professional.png";

import "toastr/build/toastr.min.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { MyContext } from "../Users/Redux";
import { FaAccusoft, FaSearch } from "react-icons/fa";
import PhotoAbout from "../images/Logo - With Text.png";
export default function HomePage() {
  const [sideBarVisible, setSideBarVisible] = useState(false);
  // const [resercherId, setResearcherId] = useState(null);
  const [courses, setAllCourses] = useState(null);
  const [allSkills, setAllSkills] = useState(null);
  const [skillId, setSkillId] = useState(null);
  const navigate = useNavigate();
  // const userData = useLocation().state?.data;
  const userData = useContext(MyContext);

  const [showSecondParagraph, setShowSecondParagraph] = useState(false);

  const handleSwitch = () => {
    setShowSecondParagraph(!showSecondParagraph);
  };
  const [content, setContent] = useState("p1");

  const [activeParagraph, setActiveParagraph] = useState(0);

  useEffect(() => {
    // Auto slide to next paragraph every 3 seconds
    const timer = setInterval(() => {
      setActiveParagraph((prev) => (prev === 0 ? 1 : 0));
    }, 3000);

    return () => {
      clearInterval(timer);
    };
  }, []);
  useEffect(() => {
    // Auto slide to next paragraph every 3 seconds
    const timer = setInterval(() => {
      setActiveParagraph((prev) => (prev === 0 ? 1 : 0));
    }, 3000);

    return () => {
      clearInterval(timer);
    };
  }, []);
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
          fill="black"
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
        style={{zIndex:'300'}}
          className="closeSvg"
          stroke="currentColor"
          fill="black"
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
          if (data.isSuccessed)
            toastr.success("you already succeded in this exam !", "Success");
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
        >
          {course.name}
        </h1>
        <h3
          //  className="shakingText"
          className="scalingText"
        >
          Skill : {course.skillObj.name}
        </h3>

        <div className="courseBtnAndPriceDiv">
          <button
            style={{ gap: "5px" }}
            className="bn54"
            onClick={() => navigate(`/CourseDetails/${course.id}`)}
          >
            {" "}
            <img style={{ width: "20px", height: "20px" }} src={loGo} />
            Details
          </button>
          <h4>{course.price} EGP</h4>
        </div>
      </div>
    );
  };

  

  if (userData.userId === "") {
    return (
      <div
        style={{
          display: "flex",
          width: "100%",
          minHeight: "100vh",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          rowGap: "20px",
        }}
      >
        <h1>Please Login First</h1>
        <button
          style={{
            width: "120px",
            height: "50px",
            borderRadius: "10px",
            backgroundColor: "rgb(21, 46, 125)",
            color: "white",
            fontSize: "20px",
            fontWeight: "bold",
          }}
          onClick={() => navigate("/")}
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="homePageContainer">
      <Header userData={userData} />

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

      <div className="ContainerLandingAndBadges">
        <div className="landingPage">
          <div className="sidebarCloseIcon">
            <img
              className="movingSearchIcon"
              style={{ width: "100%" }}
              src={SearchIconLogo}
            />
          </div>
          
          <div className="landingData">
            {/* <h3>Hello Students, Researchers</h3> */}
            <h1 style={{ width: "65%", textAlign: "center" }}>
              Start exploring, learning, and connecting with ResWeb today!
            </h1>
            {/* <h1>           Our mission            </h1> */}

            <p style={{ textAlign: "center", width: "60%" }}>
              Welcome to{" "}
              <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                ResWeb
              </span>
              , the leading platform for researchers and students seeking
              comprehensive courses, research opportunities, and a vibrant
              research community. We are dedicated to empowering researchers by
              providing a seamless and accessible environment for academic
              growth and collaboration.
            </p>
            {/* <button className="buttonn">Join Us Now!</button> */}
          </div>
        </div>
        <div className="badgesDivContainer">
          <div className="badgeDiv">
            <div className="ContNum">
              <h2>01</h2>
            </div>
            <div
              style={{
                height: "170px",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
              }}
            >
              <h3>Courses</h3>
              <p
                style={{
                  textAlign: "justiy",
                  padding: "5px",
                  maxHeight: "130px",
                  overflow: "auto",
                }}
                className="custom-scrollbar"
              >
                At{" "}
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                  ResWeb
                </span>
                , our mission is to bridge the gap between researchers and their
                aspirations (research opportunities). We offer a diverse range
                of high-quality courses designed to enhance your research skills
                and expand your knowledge in various fields. Our courses are
                carefully curated and offered at affordable prices, making them
                accessible to students and professionals alike. We believe that
                learning should be inclusive and cost-effective, and that's why
                we strive to provide exceptional value without compromising on
                quality.
              </p>
            </div>
          </div>

          <div className="badgeDiv">
            <div className="ContNum">
              <h2>02</h2>
            </div>
            <div
              style={{
                height: "170px",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
              }}
            >
              <h3>Research opportunities</h3>
              <p
                style={{
                  textAlign: "justiy",
                  padding: "5px",
                  maxHeight: "130px",
                  overflow: "auto",
                }}
                className="custom-scrollbar"
              >
                One of the unique features of{" "}
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                  ResWeb
                </span>{" "}
                is our Research Paper Enrollment Program. We understand the
                significance of publishing research papers as a crucial step
                towards academic and professional success. Our platform connects
                researchers with exciting opportunities to enroll in research
                papers and contribute to cutting-edge discoveries. By offering a
                curated selection of research ideas, we empower researchers to
                choose projects that align with their interests and expertise.
                We provide the necessary guidance and resources to ensure a
                seamless research experience, from proposal development to
                publication.
              </p>
            </div>
          </div>
          <div className="badgeDiv">
            <div className="ContNum">
              <h2>03</h2>
            </div>
            <div
              style={{
                height: "170px",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
              }}
            >
              <h3>International opportunities</h3>
              <p
                style={{
                  textAlign: "justiy",
                  padding: "5px",
                  maxHeight: "130px",
                  overflow: "auto",
                }}
                className="custom-scrollbar"
              >
                In addition to local opportunities,{" "}
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                  ResWeb
                </span>{" "}
                also offers international research opportunities from different
                countries. We collaborate with doctors and researchers from
                around the world to provide a diverse range of research projects
                and perspectives. This global network allows you to explore
                cross-cultural research collaborations, gain exposure to
                different research methodologies, and broaden your horizons as a
                researcher.
              </p>
            </div>
          </div>
          <div className="badgeDiv">
            <div className="ContNum">
              <h2>04</h2>
            </div>
            <div
              style={{
                height: "170px",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
              }}
            >
              <h3>Mentors and experts</h3>
              <p
                style={{
                  textAlign: "justiy",
                  padding: "5px",
                  maxHeight: "130px",
                  overflow: "auto",
                }}
                className="custom-scrollbar"
              >
                As part of our commitment to supporting researchers,{" "}
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                  ResWeb
                </span>{" "}
                provides access to a network of mentors and experts. These
                experienced professionals from various disciplines are available
                to provide guidance, mentorship, and valuable insights
                throughout your research journey. Whether you need assistance
                with project development, data analysis, or publication
                strategies, our mentors and experts are here to help you
                succeed.
              </p>
            </div>
          </div>
          <div className="badgeDiv">
            <div className="ContNum">
              <h2>05</h2>
            </div>
            <div
              style={{
                height: "170px",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
              }}
            >
              <h3>Community</h3>
              <p
                style={{
                  textAlign: "justiy",
                  padding: "5px",
                  maxHeight: "130px",
                  overflow: "auto",
                }}
                className="custom-scrollbar"
              >
                <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                  ResWeb
                </span>{" "}
                takes pride in fostering a vibrant research community where
                researchers can collaborate, exchange ideas, and form valuable
                connections. Our platform offers an organized and user-friendly
                system that allows researchers to easily navigate through
                available opportunities, connect with peers, chat with
                researchers, and stay up to date with the latest advancements in
                their fields of interest. We believe that collaboration fuels
                innovation, and we strive to create an environment that
                encourages meaningful interactions and fruitful partnerships.
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

    

      {/* <div class="hexagon"></div> */}

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
              <option selected disabled value="">
                Choose a Skill
              </option>
              {allSkills?.map((skill) => {
                return <option value={skill.id}>{skill.name}</option>;
              })}
            </select>
            {skillId && (
              <button
                className="btnSkillHome"
                style={{
                  gap: "5px",
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "center",
                }}
                onClick={checkQuiz}
              >
                <img style={{ width: "20px", height: "20px" }} src={loGo} />
                Take Quiz
              </button>
            )}
          </div>
          <div className="Shape2"></div>
          <div className="Shape5"></div>
        </div>

        <div className="videoContainer" style={{ width: "30%" }}>
          <h2 style={{ textAlign: "center", padding: "5px" }}>
            Demonstration Video
          </h2>
          <video poster={LOGOJPG} controls style={{ width: "100%" }}>
            <source src={video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
      <div className="AllContainerDetailsdata">
        <div style={{ borderColor: "#018C91" }} className="BigParentContainer">
          <div
            style={{ backgroundColor: "#018C91" }}
            className="smallParentContainerTop"
          >
            <p style={{fontWeight:"500",color:"white",fontSize:"40px"}}>01</p>
            <p style={{color:"white",fontWeight:"bold",fontSize:"18px"}}>Learn Research</p>
          </div>
          <div className="smallParentContainerBottom">
            <p className="custom-scrollbar">
              At <span style={{ fontWeight: "bold" }}>ResWeb</span> Platform, we
              offer a diverse range of high-quality courses designed to equip
              aspiring researchers with essential skills and knowledge. Our
              comprehensive curriculum covers various research methodologies,
              data analysis techniques, academic writing, and more.{" "}
              <span style={{ fontWeight: "bold" }}>
                Whether you are a beginner or looking to enhance your research
                expertise, our low-priced courses ensure accessibility for all
                students, empowering them to embark on a successful research
                journey.
              </span>
            </p>
          </div>
        </div>
        <div style={{ borderColor: "#BF2424" }} className="BigParentContainer">
          <div
            style={{ backgroundColor: "#BF2424" }}
            className="smallParentContainerTop"
          >
            <p style={{color:"white",fontWeight:"500",fontSize:"40px"}}>02</p>
            <p style={{color:"white",fontWeight:"bold",fontSize:"18px"}}>Gain Experience</p>
          </div>
          <div className="smallParentContainerBottom">
            <p className="custom-scrollbar">
              We believe that experience is invaluable in the world of research.
              Through our platform,{" "}
              <span style={{ fontWeight: "bold" }}>
                researchers have the opportunity to engage in practical projects
                and gain hands-on experience in their chosen fields.
              </span>{" "}
              By collaborating with professionals and established research
              projects, individuals can boost their practical skills,
              contributing to personal growth and enhancing their credibility as
              researchers.
            </p>
          </div>
        </div>
        <div style={{ borderColor: "#7A9C27" }} className="BigParentContainer">
          <div
            style={{ backgroundColor: "#7A9C27" }}
            className="smallParentContainerTop"
          >
            <p style={{fontWeight:"500",color:"white",fontSize:"40px"}}>03</p>
            <p style={{color:"white",fontWeight:"bold",fontSize:"18px",textAlign:"center"}}>Join Big Research Community</p>
          </div>
          <div className="smallParentContainerBottom">
            <p className="custom-scrollbar">
              Joining <span style={{ fontWeight: "bold" }}>ResWeb</span> opens
              the door to a thriving research community, where researchers from
              diverse backgrounds converge to share ideas, insights, and
              collaborate on innovative projects.{" "}
              <span style={{ fontWeight: "bold" }}>
                Our user-friendly interface allows easy interaction, direct
                chatting, fostering meaningful connections between researchers
                worldwide.
              </span>
              Engage in discussions, seek advice, and explore collaborative
              opportunities within our dynamic research community.
            </p>
          </div>
        </div>
        <div style={{ borderColor: "#B37B10" }} className="BigParentContainer">
          <div
            style={{ backgroundColor: "#B37B10" }}
            className="smallParentContainerTop"
          >
            <p style={{fontWeight:"500",color:"white",fontSize:"40px"}}>04</p>
            <p style={{color:"white",fontWeight:"bold",fontSize:"18px"}}> Participate in Real Projects</p>
          </div>
          <div className="smallParentContainerBottom">
            <p className="custom-scrollbar">
              At <span style={{ fontWeight: "bold" }}>ResWeb</span>, we take
              learning beyond theoretical concepts. Researchers can actively
              participate in real-world projects, allowing them to tackle
              challenges, apply their knowledge, and make a tangible impact.{" "}
              <span style={{ fontWeight: "bold" }}>
                Our platform connects individuals with ongoing research
                initiatives, enabling them to contribute meaningfully and
                broaden their perspectives in their respective fields.
              </span>
            </p>
          </div>
        </div>
        <div style={{ borderColor: "#934584" }} className="BigParentContainer">
          <div
            style={{ backgroundColor: "#934584" }}
            className="smallParentContainerTop"
          >
            <p style={{fontWeight:"500",color:"white",fontSize:"40px"}}>05</p>
            <p style={{color:"white",fontWeight:"bold",fontSize:"18px"}}>Publish a New Paper</p>
          </div>
          <div className="smallParentContainerBottom">
            <p className="custom-scrollbar">
              Publishing research findings is a significant milestone for any
              researcher, and at ResWeb, we strive to make this achievement
              attainable. <span style={{ fontWeight: "bold" }}>Our platform provides opportunities for researchers to
              submit their papers for publication consideration. </span> With a
              streamlined and organized research system, we ensure that the
              publication process is accessible and efficient, helping
              researchers share their discoveries with the broader academic
              community.
            </p>
          </div>
        </div>
        {/* <div className="ContainerTopBottom">
  <div className="BigParentContainer"> 
    <div className="smallParentContainer">
      <FaAccusoft/>
      <h2>sample</h2>

    </div>
    
  </div>
  <p className="custom-scrollbar">Lorem ipsum dolor,
       sit amet consectetur
        adipisicing elit.
         Soluta eveniet doloribus
          consequuntur consequatur
           maiores voluptatum quos repellendus dolorem error doloremque praesentium provident a sequi perspiciatis, beatae esse quasi! Expedita, et?</p>
  </div>
  
  <div className="ContainerTopBottom">
  <div className="BigParentContainer"> 
    <div className="smallParentContainer">
      <FaAccusoft/>
      <h2>sample</h2>

    </div>
    
  </div>
  <p className="custom-scrollbar">Lorem ipsum dolor,
       sit amet consectetur
        adipisicing elit.
         Soluta eveniet doloribus
          consequuntur consequatur
           maiores voluptatum quos repellendus dolorem error doloremque praesentium provident a sequi perspiciatis, beatae esse quasi! Expedita, et?</p>
  </div>
  <div className="ContainerTopBottom">
  <div className="BigParentContainer"> 
    <div className="smallParentContainer">
      <FaAccusoft/>
      <h2>sample</h2>

    </div>
    
  </div>
  <p className="custom-scrollbar">Lorem ipsum dolor,
       sit amet consectetur
        adipisicing elit.
         Soluta eveniet doloribus
          consequuntur consequatur
           maiores voluptatum quos repellendus dolorem error doloremque praesentium provident a sequi perspiciatis, beatae esse quasi! Expedita, et?</p>
  </div>
  <div className="ContainerTopBottom">
  <div className="BigParentContainer"> 
    <div className="smallParentContainer">
      <FaAccusoft/>
      <h2>sample</h2>

    </div>
    
  </div>
  <p className="custom-scrollbar">Lorem ipsum dolor,
       sit amet consectetur
        adipisicing elit.
         Soluta eveniet doloribus
          consequuntur consequatur
           maiores voluptatum quos repellendus dolorem error doloremque praesentium provident a sequi perspiciatis, beatae esse quasi! Expedita, et?</p>
  </div>
  <div className="ContainerTopBottom">
  <div className="BigParentContainer"> 
    <div className="smallParentContainer">
      <FaAccusoft/>
      <h2>sample</h2>

    </div>
    
  </div>
  <p className="custom-scrollbar">Lorem ipsum dolor,
       sit amet consectetur
        adipisicing elit.
         Soluta eveniet doloribus
          consequuntur consequatur
           maiores voluptatum quos repellendus dolorem error doloremque praesentium provident a sequi perspiciatis, beatae esse quasi! Expedita, et?</p>
  </div> */}
      </div>

      <div className="ContainerCoursesShape fadinAnimation">
        <div className="coursesBigDiv">
          <h3>Couldn't Solve it?, No Problem. Take A Look On Our Courses</h3>
          <h1>Our Courses</h1>
          <div className="coursesContainer">
            {courses?.map((course) => {
              return <CourseCard course={course} />;
            })}
          </div>
          <span className="ShapeInCourses1"></span>
        </div>
      </div>

      {/* <div className="AllAboutUsContainer">
      <h1>About Us</h1>
      <div className="AllLeftRightAboutUs">
        <div className="LeftContainer">
          <img src={PhotoAbout} alt="Company Logo" />
        </div>
        <div className="RightContainer">
          <p>
            This is the first paragraph. It's always visible.
          </p>
          {showSecondParagraph && (
            <p>
              This is the second paragraph. It's displayed when the switch is toggled.
            </p>
          )}
        </div>
      </div>
      <div className="SwitchContainer">
        <label className="SwitchLabel">
          <input
            type="checkbox"
            checked={showSecondParagraph}
            onChange={handleSwitch}
          />
          Switch
        </label>
      </div>
    </div> */}
      {/* <div className="AllAboutUsContainer" style={{ height: '500px' }}>
      <h1 style={{ zIndex: 10 }}>About Us</h1>
      <div className="AllLeftRightAboutUs">
        <div className="LeftContainer">
          <img src={PhotoAbout} alt="About Us" />
        </div>
        <div className="RightContainer">
          <p>First paragraph content</p>
          <p>Second paragraph content</p>
        </div>
      </div>
    </div> */}

      <div
        className="AllAboutUsContainer fadinAnimation"
        style={{ height: "600px" }}
      >
        <h1 style={{ zIndex: 10 }}>About Us</h1>
        <div className="AllLeftRightAboutUs">
          <div className="LeftContainer">
            <img src={PhotoAbout} alt="About Us" />
          </div>
          <div className="RightContainer">
            <div>
              <p
                className="custom-scrollbar"
                style={{
                  fontSize: "18px",
                  lineHeight: "1.5",
                  display: content === "p1" ? "block" : "none",
                }}
              >
                Join us at ResWeb and unlock a world of research opportunities.
                Whether you are a student starting your journey or a seasoned
                researcher seeking new avenues for collaboration, we are here to
                support you every step of the way.
              </p>
              <p
                className="custom-scrollbar"
                style={{
                  fontSize: "18px",
                  lineHeight: "1.5",
                  display: content === "p2" ? "block" : "none",
                }}
              >
                Second paragraph content Second paragraph content Second
                paragraph content Second paragraph content Second paragraph
                content Second paragraph content Second paragraph content Second
                paragraph content Second paragraph content Second paragraph
                content Second paragraph content Second paragraph content Second
                paragraph content Second paragraph content Second paragraph
                content Second paragraph content Second paragraph content Second
                paragraph content Second paragraph content Second paragraph
                content Second paragraph content Second paragraph content Second
                paragraph content Second paragraph content Second paragraph
                content Second paragraph content Second paragraph content
                content Second paragraph content Second paragraph content nd
                paragraph content
              </p>
            </div>
            <div>
              <button
                style={{
                  padding: "5px 25px",
                  backgroundColor:
                    content === "p1" ? "var(--button-color)" : "#e1d5d5",
                  border: "none",
                }}
                onClick={() => setContent("p1")}
              ></button>
              <button
                style={{
                  padding: "5px 25px",
                  backgroundColor:
                    content === "p2" ? "var(--button-color)" : "#e1d5d5",
                  border: "none",
                }}
                onClick={() => setContent("p2")}
              ></button>
            </div>
          </div>
        </div>
      </div>
      <div className="AllWhyChoose">
        <h1 style={{ fontSize: "3rem" }}>
          Why Choose{" "}
          <span style={{ fontWeight: "bold", fontSize: "30px" }}>ResWeb</span>
        </h1>
        <div className="ContainerWhy">
          <div className="cardWhyChooseRes">
            <div className="FirstInfo">
              <img src={coursesSvg} />
              <p>Comprehensive Courses</p>
            </div>
            <p style={{ padding: "20px" }}>
              Access a wide range of high-quality courses at affordable prices,
              tailored to enhance your research skills and knowledge.
            </p>
          </div>
          <div className="cardWhyChooseRes">
            <div className="FirstInfo">
              <img src={easyImg} />
              <p>Easy and Organized System</p>
            </div>
            <p style={{ padding: "20px" }}>
              Navigate our platform effortlessly, with a user-friendly interface
              that ensures a seamless research experience.
            </p>
          </div>
          <div className="cardWhyChooseRes">
            <div className="FirstInfo">
              <img src={enroll} />
              <p>Research Paper Enrollment</p>
            </div>
            <p style={{ padding: "20px" }}>
              Discover and enroll in exciting research papers, contributing to
              groundbreaking discoveries and building your academic portfolio.
            </p>
          </div>
          <div className="cardWhyChooseRes">
            <div className="FirstInfo">
              <img src={mentors} />
              <p>Mentors and Experts</p>
            </div>
            <p style={{ padding: "20px" }}>
              Benefit from the guidance and expertise of mentors and experts who
              are dedicated to supporting your research journey.
            </p>
          </div>
          <div className="cardWhyChooseRes">
            <div className="FirstInfo">
              <img src={community} />
              <p>Vibrant Research Community</p>
            </div>
            <p style={{ padding: "20px" }}>
              Connect with like-minded researchers, exchange ideas, and form
              valuable collaborations in our supportive and accessible community
            </p>
          </div>
          <div className="cardWhyChooseRes">
            <div className="FirstInfo">
              <img src={international} />
              <p>International Research Opportunities</p>
            </div>
            <p style={{ padding: "20px" }}>
              Explore research projects and perspectives from different
              countries, provided by doctors and researchers around the world.
            </p>
          </div>
        </div>
      </div>
      <div className="OurGradingSys">
        <h1>Our Grading System</h1>
        <div className="ContainerAlGrade">
          <p>1 Quiz = 1 point</p>
          <p>
            {" "}
            2 participations in research papers (in or out our platform) = 1
            point
          </p>
          <div className="AllUsers">
            <div>
              <img src={Beginner} />
              <p>Beginner 1-3 points</p>
            </div>
            <div>
              <img src={intermediate} />
              <p>intermediate 4-6 points</p>
            </div>
            <div>
              <img src={Professional} />
              <p>Professional 7-8 points</p>
            </div>
            <div>
              <img src={Expert} />
              <p>Expert 9-10 points</p>
            </div>
          </div>
          <div className="TextDownUsers">
            <p>
              • You must pass at least one quiz to be able to join the
              opportunities dashboard (just to ensure that the joining members
              are true researchers and at least have the basics of research)
            </p>
            <p>
              • You will be able to lead idea by having total 3 points or more
              according to the study design of your research paper.
            </p>
            <p>
              • If you have a research idea but you still are not able to lead a
              team, send it to us and we will assign a leader to your idea and
              your ownership will be preserved.
            </p>
          </div>
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

      <Footer />
    </div>
  );
}
