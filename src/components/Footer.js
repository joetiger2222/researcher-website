import React from "react";
import { FaFacebook } from "react-icons/fa";

import { FaLinkedin } from "react-icons/fa";

import { FaTwitterSquare } from "react-icons/fa";

import { FaWhatsapp } from "react-icons/fa";

import "../css/Footer.css"
const Footer = () => {
  return (
    <div className="Footer">
      <div className="btnsFooter">
        <button>Login</button>
        <button>Sign Up</button>
      </div>
      <div className="IconsFooter">
        <FaFacebook className="icon-footer " />

        <FaLinkedin className=" icon-footer"/>

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
    </div>
  );
};

export default Footer;
