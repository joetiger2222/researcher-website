import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import vod from '../images/vod.jpeg'
export default function BuyCourse() {
  const userData = useLocation().state.data;

  const VodafoneCashCard = () => {
    return (
      <div
        style={{
          backgroundColor: "white",
          width: "50%",
          height: "200px",
          borderRadius: "8px",
          borderTop: "30px solid #4146ff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2>Transfer Money To This Number Using Vodafone Cash</h2>
        <h4>+20 120 311 4025</h4>
        <span style={{fontWeight:'bold'}}>Take A Picture Of Your Reciept</span>
        <span style={{fontWeight:'bold'}}>Send A Screenshot To The Same Number Like This One</span>
        <img src={vod} style={{width:'100%',}} />
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
      <div style={{display:'flex',flexDirection:'column',width:'100%',alignItems:'center',marginTop:'120px'}}>
      <h1>Buy Course</h1>
      <h4>To Buy This Course You Need To Follow This Instructions</h4>

      <VodafoneCashCard />
      </div>
    </div>
  );
}
