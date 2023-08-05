import React from "react";
import {  useNavigate } from "react-router-dom";
import Header from "./Header";
import vod from '../images/photoPayment.png'
import Footer from "./Footer";
import { useContext } from "react";
import { MyContext } from '../Users/Redux';
import SideBar from "./SideBar";
import { useState } from "react";
import '../css/BuyCourse.css';
export default function BuyCourse() {
 
  const userData = useContext(MyContext);
  const navigate=useNavigate();
  const [sideBarVisible, setSideBarVisible] = useState(false);




  function renderSideBar() {
    if (sideBarVisible) {
      return <SideBar />;
    }
  }

  function renderSideBarIcon() {
    if (sideBarVisible) {
      return (
        <svg
          className="closeSvg"
          stroke="currentColor"
          fill="black"
          stroke-width="0"
          viewBox="0 0 24 24"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g>
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"></path>
          </g>
        </svg>
      );
    } else {
      return (
        <svg
        style={{zIndex:'300'}}
          className="closeSvg"
          stroke="currentColor"
          fill="black"
          stroke-width="0"
          viewBox="0 0 24 24"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      );
    }
  }








  const VodafoneCashCard = () => {



    
    return (
      <div
      className="custom-scrollbar buyNow"
        style={{
          backgroundColor: "white",
          maxWidth:'500px',
          width:'80%',
          height: "500px",
          borderRadius: "8px",
          borderTop: "30px solid #4146ff",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap:"20px",
          maxHeight:"500px",
          padding:"20px",
          overflow:"auto"

        }}
      >
        <div className="buyNowContainer" style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
        <h2 style={{textAlign:"center"}}>Transfer Money To This Number Using Vodafone Cash</h2>
        <h4>+20 106 439 4735</h4>
        <span style={{fontWeight:'bold',textAlign:"center"}}>Take A Picture Of Your Reciept</span>
        <span style={{fontWeight:'bold',textAlign:"center"}}>Send A Screenshot To The Same Number Like This One</span>
        
        </div>
       <div>
        <img src={vod} style={{width:'100%',boxShadow:'0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}} />

        </div>
      </div>
    );
  };



  if(userData.userId===''){
    return (
      <div style={{display:'flex',width:'100%',minHeight:'100vh',justifyContent:'center',alignItems:'center',flexDirection:'column',rowGap:'20px'}}>
        <h1>Please Login First</h1>
        <button style={{width:'120px',height:'50px',borderRadius:'10px',backgroundColor:'rgb(21, 46, 125)',color:'white',fontSize:'20px',fontWeight:'bold'}} onClick={()=>navigate('/')}>Login</button>
      </div>
    )
  }






  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        // justifyContent: "center",
        backgroundColor: "#eee",
      }}
    >
      <Header  />
      {renderSideBar()}
          <div
            style={{
              display: "none",
              position: "fixed",
              top: "20px",
              right: "50px",
              zIndex: "200",
            }}
            onClick={() => setSideBarVisible(!sideBarVisible)}
            class="sidebarClodeIcon"
          >
            {renderSideBarIcon()}
          </div>
      <div style={{margin:"40px",display:'flex',flexDirection:'column',width:'100%',alignItems:'center',marginTop:'120px'}}>
      
      <div className="buy"  style={{alignItems:"center", display:"flex",flexDirection:"column",gap:"20px"}}>
      <h1 className="h1Size">Buy Course</h1>
      <h4 className="h1Size">To Buy This Course You Need To Follow This Instructions</h4>
      <VodafoneCashCard />
      </div>
      </div>
      <Footer />
    </div>
  );
}
