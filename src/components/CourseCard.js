import React from "react";

export default function CourseCard(){
    return (
        <div className="courseCard">
            <h1>Course Name</h1>
            <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book
          </p>
          <div className="courseBtnAndPriceDiv">
          <button>Learn More</button>
          <h4>30$</h4>
          </div>
        </div>
    )
}