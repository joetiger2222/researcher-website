import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function CourseCard(props) {
    const navigate=useNavigate();
  return (
    <div
        onClick={() =>
          navigate(`/CourseDetails/${props.course.id}`,{state:{data:props.course}})
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
          <span className="notBold">{props.course.price} EGP</span>
        </h4>
      </div>
  )
}
