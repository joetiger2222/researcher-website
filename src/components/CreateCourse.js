import React, { useState } from "react";
import "../css/CreateCourse.css";

export default function CreateCourse() {
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
      .then((response) => console.log(response))
      .then((data) => console.log(data));
  }

  console.log(courseData);

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
            <label>Price</label>
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
              type="number"
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
