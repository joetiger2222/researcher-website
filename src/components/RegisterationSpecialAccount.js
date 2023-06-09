import React, { useState, useEffect } from "react";
import registartionImg from "../images/registerImage.png";
import google from "../google.png";
import "../css/Registration.css";
import toastr from "toastr";
import 'toastr/build/toastr.min.css';
import { useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { MyContext } from '../Users/Redux';
export default function RegisterationSpecialAccount() {
  // const userData = useLocation().state.data;
  const userData = useContext(MyContext);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    userName: "",
    email: "",
    password: "",
    age: "",
    phoneNumber: "",
    gender: 0,
    nationalityId: 0,
    type: 0,
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
        [event.target.name]: event.target.value,
      };
    });
  }

  useEffect(() => {
    let data = formData;
    data.gender = data.gender * 1;
    setFormData(data);
  }, [formData.gender]);

  console.log(formData);

  function sendResData(resId) {
    fetch(
      `https://localhost:7187/api/Admin/Researchers/SpecialAccount/${resId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify(formData),
      }
    )
      // .then(res=>res.ok?alert('user successfully created'):alert('failed to send points and speciality'))
      .then((res) => {
        if (res.ok) {
          toastr.success("user successfully created","Success");
          navigate("/AdminPanel");
        } else toastr.error("failed to send points and speciality","Failed");
      });
  }

  function sendRegisterData(e) {
    e.preventDefault();
    if (formData.password === passwordMatch) {
      fetch(
        "https://localhost:7187/api/Authentication/Student/SpecialAccount",
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
            return res.json();
          } else toastr.error("failed to add student","Failed");
        })
        .then((data) => {
          if (data) {
            setStuId(data.userId);
            sendResData(data.userId);
          }
        });
    } else {
      toastr.error("Password and Confirm Password Does not Match","Error");
    }
  }

  function getAllNationalities() {
    fetch(`https://localhost:7187/api/Students/Nationalites`)
      .then((res) =>
        res.ok ? res.json() : toastr.error("failed to load nationalities","Failed")
      )
      .then((data) => (data ? setAllNationalities(data) : null));
  }

  useEffect(() => {
    getAllNationalities();
    getAllSpecs();
  }, [userData]);
  // console.log('stuId',stuId);
  // console.log('show res moda',showResModal);

  function getAllSpecs() {
    fetch(`https://localhost:7187/api/Researchers/Specialties`, {
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

            <form className="registrationForm custom-scrollbar">
              <div className="NameAndUserName">
                <div>
                  {" "}
                  <label htmlFor="">First Name</label>
                  <input
                    onChange={getRegisterData}
                    name="firstname"
                    type="text"
                    placeholder="Enter Your Name"
                  />
                </div>
                <div>
                  {" "}
                  <label htmlFor="">Last Name</label>
                  <input
                    onChange={getRegisterData}
                    name="lastname"
                    type="text"
                    placeholder="Enter Your Username"
                  />
                </div>
              </div>
              <div className="username">
                {" "}
                <label htmlFor="">Username</label>
                <input
                  onChange={getRegisterData}
                  name="userName"
                  type="text"
                  placeholder="Enter Your Username"
                />
              </div>
              <div className="emailForm">
                <label htmlFor="">Email</label>
                <input
                  onChange={getRegisterData}
                  name="email"
                  type="email"
                  placeholder="Enter Your Email"
                />
              </div>
              <div className="passwordAndConfirm">
                <div>
                  <label htmlFor="">Password</label>
                  <input
                    onChange={getRegisterData}
                    name="password"
                    type="password"
                    placeholder="Enter Your Password"
                  />
                </div>
                <div>
                  <label htmlFor="">Confirm Password</label>
                  <input
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
                  <label htmlFor="">Age</label>
                  <input
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
                    placeholder="Enter Points"
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
                <button onClick={sendRegisterData} className="createAccountbtn">
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
