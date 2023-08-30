import React, { useEffect, useState } from "react";
import Header from "./Header";
import "../css/HomePage.css";
import "../css/Header.css";
import "../../src/App.css";
import Community from "../images/community.png";
import enroll from "../images/enroll.png";
import publish from "../images/publish.png";
import Footer from "./Footer";
import LOGOJPG from "../images/LogoJPG.jpg";
import SearchIconLogo from "../images/Logo.png";
import loGo from "../images/Logo.png";
import video from "../images/intro video in home.mp4";
import SideBar from "./SideBar";
import toastr from "toastr";
import coursesSvg from "../images/coursesSvg.png";
import easyImg from "../images/easy.png";
import mentors from "../images/mentors.png";
import international from "../images/international.png";
import Beginner from "../images/Beginner.png";
import Expert from "../images/Expert.png";
import intermediate from "../images/intermediate.png";
import Professional from "../images/Professional.png";
import "toastr/build/toastr.min.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { MyContext } from "../Users/Redux";
import PhotoAbout from "../images/Logo - With Text.png";
import loader from "../loader.gif";
export default function HomePage() {
  const [sideBarVisible, setSideBarVisible] = useState(false);
  const [courses, setAllCourses] = useState(null);
  const [allSkills, setAllSkills] = useState(null);
  const [skillId, setSkillId] = useState(null);
  const navigate = useNavigate();
  const userData = useContext(MyContext);

  const [content, setContent] = useState("p1");

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
          style={{ zIndex: "300" }}
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
    fetch(`https://resweb-001-site1.htempurl.com/api/Courses`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setAllCourses(data));
  }

  useEffect(() => {
    if (userData.userId !== "" && courses === null) {
      getAllCourses();
    }
    if (userData.userId !== "" && allSkills === null) {
      getAllSkills();
    }
  }, [userData]);

  function getAllSkills() {
    fetch(`https://resweb-001-site1.htempurl.com/api/Researchers/Skills`, {
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
      `https://resweb-001-site1.htempurl.com/api/Quizes/IsSuccessedFinalQuiz/${skillId}?studentId=${userData.userId}`,
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
            onClick={() =>
              navigate(`/CourseDetails/${course.id}`, {
                state: { data: course },
              })
            }
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
      <div className="homePageContainer">
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
              <h1 style={{ width: "65%", textAlign: "center" }}>
                Unlocking The Research World
              </h1>

              <p
                style={{ textAlign: "center", width: "60%", fontSize: "20px" }}
              >
                Start exploring, learning, and connecting with ResWeb today!
              </p>
            </div>
          </div>
          <div className="badgesDivContainer">
            <div className="badgeDiv">
              <div className="ContNum">
                <h2>01</h2>

                {/* <img src={learnResearch}/> */}
              </div>
              <div
                style={{
                  height: "170px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                }}
              >
                <h3>Learn Research</h3>
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
                  , our mission is to bridge the gap between researchers and
                  their aspirations (research opportunities). We offer a diverse
                  range of high-quality courses designed to enhance your
                  research skills and expand your knowledge in various fields.
                  Our courses are carefully curated and offered at affordable
                  prices, making them accessible to students and professionals
                  alike. We believe that learning should be inclusive and
                  cost-effective, and that's why we strive to provide
                  exceptional value without compromising on quality.
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
                <h3>Gain Experience</h3>
                <p
                  style={{
                    textAlign: "justiy",
                    padding: "5px",
                    maxHeight: "130px",
                    overflow: "auto",
                  }}
                  className="custom-scrollbar"
                >
                  We believe that experience is invaluable in the world of
                  research. Through our platform,{" "}
                  <span style={{ fontWeight: "bold" }}>
                    researchers have the opportunity to engage in practical
                    projects and gain hands-on experience in their chosen
                    fields.
                  </span>{" "}
                  By collaborating with professionals and established research
                  projects, individuals can boost their practical skills,
                  contributing to personal growth and enhancing their
                  credibility as researchers.
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
                <h3>Join Big Research Community</h3>
                <p
                  style={{
                    textAlign: "justiy",
                    padding: "5px",
                    maxHeight: "130px",
                    overflow: "auto",
                  }}
                  className="custom-scrollbar"
                >
                  Joining <span style={{ fontWeight: "bold" }}>ResWeb</span>{" "}
                  opens the door to a thriving research community, where
                  researchers from diverse backgrounds converge to share ideas,
                  insights, and collaborate on innovative projects.{" "}
                  <span style={{ fontWeight: "bold" }}>
                    Our user-friendly interface allows easy interaction, direct
                    chatting, fostering meaningful connections between
                    researchers worldwide.
                  </span>
                  Engage in discussions, seek advice, and explore collaborative
                  opportunities within our dynamic research community.
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
                <h3> Participate in Real Projects</h3>
                <p
                  style={{
                    textAlign: "justiy",
                    padding: "5px",
                    maxHeight: "130px",
                    overflow: "auto",
                  }}
                  className="custom-scrollbar"
                >
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
                <h3> Publish a New Paper</h3>
                <p
                  style={{
                    textAlign: "justiy",
                    padding: "5px",
                    maxHeight: "130px",
                    overflow: "auto",
                  }}
                  className="custom-scrollbar"
                >
                  Publishing research findings is a significant milestone for
                  any researcher, and at ResWeb, we strive to make this
                  achievement attainable.{" "}
                  <span style={{ fontWeight: "bold" }}>
                    Our platform provides opportunities for researchers to
                    submit their papers for publication consideration.{" "}
                  </span>{" "}
                  With a streamlined and organized research system, we ensure
                  that the publication process is accessible and efficient,
                  helping researchers share their discoveries with the broader
                  academic community.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="ContSkillAndAchievePrize">
          {/* <div className="ContShape2Skill">
          <div className="Shape3 "></div>
          <div className="Shape4 "></div>

          <div className="quizContainer">
            
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
                Login To See All Skills
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
        </div> */}

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
        <div className="AllWhyChoose">
          <h1 style={{ fontSize: "3rem", textAlign: "center" }}>
            Why To Choose{" "}
            <span style={{ fontWeight: "bold", fontSize: "3.5rem" }}>
              ResWeb
            </span>
          </h1>
          <div className="ContainerWhy">
            <div className="cardWhyChooseRes">
              <div className="FirstInfo">
                <img src={coursesSvg} />
                <p>Comprehensive Courses</p>
              </div>
              <p style={{ padding: "20px" }}>
                Access a wide range of high-quality courses at affordable
                prices, tailored to enhance your research skills and knowledge.
              </p>
            </div>
            <div className="cardWhyChooseRes">
              <div className="FirstInfo">
                <img src={easyImg} />
                <p>Easy and Organized System</p>
              </div>
              <p style={{ padding: "20px" }}>
                Navigate our platform effortlessly, with a user-friendly
                interface that ensures a seamless research experience.
              </p>
            </div>
            <div className="cardWhyChooseRes">
              <div className="FirstInfo">
                <img src={enroll} />
                <p>Protection and Copy Rights</p>
              </div>
              <p style={{ padding: "20px" }}>
                Our platform is protecting researchers' copyright and privacy,
                providing strong security against plagiarism while offering
                determined support.
              </p>
            </div>
            <div className="cardWhyChooseRes">
              <div className="FirstInfo">
                <img src={mentors} />
                <p>Mentors and Experts</p>
              </div>
              <p style={{ padding: "20px" }}>
                Benefit from the guidance and expertise of mentors and experts
                who are dedicated to supporting your research journey.
              </p>
            </div>
            <div className="cardWhyChooseRes">
              <div className="FirstInfo">
                <img src={Community} />
                <p>Vibrant Research Community</p>
              </div>
              <p style={{ padding: "20px" }}>
                Connect with like-minded researchers, exchange ideas, and form
                valuable collaborations in our supportive and accessible
                community
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

        {/* <div className="ContainerCoursesShape fadinAnimation">
        <div className="coursesBigDiv">
          <h3>Couldn't Solve it?, No Problem. Take A Look On Our Courses</h3>
          <h1 style={{ fontSize: "3rem" }}>Our Courses</h1>
          <div className="coursesContainer">
            {!courses&&<img src={loader} />}
            {courses&&courses?.map((course) => {
              return <CourseCard course={course} />;
            })}
          </div>
          <span className="ShapeInCourses1"></span>
        </div>
      </div> */}
        <div className="AllContainerDetailsdata">
          <div
            style={{ borderColor: "#018C91" }}
            className="BigParentContainer"
          >
            <div
              style={{ backgroundColor: "#018C91" }}
              className="smallParentContainerTop"
            >
              <div style={{ width: "70px", height: "70px" }}>
                <img className="imgColors" src={publish} />
              </div>
              <p
                style={{ color: "white", fontWeight: "bold", fontSize: "18px" }}
              >
                Start Learning
              </p>
            </div>
            <div className="smallParentContainerBottom">
              <p className="custom-scrollbar" style={{ fontSize: "20px" }}>
                For students new to research, our{" "}
                <span style={{ fontWeight: "bold" }}>
                  courses provide essential skills and experience
                </span>
                . Gain the knowledge you need to excel.
              </p>
            </div>
          </div>
          <div
            style={{ borderColor: "#BF2424" }}
            className="BigParentContainer"
          >
            <div
              style={{ backgroundColor: "#BF2424" }}
              className="smallParentContainerTop"
            >
              <div style={{ width: "70px", height: "70px" }}>
                <img className="imgColors" src={coursesSvg} />
              </div>

              <p
                style={{ color: "white", fontWeight: "bold", fontSize: "18px" }}
              >
                Demonstrate Proficiency
              </p>
            </div>
            <div className="smallParentContainerBottom">
              <p className="custom-scrollbar" style={{ fontSize: "20px" }}>
                After completing a course, take a skill-specific quiz. Each
                successful quiz earns you a point. You{" "}
                <span style={{ fontWeight: "bold" }}>only need 1 point</span> to
                join the{" "}
                <span style={{ fontWeight: "bold" }}>
                  Research Opportunities Panel
                </span>{" "}
                to apply for exciting projects and join our{" "}
                <span style={{ fontWeight: "bold" }}>Researchers</span>{" "}
                community.
              </p>
            </div>
          </div>
          <div
            style={{ borderColor: "#7A9C27" }}
            className="BigParentContainer"
          >
            <div
              style={{ backgroundColor: "#7A9C27" }}
              className="smallParentContainerTop"
            >
              <div style={{ width: "70px", height: "70px" }}>
                <img className="imgColors" src={international} />
              </div>
              <p
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "18px",
                  textAlign: "center",
                }}
              >
                Expert Researcher Pathway
              </p>
            </div>
            <div className="smallParentContainerBottom">
              <p className="custom-scrollbar" style={{ fontSize: "20px" }}>
                <span style={{ fontWeight: "bold" }}>
                  Experienced researchers get two chances to pass a quiz
                </span>{" "}
                in the skill they are experienced at.{" "}
                <span style={{ fontWeight: "bold" }}>
                  Passing only one quiz
                </span>{" "}
                opens the door to the{" "}
                <span style={{ fontWeight: "bold" }}>
                  Research Opportunities Panel
                </span>
                . Keep in mind, different study designs require specific number
                of points – complexity dictates the points needed.
              </p>
            </div>
          </div>

          <div
            style={{ borderColor: "#B37B10" }}
            className="BigParentContainer"
          >
            <div
              style={{ backgroundColor: "#B37B10" }}
              className="smallParentContainerTop"
            >
              <div style={{ width: "70px", height: "70px" }}>
                <img className="imgColors" src={mentors} />
              </div>
              <p
                style={{ color: "white", fontWeight: "bold", fontSize: "18px" }}
              >
                {" "}
                Share your contributions
              </p>
            </div>
            <div className="smallParentContainerBottom">
              <p className="custom-scrollbar" style={{ fontSize: "20px" }}>
                <span style={{ fontWeight: "bold" }}>Elevate your profile</span>{" "}
                by incorporating previous research papers, each contributing to
                your points{" "}
                <span style={{ fontWeight: "bold" }}>
                  (2 published papers = 1 point)
                </span>
                and spotlighting your experience.
              </p>
            </div>
          </div>
          <div
            style={{ borderColor: "#934584" }}
            className="BigParentContainer"
          >
            <div
              style={{ backgroundColor: "#934584" }}
              className="smallParentContainerTop"
            >
              <div style={{ width: "70px", height: "70px" }}>
                <img className="imgColors" src={Community} />
              </div>
              <p
                style={{ color: "white", fontWeight: "bold", fontSize: "18px" }}
              >
                Elevate Your Role
              </p>
            </div>
            <div className="smallParentContainerBottom">
              <p className="custom-scrollbar" style={{ fontSize: "20px" }}>
                Collect points by{" "}
                <span style={{ fontWeight: "bold" }}>
                  doing quizzes and demonstrating published work{" "}
                </span>
                to boost your chances. Remember, some research projects require
                <span style={{ fontWeight: "bold" }}> higher points</span> based
                on study complexity. Spot yourself at the forefront of research
                leadership. Engage with us today!"
              </p>
            </div>
          </div>
          <div className="OurGradingSys">
            <h1 style={{ fontSize: "3rem", textAlign: "center" }}>
              Our Grading System
            </h1>
            <div className="ContainerAlGrade">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "20px",
                  fontSize: "18px",
                  fontWeight: "500",
                }}
              >
                <p>1 Quiz = 1 point</p>
                <p>
                  {" "}
                  2 participations in research papers (in or out our platform) =
                  1 point
                </p>
              </div>
              <div className="AllUsers">
                <div>
                  <img src={Beginner} />
                  <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                    Beginner 1-3 points
                  </p>
                </div>
                <div>
                  <img src={intermediate} />
                  <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                    intermediate 4-6 points
                  </p>
                </div>
                <div>
                  <img src={Professional} />
                  <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                    Professional 7-8 points
                  </p>
                </div>
                <div>
                  <img src={Expert} />
                  <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                    Expert 9-10 points
                  </p>
                </div>
              </div>
              <div className="TextDownUsers">
                <p>
                  • You must pass at least one quiz to be able to join the
                  opportunities dashboard (just to ensure that the joining
                  members are true researchers and at least have the basics of
                  research)
                </p>
                <p>
                  • You will be able to lead idea by having total 3 points or
                  more according to the study design of your research paper.
                </p>
                <p>
                  • If you have a research idea but you still are not able to
                  lead a team, send it to us and we will assign a leader to your
                  idea and your ownership will be preserved.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          className="AllAboutUsContainer fadinAnimation"
          style={{ height: "600px" }}
          id="aboutUsContainer"
        >
          <h1 style={{ zIndex: 10, fontSize: "3rem" }}>About Us</h1>
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
                  Welcome to ResWeb, the leading platform for researchers and
                  students seeking comprehensive courses, research
                  opportunities, and a vibrant research community. We are
                  dedicated to empowering researchers by providing a seamless
                  and accessible environment for academic growth and
                  collaboration.
                </p>
                <p
                  className="custom-scrollbar"
                  style={{
                    fontSize: "18px",
                    lineHeight: "1.5",
                    display: content === "p2" ? "block" : "none",
                  }}
                >
                  Join us at ResWeb and unlock a world of research
                  opportunities. Whether you are a student starting your journey
                  or a seasoned researcher seeking new avenues for
                  collaboration, we are here to support you every step of the
                  way.
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

        <Footer />
      </div>
    );
  }

  return (
    <div className="homePageContainer">
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

      <div className="ContainerLandingAndBadges" id="container">
        <div className="landingPage">
          <div className="sidebarCloseIcon">
            <img
              className="movingSearchIcon"
              style={{ width: "100%" }}
              src={SearchIconLogo}
            />
          </div>

          <div className="landingData">
            <h1 style={{ width: "65%", textAlign: "center" }}>
              Unlocking The Research World
            </h1>

            <p style={{ textAlign: "center", width: "60%", fontSize: "20px" }}>
              Start exploring, learning, and connecting with ResWeb today!
            </p>
          </div>
        </div>
        <div className="badgesDivContainer">
          <div className="badgeDiv">
            <div className="ContNum">
              <h2>01</h2>

              {/* <img src={learnResearch}/> */}
            </div>
            <div
              style={{
                height: "170px",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
              }}
            >
              <h3>Learn Research</h3>
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
              <h3>Gain Experience</h3>
              <p
                style={{
                  textAlign: "justiy",
                  padding: "5px",
                  maxHeight: "130px",
                  overflow: "auto",
                }}
                className="custom-scrollbar"
              >
                We believe that experience is invaluable in the world of
                research. Through our platform,{" "}
                <span style={{ fontWeight: "bold" }}>
                  researchers have the opportunity to engage in practical
                  projects and gain hands-on experience in their chosen fields.
                </span>{" "}
                By collaborating with professionals and established research
                projects, individuals can boost their practical skills,
                contributing to personal growth and enhancing their credibility
                as researchers.
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
              <h3>Join Big Research Community</h3>
              <p
                style={{
                  textAlign: "justiy",
                  padding: "5px",
                  maxHeight: "130px",
                  overflow: "auto",
                }}
                className="custom-scrollbar"
              >
                Joining <span style={{ fontWeight: "bold" }}>ResWeb</span> opens
                the door to a thriving research community, where researchers
                from diverse backgrounds converge to share ideas, insights, and
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
              <h3> Participate in Real Projects</h3>
              <p
                style={{
                  textAlign: "justiy",
                  padding: "5px",
                  maxHeight: "130px",
                  overflow: "auto",
                }}
                className="custom-scrollbar"
              >
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
              <h3> Publish a New Paper</h3>
              <p
                style={{
                  textAlign: "justiy",
                  padding: "5px",
                  maxHeight: "130px",
                  overflow: "auto",
                }}
                className="custom-scrollbar"
              >
                Publishing research findings is a significant milestone for any
                researcher, and at ResWeb, we strive to make this achievement
                attainable.{" "}
                <span style={{ fontWeight: "bold" }}>
                  Our platform provides opportunities for researchers to submit
                  their papers for publication consideration.{" "}
                </span>{" "}
                With a streamlined and organized research system, we ensure that
                the publication process is accessible and efficient, helping
                researchers share their discoveries with the broader academic
                community.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="ContSkillAndAchievePrize">
        <div className="ContShape2Skill">
          <div className="Shape3 "></div>
          <div className="Shape4 "></div>

          <div className="quizContainer">
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
      <div className="AllWhyChoose">
        <h1 style={{ fontSize: "3rem", textAlign: "center" }}>
          Why To Choose{" "}
          <span style={{ fontWeight: "bold", fontSize: "3.5rem" }}>ResWeb</span>
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
              <p>Protection and Copy Rights</p>
            </div>
            <p style={{ padding: "20px" }}>
              Our platform is protecting researchers' copyright and privacy,
              providing strong security against plagiarism while offering
              determined support.
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
              <img src={Community} />
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

      <div
        className="ContainerCoursesShape fadinAnimation"
        id="couresesContainer"
      >
        <div className="coursesBigDiv">
          <h3>Couldn't Solve it?, No Problem. Take A Look On Our Courses</h3>
          <h1 style={{ fontSize: "3rem" }}>Our Courses</h1>
          <div className="coursesContainer">
            {!courses && <img src={loader} />}
            {courses &&
              courses?.map((course) => {
                return <CourseCard course={course} />;
              })}
          </div>
          <span className="ShapeInCourses1"></span>
        </div>
      </div>
      <div className="AllContainerDetailsdata">
        <div style={{ borderColor: "#018C91" }} className="BigParentContainer">
          <div
            style={{ backgroundColor: "#018C91" }}
            className="smallParentContainerTop"
          >
            <div style={{ width: "70px", height: "70px" }}>
              <img className="imgColors" src={publish} />
            </div>
            <p style={{ color: "white", fontWeight: "bold", fontSize: "18px" }}>
              Start Learning
            </p>
          </div>
          <div className="smallParentContainerBottom">
            <p className="custom-scrollbar" style={{ fontSize: "20px" }}>
              For students new to research, our{" "}
              <span style={{ fontWeight: "bold" }}>
                courses provide essential skills and experience
              </span>
              . Gain the knowledge you need to excel.
            </p>
          </div>
        </div>
        <div style={{ borderColor: "#BF2424" }} className="BigParentContainer">
          <div
            style={{ backgroundColor: "#BF2424" }}
            className="smallParentContainerTop"
          >
            <div style={{ width: "70px", height: "70px" }}>
              <img className="imgColors" src={coursesSvg} />
            </div>

            <p style={{ color: "white", fontWeight: "bold", fontSize: "18px" }}>
              Demonstrate Proficiency
            </p>
          </div>
          <div className="smallParentContainerBottom">
            <p className="custom-scrollbar" style={{ fontSize: "20px" }}>
              After completing a course, take a skill-specific quiz. Each
              successful quiz earns you a point. You{" "}
              <span style={{ fontWeight: "bold" }}>only need 1 point</span> to
              join the{" "}
              <span style={{ fontWeight: "bold" }}>
                Research Opportunities Panel
              </span>{" "}
              to apply for exciting projects and join our{" "}
              <span style={{ fontWeight: "bold" }}>Researchers</span> community.
            </p>
          </div>
        </div>
        <div style={{ borderColor: "#7A9C27" }} className="BigParentContainer">
          <div
            style={{ backgroundColor: "#7A9C27" }}
            className="smallParentContainerTop"
          >
            <div style={{ width: "70px", height: "70px" }}>
              <img className="imgColors" src={international} />
            </div>
            <p
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: "18px",
                textAlign: "center",
              }}
            >
              Expert Researcher Pathway
            </p>
          </div>
          <div className="smallParentContainerBottom">
            <p className="custom-scrollbar" style={{ fontSize: "20px" }}>
              <span style={{ fontWeight: "bold" }}>
                Experienced researchers get two chances to pass a quiz
              </span>{" "}
              in the skill they are experienced at.{" "}
              <span style={{ fontWeight: "bold" }}>Passing only one quiz</span>{" "}
              opens the door to the{" "}
              <span style={{ fontWeight: "bold" }}>
                Research Opportunities Panel
              </span>
              . Keep in mind, different study designs require specific number of
              points – complexity dictates the points needed.
            </p>
          </div>
        </div>

        <div style={{ borderColor: "#B37B10" }} className="BigParentContainer">
          <div
            style={{ backgroundColor: "#B37B10" }}
            className="smallParentContainerTop"
          >
            <div style={{ width: "70px", height: "70px" }}>
              <img className="imgColors" src={mentors} />
            </div>
            <p style={{ color: "white", fontWeight: "bold", fontSize: "18px" }}>
              {" "}
              Share your contributions
            </p>
          </div>
          <div className="smallParentContainerBottom">
            <p className="custom-scrollbar" style={{ fontSize: "20px" }}>
              <span style={{ fontWeight: "bold" }}>Elevate your profile</span>{" "}
              by incorporating previous research papers, each contributing to
              your points{" "}
              <span style={{ fontWeight: "bold" }}>
                (2 published papers = 1 point)
              </span>
              and spotlighting your experience.
            </p>
          </div>
        </div>
        <div style={{ borderColor: "#934584" }} className="BigParentContainer">
          <div
            style={{ backgroundColor: "#934584" }}
            className="smallParentContainerTop"
          >
            <div style={{ width: "70px", height: "70px" }}>
              <img className="imgColors" src={Community} />
            </div>
            <p style={{ color: "white", fontWeight: "bold", fontSize: "18px" }}>
              Elevate Your Role
            </p>
          </div>
          <div className="smallParentContainerBottom">
            <p className="custom-scrollbar" style={{ fontSize: "20px" }}>
              Collect points by{" "}
              <span style={{ fontWeight: "bold" }}>
                doing quizzes and demonstrating published work{" "}
              </span>
              to boost your chances. Remember, some research projects require
              <span style={{ fontWeight: "bold" }}> higher points</span> based
              on study complexity. Spot yourself at the forefront of research
              leadership. Engage with us today!"
            </p>
          </div>
        </div>
        <div className="OurGradingSys">
          <h1 style={{ fontSize: "3rem", textAlign: "center" }}>
            Our Grading System
          </h1>
          <div className="ContainerAlGrade">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "20px",
                fontSize: "18px",
                fontWeight: "500",
              }}
            >
              <p>1 Quiz = 1 point</p>
              <p>
                {" "}
                2 participations in research papers (in or out our platform) = 1
                point
              </p>
            </div>
            <div className="AllUsers">
              <div>
                <img src={Beginner} />
                <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                  Beginner 1-3 points
                </p>
              </div>
              <div>
                <img src={intermediate} />
                <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                  intermediate 4-6 points
                </p>
              </div>
              <div>
                <img src={Professional} />
                <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                  Professional 7-8 points
                </p>
              </div>
              <div>
                <img src={Expert} />
                <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                  Expert 9-10 points
                </p>
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
                • If you have a research idea but you still are not able to lead
                a team, send it to us and we will assign a leader to your idea
                and your ownership will be preserved.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="AllAboutUsContainer fadinAnimation"
        style={{ height: "600px" }}
        id="aboutUsContainer"
      >
        <h1 style={{ zIndex: 10, fontSize: "3rem" }}>About Us</h1>
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
                Welcome to ResWeb, the leading platform for researchers and
                students seeking comprehensive courses, research opportunities,
                and a vibrant research community. We are dedicated to empowering
                researchers by providing a seamless and accessible environment
                for academic growth and collaboration.
              </p>
              <p
                className="custom-scrollbar"
                style={{
                  fontSize: "18px",
                  lineHeight: "1.5",
                  display: content === "p2" ? "block" : "none",
                }}
              >
                Join us at ResWeb and unlock a world of research opportunities.
                Whether you are a student starting your journey or a seasoned
                researcher seeking new avenues for collaboration, we are here to
                support you every step of the way.
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

      <Footer />
    </div>
  );
}
