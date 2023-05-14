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
    fetch(`https://localhost:7187/api/Researchers/Skills`, {
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

  useEffect(() => {
    getCourses();
    getAllSkills();
    getAllSpecs();
    getAllTopics();
  }, []);

  // console.log(allSpecs);

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

        <div>
          <button>Create New Skill</button>
        </div>

        <div>
          <h1 style={{ color: "white" }}>All Specialties</h1>
          {allSpecs?.map((spec) => {
            return (
              <div style={{ color: "white" }}>
                <h4>{spec?.name}</h4>
              </div>
            );
          })}
          <button onClick={() => setShowSpec(true)}>
            Create New Specality
          </button>
          <AddNewSpec show={showSpec} onClose={() => setShowSpec(false)} />
        </div>

        <div>
          <h1 style={{ color: "white" }}>All Topics</h1>
          {allTopics?.map((topic) => {
            return (
              <div style={{ color: "white" }}>
                <h4>{topic?.name}</h4>
              </div>
            );
          })}
          <button onClick={() => setShowTopic(true)}>Create New Topic</button>
          <AddNewTopic show={showTopic} onClose={() => setShowTopic(false)} />
        </div>
      </div>
    </div>
  );
}
