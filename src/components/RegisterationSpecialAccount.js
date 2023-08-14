import React, { useState, useEffect } from "react";
import registartionImg from "../images/registerImage.png";
import "../css/Registration.css";
import toastr from "toastr";
import 'toastr/build/toastr.min.css';
import {  useNavigate } from "react-router-dom";
import { useContext } from "react";
import { MyContext } from '../Users/Redux';
import loader from '../loader.gif';
export default function RegisterationSpecialAccount() {
  
  const userData = useContext(MyContext);
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
    nationalityId: 0,
    type: -1,
    isMentor: true,
    points: 0,
    specalityId: 0,
  });
  const [passwordMatch, setPasswrdMatch] = useState("");
  const [allNationalities, setAllNationalities] = useState([]);
  const [stuId, setStuId] = useState(null);
  const [showResModal, setShowResModal] = useState(false);
  const [allSpecs, setAllSpecs] = useState(null);
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

 

  function sendResData(resId) {
    setLoad(true)
    fetch(
      `https://resweb-001-site1.htempurl.com/api/Admin/Researchers/SpecialAccount/${resId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify(formData),
      }
    )
      
      .then((res) => {
        if (res.ok) {
          setLoad(false)
          toastr.success("user successfully created","Success");
          navigate("/AdminPanel");
        } else toastr.error("failed to send points and speciality","Failed");
      });
  }

  function sendRegisterData(e) {
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
    if (formData.type*1 !== 0) {
      if (formData.type*1 !== 1) {
        if (formData.type*1 !== 2) {
      toastr.error('Please Choose A Valid Type');
      setLoad(false)
      return;
      }
    }
    }
    
    if(formData.nationalityId===0){
      toastr.error('Please Choose A Valid Nationality');
      setLoad(false)
      return;
    }
    if(formData.specalityId===0){
      toastr.error('Please Choose A Valid Speciality');
      setLoad(false)
      return;
    }


    if (formData.password === passwordMatch) {
      setLoad(true)
      fetch(
        "https://resweb-001-site1.htempurl.com/api/Authentication/Student/SpecialAccount",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
          body: JSON.stringify(formData),
        }
      )
        // .then((res) => {
        //   if (res.ok) {
        //     return res.json();
        //   } else toastr.error("failed to add student","Failed");
        // })
        // .then((data) => {
        //   if (data) {
        //     setStuId(data.userId);
        //     sendResData(data.userId);
        //   }
        // });
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
          } 

          return readStream().then((chunks) => {
            const body = new TextDecoder().decode(
              new Uint8Array(chunks.flatMap((chunk) => Array.from(chunk)))
            );
            const response = JSON.parse(body);
          if(response.userId){
            setLoad(false)
              const userId = response.userId;
              setStuId(userId);
            sendResData(userId);
           
          }
          });
        })
        .catch((error) => console.error(error));
    } else {
      setLoad(false)
      toastr.error("Password and Confirm Password Does not Match","Error");
    }
  }

  function getAllNationalities() {
    setLoad(true)
    fetch(`https://resweb-001-site1.htempurl.com/api/Students/Nationalites`)
      // .then((res) =>
      //   res.ok ? res.json() : toastr.error("failed to load nationalities","Failed")
      // )
      .then(res=>{
        setLoad(false)
        if(res.ok){

          return res.json();
        }else toastr.error("failed to load nationalities","Failed")
      })
      .then((data) => (data ? setAllNationalities(data) : null));
  }

  useEffect(() => {
    getAllNationalities();
    getAllSpecs();
  }, [userData]);


  function getAllSpecs() {
    fetch(`https://resweb-001-site1.htempurl.com/api/Researchers/Specialties`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : toastr.error("failed to Load specs","Failed")))
      .then((data) => {
        if (data) {
          setAllSpecs(data);
        }
      });
  }

 






  if (userData.roles === "Admin") {
    return (
      <div className="parentRegistration">
        <div className="registerContainer">
          <div className="left">
            <h1 className="h1ForRegistration">Sign Up</h1>

            <form className="registrationForm custom-scrollbar" onSubmit={sendRegisterData}>
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
                  <label htmlFor="">Last Name <label style={{color:'rgb(150 147 147)'}}>(No Spaces)</label></label>
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
                  required
                    onChange={getRegisterData}
                    name="age"
                    type="text"
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
              <div className="NameAndUserName">
                <div style={{width:"30%"}}>
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
                    <option selected disabled>
                      Nationality
                    </option>
                    {allNationalities?.map((nat) => {
                      return <option value={nat.id}>{nat.name}</option>;
                    })}
                  </select>
                </div>
                <div style={{width:"30%"}}>
                  <label htmlFor="">Type</label>

                  <select
                  required
                    className="genderSelect"
                    name="type"
                    onChange={(e) =>
                      setFormData((prev) => {
                        return { ...prev, [e.target.name]: e.target.value * 1 };
                      })
                    }
                  >
                    <option selected={true} disabled={true}>
                      Type
                    </option>
                    <option value={0}>Student</option>
                    <option value={1}>Graduated</option>
                    <option value={2}>Specialist</option>
                    {/* <option value={3}></option> */}
                  </select>
                </div>
                <div style={{width:"30%"}}>
                  <label htmlFor="">isMentor</label>

                  <select
                  required
                    className="genderSelect"
                    name="isMentor"
                    onChange={(e) => {
                      const selectedValue = e.target.value === "true"; // Convert the string value to boolean
                      setFormData((prev) => {
                        return { ...prev, [e.target.name]: selectedValue };
                      });
                    }}
                  >
                    <option disabled>Choose an option</option>
                    <option value={true}>True</option>
                    <option value={false}>False</option>
                  </select>
                </div>
              </div>

              <div className="NameAndUserName">
                <div>
                  <label>Points </label>
                  <input
                  required
                    placeholder="Enter Points"
                    type="number"
                    min={0}
                    name="points"
                    onChange={(e) =>
                      setFormData((prev) => {
                        return { ...prev, [e.target.name]: e.target.value * 1 };
                      })
                    }
                  ></input>
                </div>
                <div>
                  <label>Speciality </label>

                  <select
                  required
                    name="specalityId"
                    className="genderSelect"
                    onChange={(e) =>
                      setFormData((prev) => {
                        return { ...prev, [e.target.name]: e.target.value * 1 };
                      })
                    }
                  >
                    <option disabled selected>
                      Speciality
                    </option>
                    {allSpecs?.map((spec) => {
                      return <option value={spec.id}>{spec.name}</option>;
                    })}
                  </select>
                </div>
              </div>

              <div className="registrationButtons">
                <button  className="createAccountbtn" type="submit">
                  Create Account
                </button>

                {/* {showResModal&&<ResCard show={showResModal} onClose={()=>setShowResModal(false) } />} */}
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
  } else {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <h1>You Are Not Allowed In This Page</h1>
      </div>
    );
  }
}
