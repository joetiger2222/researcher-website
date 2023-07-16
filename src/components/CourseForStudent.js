import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Header from "./Header";
import "../css/CourseForStudent.css";
import { useContext } from "react";
import { MyContext } from '../Users/Redux';
export default function CourseForStudent() {
  const { videoId } = useParams();
  const { sectionId } = useParams();
  const [video, setVideo] = useState(null);
  const [videosIds, setVideosIds] = useState(null);
  const [sectionVideo, setSectionVideo] = useState(videoId);
  // const userData=useLocation().state?.data;
  const userData = useContext(MyContext);
  const navigate=useNavigate();

  function getVideo() {
    fetch(`https://localhost:7187/api/courses/Videos/${sectionVideo}`,{
      method:"GET",
      headers:{
        "authorization":`Bearer ${userData.token}`
      }
    })
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
    fetch(`https://localhost:7187/api/Courses/Sections/Videos/${sectionId}`,{
      method:"GET",
      headers:{
        "authorization":`Bearer ${userData.token}`
      }
    })
      .then((res) => res.json())
      .then((data) => setVideosIds(data));
  }

  useEffect(() => {
    getVideo();
    getVideosIds();
  }, [userData]);

  useEffect(() => {
    getVideo();
  }, [sectionVideo]);



  if(userData.userId===''){
    return (
      <div style={{display:'flex',width:'100%',minHeight:'100vh',justifyContent:'center',alignItems:'center',flexDirection:'column',rowGap:'20px'}}>
        <h1>Please Login First</h1>
        <button style={{width:'120px',height:'50px',borderRadius:'10px',backgroundColor:'rgb(21, 46, 125)',color:'white',fontSize:'20px',fontWeight:'bold'}} onClick={()=>navigate('/')}>Login</button>
      </div>
    )
  }






  return (
    <div className="courseForStudentContainer">
      <Header userData={userData} />

      <div className="courseForStudentContent">
        <div className="courseForStudentVideoDiv">
          <video className="Video" controls src={video} type="video/mp4" controlsList="nodownload"/>
        </div>

        <div
        className="videosFixed"
          style={{
            position: "fixed",
            top: "90px",
            right: "0",
            minHeight: "100%",
            backgroundColor: "white",
            width: "30%",
          }}
        >
          <h2 style={{padding:"20px"}}>Section Content</h2>
            <div className="videosNames">
            {videosIds?.map((video,index) => (
          <span
                style={{backgroundColor:video.id===sectionVideo*1?'gray':'transparent',borderBottom:"1px solid black",}}
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
