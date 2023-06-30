import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function AssignStudentToCourse(){
    const userData=useLocation().state.data;
    const [allStudents,setAllStudents]=useState(null);
    const [searchTerm,setSearchTerm]=useState('');
    const [choosenStudent,setChoosenStudent]=useState(null);
    const [showCourseCard,setShowCourseCard]=useState(false);

    function getAllStudents(){
        fetch(`https://localhost:7187/api/Students?SearchTerm=${searchTerm}`,{
            method:"GET",
            headers:{
                "Authorization":`Bearer ${userData.token}`
            }
        })
        .then(res=>res.ok?res.json():alert('failed to load students data'))
        .then(data=>data?setAllStudents(data):null)
    }

    useEffect(()=>{
        getAllStudents();
    },[searchTerm])

    // console.log(allStudents)


const CoursesCard=(props)=>{

    const [courses,setCourses]=useState(null);

    function getAllCourses() {
        fetch(`https://localhost:7187/api/Courses`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        })
          .then((res) => (res.ok ? res.json() : alert("Failed To Load Courses")))
          .then((data) => setCourses(data));
      }

      useEffect(()=>{
        getAllCourses();
      },[])

      console.log(courses)

      function assignToCourse(){
        fetch(``,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${userData.token}`
            },
            body:JSON.stringify(props.student.id)
        })
        .then(res=>res.ok?alert('Student Assigned Successfully'):alert('Failed To Assign Student'))
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
        <div style={{ backgroundColor: "white", width: "50%", color: "black" }}>
            {courses?.map(course=>{
                return(
                    <div style={{margin:'20px',color:'gray',display:'flex',flexDirection:'column'}}>
                        <span>{"Name : "+course.name}</span>
                        <span>{"Brief : "+course.brief}</span>
                        <span>{"Hours : "+course.hours}</span>
                        <span>{"Price : "+course.price}</span>
                        <span>{"Skill : "+course.skillObj.name}</span>
                        <button onClick={assignToCourse}>Assign To Student</button>
                        <button onClick={props.onClose}>Cancel</button>
                    </div>
                )
            })}
        </div>
        </div>
    )
}



    if(userData.roles==='Admin'){
    return(
        <div>
            <input onChange={(e)=>setSearchTerm(e.target.value)} placeholder="Enter Email..."></input>
            {allStudents?.map(student=>{
                return(
                    <div style={{margin:'20px',backgroundColor:'gray',display:'flex',flexDirection:'column'}}>
                        <span>{'Name : '+student.firstName+' '+student.lastName}</span>
                        <span>{'Email : '+student.email}</span>
                        <span>{'Nationality : '+student.nationality.name}</span>
                        <span>{'Age : '+student.age}</span>
                        <span>{"Gender "+student.gender===0?'Female':'Male'}</span>
                        <button onClick={()=>{setChoosenStudent(student);setShowCourseCard(true)}}>Assign To Course</button>
                    </div>
                )
            })}
            <CoursesCard show={showCourseCard} onClose={()=>setShowCourseCard(false)} student={choosenStudent} />
        </div>
    )
    }else {
        return(
            <div><h1>You Are Not Authorized To Enter This Page</h1></div>
        )
    }
}