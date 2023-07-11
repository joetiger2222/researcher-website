import React from "react";
import Header from "./Header";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { MyContext } from '../Users/Redux';
export default function SuccededFinalQuiz(){
    // const userData=useLocation().state.data;
    const userData = useContext(MyContext);
    const navigate=useNavigate();
    // console.log('user data from succeded final quiz',userData)
    if(userData.userId===''){
        return (
          <div style={{display:'flex',width:'100%',minHeight:'100vh',justifyContent:'center',alignItems:'center',flexDirection:'column',rowGap:'20px'}}>
            <h1>Please Login First</h1>
            <button style={{width:'120px',height:'50px',borderRadius:'10px',backgroundColor:'rgb(21, 46, 125)',color:'white',fontSize:'20px',fontWeight:'bold'}} onClick={()=>navigate('/')}>Login</button>
          </div>
        )
      }
    return(
        <div style={{minHeight:'100vh',display:'flex',alignItems:'center',width:'100%',justifyContent:'center'}}>
            <Header userData={userData}/>
            <div style={{padding:"20px",backgroundColor:'aliceblue',borderRadius:'10px',width:'50%',display:'flex',flexDirection:'column',textAlign:"center"}}>
                <h1>Congratulations You Succeded</h1>
                <h5>You Can Now Edit You Speciality in Your Profile</h5>
                <h5>The Marketplace Have Opened For You</h5>
            </div>
        </div>
        )
}