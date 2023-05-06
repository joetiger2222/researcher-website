import React from "react";
import { useNavigate } from "react-router-dom";
export default function CourseCard({course}){
    const navigate=useNavigate();
    return (
        <div className="courseCard">
            <h1>{course.name}</h1>
            <p>
           {course.brief}
          </p>
          <div className="courseBtnAndPriceDiv">
          <button onClick={()=>navigate(`/CourseDetails/${course.id}`)}>Learn More</button>
          <h4>{course.price} EGP</h4>
          </div>
        </div>
    )
}