import React, { useEffect, useState } from "react";
import "../../css/AdminPanel.css";
import Header from "../Header";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useContext } from "react";
import { MyContext } from '../../Users/Redux';
import SideBar from "../SideBar";
import { FiMenu } from 'react-icons/fi';
import { FaTimes } from 'react-icons/fa';
import loader from '../../loader.gif';
import AllCourses from "./AllCourses";
import AllSkills from "./AllSkills";
import AllSpecs from "./AllSpecs";
import AllTopics from "./AllTopics";
import AllIdeas from "./AllIdeas";
import AllExpertRequests from "./AllExpertRequests";
export default function AdminPanel() {
  const [load,setLoad]=useState(false);
  const navigate = useNavigate();
  
  
  const [sideBarVisible, setSideBarVisible] = useState(false);

  
  
  const [problemCategories, setProblemCategories] = useState(null);
  const [problemCategoryId, setProblemCategoryId] = useState(null);
  const [studentProblems, setStudentProblems] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [choosenProblem, setChoosenProblem] = useState(null);
  const [adminReponse, setAdminResponse] = useState(null);
  const [choosenCat,setChoosenCat]=useState(1);
  const [skillsWithQuizes, setSkillsWithQuizes] = useState(null);
  const [finalQuizSkillId, setFinalQuizSkillId] = useState(null);
  const userData = useContext(MyContext);





  function renderSideBar() {
    if (sideBarVisible) {
      return <SideBar />;
    }
  }

  function renderSideBarIcon() {
    if (sideBarVisible) {
      return (
       <FaTimes style={{color:'#3e8dff',width:'40px',height:'40px'}}/>
      );
    } else {
      return (
        <FiMenu style={{color:'#3e8dff',width:'40px',height:'40px'}} />
      );
    }
  }





  

  

  function getStudentProblems() {
    fetch(
      `https://resweb-001-site1.htempurl.com/api/Students/Problems?categoryId=${problemCategoryId}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${userData.token}`,
        },
      }
    )
      .then((res) =>
        res.ok
          ? res.json()
          : null
      )
      .then((data) => (data ? setStudentProblems(data) : null));
  }

  function getProblemCategories() {
    fetch(`https://resweb-001-site1.htempurl.com/api/Admin/ProblemCategories`)
      .then((res) =>
        res.ok
          ? res.json()
          : null
      )
      .then((data) => (data ? setProblemCategories(data) : null));
  }

  function getAdminResponse() {
    fetch(`https://resweb-001-site1.htempurl.com/api/Admin/Responses/ProbelmCategory/${choosenCat}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    })
      .then((res) =>
        res.ok ? res.json() : null
      )
      .then((data) => (data ? setAdminResponse(data) : null));
  }

  

  function getAllSkillsWithQuizes() {
    fetch(`https://resweb-001-site1.htempurl.com/api/Researchers/Skills`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const uniqueArray = Array.from(new Set(data.map((obj) => obj.id))).map(
          (id) => {
            return data.find((obj) => obj.id === id);
          }
        );
        setSkillsWithQuizes(uniqueArray);
      })
      .catch((error) => console.error(error));
  }

  function deleteRes(resId){
    Swal.fire({
      title: "Are You Sure To Delete The Response",
      showCancelButton: true,
    }).then(data=>{
      if(data.isConfirmed){
        fetch(`https://resweb-001-site1.htempurl.com/api/Students/responseId?responseId=${resId}`,{
          method:"DELETE",
          headers:{
            "Authorization":`Bearer ${userData.token}`
          }
        })
        .then(res=>{
          if(res.ok){
            toastr.success('Response Deleted Successfully');
            getAdminResponse();
          }else{
            toastr.error('Failed To Delete Response Please Try Again Later')
          }
        })
      }
    })
    
  }

  useEffect(() => {
    getProblemCategories();
    getAllSkillsWithQuizes();
  }, [userData]);
  useEffect(()=>{
    getAdminResponse();
  },[userData,choosenCat])


 

  useEffect(() => {
    getStudentProblems();
  }, [problemCategoryId]);

  

  

  

  

  const ProblemResponseCard = (props) => {
    const [responseData, setResponseData] = useState({
      message: "",
      studentId: props.problem.studentId,
      problemId: props.problem.id,
    });

    function sendResponse() {
      setLoad(true)
      fetch(`https://resweb-001-site1.htempurl.com/api/Students/Responses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify(responseData),
      }).then((res) => {
        setLoad(false)
        if (res.ok) {
          toastr.success("Response Sent Successfully", "Success");
          props.onClose();
        } else toastr.error("Failed To Send Response", "Failed");
      });
    }

    if (!props.show) return null;
    return (
      <div className="modal-overlay2">
        <div className="modal2" style={{height:'300px',alignItems:'center'}}>
          <div className="ContExitbtn" onClick={props.onClose}>
            <div class="outer">
              <div class="inner">
                <label className="label2">Exit</label>
              </div>
            </div>
          </div>
          <h1 className="headContact2">Send Response To Student</h1>
          <div className="FormModal2">
            <label className="AllLabeles">Message: </label>
            <input
              className="InputModalHallDetails"
              name="message"
              onChange={(e) =>
                setResponseData((prev) => {
                  return { ...prev, [e.target.name]: e.target.value };
                })
              }
              placeholder="Enter Response"
            ></input>
            <div className="buttonsOnModal">
              {responseData.message && (
                <button onClick={sendResponse}>Send</button>
              )}
              <button onClick={props.onClose}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  

  const StudentProblemCard = (props) => {
    const [studentData, setStudentData] = useState(null);

    function getStudentData() {
      fetch(`https://resweb-001-site1.htempurl.com/api/Students/${props.prob.studentId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData?.token}`,
        },
      })
        .then((res) =>
          res.ok
            ? res.json()
            : toastr.error("Something Wrong Happened", "Error")
        )
        .then((data) => {
          if (data) {
            setStudentData(data);
          }
        });
    }
    useEffect(() => {
      getStudentData();
    }, []);

    return (
      <div className="ContainerreauestWithBtnForProblems">
        <p
          className="custom-scrollbar UserNameHover"
          onClick={() =>
            navigate(`/Profile/${props.prob.studentId}`)
          }
          style={{
            cursor: "pointer",
            padding: "10px 0",
            fontWeight: "normal",
            borderBottom: "1px solid black",
            width: "100%",
            textAlign: "center",
          }}
        >
          <span style={{ fontWeight: "bold" }}>Student Name:</span>{" "}
          {studentData?.firstName + " " + studentData?.lastName}
        </p>{" "}
        <div
          style={{
            padding: "10px",
            width: "95%",
            height: "150px",
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
          }}
        >
          <span
            style={{ fontWeight: "bold", padding: "10px", height: "101px" }}
          >
            Problem Description:
            <p
              className="custom-scrollbar"
              style={{
                padding: "5px 10px",
                fontWeight: "normal",
                maxHeight: "75px",
                overflow: "auto",
              }}
            >
              {props.prob.description}
            </p>{" "}
          </span>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <button
              style={{ width: "100px" }}
              className="hoverBtn"
              onClick={() => {
                setChoosenProblem(props.prob);
                setShowResponseModal(true);
              }}
            >
              Respond
            </button>
          </div>
        </div>
      </div>
    );
  };

  if(userData.userId===''){
    return (
      <div style={{display:'flex',width:'100%',minHeight:'100vh',justifyContent:'center',alignItems:'center',flexDirection:'column',rowGap:'20px'}}>
        <h1>Please Login First</h1>
        <button style={{width:'120px',height:'50px',borderRadius:'10px',backgroundColor:'rgb(21, 46, 125)',color:'white',fontSize:'20px',fontWeight:'bold'}} onClick={()=>navigate('/')}>Login</button>
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
    <div className="adminPanelParent" style={{ rowGap: "50px" }}>
      <Header userData={userData} />
      {renderSideBar()}
          <div
            style={{
              display: "none",
              position: "fixed",
              top: "20px",
              right: "50px",
              zIndex: "200",
            }}
            onClick={() => setSideBarVisible(!sideBarVisible)}
            class="sidebarClodeIcon"
          >
            {renderSideBarIcon()}
          </div>
      <h1 style={{ fontWeight: "bold", color: "white", marginTop: "120px" }}>
        Admin Panel
      </h1>
      <div className="AllContCoursesAndCreateQuiz">
        <AllCourses userData={userData} />

        <div className="ContTopicAndSpeciality">
          
         <AllSkills userData={userData} />

          <AllSpecs userData={userData} />

          <AllTopics userData={userData} />
        </div>
      </div>

      <AllIdeas userData={userData} />

      <AllExpertRequests userData={userData} />

      <div className="allSkillsDivForProblems">
        <h2>Choose Cateogry To See Problems </h2>
        <select
          onChange={(e) => {
            setProblemCategoryId(e.target.value * 1);
          }}
          className="SelectSkillForProblems"
        >
          <option selected disabled>Choose Category</option>
          {problemCategories?.map((cat) => {
            return <option value={cat.id}>{cat.name}</option>;
          })}
        </select>

        <div className="custom-scrollbar ContAllProblemsCards">
          {studentProblems?.map((prob) => {
            return <StudentProblemCard prob={prob} />;
          })}
          {showResponseModal && choosenProblem && (
            <ProblemResponseCard
              show={showResponseModal}
              onClose={() => setShowResponseModal(false)}
              problem={choosenProblem}
            />
          )}
        </div>
      </div>
      <div className="ContainerAllIdeas">
        <h1 style={{ color: "white" }}>All Responses</h1>
        <select
        className="SelectSkillForProblems"
          onChange={(e)=>setChoosenCat(e.target.value*1)}
          >
            {problemCategories?.map(cat=>{
              return(
                <option value={cat.id}>{cat.name}</option>
              )
            })}
          </select>
        <div
          style={{ width: "90%", maxHeight: "430px", overflow: "auto" }}
          className="AllIdeas custom-scrollbar"
        >
          
          {adminReponse?.map((res) => {
            return (
              <div
                //  style={{border:'2px solid white'}}
                className="CardInAllIdeas"
              >
                <span className="spanForScroll custom-scrollbar ">
                  <span style={{ fontWeight: "bold" }}>
                    Problem Description :
                  </span>{" "}
                  {res.problem?.description}
                </span>
                <span className="spanForScroll custom-scrollbar">
                  <span style={{ fontWeight: "bold" }}>Admin Response :</span>{" "}
                  {res.message}
                </span>
                <span className="custom-scrollbar">
                  <span style={{ fontWeight: "bold" }}>Problem Category :</span>{" "}
                  {res.problem?.problemCategory?.name}
                </span>
                <button className="buttonExit2" onClick={()=>deleteRes(res.id)}>Delete</button>
              </div>
            );
          })}
        </div>
      </div>
      <div className="allSkillsDiv">
        <h2>Choose a Skill To View It's Quizes </h2>
        <select
          onChange={(e) => {
            setFinalQuizSkillId(e.target.value * 1);
          }}
          className="SelectSkill"
          name="skillId"
          id="skill"
          class="select-field-skillInAdminPanel"
        >
          <option selected disabled value="">
            Choose a Skill
          </option>
          {skillsWithQuizes?.map((skill) => {
            return <option value={skill.id}>{skill.name}</option>;
          })}
        </select>
        {finalQuizSkillId && (
          <button
            className="plusBtn"
            onClick={() =>
              navigate(`/AllFinalQuizes/${finalQuizSkillId}`)
            }
          >
            View All Quizes
          </button>
        )}
      </div>
      <div>
        <button
          className="plusBtn"
          onClick={() =>
            navigate("/RegisterationSpecialAccount")
          }
        >
          Create Special Account
        </button>
      </div>
      <div style={{ marginBottom: "50px" }}>
        <button
          className="plusBtn"
          onClick={() =>
            navigate("/AssignStudentToCourse")
          }
        >
          Assign Student To Course
        </button>
      </div>

     
     
    </div>
  );
      
}
