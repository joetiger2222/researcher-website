import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import "../css/RatePage.css"
import toastr from "toastr";
import 'toastr/build/toastr.min.css';
import { useContext } from "react";
import { MyContext } from '../Users/Redux';
import SideBar from "./SideBar";
import { FiMenu } from 'react-icons/fi';
import { FaTimes } from 'react-icons/fa';
import loader from '../loader.gif';
export default function AssignStudentToCourse(){
  const [load,setLoad]=useState(false);
    const userData = useContext(MyContext);
    const [allStudents,setAllStudents]=useState(null);
    const [sideBarVisible, setSideBarVisible] = useState(false);
    const [search,setSearch]=useState({SearchTerm:'',PageSize:10});
    const [choosenStudent,setChoosenStudent]=useState(null);
    const [showCourseCard,setShowCourseCard]=useState(false);
    const navigate=useNavigate();




    function getAllStudents(){
      
        fetch(`https://resweb-001-site1.htempurl.com/api/Students?SearchTerm=${search.SearchTerm}&PageSize=${search.PageSize}`,{
            method:"GET",
            headers:{
                "Authorization":`Bearer ${userData.token}`
            }
        })
        // .then(res=>res.ok?res.json():null)
        .then(res=>{
          
          if(res.ok){
            return res.json();
          }
        })
        .then(data=>data?setAllStudents(data):null)
    }

    useEffect(()=>{
        getAllStudents();
    },[search,userData])

   



console.log('search',search)



    function renderSideBar() {
      if (sideBarVisible) {
        return <SideBar />;
      }
    }
  
    function renderSideBarIcon() {
      if (sideBarVisible) {
        return (
         <FaTimes style={{color:'black',width:'40px',height:'40px'}}/>
        );
      } else {
        return (
          <FiMenu style={{color:'black',width:'40px',height:'40px'}} />
        );
      }
    }



const CoursesCard=(props)=>{

    const [courses,setCourses]=useState(null);

    function getAllCourses() {
        fetch(`https://resweb-001-site1.htempurl.com/api/Courses`, {
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
        
        const temp={studentId:studentId}
        fetch(`https://resweb-001-site1.htempurl.com/api/Courses/Enrollment?courseId=${courseId}`,{
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
        fetch(`https://resweb-001-site1.htempurl.com/api/Courses/CheckEnrollment?courseId=${courseId}&studentId=${studentId}`,{
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
      <button style={{width:'120px',height:'50px',borderRadius:'10px',backgroundColor:'rgb(21, 46, 125)',color:'white',fontSize:'20px',fontWeight:'bold'}} onClick={()=>navigate('/Login')}>Login</button>
    </div>
  )
}



if(load){
  return(
    <div style={{width:'100%',minHeight:'100vh',display:'flex',justifyContent:'center',alignItems:'center',backgroundColor:'white'}}>
      <img src={loader} />
    </div>
  )
}




    if(userData.roles==='Admin'){
    return(
        <div>
            <Header userData={userData} />
            {renderSideBar()}
          <div
            style={{
              display: "none",
              position: "fixed",
              top: "20px",
              right: "50px",
              zIndex: "200",
            }}
            onClick={() => setSideBarVisible(!sideBarVisible)}
            class="sidebarClodeIcon"
          >
            {renderSideBarIcon()}
          </div>
            <div className="AllDataInRatePage">
<label style={{fontSize:"20px",fontWeight:"bold"}}>Search By Email</label>
            <input className="search-input" name="SearchTerm" onChange={(e)=>setSearch(prev=>{return{...prev,[e.target.name]:e.target.value}})} placeholder="Enter Email..."></input>
            
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
            <button className="plusBtn" onClick={(e)=>setSearch(prev=>{return{...prev,PageSize:search.PageSize+10}})}>View More</button>
          
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