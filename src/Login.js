import React, { useEffect } from "react";
import loginImg from "./loginImg.png";
import loginPhoto from "./images/loginPhoto.png"
import './Login.css'
import google from "./google.png";
import { useState, } from "react";
import { useNavigate } from "react-router-dom";
import loader from './loader.gif';
import toastr from "toastr";
import 'toastr/build/toastr.min.css';
import { useContext } from "react";
import { MyContext } from './Users/Redux';
export default function Login() {
  const navigate=useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loginData,setLoginData]=useState(null);
  const [load,setLoad]=useState(false)
  const [showForgotCard,setShowForgotCard]=useState(false);
  const { userId, setUserId, token, setToken, roles, setRoles } = useContext(MyContext);

  function getLoginData(event) {
    setFormData(prevFormData=>{
        return {
            ...prevFormData,
            [event.target.name]:event.target.value
        }
    })
  }



function loginAdmin(e){
  e.preventDefault();

  const containsSpaces = formData.email.includes(' ');

  if(containsSpaces){
    toastr.error('Email Can\'t Contain Spaces')
    setLoad(false)
    return;
  }
const isGmail = formData.email.split('@')[1] === 'gmail.com';
  if(!isGmail){
    toastr.error('Email Must Be A Gmail');
    setLoad(false)
    return;
  }

  if(formData.password===''){
    toastr.error('Password Can\'t Be Empty');
        setLoad(false)
        return;
  }


  setLoad(true)
  
  fetch(`https://resweb-001-site1.htempurl.com/api/Admin/AdminLogin`,{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
    },
    body:JSON.stringify(formData)
  }).then(res=>{
    if(res.ok){
      return res.json();
    }else{
      authorizeLogin(e)
    }
  })
  .then(data=>{
    if (data) {
      setRoles('Admin');
      setUserId(data.userId);
      setToken(data.token)
      navigate(`/adminPanel`);
    }
  }).catch(e=>{
    setLoad(false)
    toastr.error('Server Is Down Please Try Again Later')
  })
}



function authorizeLogin(e){
  e.preventDefault();
  
  fetch("https://resweb-001-site1.htempurl.com/api/Authentication/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        
      },
      body: JSON.stringify(
        formData
      ),
    })


    .then((response) => {
      setLoad(false)
      if(response.ok)return response.json();
      else toastr.error('wrong Email or password',"Error")
    })
    .then(data=>{
      if(data){
      setRoles('Student');
      setUserId(data.userId);
      setToken(data.token)
      navigate(`/`,);
    }
    }).catch(e=>{
      setLoad(false);
      toastr.error('Internal Server Error Please Try Again Later')
    })
    ;
}





// useEffect(()=>{
//   if(token){
//     navigate(`/HomePage`,);
//   }
// },[token])




const ForgotPasswordCard=(props)=>{
  const [email,setEmail]=useState('');
  function sendEmail(e){
    e.preventDefault();
    fetch(`https://resweb-001-site1.htempurl.com/api/Authentication/forgotpassword/${email}`,{
      method:"POST",
      headers:{
        "Content-Type":'application/json'
      },
    })
    .then(res=>{
      if(res.ok){
        toastr.success('Please Go Check Your Email Address');
        props.onClose();
      }else {
        toastr.error('Email Not Found')
      }
    }).catch(e=>{
      toastr.error('Server Error Please Try Again Later');
      console.log(e);
    })

  }
  

  if (!props.show) return null;
    return (
      <div className="modal-overlay2">
        <div className="modal2" style={{height:'300px',rowGap:'50px'}}>
          <h1>Please Enter You Email Address</h1>
          <input value={email} onChange={(e)=>setEmail(e.target.value)} className="search-input" placeholder="Email..." type="email" style={{width:'80%',maxWidth:'300px'}}></input>
          <div className="buttonsOnModal" style={{width:'80%',maxWidth:'300px'}}>
              <button
                
                onClick={sendEmail}
              >
                Submit
              </button>
              <button  onClick={props.onClose}>
                Decline
              </button>
            </div>
        </div>
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
    <div
      className="loginParent"
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        minHeight: "100vh",
        backgroundColor: "rgb(9,14,52)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="loginContainer"
        style={{
          width: "70%",
          height:'640px',
          justifyContent:'space-around',
          maxWidth:'1240px',
          backgroundColor: "white",
          display: "flex",
          borderRadius: "10px",
          alignItems: "center",
          padding:'10px'
        }}
      >
        <div className="loginImgDiv" style={{ width: "40%" }}>
          <img
            className="loginImg"
            style={{ width: "100%",maxWidth:'800px', borderRadius: "10px" }}
            src={loginImg}
            alt="login"
          />
        </div>

        <div
          className="loginDataDiv"
          // style={{ display: "flex", flexDirection: "column",width:'40%' }}
        >
          <h1>Login To Website </h1>
          
          <form style={{ display: "flex", flexDirection: "column" }}>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{fontSize:'18px'}}>Email:</label>
              <input
              name="email"
                type={'email'}
                style={{    
                  borderRadius: "4px",
                  border: "0.01em solid #cbc7c7",
                  padding: "20px 10px",
                  margin: "5px 0 0 0",
                  fontSize:'18px',
                  direction:"ltr"
                }}
                onChange={getLoginData}
                placeholder="Enter your Email"
              ></input>
            </div>


            <div
              style={{
                display: "flex",
                flexDirection: "column",
                margin: "10px 0 0 0",
              }}
            >
              <label style={{fontSize:'18px'}} >Password:</label>
              <input
              type={'password'}
              name="password"
              onChange={getLoginData}
                placeholder= "Enter Password"
                style={{

                  border: "0.01em solid #cbc7c7",
                  borderRadius: "4px",
                  padding: "20px 10px",
                  margin: "5px 0 30px 0",
                  fontSize:'18px',
                }}
              ></input>
              
            </div>
            <button
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
                gap:"5px"
              }}
              onClick={(e)=>{loginAdmin(e);}}
            >
              <img style={{width:"20px",height:"20px",color:"white"}} src={loginPhoto}/>
              <span>Login</span>
              
            </button>
            <button
            onClick={()=>navigate('/Registration')}
            className="loginGoogleBtn"
              style={{
                width: "100%",
                color: "##5a5959",
                backgroundColor: "white",
                display: "flex",
                justifyContent: "center",
                gap: "7px",
                padding: "15px 10px",
                borderRadius: "4px",
                margin: "10px 0 20px 0",
                border: "0.01em solid #cbc7c7",
                fontSize:'1.1em',
                fontWeight:'bold',
                cursor:'pointer',
                
              }}
            >
              Signup
            </button>
            <p style={{color:'blue',borderBottom:'1px solid blue',width:'130px',alignSelf:'flex-end',cursor:'pointer'}} onClick={()=>setShowForgotCard(true)}>Forgot Password?</p>
            {showForgotCard&&<ForgotPasswordCard show={showForgotCard} onClose={()=>setShowForgotCard(false)} />}
          </form>
        </div>
      </div>
    </div>
  );
}
