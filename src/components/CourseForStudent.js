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
  // useEffect(() => {
  //   // Replace with the actual URL of your .NET Web API endpoint
  //   const apiUrl = 'https://your-api-url.com/api/getvideo';

  //   let sourceBuffer = null;

  //   // Create a media source object and set up event listeners
  //   const mediaSource = new MediaSource();
  //   mediaSource.addEventListener('sourceopen', () => {
  //     sourceBuffer = mediaSource.addSourceBuffer('video/mp4');
  //   });

  //   mediaSource.addEventListener('sourceended', () => {
  //     console.log('Media source ended');
  //   });

  //   // Set the media source as the video element's source
  //   videoRef.current.src = URL.createObjectURL(mediaSource);

  //   // Fetch video data from the API and append it to the source buffer
  //   fetch(apiUrl)
  //     .then((response) => {
  //       const reader = response.body.getReader();

  //       function readChunk() {
  //         reader.read().then(({ done, value }) => {
  //           if (done) {
  //             // All video chunks have been loaded
  //             mediaSource.endOfStream();
  //           } else {
  //             // Append the video chunk to the source buffer
  //             sourceBuffer.appendBuffer(value);
  //             readChunk();
  //           }
  //         });
  //       }

  //       readChunk();
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching video:', error);
  //     });

  //   // Clean up the media source when the component unmounts
  //   return () => {
  //     if (mediaSource.readyState === 'open') {
  //       mediaSource.endOfStream();
  //     }
  //   };
  // }, []);


  const videoRef = useRef(null);

async function getVideo() {
  const apiUrl = 'http://resweb2.somee.com/api/Courses/GetVideoBuffering/1';

  try {
    const response = await fetch(apiUrl);
    const reader = response.body.getReader();

    // Create an array to store blob chunks
    const chunks = [];

    // Read and process video chunks
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        // All video chunks have been loaded
        break;
      }

      // Store the video chunk as a blob in the array
      chunks.push(value);
    }

    // Concatenate the chunks into a single blob
    const blob = new Blob(chunks, { type: 'video/mp4' });

    // Create an object URL for the blob
    const objectUrl = URL.createObjectURL(blob);

    // Set the object URL as the video element's source
    videoRef.current.src = objectUrl;
  } catch (error) {
    console.error('Error fetching video:', error);
  }
}

// Call the function to start fetching and buffering the video


  
  // Call the function to start fetching and buffering the video
 
  
  

  

  


  // const [videoUrl, setVideoUrl] = useState('');

  // useEffect(() => {
  //   const fetchVideoUrl = async () => {
  //     try {
  //       // Fetch the video URL from your backend API
  //       const response = await fetch(`https://localhost:7187/api/Courses/GetVideoBuffering/1`);
        
  //       if (response.ok) {
  //         // Assuming your backend returns the video URL as a string
  //         const videoUrl = await response.text();
  //         setVideoUrl(videoUrl);
  //       } else {
  //         console.error('Failed to fetch video');
  //       }
  //     } catch (error) {
  //       console.error('Error fetching video:', error);
  //     }
  //   };

  //   fetchVideoUrl();
  // }, [videoId]);
  


  // function getVideo(videoId,index) {
  //   const filterVideo=otherVideos.filter(video=>video.index===index);
  //   if(filterVideo.length>0){
  //     setVideo(filterVideo[0].url);
  //     getNextVideo(index+1);
  //     return ;
  //   }
    
  //   setVideoLoading(true)
  //   fetch(`https://resweb-001-site1.htempurl.com/api/courses/Videos/${videoId}`, {
  //     method: "GET",
  //     headers: {
  //       "authorization": `Bearer ${userData.token}`
  //     },
  //     signal: abortController.signal
  //   })
  //   .then((response) => {
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch video.");
  //     }
  //     return response.blob();
  //   })
  //   .then((blob) => {
  //     const videoItself = URL.createObjectURL(blob);
  //     setVideo(videoItself);
  //     setOtherVideos(prev=>[...prev,{index:index,url:videoItself,id:videoId}])
  //     if(videosIds.length-1>index){
  //       getNextVideo(index+1);
  //     }
  //     const videoElement = document.querySelector(".Video");
  //     if (videoElement) {
  //       setVideoLoading(false)
  //     }
  //   })
  //   .catch((error) => {
  //     setVideoLoading(false)
  //     const filterVideo=otherVideos.filter(video=>video.index===index);
  //   if(filterVideo.length>0){
  //     setVideo(filterVideo[0].url);
  //     getNextVideo(index+1);
  //     return ;
  //   }
  //     if(userData.userId!==''){
  //       getVideo(videoId,index*1);
  //     }
  //     console.error("Error fetching video:", error);
  //   });
  // }

  


  // function getNextVideo(index){
  //   const videoId=videosIds[index]?.id;
  //   const filterVideo=otherVideos.filter(video=>video.index===index);
  //   if(filterVideo.length>0){
  //     return ;
  //   }else{
  //     fetch(`https://resweb-001-site1.htempurl.com/api/courses/Videos/${videoId}`, {
  //     method: "GET",
  //     headers: {
  //       "authorization": `Bearer ${userData.token}`
  //     },
  //     signal: abortController.signal
  //   })
  //   .then((response) => {
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch video.");
  //     }
  //     return response.blob();
  //   })
  //   .then((blob) => {
  //     const videoItself = URL.createObjectURL(blob);
  //     setOtherVideos(prev=>[...prev,{index:index,url:videoItself,id:videoId}])
     
  //   })
  //   .catch((error) => {
  //     console.error("Error fetching video: from next video", error);
  //   });
  //   }
  // }

  useEffect(() => {
    return () => {
      console.log('abort invoked')
      abortController.abort();
    };
  }, []);
  

  useEffect(() => {
    if(userData.userId!==''){
    // getVideo(videoId,index*1);
    getVideo()
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
     {/* <video className="Video" controls src={video} type="video/mp4" preload="auto" controlsList="nodownload" autoPlay /> */}
     <video className="Video" controls type="video/mp4" preload="auto" controlsList="nodownload" autoPlay ref={videoRef} />
     {/* {videoUrl && (
        // <video className="Video" controls width="640" height="360">
        //   <source src={videoUrl} type="video/mp4" />
        //   Your browser does not support the video tag.
        // </video>
      )} */}

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
