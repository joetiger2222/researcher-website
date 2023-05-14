import React, { useEffect } from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";
import kariem from "../images/userImg.png";
import { useState } from "react";
import "../css/Modal.css";
import "../css/Profile.css";
import { useLocation } from "react-router-dom";
import Header from "./Header";

import ModalEditProfile from "./ModalEditProfile";
const Profile = () => {
  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [researcherData, setResearcherData] = useState(null);
  const [showAddPaper, setShowAddPaper] = useState(false);
  const userData = useLocation().state?.data;

  function getStudentData() {
    fetch(`https://localhost:7187/api/Students/${userData?.userId}`,{
      method:"GET",
      headers:{
        "Authorization":`Bearer ${userData?.token}`
      }
    })
      .then((res) =>res.ok?res.json():alert('Something Wrong Happened'))
      .then((data) => data?setStudentData(data):null);
  }

  



  function getResearcherData() {
    fetch(`https://localhost:7187/api/Researchers/${userData?.resercherId}`,{
      method:"GET",
      headers:{
        "Authorization":`Bearer ${userData?.token}`
      }
    })
      .then((res) => res.ok?res.json():null)
      .then((data) => data?setResearcherData(data):null);
  }

  useEffect(() => {
    getStudentData();
    getResearcherData();
   
  }, []);



  const WatchedCourse = () => (
    <div className="watchedCourse">
      <h4>Course Name</h4>
      <p>Category</p>
    </div>
  );

  const BadgeName = ({b}) => (
    <div className="badge">
      <h4>{b?.name}</h4>
    </div>
  );

  const Task = () => <h4>Task</h4>;

  const AddPaperModal = (props) => {
    const [paperData, setPaperData] = useState({
      name: "",
      citation: "",
      url: "",
    });
    // console.log(paperData);
    function getPaperData(e) {
      setPaperData((prev) => {
        return {
          ...prev,
          [e.target.name]: e.target.value,
        };
      });
    }

    function createPaper() {
      let peperArr = [];
      peperArr.push(paperData);
      fetch(
        `https://localhost:7187/api/Researchers/Papers/${researcherData?.id}`,
        {
          method: "POST",
          headers: {
            "Authorization":`Bearer ${userData?.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(peperArr),
        }
      ).then((res) => res.ok?window.location.reload():alert('failed to add paper'));
    }

    if (!props.show) return null;

    return (
      <div
        style={{
          position: "fixed",
          left: "0",
          top: "0",
          right: "0",
          bottom: "0",
          backgroundColor: "rgba(0, 0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: "100",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h1 style={{ color: "black" }}>Create New Paper</h1>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "white",
            }}
          >
            <label>Paper Name:</label>
            <input
              onChange={getPaperData}
              name="name"
              placeholder="Name..."
            ></input>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "white",
            }}
          >
            <label>Paper Citation:</label>
            <input
              onChange={getPaperData}
              name="citation"
              placeholder="Citation..."
            ></input>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "white",
            }}
          >
            <label>Paper Url:</label>
            <input
              onChange={getPaperData}
              name="url"
              placeholder="Url..."
            ></input>
          </div>
          <button onClick={createPaper}>Create</button>
          <button onClick={props.onClose}>Cancel</button>
        </div>
      </div>
    );
  };

  return (
    <div className="ParentHeadData">
      <Header userData={userData}  />
      <div className="profile-header" style={{marginTop:'130px'}}>
        <div className="imageProfDiv">
          <img src={kariem} alt="Profile" className="profile-image" />
          {/* <p className="nameUser">Wedding Planner</p> */}
        </div>
        <div className="profile-details">
          <h1 className="profile-name">
            {studentData?.firstName + " " + studentData?.lastName}
          </h1>
          <p className="profile-bio">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis
            beatae non rerum ab es.
          </p>
          <div className="social-icons">
            <a href="#">
              <FaInstagram />
            </a>
            <a href="#">
              <FaFacebook />
            </a>
            <a href="#">
              <FaTwitter />
            </a>
          </div>
        </div>
        <div className="btnsPlannerProf">
          <div className="planner-prof-btn-div">
            <Link
              className="btn-flip"
              data-back="Contact"
              data-front="Contact"
              to="#"
            ></Link>
          </div>
          <div className="planner-prof-btn-div">
            <Link
              onClick={() => setShowEdit(true)}
              className="btn-flip"
              data-back="Edit"
              data-front="Edit"
            ></Link>
            <ModalEditProfile
              onClose={() => setShowEdit(false)}
              show={showEdit}
            />
          </div>

          <div className="planner-prof-btn-div">
            <Link
              onClick={() => setShow(true)}
              className="btn-flip"
              data-back="AddPlan"
              data-front="AddPlan"
              to="#"
            ></Link>
            <ModalEditProfile onClose={() => setShow(false)} show={show} />
          </div>
        </div>
      </div>

      <div className="badgesAndPoints">
        <div className="badgesContainer">
          <h1>Badges</h1>
          <div className="badgesDiv">
            {researcherData?.badges.map(b=>{
              return(
                <BadgeName b={b}/>
              )
            })}
          </div>
        </div>

        <div className="pointsContainer">
          <h1>Points</h1>
          <div className="pointsDiv">
            <li
              className="profileBeg"
              style={{
                backgroundColor: researcherData?.level === 0 ? "gray" : "",
              }}
            >
              Beginner (0-2) Points
            </li>
            <li
              className="profileInter"
              style={{
                backgroundColor: researcherData?.level === 1 ? "gray" : "",
              }}
            >
              Intermediate (2-6) Points
            </li>
            <li
              className="profileExp"
              style={{
                backgroundColor: researcherData?.level >= 2 ? "gray" : "",
              }}
            >
              Expert (6{"<"}points)
            </li>
          </div>
        </div>
      </div>

      <div className="DataForLeftRight">
        <div className="leftBox">
          <h1>Enrolled Courses</h1>
          <div>
            <WatchedCourse />
            <WatchedCourse />
            <WatchedCourse />
            <WatchedCourse />
          </div>
        </div>
        <div className="RightBox">
          <h1>Current Idea</h1>
          <div className="tasksDiv">
            <Task />
            <Task />
            <Task />
            <Task />
            <Task />
          </div>
        </div>
      </div>

      {userData.roles==='Researcher' && (
        <div
          style={{
            color: "white",
            border: "1px solid white",
            display: "flex",
            flexDirection: "column",
            padding: "20px",
            alignItems: "center",
          }}
        >
          <h1>Papers</h1>
          <div style={{ display: "flex", columnGap: "40px" }}>
            {researcherData?.papers?.map((paper) => {
              return (
                <div>
                  <p>{"Paper Name : " + paper?.name}</p>
                  <p>{"Paper citation : " + paper?.citation}</p>
                  <p>{"Paper url : " + paper?.url}</p>
                </div>
              );
            })}
          </div>
          <button onClick={() => setShowAddPaper(true)}>Add New Paper</button>
          <AddPaperModal
            show={showAddPaper}
            onClose={() => setShowAddPaper(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Profile;
