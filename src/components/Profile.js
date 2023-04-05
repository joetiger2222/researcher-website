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
      <div className="DataForLeftRight">
        <div className="leftBox"></div>
        <div className="RightBox"></div>
      </div>
    </div>
  );
};

export default Profile;
