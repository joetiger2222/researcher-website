import React, { useEffect } from "react";
import loginImg from "./loginImg.png";
import './Login.css'
import google from "./google.png";
import { useState, } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate=useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loginData,setLoginData]=useState(null);

  function getLoginData(event) {
    setFormData(prevFormData=>{
        return {
            ...prevFormData,
            [event.target.name]:event.target.value
        }
    })
  }
console.log(formData)



function authorizeLogin(e){
  e.preventDefault();
  fetch("https://localhost:7187/api/Authentication/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        formData
      ),
    })


    .then((response) => {
      if(response.ok)return response.json();
    })
    .then(data=>setLoginData(data));
}


useEffect(()=>{
  if(loginData){
    navigate(`/HomePage`, { state: { data: loginData } });
  }
},[loginData])





  return (
    <div
      className="loginParent"
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        minHeight: "100vh",
        backgroundColor: "rgb(9,14,52)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="loginContainer"
        style={{
          width: "70%",
          height:'640px',
          justifyContent:'space-around',
          maxWidth:'1240px',
          backgroundColor: "white",
          display: "flex",
          borderRadius: "10px",
          alignItems: "center",
          padding:'10px'
        }}
      >
        <div className="loginImgDiv" style={{ width: "40%" }}>
          <img
            className="loginImg"
            style={{ width: "100%",maxWidth:'800px', borderRadius: "10px" }}
            src={loginImg}
            alt="login"
          />
        </div>

        <div
          className="loginDataDiv"
          style={{ display: "flex", flexDirection: "column",width:'40%' }}
        >
          <h1>Login To Website </h1>
          
          <form style={{ display: "flex", flexDirection: "column" }}>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{fontSize:'18px'}}>Email:</label>
              <input
              name="email"
                type={'email'}
                style={{    
                  borderRadius: "4px",
                  border: "0.01em solid #cbc7c7",
                  padding: "20px 10px",
                  margin: "5px 0 0 0",
                  fontSize:'18px',
                }}
                onChange={getLoginData}
                placeholder="Enter your Email"
              ></input>
            </div>


            <div
              style={{
                display: "flex",
                flexDirection: "column",
                margin: "10px 0 0 0",
              }}
            >
              <label style={{fontSize:'18px'}} >Password:</label>
              <input
              type={'password'}
              name="password"
              onChange={getLoginData}
                placeholder= "Enter Password"
                style={{

                  border: "0.01em solid #cbc7c7",
                  borderRadius: "4px",
                  padding: "20px 10px",
                  margin: "5px 0 30px 0",
                  fontSize:'18px',
                }}
              ></input>
              
            </div>
            <button
            type='submit'
            className="loginBtn"
              style={{
                color: "white",
                backgroundColor: "rgb(48,86,209)",
                display: "flex",
                justifyContent: "center",
                padding: "15px 10px",
                borderRadius: "4px",
                margin: "0 0 0 0",
                border:'none',
                fontSize:'1.1em',
                fontWeight:'bold',
                cursor:'pointer',
              }}
              onClick={authorizeLogin}
            >
              Login
            </button>

            <button
            className="loginGoogleBtn"
              style={{
                width: "100%",
                color: "##5a5959",
                backgroundColor: "white",
                display: "flex",
                justifyContent: "center",
                gap: "7px",
                padding: "15px 10px",
                borderRadius: "4px",
                margin: "10px 0 20px 0",
                border: "0.01em solid #cbc7c7",
                fontSize:'1.1em',
                fontWeight:'bold',
                cursor:'pointer',
                
              }}
            >
              <img style={{ width: "20px" }} src={google} />
              Login With Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
