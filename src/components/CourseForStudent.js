import React, { useState, useEffect,useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import "../css/CourseForStudent.css";
import { useContext } from "react";
import { MyContext } from '../Users/Redux';
import SideBar from "./SideBar";
import { FiMenu } from 'react-icons/fi';
import { FaTimes } from 'react-icons/fa';
import loaderPng from '../loaderpng.gif'
import toastr from "toastr";
export default function CourseForStudent() {
  const [sideBarVisible, setSideBarVisible] = useState(false);
  const { videoId } = useParams();
  const {index}=useParams();
  const [video, setVideo] = useState(null);
  const [videoLoading,setVideoLoading]=useState(false);
  const [otherVideos,setOtherVideos]=useState([]);
  const [choosenVideo,setChoosenVideo]=useState(videoId*1);
  const userData = useContext(MyContext);
  const navigate=useNavigate();
  const videosIds=useLocation().state?.data;
  const abortController = new AbortController();


  function renderSideBar() {
    if (sideBarVisible) {
      return <SideBar />;
    }
  }

  function renderSideBarIcon() {
    if (sideBarVisible) {
      return (
        <FaTimes style={{color:'#3e8dff',width:'40px',height:'40px'}}/>
      );
    } else {
      return (
        <FiMenu style={{color:'#3e8dff',width:'40px',height:'40px'}} />
      );
    }
  }



  function getVideo(videoId,index) {
    const filterVideo=otherVideos.filter(video=>video.index===index);
    if(filterVideo.length>0){
      setVideo(filterVideo[0].url);
      getNextVideo(index+1);
      return ;
    }
    
    setVideoLoading(true)
    fetch(`https://resweb-001-site1.htempurl.com/api/courses/Videos/${videoId}`, {
      method: "GET",
      headers: {
        "authorization": `Bearer ${userData.token}`
      },
      signal: abortController.signal
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
      setOtherVideos(prev=>[...prev,{index:index,url:videoItself,id:videoId}])
      if(videosIds.length-1>index){
        getNextVideo(index+1);
      }
      const videoElement = document.querySelector(".Video");
      if (videoElement) {
        setVideoLoading(false)
      }
    })
    .catch((error) => {
      setVideoLoading(false)
      const filterVideo=otherVideos.filter(video=>video.index===index);
    if(filterVideo.length>0){
      setVideo(filterVideo[0].url);
      getNextVideo(index+1);
      return ;
    }
      if(userData.userId!==''){
        getVideo(videoId,index*1);
      }
      console.error("Error fetching video:", error);
    });
  }

  


  function getNextVideo(index){
    const videoId=videosIds[index]?.id;
    const filterVideo=otherVideos.filter(video=>video.index===index);
    if(filterVideo.length>0){
      return ;
    }else{
      fetch(`https://resweb-001-site1.htempurl.com/api/courses/Videos/${videoId}`, {
      method: "GET",
      headers: {
        "authorization": `Bearer ${userData.token}`
      },
      signal: abortController.signal
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch video.");
      }
      return response.blob();
    })
    .then((blob) => {
      const videoItself = URL.createObjectURL(blob);
      setOtherVideos(prev=>[...prev,{index:index,url:videoItself,id:videoId}])
     
    })
    .catch((error) => {
      console.error("Error fetching video: from next video", error);
    });
    }
  }

  useEffect(() => {
    return () => {
      console.log('abort invoked')
      abortController.abort();
    };
  }, []);
  

  useEffect(() => {
    if(userData.userId!==''){
    getVideo(videoId,index*1);
  
    }
  }, [userData]);

  useEffect(()=>{
    window.scrollTo(0, 0);
  },[])






  if(userData.userId===''){
    return (
      <div style={{display:'flex',width:'100%',minHeight:'100vh',justifyContent:'center',alignItems:'center',flexDirection:'column',rowGap:'20px'}}>
        <h1>Please Login First</h1>
        <button style={{width:'120px',height:'50px',borderRadius:'10px',backgroundColor:'rgb(21, 46, 125)',color:'white',fontSize:'20px',fontWeight:'bold'}} onClick={()=>navigate('/Login')}>Login</button>
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
     
     {videoLoading&&<div className="modal-overlay2" style={{width:'70%'}}>
            <img src={loaderPng} />
     </div>}
     <video className="Video" controls src={video} type="video/mp4" preload="auto" controlsList="nodownload" autoPlay />
     

        </div>
        
        <div
        className="videosFixed"
          style={{
            
            minHeight: "100vh",
            backgroundColor: "white",
            width: "30%",
          }}
        >
          <h2 style={{padding:"20px"}}>Section Content</h2>
            <div className="videosNames">
              {/* {<img src={loader} style={{maxWidth:'200px',width:'70%'}} className="loadVideo" />} */}
            {videosIds?.map((video,index) => (
          <span
                style={{backgroundColor:video.id===choosenVideo*1?'gray':'transparent',borderBottom:"1px solid black",}}
            onClick={() => {
              // setChoosenVideo(video.id)
              if(!videoLoading){
              getVideo(video.id*1,index);
              setChoosenVideo(video.id*1);
              }else {
                toastr.info('Please wait, the video is loading!')
              }       
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
