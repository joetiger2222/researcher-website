import React, { useEffect, useState } from "react";
import "../css/CreateCourse.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import toastr from "toastr";
import 'toastr/build/toastr.min.css';
export default function CreateCourse() {
  const navigate = useNavigate();
  const [courseId, setCourseId] = useState(null);
  const userData=useLocation().state?.data
  const [courseData, setCourseData] = useState({
    name: "",
    instructions: "",
    objectives: "",
    price: "",
    hours: "",
    brief: "",
    driveLink:'',
    skillId: 0,
  });

  const[allSkills,setAllSkills]=useState(null);



  function getCourseData(event) {
    if(event.target.name!=='skillId'){
    setCourseData((prevCourseData) => {
      return {
        ...prevCourseData,
        [event.target.name]: event.target.value,
        
      };
    });
  }else{
    setCourseData((prevCourseData) => {
      return {
        ...prevCourseData,
        [event.target.name]: event.target.value*1,
        
      };
    });
  }
    
  }




console.log(courseData)

  function getAllSkills(){
    fetch(`https://localhost:7187/api/Researchers/Skills`,{
      method:"GET",
      headers:{
        "Authorization":`Bearer ${userData.token}`
      }
    })
    .then(res=>res.ok?res.json():null)
    .then(data=>setAllSkills(data))
    .catch(error=>console.error(error))
  }

  useEffect(()=>{
    getAllSkills();
},[])

  function sendCourseData(e) {
    e.preventDefault();

    fetch("https://localhost:7187/api/Courses", {
      method: "POST",
      headers: {
        "Authorization":`Bearer ${userData.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(courseData),
    })
      .then((response) => {
        if (!response.ok)
          toastr.error("failed to create course please try again Later","Failed");
        return response.json();
      })
      .then((data) => setCourseId(data.courseId));
  }
  useEffect(() => {
    if (courseId) navigate(`/CourseDetails/${courseId}`,{state:{data:userData}});
  }, [courseId]);

  return (
    <div className="createCourseContainer">
      <form className="createCourseForm">
        <h1>Create New Course</h1>
        {/* <div className="createCourseFormOneLine">
          <label>Course Name</label>
          <input
            onChange={getCourseData}
            name="name"
            placeholder="Enter Course Name"
          ></input>
        </div> */}
        <div className="createCourseFormTwoInlineDiv">
          <div className="createCourseFormOneLine">
            <label>Course Name</label>
            <input onChange={getCourseData} name="name"></input>
          </div>
          <div className="createCourseFormOneLine">
            {/* <label>Skill</label> */}
            <select onChange={getCourseData} className="SelectSkill" name="skillId" id="skill" class="select-field-skill">
              <option selected disabled value="">Choose a Skill</option>
              {allSkills?.map(skill=>{
                  return(
                    <option value={skill.id}>{skill.name}</option>
                  )
                  })}
            </select>
          
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
            ></input>
          </div>
          <div className="createCourseFormOneLine">
            <label>Hours</label>
            <input
              className="number-input"
              type="text"
              onChange={getCourseData}
              name="hours"
            ></input>
          </div>
        </div>
        <div className="conAllTextareaCreateCourse">
        <div className="createCourseFormOneLineNew">
          <label>Instructions</label>
          <textarea
            onChange={getCourseData}
            className="textareainput"
            type="text"
            name="instructions"
          ></textarea>
        </div>
        <div className="createCourseFormOneLineNew">
          <label>Objectives:</label>
          <textarea
            onChange={getCourseData}
            className="textareainput"
            type="text"
            name="objectives"
          ></textarea>
        </div>
       
        <div className="createCourseFormOneLineNew">
          <label>Brief</label>
          <textarea
            onChange={getCourseData}
            className="textareainput"
            type="text"
            name="brief"
          ></textarea>
        </div>
        

        <div className="createCourseFormOneLine">
            <label>Drive Link</label>
            <input onChange={getCourseData} name="driveLink"></input>
          </div>


        </div>
        {/* </div> */}

        <div className="createCourseBtnDiv">
          <button onClick={sendCourseData}>Create</button>
        </div>
      </form>
    </div>
  );
}
