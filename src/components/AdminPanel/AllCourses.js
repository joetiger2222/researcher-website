import React, { useEffect } from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loader from '../../loader.gif';
import CourseCard from './CourseCard';
export default function AllCourses({userData}) {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [load,setLoad]=useState(false);

    function getCourses() {
        setLoad(true)
        fetch(`https://resweb-001-site1.htempurl.com/api/Courses`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        })
          // .then((res) => res.json())
          .then(res=>{
            setLoad(false);
            return res.json();
          })
          .then((data) => setCourses(data));
      }



useEffect(()=>{
    if(userData.userId!==''&&courses.length===0){
        getCourses();
    }
},[userData])


if(load){
    return(
        <div className="coursesParent">
          <img src={loader} />
        </div>
    )
}

  return (
    
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
                navigate("/CreateCourse")
              }
              className="plusBtn"
            >
              <span>+</span>Create New Course
            </button>
          </div>
        </div>
  )
}

