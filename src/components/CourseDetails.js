import React from "react";
import { AiOutlineHourglass } from "react-icons/ai";
import { FaRegNewspaper } from "react-icons/fa";
import { HiAcademicCap } from "react-icons/hi";
import "../css/CourseDetails.css"
const CourseDetails = () => {
  return (
    <div className="courseParent">
      <div className="leftContent">
        <div className="CourseInfo">
          <h1 className="NameCourse">
            The complete Course python Bootcamp From Zero To Hero
          </h1>
          <h3 className="briefCourse">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum
            inventore non voluptate amet obcaecati reiciendis nulla dolore a
            natus ducimus similique eaque magni quo beatae, quidem dignissimos
            nobis quisquam maxime!
          </h3>
          <h4>Created By Admin</h4>
          <p>Last uodated 3/2/2023</p>
        </div>
        <div className="Objectives">Objectives</div>
        <div className="Instructions">Instructions</div>
      </div>

      <div className="rightContent">
        <div className="TopRight">
          <video src=""></video>
         
        </div>
        <div className="BottomRight">
        <h2>Price</h2>
          <button>Buy Now</button>
          <p>This Course Include:</p>
          <p>
            <AiOutlineHourglass />
            22 hours
          </p>
          <p>
            <HiAcademicCap />
            Certificate Of Compiletion
          </p>
          <p>
            <FaRegNewspaper />
            20 Exercise
          </p>
        </div>
      </div>
    </div>
  );
};
// #262626
// #484848
export default CourseDetails;

// "name": "string",
//   "instructions": "string",
//   "objectives": "string",
//   "price": 0,
//   "hours": "string",
//   "brief": "string",
//   "skillId": 0
