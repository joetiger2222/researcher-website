import React, { useEffect, useState } from "react";
import { AiOutlineHourglass } from "react-icons/ai";
import { FaRegNewspaper } from "react-icons/fa";
import { HiAcademicCap } from "react-icons/hi";
import "../css/CourseDetails.css";
import Header from "./Header.js";
const CourseDetails = () => {
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    // Make the GET request to the API endpoint
    fetch(`https://localhost:7187/api/courses/Videos/1`)
      .then((response) => {
        // Check if the response is successful
        if (!response.ok) {
          throw new Error("Failed to fetch video.");
        }
        // Return the response as a blob
        return response.blob();
      })
      .then((blob) => {
        // Convert the blob to a URL and set it as the source of the video player
        const videoUrl = URL.createObjectURL(blob);
        setVideoUrl(videoUrl);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  console.log(videoUrl);
  return (
    
    <div className="courseParent">
              <Header />

      <div className="LeftRight">
        <div className="LeftInfo">
          <h1 className="NameCourse">
            The complete Course python Bootcamp From Zero To Hero
          </h1>
          <h3 className="briefCourse">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum
            inventore non voluptate amet obcaecati reiciendis nulla dolore a
            natus ducimus similique eaque magni quo beatae, quidem dignissimos
            nobis quisquam maxime!
          </h3>
          <h2>Price</h2>
          <button>Buy Now</button>
        </div>
        <div className="RightVideo">
          {videoUrl ? (
            <video controls src={videoUrl} type="video/mp4" />
          ) : (
            <p>Loading video...</p>
          )}
          <div className="BottomRightInfo">
            <p className="headInfo">This Course Include:</p>
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
      </div>

      <div className="Bottom">
        <div className="Objectives">Objectives</div>
        <div className="Instructions">Instructions</div>
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
