import React, { useEffect, useState } from "react";
import "../css/AdminPanel.css";
import Header from "./Header";
import { useLocation, useNavigate } from "react-router-dom";
export default function AdminPanel() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState(null);
  const [allSkills, setAllSkills] = useState(null);
  const [skillId, setSkillId] = useState(null);
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

  useEffect(() => {
    getCourses();
    getAllSkills();
  }, []);

  console.log(skillId);

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

  return (
    <div className="adminPanelParent" style={{ rowGap: "50px" }}>
      <Header />
      <h1 style={{ fontWeight: "bold", color: "white", marginTop: "120px" }}>
        Admin Panel
      </h1>

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
        <select
          onChange={(e) => {
            setSkillId(e.target.value * 1);
          }}
          className="SelectSkill"
          name="skillId"
          id="skill"
          class="select-field-skill"
        >
          <option selected disabled value="">
            Choose a Skill
          </option>
          {allSkills?.map((skill) => {
            return <option value={skill.id}>{skill.name}</option>;
          })}
        </select>
        {skillId && <button onClick={()=>navigate(`/AddQuizToCourse/${skillId}`,{state:{data:userData}})}>Create New Quiz</button>}
      </div>
    </div>
  );
}
