import React, { useEffect, useState } from "react";
import { FaFacebook } from "react-icons/fa";

import { FaLinkedin } from "react-icons/fa";

import { FaTwitterSquare } from "react-icons/fa";

import { FaWhatsapp } from "react-icons/fa";

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
          res.ok ? res.json() : alert("failed to load problem categories")
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
          alert("Problem Sent Successfully");
          props.onClose();
        } else alert("Failed To Send Problem");
      });
    }

    useEffect(() => {
      getProblemCategories();
    }, []);

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
            width: "50%",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>Enter Problem Description : </span>
          <input name="description" onChange={getProblemData}></input>
          <select
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
          <button onClick={sendProblem}>Send</button>
          <button onClick={props.onClose}>Cancel</button>
        </div>
      </div>
    );
  };

  return (
    <div className="Footer">
      <div className="btnsFooter">
        <button>Login</button>
        <button>Sign Up</button>
      </div>
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
        <button onClick={() => setShowProblemCard(true)}>
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
