import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "./Header";

export default function FinalQuizResult(){
    const {skillId}=useParams();
    const userData=useLocation().state?.data
    const navigate=useNavigate();
    console.log(userData)

    if(userData.roles==='Student'){
    return(
        <div style={{minHeight:'100vh',display:'flex',alignItems:'center',width:'100%',backgroundColor:'black',justifyContent:'center'}}>
            <Header/>
            <div style={{backgroundColor:'white',borderRadius:'10px',width:'50%',display:'flex',flexDirection:'column'}}>
                <h1>You Failed The Exam</h1>
                <button onClick={()=>navigate(`/FinalQuiz/${skillId}`, { state: { data: userData } })}>Retake</button>
            </div>
        </div>
    )
    }else if(userData.roles==='Researcher'){
        return(
        <div style={{minHeight:'100vh',display:'flex',alignItems:'center',width:'100%',backgroundColor:'black',justifyContent:'center'}}>
            <Header/>
            <div style={{backgroundColor:'white',borderRadius:'10px',width:'50%',display:'flex',flexDirection:'column'}}>
                <h1>Congratulations You Succeded</h1>
                
            </div>
        </div>
        )
    }
}