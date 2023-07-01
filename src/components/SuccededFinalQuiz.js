import React from "react";
import Header from "./Header";
import { useLocation } from "react-router-dom";
export default function SuccededFinalQuiz(){
    const userData=useLocation().state.data;
    console.log('user data from succeded final quiz',userData)
    return(
        <div style={{minHeight:'100vh',display:'flex',alignItems:'center',width:'100%',backgroundColor:'black',justifyContent:'center'}}>
            <Header userData={userData}/>
            <div style={{backgroundColor:'white',borderRadius:'10px',width:'50%',display:'flex',flexDirection:'column'}}>
                <h1>Congratulations You Succeded</h1>
                <h5>You Can Now Edit You Speciality in Your Profile</h5>
                <h5>You Have Opened The Marketplace</h5>
            </div>
        </div>
        )
}