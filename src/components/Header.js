import React, { useEffect } from "react";
import "../css/Header.css";
import userImg from "../images/userImg.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import kariem from "../images/userImg.png";

export default function Header({userData,resercherId}) {

  const[studentImage,setStudentImage]=useState({url:kariem});

  const navigate=useNavigate();


function getStudentImage(){
    fetch(`https://localhost:7187/api/Students/Image/${userData?.userId}`,{
      method:"GET",
      headers:{
        "Authorization":`Bearer ${userData.token}`
      }
    })
    .then(res=>res.ok?setStudentImage(res):null)
    
  }

  useEffect(()=>{
    getStudentImage();
  },[])


  return (
    <div className="headerParent">
      <div className="headerContainer">
        <div className="headerLeft">
          <h1 style={{cursor:"pointer"}} onClick={()=>userData.roles==='Admin'?navigate('/AdminPanel',{state:{data:userData}}):navigate('/HomePage',{state:{data:userData}})}>Logo</h1>
        </div>

        <div className="headerRight">
          <ul className="headerUl">
           {userData?.roles==='Researcher'&&<li onClick={()=>navigate('/MarketPlace',{state:{data:userData}})}>MarketPlace</li>}
            
            <li class="dropdown">
              <a href="javascript:void(0)" class="dropbtn">
                Courses
              </a>
              <div class="dropdown-content">
                <a href="#">Link 1</a>
                <a href="#">Link 2</a>
                <a href="#">Link 3</a>
              </div>
            </li>

            {userData?.roles==='Researcher'&&<li onClick={()=>navigate(`/Researchers`,{state:{data:userData}})}>Researchers</li>}
          </ul>
          <div className="headerBtnsContainer">
            {!userData&&<button className="headerSignBtn">Login</button>}
            {!userData&&<button className="headerSignBtn">Signup</button>}
            {userData&&<button onClick={()=>navigate(`/`)} className="headerSignBtn">Logout</button>}
          </div>
          
          

         {userData.roles!=='Admin'&&<li class="dropdown">
              <img src={studentImage.url} class="dropbtn userImgHeader"/>
              <div class="dropdown-content">
                <a onClick={()=>userData.roles==='Admin'?navigate('/AdminPanel',{state:{data:userData}}):navigate(`/Profile/${userData.userId}`,{state:{data:userData}})}>Profile</a>
                <a href="#">Link 2</a>
                <a href="#">Link 3</a>
              </div>
            </li>
            }
        </div>
      </div>
    </div>
  );
}
