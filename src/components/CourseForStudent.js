import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Header from "./Header";
import "../css/CourseForStudent.css";
export default function CourseForStudent() {
  const { videoId } = useParams();
  const { sectionId } = useParams();
  const [video, setVideo] = useState(null);
  const [videosIds, setVideosIds] = useState(null);
  const [sectionVideo, setSectionVideo] = useState(videoId);

  function getVideo() {
    fetch(`https://localhost:7187/api/courses/Videos/${sectionVideo}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch video.");
        }

        return response.blob();
      })
      .then((blob) => {
        const videoItself = URL.createObjectURL(blob);
        setVideo(videoItself);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function getVideosIds() {
    fetch(`https://localhost:7187/api/Courses/Sections/Videos/${sectionId}`)
      .then((res) => res.json())
      .then((data) => setVideosIds(data));
  }

  useEffect(() => {
    getVideo();
    getVideosIds();
  }, []);

  useEffect(() => {
    getVideo();
    
  }, [sectionVideo]);


  // console.log(videosIds);

  return (
    <div className="courseForStudentContainer">
      <Header />

      <div className="courseForStudentContent">
        <div className="courseForStudentVideoDiv">
          <video className="Video" controls src={video} type="video/mp4" />
        </div>

        <div
          style={{
            position: "fixed",
            top: "90px",
            right: "0",
            minHeight: "100%",
            backgroundColor: "#1f1f1f",
            width: "30%",
          }}
        >
            <div className="videosNames">
            {videosIds?.map((video,index) => (
          <span
                style={{backgroundColor:video.id===sectionVideo?'gray':'transparent'}}
            onClick={() => {
              setSectionVideo(video.id);
             
            }}
            
            className="LinkVideoSection"
          >
            <span style={{cursor:'pointer'}}>{index+1+". "+video?.title}</span>
          </span>
        ))}
            </div>
        </div>
      </div>
    </div>
  );
}
