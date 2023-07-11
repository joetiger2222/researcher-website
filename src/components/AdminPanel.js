import React, { useEffect, useState } from "react";
import "../css/AdminPanel.css";
import Header from "./Header";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { json, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useContext } from "react";
import { MyContext } from '../Users/Redux';
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
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [showEditSkillName, setShowEditSkillName] = useState(false);
  const [choosenProblem, setChoosenProblem] = useState(null);
  const [adminReponse, setAdminResponse] = useState(null);
  const [allExpertReqs, setAllExpertReqs] = useState(null);
  const [searchIdea, setSearchIdea] = useState("");

  const [skillsWithQuizes, setSkillsWithQuizes] = useState(null);
  const [finalQuizSkillId, setFinalQuizSkillId] = useState(null);
  // const userData = useLocation().state?.data;
  const userData = useContext(MyContext);

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
      .then((res) =>
        res.ok ? res.json() : null
      )
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
      .then((res) =>
        res.ok ? res.json() : null
      )
      .then((data) => {
        if (data) {
          setAllTopics(data);
        }
      });
  }

  function getAllIdeas() {
    fetch(`https://localhost:7187/api/Ideas?SearchTerm=${searchIdea}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData?.token}`,
      },
    })
      .then((res) =>
        res.ok ? res.json() : null
      )
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
        res.ok
          ? res.json()
          : null
      )
      .then((data) => (data ? setStudentProblems(data) : null));
  }

  function getProblemCategories() {
    fetch(`https://localhost:7187/api/Admin/ProblemCategories`)
      .then((res) =>
        res.ok
          ? res.json()
          : null
      )
      .then((data) => (data ? setProblemCategories(data) : null));
  }

  function getAdminResponse() {
    fetch(`https://localhost:7187/api/Students/Responses`, {
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

  function getAllExpertReqs() {
    fetch(`https://localhost:7187/api/Admin/ExpertRequests`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    })
      .then((res) =>
        res.ok ? res.json() : null
      )
      .then((data) => (data ? setAllExpertReqs(data) : null));
  }

  function getAllSkillsWithQuizes() {
    fetch(`https://localhost:7187/api/Researchers/Skills`, {
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

  useEffect(() => {
    getCourses();
    getAllSkills();
    getAllSpecs();
    getAllTopics();
    getAllIdeas();
    getProblemCategories();
    getAdminResponse();
    getAllExpertReqs();
    getAllSkillsWithQuizes();
  }, [userData]);
  useEffect(() => {
    getAllIdeas();
  }, [searchIdea,userData]);

  console.log(allExpertReqs);

  useEffect(() => {
    getStudentProblems();
  }, [problemCategoryId]);

  const CourseCard = (props) => {
    return (
      <div
        onClick={() =>
          navigate(`/CourseDetails/${props.course.id}`)
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
        } else toastr.error("failed to add new speciality", "Failed");
      });
    }

    if (!props.show) return null;
    return (
      <div className="modal-overlay2">
        <div className="modal2">
          <div className="ContExitbtn" onClick={props.onClose}>
            <div class="outer">
              <div class="inner">
                <label className="label2">Exit</label>
              </div>
            </div>
          </div>
          <h1 className="headContact2">Enter Specality Name:</h1>
          <div className="FormModal2">
            <label className="AllLabeles">Name:</label>
            <input
              className="InputModalHallDetails"
              value={specName.name}
              onChange={(e) => {
                setSpecName((prev) => {
                  return { ...prev, name: e.target.value };
                });
              }}
              placeholder="New Speciality"
            ></input>
            <div className="buttonsOnModal">
              {specName.name !== "" && (
                <button onClick={addSPec}>Finish</button>
              )}
              <button onClick={props.onClose}>Cancel</button>
            </div>
          </div>
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
        } else toastr.error("failed to add new Topic", "Failed");
      });
    }

    if (!props.show) return null;
    return (
      <div className=" modal-overlay2">
        <div className="modal2">
          <div className="ContExitbtn" onClick={props.onClose}>
            <div class="outer">
              <div class="inner">
                <label className="label2">Exit</label>
              </div>
            </div>
          </div>
          <h1 className="headContact2">Create New Topic</h1>
          <div className="FormModal2">
            <label className="AllLabeles">Enter Topic Name: </label>
            <input
              className="InputModalHallDetails"
              value={topicName.name}
              onChange={(e) => {
                setTopicName((prev) => {
                  return { ...prev, name: e.target.value };
                });
              }}
              placeholder="New Topic"
            ></input>
            <label className="AllLabeles">Enter Topic Min Points</label>
            <input
              className="InputModalHallDetails"
              onChange={(e) => {
                setTopicName((prev) => {
                  return { ...prev, minmumPoints: e.target.value * 1 };
                });
              }}
              placeholder="Topic Min Points"
            ></input>
            <div className="buttonsOnModal">
              {topicName.name !== "" && (
                <button onClick={addTopic}>Finish</button>
              )}
              <button onClick={props.onClose}>Cancel</button>
            </div>
          </div>
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
          res.ok
            ? res.json()
            : toastr.error("failed to load Requests for this idea", "Failed")
        )
        .then((data) => (data ? setExpertReqForSingleIdea(data) : null));
    }

    useEffect(() => {
      getExpertReqs();
    }, []);

    if (!props.show) return null;
    return (
      <div className="modal-overlay2">
        <div className="modal2">
          <div className="ContExitbtn" onClick={props.onClose}>
            <div class="outer">
              <div class="inner">
                <label className="label2">Exit</label>
              </div>
            </div>
          </div>
          <h1 className="headContact2">Expert Req For Idea</h1>

          <div className="FormModal2">
            <div className="AllExpertReq custom-scrollbar">
              {expertReqForSingleIdea.length > 0 ? (
                expertReqForSingleIdea?.map((req) => {
                  return <SingleExpertReqCard req={req} />;
                })
              ) : (
                <div style={{ textAlign: "center" }}>No Expert Reqs</div>
              )}
            </div>

            <div className="resetAndCancel2">
              <button className="buttonExit2" onClick={props.onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SingleExpertReqCard = (props) => {
    const [resData, setResData] = useState(null);

    function getResData() {
      fetch(
        `https://localhost:7187/api/Researchers/${props.req.participantId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userData?.token}`,
          },
        }
      )
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => (data ? setResData(data) : null));
    }

    useEffect(() => {
      getResData();
    }, []);

    function deleteExpertReq(req) {
      Swal.fire({
        title: "Are You Sure To Delete The Request",
        showCancelButton: true,
      }).then((data) => {
        if (data.isConfirmed) {
          fetch(`https://localhost:7187/api/Admin/ExpertRequests/${req?.id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userData.token}`,
            },
          }).then((res) => {
            if (res.ok) {
              toastr.success("Request Successfully deleted", "Success");
              props.onClose();
              getAllExpertReqs();
            } else {
              toastr.error("Failed To Delete Request", "Failed");
            }
          });
        }
      });
    }

    return (
      <div className="ContExpertReqAdmin" style={{ backgroundColor: "white" }}>
        <span
          style={{
            padding: "10px",
            textAlign: "center",
            width: "100%",
            borderBottom: "1px solid black",
          }}
        >
          <span style={{ fontWeight: "bold" }}>Sender Name : </span>
          {resData?.firstName + " " + resData?.lastName}
        </span>
        <div className="ContBTNSData">
          <div className="contTitleAndContnentReq">
            <span>
              <span style={{ fontWeight: "bold" }}>Title : </span>
              {props.req.title}
            </span>
            <span
              className="custom-scrollbar"
              style={{ overflow: "auto", maxHeight: "150px" }}
            >
              <span style={{ fontWeight: "bold" }}>Content : </span>
              {props.req.content}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <button
              className="detailsbtn"
              onClick={() =>
                navigate(`/Idea/${props.req.ideaId}`)
              }
            >
              View Idea
            </button>
            <button
              className="buttonExit2"
              onClick={() => deleteExpertReq(props.req)}
            >
              Delete Expert Request
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ProblemResponseCard = (props) => {
    const [responseData, setResponseData] = useState({
      message: "",
      studentId: props.problem.studentId,
      problemId: props.problem.id,
    });

    function sendResponse() {
      fetch(`https://localhost:7187/api/Students/Responses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify(responseData),
      }).then((res) => {
        if (res.ok) {
          toastr.success("Response Sent Successfully", "Success");
          props.onClose();
        } else toastr.error("Failed To Send Response", "Failed");
      });
    }

    if (!props.show) return null;
    return (
      <div className="modal-overlay2">
        <div className="modal2">
          <div className="ContExitbtn" onClick={props.onClose}>
            <div class="outer">
              <div class="inner">
                <label className="label2">Exit</label>
              </div>
            </div>
          </div>
          <h1 className="headContact2">Create New Idea</h1>
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

  const EditSkillCard = (props) => {
    const [skillName, setSkillName] = useState({ name: "" });

    function editSkillName() {
      fetch(`https://localhost:7187/api/Admin/Skills/${skillId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${userData.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(skillName),
      }).then((res) => {
        if (res.ok) {
          alert("skill successfully edited");
          props.onClose();
          getAllSkills();
        } else {
          alert("Failed to edit skill name");
        }
      });
    }

    if (!props.show) return null;
    return (
      <div className="modal-overlay2">
        <div className="modal2">
          <div className="ContExitbtn" onClick={props.onClose}>
            <div class="outer">
              <div class="inner">
                <label className="label2">Exit</label>
              </div>
            </div>
          </div>
          <h1 className="headContact2">Edit Skill Name</h1>
          <div className="FormModal2">
            <label className="AllLabeles">Skill Name</label>
            <input
              placeholder="Enter Skill Name"
              className="InputModalHallDetails"
              type="text"
              name="name"
              onChange={(e) =>
                setSkillName((prev) => {
                  return { ...prev, [e.target.name]: e.target.value };
                })
              }
            ></input>
            <div className="buttonsOnModal">
              <button onClick={editSkillName}>Submit</button>
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
      fetch(`https://localhost:7187/api/Students/${props.prob.studentId}`, {
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
          </div>
          <div className="ContainerbtnData">
            <button
              onClick={() =>
                navigate("/CreateCourse")
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
                className="plusBtn"
                onClick={() =>
                  navigate(`/AddQuizToCourse/${skillId}`)
                }
              >
                Create New Quiz
              </button>
            )}
            {skillId && (
              <button
                className="plusBtn"
                onClick={() => setShowEditSkillName(true)}
              >
                Edit Skill Name
              </button>
            )}
          </div>
          {/* <div>
          <button>Create New Skill</button>
        </div> */}

          <div className="allSkillsDiv">
            <h2 style={{ color: "#262626" }}>All Specialties</h2>
            <div className="ContSpecialities custom-scrollbar">
              {allSpecs?.map((spec) => {
                return (
                  <li
                    style={{
                      color: "rgb(21 46 125)",
                      fontSize: "16px",
                      fontWeight: "700",
                    }}
                  >
                    {spec?.name}
                  </li>
                );
              })}
            </div>

            <button
              // className="buttonn"
              className="plusBtn"
              // className="button-arounder1"
              // className="bn54"
              onClick={() => setShowSpec(true)}
            >
              Create New Specality
            </button>
            <AddNewSpec show={showSpec} onClose={() => setShowSpec(false)} />
          </div>

          <div className="allSkillsDiv ">
            <h2 style={{ color: "#262626" }}>All Topics</h2>
            <div className="custom-scrollbar ContSpecialities">
              {allTopics?.map((topic) => {
                return (
                  <li
                    style={{
                      color: "rgb(21 46 125)",
                      fontSize: "16px",
                      fontWeight: "700",
                    }}
                  >
                    {topic?.name}
                  </li>
                );
              })}
            </div>

            <button className="plusBtn" onClick={() => setShowTopic(true)}>
              Create New Topic
            </button>
            <AddNewTopic show={showTopic} onClose={() => setShowTopic(false)} />
          </div>
        </div>
      </div>

      <div className="ContainerAllIdeas">
        <h1 style={{ color: "white" }}>All Ideas</h1>
        <input
          placeholder="Search by name"
          className="search-input"
          onChange={(e) => setSearchIdea(e.target.value)}
        ></input>
        <div
          style={{ maxHeight: "480px", overflow: "auto" }}
          className="AllIdeas custom-scrollbar"
        >
          {allIdeas?.length > 0 ? (
            allIdeas?.map((idea, index) => {
              return (
                <div className="CardInAllIdeas">
                  <h2>Idea {index + 1}</h2>
                  <div className="containerSpansData">
                    <span
                      style={{
                        borderBottom: "1px solid black",
                        padding: "5px",
                      }}
                    >
                      Name:{" "}
                      <span style={{ fontWeight: "bold" }}>{idea.name}</span>
                    </span>

                    <span
                      style={{
                        borderBottom: "1px solid black",
                        padding: "5px",
                      }}
                    >
                      specality:{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {idea?.specalityObj?.name}
                      </span>
                    </span>
                    <span
                      style={{
                        borderBottom: "1px solid black",
                        padding: "5px",
                      }}
                    >
                      deadline:{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {new Date(idea?.deadline).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </span>
                    <span
                      style={{
                        borderBottom: "1px solid black",
                        padding: "5px",
                      }}
                    >
                      topic:{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {idea?.topicObject?.name}
                      </span>
                    </span>
                    <span
                      style={{
                        borderBottom: "1px solid black",
                        padding: "5px",
                      }}
                    >
                      Participants Number:{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {idea?.participantsNumber}
                      </span>
                    </span>
                    <span
                      style={{
                        borderBottom: "1px solid black",
                        padding: "5px",
                      }}
                    >
                      max Participants Number:{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {idea?.maxParticipantsNumber}
                      </span>
                    </span>
                  </div>
                  <div className="ContainerbtnData">
                    <button
                      className="button-arounder1"
                      onClick={() => {
                        setExpertIdea(idea);
                        setShowExpertReqsModal(true);
                      }}
                    >
                      View Expert Requests
                    </button>
                    <button
                      className="button-arounder1"
                      onClick={() =>
                        navigate(`/Idea/${idea.id}`)
                      }
                    >
                      View Idea
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <span> No Ideas Yet!</span>
          )}
        </div>

        {showExpertReqsModal && (
          <ExpertReqsCard
            show={showExpertReqsModal}
            onClose={() => setShowExpertReqsModal(false)}
            idea={expertIdea}
          />
        )}
      </div>

      <div className="ContainerAllIdeas">
        <h1 style={{ color: "white" }}>All Expert Requestes</h1>
        <div
          style={{ maxHeight: "350px", overflow: "auto" }}
          className="AllIdeas custom-scrollbar"
        >
          {allExpertReqs?.length > 0 &&
            allExpertReqs?.map((req, index) => {
              return (
                // <div className="CardInAllIdeas">
                //   <h2>Request {index + 1}</h2>
                //   <div className="containerSpansData">
                //     <span
                //       style={{
                //         borderBottom: "1px solid black",
                //         padding: "5px",
                //       }}
                //     >
                //       Title:{" "}
                //       <span style={{ fontWeight: "bold" }}>{req.title}</span>
                //     </span>

                //     <span
                //       style={{
                //         borderBottom: "1px solid black",
                //         padding: "5px",
                //       }}
                //     >
                //       Content:{" "}
                //       <span style={{ fontWeight: "bold" }}>
                //         {req?.content}
                //       </span>
                //     </span>

                //     <span
                //       style={{
                //         borderBottom: "1px solid black",
                //         padding: "5px",
                //       }}
                //     >
                //       Sender Name:{" "}
                //       <span style={{ fontWeight: "bold" }}>
                //         {req?.content}
                //       </span>
                //     </span>

                //   </div>
                //   <div className="ContainerbtnData">
                //     <button
                //       className="button-arounder1"
                //       onClick={() => {

                //       }}
                //     >
                //       Delete Expert Request
                //     </button>
                //   </div>
                // </div>
                <SingleExpertReqCard req={req} />
              );
            })}
        </div>

        {showExpertReqsModal && (
          <ExpertReqsCard
            show={showExpertReqsModal}
            onClose={() => setShowExpertReqsModal(false)}
            idea={expertIdea}
          />
        )}
      </div>

      <div className="allSkillsDivForProblems">
        <h2>Choose Cateogry To See Problems </h2>
        <select
          onChange={(e) => {
            setProblemCategoryId(e.target.value * 1);
          }}
          className="SelectSkillForProblems"
        >
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

      {showEditSkillName && skillId && (
        <EditSkillCard
          show={showEditSkillName}
          onClose={() => setShowEditSkillName(false)}
        />
      )}
    </div>
  );
      
}
