import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toastr from "toastr";
import LOGOJPG from "../images/LogoJPG.jpg";
import loader from '../loader.gif';
export default function ForgotPassword (){
    const location = useLocation();
    const navigate=useNavigate();
    const [load,setLoad]=useState(false);
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get('email');
  const token = searchParams.get('token');
  const [confirmPass,setConfirmPass]=useState('')
    const [formData,setFormData]=useState({email:email,token:token,newPassword:''})

    


    function changePass(){
       
        if(formData.newPassword===''||confirmPass===''){
            toastr.error('Please Enter A Valid Password');
            return;
        }
        if(formData.newPassword===confirmPass){
            setLoad(true)
            fetch(`https://resweb-001-site1.htempurl.com/api/Authentication/resetpassword`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(formData)
            })
            .then(res=>{
                setLoad(false)
                if(res.ok){
                    toastr.success('Password Reset Successfully')
                    navigate('/')
                }else{
                    toastr.error('Failed To Reset Password')
                }
            })
        }else{
            toastr.error('Password Does Not Match The Confirm Password')
        }
    }




    if(!email||!token){
        return (
            <div style={{width:'100%',minHeight:'100vh',backgroundColor:'rgb(9, 14, 52)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <h1 style={{color:'white'}}>You Need To Enter This Page Through Your Gmail</h1>
            </div>
        )
    }

    if(load){
        return(
          <div style={{width:'100%',minHeight:'100vh',display:'flex',justifyContent:'center',alignItems:'center',backgroundColor:'white'}}>
            <img src={loader} />
          </div>
        )
      }



    return (
        <div style={{width:'100%',minHeight:'100vh',backgroundColor:'rgb(9, 14, 52)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            
           <div className="loginContainer" style={{width:'70%',height:'640px',maxWidth:'1240px',backgroundColor:'white',display:'flex',justifyContent:'space-around',borderRadius:'10px',alignItems:'center',padding:'10px'}}>
           <div style={{width:'40%'}} className="loginImgDiv">
                <img src={LOGOJPG} className="loginImg" style={{width:'100%',maxWidth:'800px'}} />

            </div>
           <div className="loginDataDiv" style={{alignItems:'center'}}>
           <h3>Enter Your New Password</h3>
           <input value={formData.newPassword} name="newPassword" onChange={(e)=>setFormData(prev=>{return{...prev,[e.target.name]:e.target.value}})} className="search-input" placeholder="Password..." type="password" style={{width:'80%',maxWidth:'300px'}}></input>
           <input value={confirmPass} onChange={(e)=>setConfirmPass(e.target.value)} className="search-input" placeholder="Confirm Password..." type="password" style={{width:'80%',maxWidth:'300px'}}></input>
           <button
           onClick={changePass}
            type='submit'
            className="loginBtn"
              style={{
                color: "white",
                backgroundColor: "rgb(48,86,209)",
                display: "flex",
                justifyContent: "center",
                padding: "15px 10px",
                borderRadius: "4px",
                margin: "0 0 0 0",
                border:'none',
                fontSize:'1.1em',
                fontWeight:'bold',
                cursor:'pointer',
                gap:"5px",
                width:'80%',
                maxWidth:'322px'
              }}
              
            >
              <span>Update Password</span>
              
            </button>
           </div>
           </div>
        </div>
    )
}