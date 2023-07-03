import React, { useEffect, useState } from "react";
import "../css/AdminPanel.css";
import Header from "./Header";
import toastr from "toastr";
import 'toastr/build/toastr.min.css';
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
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [choosenProblem, setChoosenProblem] = useState(null);
  const [adminReponse, setAdminResponse] = useState(null);
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
      .then((res) => (res.ok ? res.json() : toastr.error("failed to Load specs","Failed")))
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
      .then((res) => (res.ok ? res.json() : toastr.error("failed to Load topics","Failed")))
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
      .then((res) => (res.ok ? res.json() : toastr.error("failed to Load All Ideas","Failed")))
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
        res.ok ? res.json() : toastr.error("failed to load student problems","Failed")
      )
      .then((data) => (data ? setStudentProblems(data) : null));
  }

  function getProblemCategories() {
    fetch(`https://localhost:7187/api/Admin/ProblemCategories`)
      .then((res) =>
        res.ok ? res.json() : toastr.error("failed to load problem categories","Failed")
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
      .then((res) => (res.ok ? res.json() : toastr.error("failed to load responses","Failed")))
      .then((data) => (data ? setAdminResponse(data) : null));
  }

  useEffect(() => {
    getCourses();
    getAllSkills();
    getAllSpecs();
    getAllTopics();
    getAllIdeas();
    getProblemCategories();
    getAdminResponse();
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
        } else toastr.error("failed to add new speciality","Failed");
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
        } else toastr.error("failed to add new Topic","Failed");
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
          res.ok ? res.json() : toastr.error("failed to load Requests for this idea","Failed")
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
      }).then((res) => {
        if (res.ok) {
          toastr.success("Request Successfully deleted","Success");
          props.onClose();
        } else toastr.error("Failed To Delete Request","Failed");
      });
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
                  return (
                    <div className="ContExpertReqAdmin">
                      <div className="contTitleAndContnentReq">
                        <span>
                          <span style={{ fontWeight: "bold" }}>Title : </span>
                          {req.title}
                        </span>
                        <span
                          className="custom-scrollbar"
                          style={{ overflow: "auto", maxHeight: "100px" }}
                        >
                          <span style={{ fontWeight: "bold" }}>Content : </span>
                          {req.content}
                        </span>
                      </div>
                      <div>
                        <button
                          className="buttonExit2"
                          onClick={() => deleteExpertReq(req)}
                        >
                          Delete Expert Request
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{textAlign:"center"}}>No Expert Reqs</div>
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
          toastr.success("Response Sent Successfully","Success");
          props.onClose();
        } else toastr.error("Failed To Send Response","Failed");
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
                className="plusBtn"
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
            <h2 style={{ color: "#262626" }}>All Specialties</h2>
            <div className="ContSpecialities custom-scrollbar">
              {allSpecs?.map((spec) => {
                return (
                  <li
                    style={{
                      color: "#007d6f",
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
                      color: "#007d6f",
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
        <div className="AllIdeas">
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
                        {idea?.specalityObj.name}
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
                        {idea?.topicObject.name}
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

      <div className="allSkillsDivForProblems">
        <h2>Choose Cateogry To See Problems </h2>
        <select
          onChange={(e) => {
            setProblemCategoryId(e.target.value * 1);
          }}
          className="SelectSkillForProblems"
          // className="SelectSkill"
          // name="skillId"
          // id="skill"
          // class="select-field-skillInAdminPanel"
        >
          {problemCategories?.map((cat) => {
            return <option value={cat.id}>{cat.name}</option>;
          })}
        </select>

        <div
          className="custom-scrollbar ContAllProblemsCards"
        >
          {studentProblems?.map((prob) => {
            return (
              <div className="ContainerreauestWithBtnForProblems">
                <span style={{ fontWeight: "bold", padding: "10px" }}>
                  Problem Description:
                  <p className="custom-scrollbar" style={{ padding: "10px", fontWeight: "normal",maxHeight:"145px",overflow:"auto" }}>
                    {prob.description}
                  </p>{" "}
                </span>
                <button
                className="hoverBtn"
                  onClick={() => {
                    setChoosenProblem(prob);
                    setShowResponseModal(true);
                  }}
                >
                  Respond
                </button>
              </div>
            );
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
        <div className="AllIdeas">
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
                  {res.problem.description}
                </span>
                <span className="spanForScroll custom-scrollbar">
                  <span style={{ fontWeight: "bold" }}>Admin Response :</span>{" "}
                  {res.message}
                </span>
                <span className="custom-scrollbar">
                  <span style={{ fontWeight: "bold" }}>Problem Category :</span>{" "}
                  {res.problem.problemCategory.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <button
        className="AddNewPaper"
          onClick={() =>
            navigate("/RegisterationSpecialAccount", {
              state: { data: userData },
            })
          }
        >
          Create Special Account
        </button>
      </div>
      <div>
        <button
        className="AddNewPaper"
          onClick={() =>
            navigate("/AssignStudentToCourse", {
              state: { data: userData },
            })
          }
        >
          Assign Student To Course
        </button>
      </div>
    </div>
  );
}
