import React, { useEffect, useState } from "react";
import "../css/CreateCourse.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateCourse() {
  const navigate = useNavigate();
  const[courseId,setCourseId]=useState(null);
  const [courseData, setCourseData] = useState({
    name: "",
    instructions: "",
    objectives: "",
    price: "",
    hours: "",
    brief: "",
    skillId: 0,
  });

  function getCourseData(event) {
    setCourseData((prevCourseData) => {
      return {
        ...prevCourseData,
        [event.target.name]: event.target.value,
      };
    });
    parseInt(courseData.skillId);
  }

  function sendCourseData(e) {
    e.preventDefault();

    fetch("https://localhost:7187/api/Courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(courseData),
    })
      .then((response) => {
        if (!response.ok)
          alert("failed to create course please try again Later");
          return response.json();
      })
      .then((data) =>setCourseId(data.courseId));
  }
  useEffect(()=>{
    if(courseId)
    navigate(`/CourseDetails/${courseId}`)
  },[courseId])

  return (
    <div className="createCourseContainer">
      <form className="createCourseForm">
        <h1>Create New Course</h1>
        <div className="createCourseFormOneLine">
          <label>Course Name</label>
          <input
            onChange={getCourseData}
            name="name"
            placeholder="Enter Course Name"
          ></input>
        </div>

        <div className="createCourseFormTwoInlineDiv">
          <div className="createCourseFormOneLine">
            <label>Instructions</label>
            <input
              onChange={getCourseData}
              name="instructions"
              placeholder="Enter Course Instructions"
            ></input>
          </div>
          <div className="createCourseFormOneLine">
            <label>Objectives</label>
            <input
              onChange={getCourseData}
              name="objectives"
              placeholder="Enter Course Objectives"
            ></input>
          </div>
        </div>

        <div className="createCourseFormTwoInlineDiv">
          <div className="createCourseFormOneLine">
            <label>Price (EGP)</label>
            <input
              type="number"
              className="number-input"
              onChange={getCourseData}
              name="price"
              placeholder="Enter Course's Price"
            ></input>
          </div>
          <div className="createCourseFormOneLine">
            <label>Hours</label>
            <input
              className="number-input"
              type="text"
              onChange={getCourseData}
              name="hours"
              placeholder="Enter Course's Hours"
            ></input>
          </div>
        </div>

        {/* <div className="createCourseFormTwoInlineDiv"> */}
        {/* <div className="createCourseFormOneLine">
            <label>Brief</label>
            <input
              onChange={getCourseData}
              name="brief"
              placeholder="Enter Course's Brief"
            ></input>
          </div> */}
        <div className="createCourseFormOneLine">
          <label>Skill ID</label>
          <input
            className="number-input"
            type="number"
            onChange={getCourseData}
            name="skillId"
            placeholder="Enter Course Objectives"
          ></input>
        </div>
        <div className="createCourseFormOneLine">
          <label>Brief</label>
          <textarea
            onChange={getCourseData}
            className="textareainput"
            type="text"
            name="brief"
            placeholder="Enter Course's Brief"
          ></textarea>
        </div>

        {/* </div> */}

        <div className="createCourseBtnDiv">
          <button onClick={sendCourseData}>Create</button>
        </div>
      </form>
    </div>
  );
}
