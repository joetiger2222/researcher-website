import React from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";
import kariem from "../images/userImg.png";
import { useState } from "react";
import "../css/Modal.css";
import "../css/Profile.css";
import Header from "./Header";

import ModalEditProfile from "./ModalEditProfile";
const Profile = () => {
  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [plannerData, setPlannerData] = useState();

  const WatchedCourse = () => (
    <div className="watchedCourse">
      <h4>Course Name</h4>
      <p>Category</p>
    </div>
  );

  const BadgeName = () => (
    <div className="badge">
      <h4>Badge Name</h4>
    </div>
  );

  const Task = () => <h4>Task</h4>;

  return (
    <div className="ParentHeadData">
      <Header />
      <div className="profile-header">
        <div className="imageProfDiv">
          <img src={kariem} alt="Profile" className="profile-image" />
          <p className="nameUser">Wedding Planner</p>
        </div>
        <div className="profile-details">
          <h1 className="profile-name">Kariem Atef</h1>
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
            <BadgeName />
            <BadgeName />
            <BadgeName />
            <BadgeName />
          </div>
        </div>

        <div className="pointsContainer">
          <h1>Points</h1>
          <div className="pointsDiv">
            <li className="profileBeg">Beginner (0-2) Points</li>
            <li className="profileInter">Intermediate (2-6) Points</li>
            <li className="profileExp">Expert (6{"<"}points)</li>
          </div>
        </div>
      </div>

      <div className="DataForLeftRight">
        <div className="leftBox">
          <h1>Watched Courses</h1>
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
    </div>
  );
};

export default Profile;
