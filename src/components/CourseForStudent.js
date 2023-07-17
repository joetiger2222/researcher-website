import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Header from "./Header";
import "../css/CourseForStudent.css";
import { useContext } from "react";
import { MyContext } from '../Users/Redux';
import SideBar from "./SideBar";
export default function CourseForStudent() {
  const [sideBarVisible, setSideBarVisible] = useState(false);
  const { videoId } = useParams();
  const { sectionId } = useParams();
  const [video, setVideo] = useState(null);
  const [videosIds, setVideosIds] = useState(null);
  const [sectionVideo, setSectionVideo] = useState(videoId);
  // const userData=useLocation().state?.data;
  const userData = useContext(MyContext);
  const navigate=useNavigate();






  function renderSideBar() {
    if (sideBarVisible) {
      return <SideBar />;
    }
  }

  function renderSideBarIcon() {
    if (sideBarVisible) {
      return (
        <svg
          className="closeSvg"
          stroke="currentColor"
          fill="white"
          stroke-width="0"
          viewBox="0 0 24 24"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g>
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"></path>
          </g>
        </svg>
      );
    } else {
      return (
        <svg
        style={{zIndex:'300'}}
          className="closeSvg"
          stroke="currentColor"
          fill="white"
          stroke-width="0"
          viewBox="0 0 24 24"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      );
    }
  }










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
