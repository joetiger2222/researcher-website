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
  const userData=useLocation().state?.data;
  console.log(userData)

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
        console.log(videoItself)
        setVideo(videoItself);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // function getVideo(){
  //   fetch(`https://localhost:7187/api/courses/Videos/${sectionVideo}`)
  //   .then(res=>res)
  //   .then(data=>setVideo(data))
  // }
  // console.log(video)





//   function getVideo(){
//     fetch(`https://localhost:7187/api/courses/Videos/${sectionVideo}`)
//     .then((response) => {
//       const reader = response.body.getReader();
//       let chunks = [];

//       function readStream() {
//         return reader.read().then(({ done, value }) => {
//           if (done) {
//             return chunks;
//           }
//           chunks.push(value);
//           return readStream();
//         });
//       }

//       return readStream();
//     })
//     .then((chunks) => {
//       const body = new TextDecoder().decode(
//         new Uint8Array(chunks.flatMap((chunk) => Array.from(chunk)))
//       );
//       console.log(body);
      
//     })
//     .catch((error) => console.error(error));
// }
  

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


  // console.log(videosIds);

  return (
    <div className="courseForStudentContainer">
      <Header userData={userData} />

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
            backgroundColor: "white",
            width: "30%",
          }}
        >
          <h2 style={{padding:"20px"}}>Section Content</h2>
            <div className="videosNames">
            {videosIds?.map((video,index) => (
          <span
                style={{backgroundColor:video.id===sectionVideo?'gray':'transparent',borderBottom:"1px solid black",}}
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
