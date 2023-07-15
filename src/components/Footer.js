import React, { useEffect, useState } from "react";
import { FaFacebook, FaInstagram } from "react-icons/fa";

import { FaLinkedin } from "react-icons/fa";
import Logo from "../images/Logo - Text Only.png"
import { FaTwitterSquare } from "react-icons/fa";
import { AiOutlineWhatsApp } from "react-icons/ai";

import { FaWhatsapp } from "react-icons/fa";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import "../css/Footer.css";
import { useContext } from "react";
import { MyContext } from '../Users/Redux';
const Footer = () => {
  const [showProblemCard, setShowProblemCard] = useState(false);
  const userData = useContext(MyContext);
  // console.log('from footer',userData)
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const urlWhatSap = () => {
     
    let phoneNumber = "201064394735"; // replace with the phone number you want to chat with
    let message = "Hello!"; // replace with the message you want to send
    setWhatsappUrl(
      `https://api.whatsapp.com/send/?phone=${phoneNumber}&text&type=phone_number&app_absent=0`

      //`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    );
  };
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
          res.ok
            ? res.json()
            : toastr.error("failed to load problem categories", "Failed")
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
          toastr.success("Problem Sent Successfully", "Success");
          props.onClose();
        } else toastr.error("Failed To Send Problem", "Failed");
      });
    }

    useEffect(() => {
      getProblemCategories();
      urlWhatSap();
    }, []);

    if (!props.show) return null;
    return (
      <div className="modal-overlay2">
        <div className="modal2">
          <div className="ContExitbtn">
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
            <input
            required
              className="InputModalHallDetails"
              name="description"
              onChange={getProblemData}
            ></input>

            <div className="buttonsOnModal">
              {problem.description!==''&&problem.problemCategoryId>0&&<button onClick={sendProblem}>Send</button>}
              <button onClick={props.onClose}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="Footer" style={{color:"#ffffffa8"}}>
      {!userData && (
        <div className="btnsFooter">
          <button>Login</button>
          <button>Sign Up</button>
        </div>
      )}
      <div className="IconsFooter">
        <a href="https://www.facebook.com/resweb.go">
          <FaFacebook className="icon-footer " />
        </a>
        <a href="https://www.linkedin.com/company/resweb/">
          <FaLinkedin className=" icon-footer" />
        </a>
        {/* <a href="https://www.facebook.com/resweb.go">
          <FaWhatsapp className=" icon-footer" />
        </a> */}

        {/* <div className="whatsap"> */}
        <a href="https://api.whatsapp.com/send?phone=201064394735&text=Hello%20there">
  <FaWhatsapp className="icon-footer" />
</a>

              {/* </div> */}
              {/* AiOutlineWhatsApp */}
        {/* <a href="https://www.facebook.com/resweb.go">

        <FaTwitterSquare className="  icon-footer" />
                </a> */}
        <a href="https://instagram.com/resweb.co">
          <FaInstagram className=" icon-footer" />
        </a>
      </div>
      <div className="aboutUsAndContact">
        <a href="#">About Us</a>
        <a href="#">Contact Us </a>
      </div>
      <div className="AllRightReserved">
        <p><span>&#169; All Rights Are Reserved For Teamwork</span> </p>
      </div>
      <div>
        <button style={{backgroundColor:"#ffffffa8"}}  className="bn54" onClick={() => setShowProblemCard(true)}>
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
