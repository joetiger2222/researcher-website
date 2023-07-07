import React, { useEffect, useState } from "react";
import { FaFacebook } from "react-icons/fa";

import { FaLinkedin } from "react-icons/fa";

import { FaTwitterSquare } from "react-icons/fa";

import { FaWhatsapp } from "react-icons/fa";
import toastr from "toastr";
import 'toastr/build/toastr.min.css';
import "../css/Footer.css";
const Footer = ({ userData }) => {
  const [showProblemCard, setShowProblemCard] = useState(false);
  // console.log('from footer',userData)

  const ProblemCard = (props) => {
    const [problemCategories, setProblemCategories] = useState(null);
    const [problem, setProblem] = useState({
      description: "",
      studentId: userData.userId,
      problemCategoryId: 0,
    });

    function getProblemData(e) {
      setProblem((prev) => {
        return {
          ...prev,
          [e.target.name]: e.target.value,
        };
      });
    }

    function getProblemCategories() {
      fetch(`https://localhost:7187/api/Admin/ProblemCategories`)
        .then((res) =>
          res.ok ? res.json() : toastr.error("failed to load problem categories","Failed")
        )
        .then((data) => (data ? setProblemCategories(data) : null));
    }

    function sendProblem() {
      fetch(`https://localhost:7187/api/Students/Problems`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify(problem),
      }).then((res) => {
        if (res.ok) {
          toastr.success("Problem Sent Successfully","Success");
          props.onClose();
        } else toastr.error("Failed To Send Problem","Failed");
      });
    }

    useEffect(() => {
      getProblemCategories();
    }, []);

    if (!props.show) return null;
    return (
      <div
        className="modal-overlay2"
      >
        <div
          className="modal2"
        >
          <div className="ContExitbtn" >
          <div className="outer" onClick={props.onClose}>
            <div className="inner">
            <label className="label2">Exit</label>
            </div>
          </div>
          </div>
          
          <h2 className="headContact">Send Request</h2>
          <div className="FormModal2">
         <select
          className="InputModalHallDetails"
            name="problemCategoryId"
            onChange={(e) =>
              setProblem((prev) => {
                return { ...prev, [e.target.name]: e.target.value * 1 };
              })
            }
          >
            <option selected disabled>
              Select Category
            </option>
            {problemCategories?.map((cat) => {
              return <option value={cat.id}>{cat.name}</option>;
            })}
          </select>
          <label className="AllLabeles">Enter Problem Description : </label>
          <input className="InputModalHallDetails" name="description" onChange={getProblemData}></input>
          
          <div className="buttonsOnModal">
          <button  onClick={sendProblem}>Send</button>
          <button  onClick={props.onClose}>Cancel</button>
          
          </div>
          </div>
          
        </div>
      </div>
    );
  };

  return (
    <div className="Footer">
      {!userData&&<div className="btnsFooter">
        <button>Login</button>
        <button>Sign Up</button>
      </div>}
      <div className="IconsFooter">
        <FaFacebook className="icon-footer " />

        <FaLinkedin className=" icon-footer" />

        <FaWhatsapp className=" icon-footer" />

        <FaTwitterSquare className="  icon-footer" />
      </div>
      <div className="aboutUsAndContact">
        <a href="#">About Us</a>
        <a href="#">Contact Us </a>
      </div>
      <div className="AllRightReserved">
        <p>&#169; All Rights Are Reserved For Teamwork</p>
      </div>
      <div>
        <button
        className="bn54"
        onClick={() => setShowProblemCard(true)}>
          Send You Problem To Admin
        </button>
        {showProblemCard && (
          <ProblemCard
            show={showProblemCard}
            onClose={() => setShowProblemCard(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Footer;
