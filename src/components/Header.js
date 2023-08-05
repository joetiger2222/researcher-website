import React, { useEffect } from "react";
import "../css/Header.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import kariem from "../images/userImg.png";
import LOGO from "../images/Logo - Text Only.png";
import { useContext } from "react";
import { MyContext } from '../Users/Redux';
import loader from '../loader.gif';
import "toastr/build/toastr.min.css";
import toastr from "toastr";


export default function Header() {
  const navigate=useNavigate();
  const userData = useContext(MyContext);
  
function getStudentImage(){
  console.log('invoked')
    fetch(`https://resweb-001-site1.htempurl.com/api/Students/Image/${userData?.userId}`,{
      method:"GET",
      headers:{
        "Authorization":`Bearer ${userData.token}`
      }
    })
    .then(res=>{
      if(res.ok){
        return res.blob();
      }else {
        userData.setStudentImage(kariem);
      }
    }).then(blob=>{
      const image = URL.createObjectURL(blob);
      userData.setStudentImage(image);
    }).catch(e=>{
      userData.setStudentImage(kariem);
    })
    
  }
  

  function getResearcherIdByStudentId() {
     
    fetch(
      `https://resweb-001-site1.htempurl.com/api/Researchers/ResearcherId/${userData.userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      }
    )
      .then((res) => (res.ok ? res.json() : userData.setResercherId('not found')))
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
    if(userData.userId!=null && userData.userId!==''){
     if(userData.studentImage===''&&userData.roles!=='Admin'){
      getStudentImage();
        }
    if(userData.resercherId===''){
    getResearcherIdByStudentId();
    }
    }
  },[userData])


  useEffect(()=>{
    
  },[userData.studentImage])

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
           <li onClick={()=>userData?.roles==='Researcher'?navigate('/MarketPlace'):toastr.info('You Nedd To Have At Least One Point Before Unlocking This Page')}>Research opportunities</li>
            
            {userData.roles!=='Admin'&&<li class="dropdown">
              <a onClick={()=>{
                navigate('/HomePage');
                window.scrollTo(0, 1600)
              }}>
                Courses
              </a>
              
              
            </li>}
            

            <li onClick={()=>userData?.roles==='Researcher'?navigate(`/Researchers`):toastr.info('You Nedd To Have At Least One Point Before Unlocking This Page')}>Researchers</li>
            {userData.roles!=='Admin'&&<li class="dropdown">
              <a onClick={()=>{
                navigate('/HomePage');
                window.scrollTo(0, 2000)
              }}>
                About Us
              </a>
              
              
            </li>}
          </ul>
          <div className="headerBtnsContainer">
            
            {userData&&<button onClick={()=>{
              
               userData.setUserId('');
               userData.setToken('');
               userData.setRoles('');
               userData.setResercherId('');
               userData.setStudentImage('');
               navigate('/')
            }} className="headerSignBtn">Logout</button>}
          </div>
          
          

         {userData.roles!=='Admin'&&<li class="dropdown">
          {userData.studentImage===''&&<img src={loader} class="dropbtn userImgHeader"/>}
              {userData.studentImage!==''&&<img src={userData.studentImage} class="dropbtn userImgHeader"/>}
              <div class="dropdown-content">
                <a onClick={()=>userData.roles==='Admin'?navigate('/AdminPanel'):navigate(`/Profile/${userData.userId}`)}>Profile</a>
               
              </div>
            </li>
            }
        </div>
      </div>
    </div>
  );
}
