import React, { useState, useEffect } from "react";
import registartionImg from "../images/registerImage.png";
import "../css/Registration.css";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { MyContext } from "../Users/Redux";
import loader from '../loader.gif';
const Registration = () => {
  const { userId, setUserId, token, setToken, roles, setRoles } =
    useContext(MyContext);
    const [load,setLoad]=useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    userName: "",
    email: "",
    password: "",
    age: "",
    phoneNumber: "",
    gender: -1,
    bio: "",
    nationalityId: 0,
  });
  const [passwordMatch, setPasswrdMatch] = useState("");
 
  const [allNationalities, setAllNationalities] = useState([]);
  const navigate = useNavigate();
  
  function getRegisterData(event) {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value.trim(),
      };
    });
  }

  useEffect(() => {
    let data = formData;
    data.gender = data.gender * 1;
    setFormData(data);
  }, [formData.gender]);

  

  function sendRegisterData(e) {
    setLoad(true)
    e.preventDefault();

    const containsSpaces = formData.userName.includes(' ');

    if(containsSpaces){
      toastr.error('Username Can\'t Contain Spaces')
      setLoad(false)
      return;
    }


    if (formData.gender*1 !== 0) {
      if (formData.gender*1 !== 1) {
      toastr.error('Please Choose A Valid Gender');
      setLoad(false)
      return;
      }
    }
    
    if(formData.nationalityId===0){
      toastr.error('Please Choose A Valid Nationality');
      setLoad(false)
      return;
    }
    const isGmail = formData.email.split('@')[1] === 'gmail.com';
    if(!isGmail){
      toastr.error('Email Must Be A Gmail');
      setLoad(false)
      return;
    }


    if (formData.password === passwordMatch) {
      fetch("https://resweb-001-site1.htempurl.com/api/Authentication", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        
        .then((response) => {
          setLoad(false)
          const reader = response.body.getReader();
          let chunks = [];

          function readStream() {
            return reader.read().then(({ done, value }) => {
              if (done) {
                return chunks;
              }
              chunks.push(value);
              return readStream();
            });
          }

          if (!response.ok) {
            setLoad(false)
            return readStream().then((chunks) => {
              const body = new TextDecoder().decode(
                new Uint8Array(chunks.flatMap((chunk) => Array.from(chunk)))
              );
              const response = JSON.parse(body);

              const duplicateEmail = response.DuplicateEmail;
              const duplicateUserName = response.DuplicateUserName;
              const passwordTooShort=response.PasswordTooShort;
              if (response.DuplicateEmail)
                toastr.error(duplicateEmail[0], "Duplicate Email");
              if (response.DuplicateUserName)
                toastr.error(duplicateUserName[0], "Duplicate UserName");
              if(response.PasswordTooShort)
                toastr.error(passwordTooShort,'Short Password')
              
            });
          } else {
            setLoad(false)
            authorizeLogin(e);
          }

          return readStream().then((chunks) => {
            const body = new TextDecoder().decode(
              new Uint8Array(chunks.flatMap((chunk) => Array.from(chunk)))
            );
            
          });
        })
        .catch((error) => {
          toastr.error('Please Check Your Network Connection')
          setLoad(false)
        });
    } else {
      setLoad(false)
      toastr.error("Password and Confirm Password Does not Match", "Error");
    }
  }

  function getAllNationalities() {
    fetch(`https://resweb-001-site1.htempurl.com/api/Students/Nationalites`)
      .then((res) =>
        res.ok
          ? res.json()
          : toastr.error("failed to load nationalities", "Failed")
      )
      .then((data) => (data ? setAllNationalities(data) : null));
  }

  useEffect(() => {
    getAllNationalities();
  }, []);

  function authorizeLogin(e) {
    setLoad(true)
    e.preventDefault();
    fetch("https://resweb-001-site1.htempurl.com/api/Authentication/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        setLoad(false)
        if (response.ok) return response.json();
        else toastr.error("Failed to login in try again later", "Failed");
      })
      .then((data) => {
        if (data) {
      
          setRoles("Student");
          setUserId(data.userId);
          setToken(data.token);
          navigate(`/`);
        }
      });
  }



  
      
    



  return (
    <div className="parentRegistration">
      <div className="registerContainer">
        <div className="left">
          <h1 className="h1ForRegistration">Sign Up</h1>

          <form
            className="registrationForm custom-scrollbar"
            onSubmit={sendRegisterData}
          >
            <div className="NameAndUserName">
              <div>
                {" "}
                <label htmlFor="">First Name <label style={{color:'rgb(150 147 147)'}}>(No Spaces)</label></label>
                <input
                  required
                  onChange={getRegisterData}
                  name="firstname"
                  type="text"
                  placeholder="Enter Your Name"
                />
              </div>
              <div>
                {" "}
                <label htmlFor="" >Last Name <label style={{color:'rgb(150 147 147)'}}>(No Spaces)</label></label>
                <input
                  required
                  onChange={getRegisterData}
                  name="lastname"
                  type="text"
                  placeholder="Enter Your Username"
                />
              </div>
            </div>
            <div className="username">
              {" "}
              <label htmlFor="">Username <label style={{color:'rgb(150 147 147)'}}>(No Spaces)</label></label>
              <input
                required
                onChange={getRegisterData}
                name="userName"
                type="text"
                placeholder="Enter Your Username"
              />
            </div>
            <div className="emailForm">
              <label htmlFor="">Email <label style={{color:'rgb(150 147 147)'}}>(Must Be Gmail)</label></label>
              <input
                required
                onChange={getRegisterData}
                name="email"
                type="email"
                placeholder="Enter Your Email"
              />
            </div>
            <div className="passwordAndConfirm">
              <div>
                <label htmlFor="">Password <label style={{color:'rgb(150 147 147)'}}>(Greater Than 10 Characters)</label></label>
                <input
                  required
                  onChange={getRegisterData}
                  name="password"
                  type="password"
                  placeholder="Enter Your Password"
                />
              </div>
              <div>
                <label htmlFor="">Confirm Password</label>
                <input
                  required
                  name="confirmPassword"
                  onChange={(e) => setPasswrdMatch(e.target.value)}
                  type="password"
                  placeholder="Confirm Password"
                />
              </div>
            </div>

            <div className="NameAndUserName">
              <div>
                {" "}
                <label htmlFor="">Age <label style={{color:'rgb(150 147 147)'}}>(Greater Than 18)</label></label>
                <input
                min={18}
                max={70}
                
                  required
                  onChange={getRegisterData}
                  name="age"
                  type="number"
                  placeholder="Enter Your Age"
                />
              </div>
              <div>
                {" "}
                <label htmlFor="">Gender</label>
                <select
                  required
                  className="genderSelect"
                  name="gender"
                  onChange={getRegisterData}
                >
                  <option selected={true} disabled={true}>
                    Gender
                  </option>
                  <option value={0}>Male</option>
                  <option value={1}>Female</option>
                </select>
              </div>
            </div>

            <div className="username">
              {" "}
              <label htmlFor="">Phone Number</label>
              <input
                required
                onChange={getRegisterData}
                name="phoneNumber"
                type="text"
                placeholder="Enter Your Phone Number"
              />
            </div>
            <div className="username">
              <label htmlFor="">Nationality</label>

              <select
                required
                name="nationalityId"
                className="genderSelect"
                onChange={(e) =>
                  setFormData((prev) => {
                    return { ...prev, [e.target.name]: e.target.value * 1 };
                  })
                }
              >
                <option selected disabled value={0}>
                  Nationality
                </option>
                {allNationalities?.map((nat) => {
                  return <option value={nat.id}>{nat.name}</option>;
                })}
              </select>
            </div>

            <div className="registrationButtons">
              <button
                // onClick={sendRegisterData}
                type="submit"
                className="createAccountbtn"
              >
                Create Account
              </button>
              {/* <button className="createAccountbtnWithGoogle">
                <img style={{ width: "20px" }} src={google} />
                SignUp With Google
              </button> */}
            </div>
          </form>
        </div>
        <div className="right">
          <img
            className="registartionImg"
            src={registartionImg}
            alt="registration Image"
          />
        </div>
      </div>
      {load&&<div className="modal-overlay" style={{backgroundColor:'white'}}>
        <img src={loader} />
      </div>}
    </div>
  );
};
export default Registration;
