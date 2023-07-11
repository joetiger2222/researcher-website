import React, { useEffect } from "react";
import "../css/Header.css";
import userImg from "../images/userImg.png";
import { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import kariem from "../images/userImg.png";
import LOGO from "../images/Logo - Text Only.png";
import { useContext } from "react";
import { MyContext } from '../Users/Redux';
// import LOGO from "../images/Logo - With Text.png";


export default function Header() {

  const[studentImage,setStudentImage]=useState({url:kariem});

  const navigate=useNavigate();
  const userData = useContext(MyContext);

function getStudentImage(){
    fetch(`https://localhost:7187/api/Students/Image/${userData?.userId}`,{
      method:"GET",
      headers:{
        "Authorization":`Bearer ${userData.token}`
      }
    })
    .then(res=>res.ok?setStudentImage(res):null)
    
  }


  function getResearcherIdByStudentId() {
    fetch(
      `https://localhost:7187/api/Researchers/ResearcherId/${userData.userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      }
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          userData.setRoles("Researcher")
          userData.resercherId = data.researcherId;
          userData.setResercherId(data.researcherId);
        }
      })
      .catch((error) => console.error(error));
  }

  useEffect(()=>{
    getStudentImage();
    getResearcherIdByStudentId();
  },[userData])


  return (
    <div className="headerParent">
      <div className="headerContainer">
        <div
        style={{width:"100px",height:"50px"}}
        className="headerLeft">
          <img 
          src={LOGO} 
          style={{cursor:"pointer",width:"100%",height:"100%"}}
           onClick={()=>userData.roles==='Admin'?navigate('/AdminPanel'):navigate('/HomePage')}/>
        </div>

        <div className="headerRight">
          <ul className="headerUl">
           {userData?.roles==='Researcher'&&<li onClick={()=>navigate('/MarketPlace')}>MarketPlace</li>}
            
            {userData.roles!=='Admin'&&<li class="dropdown">
              <a onClick={()=>{
                navigate('/HomePage');
                window.scrollTo(0, 1300)
              }}>
                Courses
              </a>
              
              
            </li>}

            {userData?.roles==='Researcher'&&<li onClick={()=>navigate(`/Researchers`)}>Researchers</li>}
          </ul>
          <div className="headerBtnsContainer">
            {!userData&&<button className="headerSignBtn">Login</button>}
            {!userData&&<button className="headerSignBtn">Signup</button>}
            {userData&&<button onClick={()=>{
               userData.setUserId('');
               userData.setToken('');
               userData.setRoles('');
               navigate('/')
            }} className="headerSignBtn">Logout</button>}
          </div>
          
          

         {userData.roles!=='Admin'&&<li class="dropdown">
              <img src={studentImage.url} class="dropbtn userImgHeader"/>
              <div class="dropdown-content">
                <a onClick={()=>userData.roles==='Admin'?navigate('/AdminPanel'):navigate(`/Profile/${userData.userId}`)}>Profile</a>
                {/* <a href="#">Link 2</a>
                <a href="#">Link 3</a> */}
              </div>
            </li>
            }
        </div>
      </div>
    </div>
  );
}
