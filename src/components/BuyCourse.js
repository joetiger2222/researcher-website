import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import vod from '../images/photoPayment.png'
export default function BuyCourse() {
  const userData = useLocation().state.data;

  const VodafoneCashCard = () => {
    return (
      <div
      className="custom-scrollbar"
        style={{
          backgroundColor: "white",
          width: "500px",
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
        <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
        <h2 style={{textAlign:"center"}}>Transfer Money To This Number Using Vodafone Cash</h2>
        <h4>+20 120 311 4025</h4>
        <span style={{fontWeight:'bold',textAlign:"center"}}>Take A Picture Of Your Reciept</span>
        <span style={{fontWeight:'bold',textAlign:"center"}}>Send A Screenshot To The Same Number Like This One</span>
        
        </div>
       <div>
        <img src={vod} style={{width:'100%'}} />

        </div>
      </div>
    );
  };

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
      <Header userData={userData} />
      <div style={{margin:"40px",display:'flex',flexDirection:'column',width:'100%',alignItems:'center',marginTop:'120px'}}>
      
      <div  style={{alignItems:"center", display:"flex",flexDirection:"column",gap:"20px"}}>
      <h1>Buy Course</h1>
      <h4>To Buy This Course You Need To Follow This Instructions</h4>
      <VodafoneCashCard />
      </div>
      </div>
    </div>
  );
}
