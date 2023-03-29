import React, { useState, useEffect } from "react";
import registartionImg from "../images/registerImage.png";
import google from "../google.png";
import "../css/Registration.css";
const Registration = () => {
  return (
    <div className="parentRegistration">
      <div className="registerContainer">
        <div className="left">
          <h1 className="h1ForRegistration">Sign Up</h1>
         
          <form className="registrationForm">
            <div className="NameAndUserName">
              <div>
                {" "}
                <label htmlFor="">FirstName</label>
                <input type="text" placeholder="Enter Your Name" />
              </div>
              <div>
                {" "}
                <label htmlFor="">LastName</label>
                <input type="text" placeholder="Enter Your Username" />
              </div>
            </div>
            <div className="username">
                {" "}
                <label htmlFor="">Username</label>
                <input type="text" placeholder="Enter Your Username" />
              </div>
            <div className="emailForm">
              <label htmlFor="">Email</label>
              <input type="email" placeholder="Enter Your Email" />
            </div>
            <div className="passwordAndConfirm">
              <div>
                <label htmlFor="">Password</label>
                <input type="password" placeholder="Enter Your Password" />
              </div>
              <div>
                <label htmlFor="">Confirm Password</label>
                <input type="password" placeholder="Confirm Password" />
              </div>
            </div>
            <div className="registrationButtons">
                <button className="createAccountbtn">
                
                Create Account
            </button>
                <button className="createAccountbtnWithGoogle">
                <img style={{ width: "20px" }} src={google} />
                Login With Google
            </button>
            </div>
           
          </form>
        </div>
        <div className="right">
          <img
            className="registartionImg"
            src={registartionImg}
            alt="registration Image"
          />
        </div>
      </div>
    </div>
  );
};
export default Registration;
