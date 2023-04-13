import React, { useEffect, useState } from "react";
import { AiOutlineHourglass } from "react-icons/ai";
import { FaRegNewspaper } from "react-icons/fa";
import { HiAcademicCap } from "react-icons/hi";
import "../css/CourseDetails.css";
import Header from "./Header.js";
import { Link } from "react-router-dom";
import { FaArrowCircleDown, FaArrowCircleUp } from "react-icons/fa";
const CourseDetails = () => {
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    fetch(`https://localhost:7187/api/courses/Videos/1`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch video.");
        }

        return response.blob();
      })
      .then((blob) => {
        const videoUrl = URL.createObjectURL(blob);
        setVideoUrl(videoUrl);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  console.log(videoUrl);

  const SectionCard = () => {
    const [activeSection, setAtiveSection] = useState(false);

    return (
      <div className="courseDetailsSectionsContainer">
        <h3 onClick={(e) => setAtiveSection(!activeSection)}
         
        >
          Section Name
          { <FaArrowCircleDown style={{ transform: activeSection ? "rotate(180deg)" : "none",
          transition:   " 0.3s ease-in-out" 
        
        }} />}
         
        </h3>
        <div
          className="courseDetailsSectionVideos"
          style={{ display: activeSection ? "flex" : "none",
          
         }}
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <Link className="LinkVideoSection">{num}</Link>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="courseParent">
      <Header />

      <div className="LeftRight">
        <div className="LeftInfo">
          <h1 className="NameCourse">
            The complete Course python Bootcamp From Zero To Hero
          </h1>
          <p className="briefCourse">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum
            inventore non voluptate amet obcaecati reiciendis nulla dolore a
            natus ducimus similique eaque magni quo beatae, quidem dignissimos
            nobis quisquam maxime!
          </p>
          <h2>Price: 20$</h2>
          <button>Buy Now</button>
        </div>
        <div className="RightVideo">
          <div className="courseDetailesVideoDiv">
            {videoUrl ? (
              <video
                className="Video"
                controls
                src={videoUrl}
                type="video/mp4"
              />
            ) : (
              <h1>Intro Video</h1>
            )}
          </div>

          <div className="BottomRightInfo">
            <h3 className="headInfo">This Course Includes:</h3>
            <p>
              <AiOutlineHourglass />
              22 hours
            </p>
            <p>
              <HiAcademicCap />
              Certificate Of Compiletion
            </p>
            
          </div>
        </div>

        <div className="courseDetailsCourseContentDiv">
          <h1>Course Content</h1>
          <div className="ContSections">
            <SectionCard />
            <SectionCard />
            <SectionCard />
            <SectionCard />
          </div>
        </div>
<div className="ContObjecInst"> <div className="Objectives">
        Objectives
        </div>
        <div className="Instructions">
        Instructions  
        </div></div>
       
      </div>

      {/* <div className="Bottom">
        <div className="Objectives">Objectives</div>
        <div className="Instructions">Instructions</div>
      </div> */}
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
