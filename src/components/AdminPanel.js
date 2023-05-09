import React, { useEffect, useState } from "react";
import "../css/AdminPanel.css";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
export default function AdminPanel() {
    const navigate=useNavigate();
    const [courses,setCourses]=useState(null);

    function getCourses(){
        fetch(`https://localhost:7187/api/Courses`)
        .then(res=>res.json())
        .then(data=>setCourses(data))
    }
useEffect(()=>{
    getCourses();
},[])
console.log(courses)

const CourseCard=(props)=>{
   
    return (
        <div onClick={()=>navigate(`/CourseDetails/${props.course.id}`)} className="courseDiv">
            <h4><span className="bold">Name: </span><span className="courseNamea">{props.course.name}</span></h4>
            <h4><span  className="bold">Duration: </span><span className="notBold">{props.course.hours+" hour"}</span></h4>
            {/* <h4><span>Instructions: </span>{props.course.instructions}</h4> */}
            <h4><span  className="bold">Price: </span><span className="notBold">{props.course.price}&pound;</span></h4>
        </div>
    )
}



  return (
    <div className="adminPanelParent">
      <Header />
      <h1 style={{fontWeight:'bold',color:'white',marginTop:'120px'}}>Admin Panel</h1>

      <div className="coursesParent">
        <h1>Courses</h1>
        <div className="coursesAndPlusBtn">
        {
            courses?.map(course=>{
                return(
                    <CourseCard course={course} />
                )
            })
        }
        <button onClick={()=>navigate('/CreateCourse')} className="plusBtn"><span>+</span>Create New Course</button>
        </div>
      </div>
    </div>
  );
}
