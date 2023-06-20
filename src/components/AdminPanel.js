import React, { useEffect, useState } from "react";
import "../css/AdminPanel.css";
import Header from "./Header";
import { json, useLocation, useNavigate } from "react-router-dom";
export default function AdminPanel() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState(null);
  const [allSkills, setAllSkills] = useState(null);
  const [skillId, setSkillId] = useState(null);
  const [showCreateSkill, setShowCreateSkill] = useState(false);
  const [showSpec, setShowSpec] = useState(false);
  const [allSpecs, setAllSpecs] = useState(null);
  const [showTopic, setShowTopic] = useState(false);
  const [allTopics, setAllTopics] = useState(null);
  const [allIdeas, setAllIdeas] = useState(null);
  const [expertIdea, setExpertIdea] = useState(null);
  const [showExpertReqsModal, setShowExpertReqsModal] = useState(false);
  const [problemCategories, setProblemCategories] = useState(null);
  const [problemCategoryId, setProblemCategoryId] = useState(1);
  const [studentProblems, setStudentProblems] = useState(null);
  const [showResponseModal,setShowResponseModal]=useState(false);
  const [choosenProblem,setChoosenProblem]=useState(null);
  const [adminReponse,setAdminResponse]=useState(null);
  const userData = useLocation().state?.data;

  function getCourses() {
    fetch(`https://localhost:7187/api/Courses`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setCourses(data));
  }

  function getAllSkills() {
    fetch(`https://localhost:7187/api/Admin/Skills`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setAllSkills(data))
      .catch((error) => console.error(error));
  }

  function getAllSpecs() {
    fetch(`https://localhost:7187/api/Researchers/Specialties`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : alert("failed to Load specs")))
      .then((data) => {
        if (data) {
          setAllSpecs(data);
        }
      });
  }

  function getAllTopics() {
    fetch(`https://localhost:7187/api/Researchers/Topics`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : alert("failed to Load topics")))
      .then((data) => {
        if (data) {
          setAllTopics(data);
        }
      });
  }

  function getAllIdeas() {
    fetch(`https://localhost:7187/api/Ideas`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData?.token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : alert("failed to Load All Ideas")))
      .then((data) => {
        if (data) {
          setAllIdeas(data);
        }
      });
  }

  function getStudentProblems() {
    fetch(
      `https://localhost:7187/api/Students/Problems?categoryId=${problemCategoryId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      }
    )
      .then((res) =>
        res.ok ? res.json() : alert("failed to load student problems")
      )
      .then((data) => (data ? setStudentProblems(data) : null));
  }

  function getProblemCategories() {
    fetch(`https://localhost:7187/api/Admin/ProblemCategories`)
      .then((res) =>
        res.ok ? res.json() : alert("failed to load problem categories")
      )
      .then((data) => (data ? setProblemCategories(data) : null));
  }

  function getAdminResponse(){
    fetch(`https://localhost:7187/api/Students/Responses`,{
      method:"GET",
      headers:{
        "Authorization":`Bearer ${userData.token}`
      },

    })
    .then(res=>res.ok?res.json():alert('failed to load responses'))
    .then(data=>data?setAdminResponse(data):null)
  }

  

  useEffect(() => {
    getCourses();
    getAllSkills();
    getAllSpecs();
    getAllTopics();
    getAllIdeas();
    getProblemCategories();
    getAdminResponse()
  }, []);

  useEffect(() => {
    getStudentProblems();
  }, [problemCategoryId]);

  const CourseCard = (props) => {
    return (
      <div
        onClick={() =>
          navigate(`/CourseDetails/${props.course.id}`, {
            state: { data: userData },
          })
        }
        className="courseDiv"
      >
        <h4>
          <span className="bold">Name: </span>
          <span className="courseNamea">{props.course.name}</span>
        </h4>
        <h4>
          <span className="bold">Duration: </span>
          <span className="notBold">{props.course.hours + " hour"}</span>
        </h4>
        {/* <h4><span>Instructions: </span>{props.course.instructions}</h4> */}
        <h4>
          <span className="bold">Price: </span>
          <span className="notBold">{props.course.price}&pound;</span>
        </h4>
      </div>
    );
  };

  const AddNewSpec = (props) => {
    const [specName, setSpecName] = useState({ name: "" });
    // console.log(specName)

    function addSPec() {
      fetch(`https://localhost:7187/api/Admin/Speciality`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userData.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(specName),
      }).then((res) => {
        if (res.ok) {
          props.onClose();
          getAllSpecs();
        } else alert("failed to add new speciality");
      });
    }

    if (!props.show) return null;
    return (
      <div
        style={{
          position: "fixed",
          left: "0",
          top: "0",
          right: "0",
          bottom: "0",
          backgroundColor: "rgba(0, 0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: "100",
        }}
      >
        <div
          style={{ width: "50%", backgroundColor: "white", display: "flex" }}
        >
          <h1>Enter Specality Name: </h1>
          <input
            value={specName.name}
            onChange={(e) => {
              setSpecName((prev) => {
                return { ...prev, name: e.target.value };
              });
            }}
            placeholder="New Speciality"
          ></input>
          <button onClick={props.onClose}>Canel</button>
          {specName.name !== "" && <button onClick={addSPec}>Finish</button>}
        </div>
      </div>
    );
  };

  const AddNewTopic = (props) => {
    const [topicName, setTopicName] = useState({ name: "", minmumPoints: 1 });
    // console.log(topicName);

    function addTopic() {
      fetch(`https://localhost:7187/api/Admin/Topic`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userData.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(topicName),
      }).then((res) => {
        if (res.ok) {
          props.onClose();
          getAllTopics();
        } else alert("failed to add new Topic");
      });
    }

    if (!props.show) return null;
    return (
      <div
        style={{
          position: "fixed",
          left: "0",
          top: "0",
          right: "0",
          bottom: "0",
          backgroundColor: "rgba(0, 0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: "100",
        }}
      >
        <div
          style={{
            width: "50%",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h1>Enter Topic Name: </h1>
          <input
            value={topicName.name}
            onChange={(e) => {
              setTopicName((prev) => {
                return { ...prev, name: e.target.value };
              });
            }}
            placeholder="New Topic"
          ></input>
          <h1>Enter Topic Min Points</h1>
          <input
            onChange={(e) => {
              setTopicName((prev) => {
                return { ...prev, minmumPoints: e.target.value * 1 };
              });
            }}
            placeholder="Topic Min Points"
          ></input>
          <button onClick={props.onClose}>Canel</button>
          {topicName.name !== "" && <button onClick={addTopic}>Finish</button>}
        </div>
      </div>
    );
  };

  const ExpertReqsCard = (props) => {
    const [expertReqForSingleIdea, setExpertReqForSingleIdea] = useState([]);

    function getExpertReqs() {
      fetch(
        `https://localhost:7187/api/Ideas/ExpertRequests/${props.idea.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      )
        .then((res) =>
          res.ok ? res.json() : alert("failed to load Requests for this idea")
        )
        .then((data) => (data ? setExpertReqForSingleIdea(data) : null));
    }
  

    function deleteExpertReq(req) {
      fetch(`https://localhost:7187/api/Admin/ExpertRequests/${req?.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
      })
  
      .then(res=>{
        if(res.ok){
          alert("Request Successfully deleted");
          props.onClose()
        }else alert("Failed To Delete Request")
      })
    }

    useEffect(() => {
      getExpertReqs();
    }, []);

    if (!props.show) return null;
    return (
      <div
        style={{
          position: "fixed",
          left: "0",
          top: "0",
          right: "0",
          bottom: "0",
          backgroundColor: "rgba(0, 0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: "100",
        }}
      >
        <div
          style={{
            width: "50%",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {expertReqForSingleIdea?.map((req) => {
            return (
              <div
                style={{
                  color: "black",
                  display: "flex",
                  flexDirection: "column",
                  borderBottom: "2px solid black",
                }}
              >
                <span>Title : {req.title}</span>
                <span>Content : {req.content}</span>
                <button onClick={() => deleteExpertReq(req)}>
                  Delete Expert Request
                </button>
              </div>
            );
          })}

          <button onClick={props.onClose}>Close</button>
        </div>
      </div>
    );
  };

  const ProblemResponseCard =(props)=>{
    const [responseData,setResponseData]=useState({message:'',studentId:props.problem.studentId,problemId:props.problem.id})

    

    function sendResponse(){
      fetch(`https://localhost:7187/api/Students/Responses`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "Authorization":`Bearer ${userData.token}`
        },
        body:JSON.stringify(responseData)
      })
      .then(res=>{
        if(res.ok){
          alert('Response Sent Successfully');
          props.onClose();
        }else alert("Failed To Send Response")
      })
    }

    if (!props.show) return null;
    return (
      <div
        style={{
          position: "fixed",
          left: "0",
          top: "0",
          right: "0",
          bottom: "0",
          backgroundColor: "rgba(0, 0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: "100",
        }}
      >
        <div
          style={{
            width: "50%",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <input name="message" onChange={(e)=>setResponseData(prev=>{return{...prev,[e.target.name]:e.target.value}})} placeholder="Enter Response"></input>
          {responseData.message&&<button onClick={sendResponse}>Send</button>}
          <button onClick={props.onClose}>Cancel</button>
        </div>
        </div>
        )
  }

  return (
    <div className="adminPanelParent" style={{ rowGap: "50px" }}>
      <Header userData={userData} />
      <h1 style={{ fontWeight: "bold", color: "white", marginTop: "120px" }}>
        Admin Panel
      </h1>
      <div className="AllContCoursesAndCreateQuiz">
        <div className="coursesParent">
          <h1>Courses</h1>
          <div className="coursesAndPlusBtn">
            {courses?.map((course) => {
              return <CourseCard course={course} />;
            })}
            <button
              onClick={() =>
                navigate("/CreateCourse", { state: { data: userData } })
              }
              className="plusBtn"
            >
              <span>+</span>Create New Course
            </button>
          </div>
        </div>

        <div className="ContTopicAndSpeciality">
          <div className="allSkillsDiv">
            <h2>Let's Choose a Skill Then Create Final Quiz </h2>
            <select
              onChange={(e) => {
                setSkillId(e.target.value * 1);
              }}
              className="SelectSkill"
              name="skillId"
              id="skill"
              class="select-field-skillInAdminPanel"
            >
              <option selected disabled value="">
                Choose a Skill
              </option>
              {allSkills?.map((skill) => {
                return <option value={skill.id}>{skill.name}</option>;
              })}
            </select>
            {skillId && (
              <button
                onClick={() =>
                  navigate(`/AddQuizToCourse/${skillId}`, {
                    state: { data: userData },
                  })
                }
              >
                Create New Quiz
              </button>
            )}
          </div>
          {/* <div>
          <button>Create New Skill</button>
        </div> */}

          <div className="allSkillsDiv">
            <h1 style={{ color: "#262626" }}>All Specialties</h1>
            <div className="ContSpecialities custom-scrollbar">
              {allSpecs?.map((spec) => {
                return (
                  <div>
                    <p>{spec?.name}</p>
                  </div>
                );
              })}
            </div>

            <button className="plusBtn" onClick={() => setShowSpec(true)}>
              Create New Specality
            </button>
            <AddNewSpec show={showSpec} onClose={() => setShowSpec(false)} />
          </div>

          <div className="allSkillsDiv">
            <h1 style={{ color: "#262626" }}>All Topics</h1>
            {allTopics?.map((topic) => {
              return (
                <div style={{ color: "#262626" }}>
                  <h4>{topic?.name}</h4>
                </div>
              );
            })}
            <button className="plusBtn" onClick={() => setShowTopic(true)}>
              Create New Topic
            </button>
            <AddNewTopic show={showTopic} onClose={() => setShowTopic(false)} />
          </div>
        </div>
      </div>

      <div>
        <h1>All Ideas</h1>
        {allIdeas?.length > 0 ? (
          allIdeas?.map((idea) => {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "20px",
                  backgroundColor: "gray",
                  width: "30%",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                <span>Name: {idea.name}</span>
                <span>Participants Number: {idea?.participantsNumber}</span>
                <span>
                  max Participants Number: {idea?.maxParticipantsNumber}
                </span>
                <span>specality: {idea?.specalityObj.name}</span>
                <span>
                  deadline:{" "}
                  {new Date(idea?.deadline).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span>topic: {idea?.topicObject.name}</span>

                <button
                  onClick={() => {
                    setExpertIdea(idea);
                    setShowExpertReqsModal(true);
                  }}
                >
                  View Expert Requests
                </button>

                
              </div>
            );
          })
        ) : (
          <span> No Ideas Yet!</span>
        )}
        {showExpertReqsModal && (
          <ExpertReqsCard
            show={showExpertReqsModal}
            onClose={() => setShowExpertReqsModal(false)}
            idea={expertIdea}
          />
        )}
      </div>

      <div className="allSkillsDiv">
        <h2>Choose Cateogry To See Problems </h2>
        <select
          onChange={(e) => {
            setProblemCategoryId(e.target.value * 1);
          }}
          className="SelectSkill"
          // name="skillId"
          // id="skill"
          class="select-field-skillInAdminPanel"
        >
          {problemCategories?.map((cat) => {
            return <option value={cat.id}>{cat.name}</option>;
          })}
        </select>
        
        {studentProblems?.map(prob=>{
          return(
            <div>
              <span>Problem Description : </span>
              <span>{prob.description}</span>
              <button onClick={()=>{setChoosenProblem(prob);setShowResponseModal(true)}}>Respond</button>
              </div>
          )
        })}
        {showResponseModal&&choosenProblem&&<ProblemResponseCard show={showResponseModal} onClose={()=>setShowResponseModal(false)} problem={choosenProblem} />}
        
      </div>
      <div style={{color:'white'}}>
          <h1>All Responses</h1>
          {adminReponse?.map(res=>{
          return(
            <div style={{border:'2px solid white'}}>
              <span>Problem :</span>
              <h5>{res.problem.description}</h5>
              <span>Admin Response :</span>
              <h5>{res.message}</h5>
            </div>
          )
        })}
        </div>
    </div>
  );
}
