import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import "../css/RatePage.css"
import toastr from "toastr";
import 'toastr/build/toastr.min.css';
import { useContext } from "react";
import { MyContext } from '../Users/Redux';
export default function AssignStudentToCourse(){
    // const userData=useLocation().state.data;
    const userData = useContext(MyContext);
    const [allStudents,setAllStudents]=useState(null);
    const [searchTerm,setSearchTerm]=useState('');
    const [choosenStudent,setChoosenStudent]=useState(null);
    const [showCourseCard,setShowCourseCard]=useState(false);
    const navigate=useNavigate();
    function getAllStudents(){
        fetch(`https://localhost:7187/api/Students?SearchTerm=${searchTerm}`,{
            method:"GET",
            headers:{
                "Authorization":`Bearer ${userData.token}`
            }
        })
        .then(res=>res.ok?res.json():null)
        .then(data=>data?setAllStudents(data):null)
    }

    useEffect(()=>{
        getAllStudents();
    },[searchTerm,userData])

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
          .then((res) => (res.ok ? res.json() : toastr.error("Failed To Load Courses","Failed")))
          .then((data) => setCourses(data));
      }

      useEffect(()=>{
        getAllCourses();
      },[userData])

      

      function assignToCourse(courseId,studentId){
        console.log('course id',courseId)
        console.log('studen id',studentId);
        const temp={studentId:studentId}
        fetch(`https://localhost:7187/api/Courses/Enrollment?courseId=${courseId}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${userData.token}`
            },
            body:JSON.stringify(temp)
        })
        .then(res=>res.ok?toastr.success('Student Assigned Successfully',"Success"):toastr.error('Failed To Assign Student',"Failed"))
      }


      function checkCourseEnrollment(courseId,studentId){
        fetch(`https://localhost:7187/api/Courses/CheckEnrollment?courseId=${courseId}&studentId=${studentId}`,{
      method:"GET",
      headers:{
        "Authorization":`Bearer ${userData.token}`
      }
    })
    .then(res=>res.ok?res.json():toastr.error('failed to check enrollment',"Failed"))
    .then(data=>{
        if(data){
            if(data.isEnrolled){
                toastr.warning('this student already enrolled in this course')
            }else {
                assignToCourse(courseId,studentId);
            }
        }
    })
      }

      


    if (!props.show) return null;
    return (
      <div
        className="modal-overlay2"
      >
        <div className="modal2">
             <div className="ContExitbtn" onClick={props.onClose}>
            <div class="outer">
              <div class="inner">
                <label className="label2">Exit</label>
              </div>
            </div>
          </div>
          <div className="AllAssignData">
          <h1 className="headContact2">Assign Student To Course</h1>
            <div className="ContainerForCardsRate">
  {courses?.map(course=>{
                return(
                    <div className="CardRate">
                        <span style={{borderBottom:"1px solid white",padding:"20px"}}>{"Name : "+course.name}</span>
                        {/* <span className="padding20L">{"Brief : "+course.brief}</span> */}
                        <span className="padding20L">{"Hours : "+course.hours}</span>
                        <span className="padding20L">{"Price : "+course.price}</span>
                        {/* <span className="padding20L">{"Skill : "+course.skillObj?.name}</span> */}
                            <button style={{border:"1px solid black",
                        padding:"10px",borderRadius: "0px 0 10px 10px",
                        cursor:"pointer",fontSize:"16px"}} className="HoverAssignBtn"  onClick={()=>checkCourseEnrollment(course.id,choosenStudent.id)}>Assign Student</button>
                    

                        
                    </div>
                )
            })}

            </div>
            <div className="DivBTNINassignTocourse">
            <button  className="buttonExit2" onClick={props.onClose}>Cancel</button>

            </div>

          </div>
            


          
        </div>
        </div>
    )
}

if(userData.userId===''){
  return (
    <div style={{display:'flex',width:'100%',minHeight:'100vh',justifyContent:'center',alignItems:'center',flexDirection:'column',rowGap:'20px'}}>
      <h1>Please Login First</h1>
      <button style={{width:'120px',height:'50px',borderRadius:'10px',backgroundColor:'rgb(21, 46, 125)',color:'white',fontSize:'20px',fontWeight:'bold'}} onClick={()=>navigate('/')}>Login</button>
    </div>
  )
}

    if(userData.roles==='Admin'){
    return(
        <div>
            <Header userData={userData} />
            <div className="AllDataInRatePage">
<label style={{fontSize:"20px",fontWeight:"bold"}}>Search By Email</label>
            <input className="search-input" onChange={(e)=>setSearchTerm(e.target.value)} placeholder="Enter Email..."></input>
            <div className="ContainerForCardsRate1">
            {allStudents?.map(student=>{
                return(
                    <div className="CardRate">
                        <span  style={{borderBottom:"1px solid white",padding:"20px"}}>{'Name : '+student.firstName+' '+student.lastName}</span>
                        <span className="padding20L">{'Email : '+student.email}</span>
                        <span className="padding20L">{'Nationality : '+student.nationality?.name}</span>
                        <span className="padding20L">{'Age : '+student.age}</span>
                        <span className="padding20L">{"Gender "+student.gender===0?'Female':'Male'}</span>
                        <button className="HoverAssignBtn" style={{border:"1px solid black",
                        padding:"10px",borderRadius: "0px 0 10px 10px",
                        cursor:"pointer",fontSize:"16px"}} onClick={()=>{setChoosenStudent(student);setShowCourseCard(true)}}>Assign To Course</button>
                    </div>
                )
            })}
            </div>
          
            <CoursesCard show={showCourseCard} onClose={()=>setShowCourseCard(false)} student={choosenStudent} />
       
            </div>


            </div>
    )
    }else {
        return(
            <div><h1>You Are Not Authorized To Enter This Page</h1></div>
        )
    }
}