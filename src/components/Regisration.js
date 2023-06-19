import React, { useState, useEffect } from "react";
import registartionImg from "../images/registerImage.png";
import google from "../google.png";
import "../css/Registration.css";
import { useNavigate } from "react-router-dom";
const Registration = () => {

  const [formData, setFormData] = useState({ firstname: "", lastname: "",userName:'',email:'',password:'',age:'',phoneNumber:'',gender:0, nationalityId:1});
  const [passwordMatch,setPasswrdMatch]=useState('');
  const [userId,setUserId]=useState(null);
  const [loginData,setLoginData]=useState(null);
  const navigate=useNavigate();

  function getRegisterData(event) {
    setFormData(prevFormData=>{
        return {
            ...prevFormData,
            [event.target.name]:event.target.value
        }
    })
  }

useEffect(()=>{
  let data=formData;
  data.gender=data.gender*1;
  setFormData(data);
  
},[formData.gender])

  console.log(formData)



  function sendRegisterData(e){
    e.preventDefault();
    if(formData.password===passwordMatch){
    fetch("https://localhost:7187/api/Authentication", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        formData
      ),
    })


    .then((res) =>res.ok?authorizeLogin(e):alert('failed to register please try again later') )
    
  }else{
    alert('Password and Confirm Password Does not Match')
  }
  }



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
        else alert('Failed to login in try again later')
      })
      .then(data=>{
        if(data){
        const login={roles:'Student',userId:data.userId,token:data.token}
        navigate(`/HomePage`,{state:{data:login}})
      }
      });
  }



  return (
    <div className="parentRegistration">
      <div className="registerContainer">
        <div className="left">
          <h1 className="h1ForRegistration">Sign Up</h1>
         
          <form className="registrationForm">
            <div className="NameAndUserName">
              <div>
                {" "}
                <label htmlFor="">First Name</label>
                <input onChange={getRegisterData} name="firstname" type="text" placeholder="Enter Your Name" />
              </div>
              <div>
                {" "}
                <label htmlFor="">Last Name</label>
                <input onChange={getRegisterData} name="lastname" type="text" placeholder="Enter Your Username" />
              </div>
            </div>
            <div className="username">
                {" "}
                <label htmlFor="">Username</label>
                <input onChange={getRegisterData} name="userName" type="text" placeholder="Enter Your Username" />
              </div>
            <div className="emailForm">
              <label htmlFor="">Email</label>
              <input onChange={getRegisterData} name="email" type="email" placeholder="Enter Your Email" />
            </div>
            <div className="passwordAndConfirm">
              <div>
                <label htmlFor="">Password</label>
                <input onChange={getRegisterData} name="password" type="password" placeholder="Enter Your Password" />
              </div>
              <div>
                <label htmlFor="">Confirm Password</label>
                <input name="confirmPassword" onChange={(e)=>setPasswrdMatch(e.target.value)} type="password" placeholder="Confirm Password" />
              </div>
            </div>


            <div className="NameAndUserName">
              <div>
                {" "}
                <label htmlFor="">Age</label>
                <input onChange={getRegisterData} name="age" type="text" placeholder="Enter Your Age" />
              </div>
              <div>
                {" "}
                <label htmlFor="">Gender</label>
                
                <select className="genderSelect" name="gender" onChange={getRegisterData}>
                  <option selected={true} disabled={true}>Gender</option>
                  <option value={0}>Male</option>
                  <option value={1}>Female</option>
                </select>
              </div>
            </div>


            <div className="username">
                {" "}
                <label htmlFor="">Phone Number</label>
                <input onChange={getRegisterData} name="phoneNumber" type="text" placeholder="Enter Your Phone Number" />
              </div>

            <div className="registrationButtons">
                <button onClick={sendRegisterData} className="createAccountbtn">
                
                Create Account
            </button>
                <button className="createAccountbtnWithGoogle">
                <img style={{ width: "20px" }} src={google} />
                SignUp With Google
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
