import React from "react";
import {  useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import { useContext } from "react";
import { MyContext } from '../Users/Redux';
export default function FinalQuizResult(){
    const {skillId}=useParams();
    
    const userData = useContext(MyContext);
    const navigate=useNavigate();
    if(userData.userId===''){
        return (
          <div style={{display:'flex',width:'100%',minHeight:'100vh',justifyContent:'center',alignItems:'center',flexDirection:'column',rowGap:'20px'}}>
            <h1>Please Login First</h1>
            <button style={{width:'120px',height:'50px',borderRadius:'10px',backgroundColor:'rgb(21, 46, 125)',color:'white',fontSize:'20px',fontWeight:'bold'}} onClick={()=>navigate('/Login')}>Login</button>
          </div>
        )
      }
    return(
        <div style={{minHeight:'100vh',display:'flex',alignItems:'center',width:'100%',justifyContent:'center'}}>
            <Header userData={userData} />
            <div style={{backgroundColor:'white',borderRadius:'10px',width:'50%',display:'flex',flexDirection:'column',padding:'20px',alignItems:'center',color:"red"}}>
                <h1 style={{textAlign:'center'}}>You Failed The Exam</h1>
                <button className="SubmitQuizInFinalAndSectionQuiz" onClick={()=>navigate(`/FinalQuiz/${skillId}`)}>Retake</button>
            </div>
        </div>
    )
    
}