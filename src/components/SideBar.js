import React from "react";
import "../css/HomePage.css";
import "../css/SideBar.css";
import LOGO from "../images/Logo - Text Only.png";
import { FaGraduationCap } from "react-icons/fa";
import { BiUserCircle, BiLogOut } from "react-icons/bi";
import { IoInformationCircleSharp } from "react-icons/io5";
import marketplace from "../images/marketplace.png";
import { FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { MyContext } from "../Users/Redux";
export default function SideBar() {
  const navigate = useNavigate();
  const userData = useContext(MyContext);

  return (
    <div
      style={{
        display: "none",
        position: "fixed",
        top: "0",
        height: "100%",
        width: "33%",
        left: "0",
        zIndex: "200",
        padding: "6px",
      }}
      className="sideBar"
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          rowGap: "40px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          onClick={() =>
            userData.roles === "Admin"
              ? navigate("/AdminPanel")
              : navigate(`/HomePage`)
          }
          src={LOGO}
          style={{ width: "70%",cursor:'pointer' }}
        />

        <div
          className=""
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            rowGap: "20px",
            alignItems: "center",
            padding: "20px",
          }}
        >
          {userData.roles!=='Admin'&&<div
            onClick={() => navigate(`/MarketPlace`)}
            style={{ display: "flex", alignItems: "center", columnGap: "10px" }}
          >
            <img style={{ width: "30px", height: "30px" }} src={marketplace} />
            <span
              className="sideBarName"
              style={{ fontWeight: "bold", fontSize: "20px", color: "black" }}
            >
              MarketPlace
            </span>
          </div>}
          {userData.roles!=='Admin'&&<div
            onClick={() => {
              navigate("/HomePage");
              window.scrollTo(0, 4500);
            }}
            style={{ display: "flex", alignItems: "center", columnGap: "10px" }}
          >
            <FaGraduationCap style={{ width: "30px", height: "30px" }} />
            <span
              className="sideBarName"
              style={{ fontWeight: "bold", fontSize: "20px", color: "black" }}
            >
              Courses
            </span>
          </div>}
          {userData.roles!=='Admin'&&<div
            onClick={() => navigate(`/Researchers`)}
            style={{ display: "flex", alignItems: "center", columnGap: "10px" }}
          >
            <BiUserCircle style={{ width: "30px", height: "30px" }} />
            <span
              className="sideBarName"
              style={{ fontWeight: "bold", fontSize: "20px", color: "black" }}
            >
              Researchers
            </span>
          </div>}
          {userData.roles!=='Admin'&&<div
            onClick={() => {
              navigate("/HomePage");
              window.scrollTo(0, 9500);
            }}
            style={{ display: "flex", alignItems: "center", columnGap: "10px" }}
          >
            <IoInformationCircleSharp
              style={{ width: "30px", height: "30px" }}
            />
            <span
              className="sideBarName"
              style={{ fontWeight: "bold", fontSize: "20px", color: "black" }}
            >
              About Us
            </span>
          </div>}
          {userData.roles!=='Admin'&&<div
            onClick={() => navigate(`/Profile/${userData.userId}`)}
            style={{ display: "flex", alignItems: "center", columnGap: "10px" }}
          >
            <FiUser style={{ width: "30px", height: "30px" }} />
            <span
              className="sideBarName"
              style={{ fontWeight: "bold", fontSize: "20px", color: "black" }}
            >
              Profile
            </span>
          </div>}
          <div
            onClick={() => {
              userData.setUserId("");
              userData.setToken("");
              userData.setRoles("");
              navigate("/");
            }}
            style={{ display: "flex", alignItems: "center", columnGap: "10px" }}
          >
            <BiLogOut style={{ width: "30px", height: "30px" }} />
            <span
              className="sideBarName"
              style={{ fontWeight: "bold", fontSize: "20px", color: "black" }}
            >
              Logout
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
