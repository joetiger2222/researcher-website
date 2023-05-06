import React, { useEffect, useState } from "react";
import { AiOutlineHourglass } from "react-icons/ai";
import { FaRegNewspaper, FaPlusCircle, FaTrash, FaRegEdit } from "react-icons/fa";
import { HiAcademicCap } from "react-icons/hi";
import "../css/CourseDetails.css";
import Header from "./Header.js";
import { Link, useParams } from "react-router-dom";
import { FaArrowCircleDown, FaArrowCircleUp } from "react-icons/fa";
import Footer from "./Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ModalForQuiz from "./ModalForQuiz";
import SectionQuiz from "./SectionQuiz";


const CourseDetails = () => {
  const navigate=useNavigate();
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState(null);
  const [courseDetails, setCourseDetails] = useState(null);
  const [courseSections, setCourseSections] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  const [showAddSection, setShowAddSection] = useState(false);
  const [sectionId,setSectionId]=useState(null);
  const [showUploadVideo,setShowUploadVideo]=useState(false);
  const [showDeleteCourseModal,setShowDeleteCourseModal]=useState(false)
  

  let { id } = useParams();


  function getCourseDetatils() {
    fetch(`https://localhost:7187/api/Courses/${id}`)
      .then((res) => res.json())
      .then((data) => setCourseDetails(data));
  }

  function getCourseSections() {
    fetch(`https://localhost:7187/api/Courses/SectionsToCourse?courseId=${id}`)
      .then((res) => res.json())
      .then((data) => setCourseSections(data));
  }

  // console.log(courseDetails);
  useEffect(() => {
    getCourseDetatils();
    getCourseSections();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const SectionCard = ({ section }) => {
    const [activeSection, setAtiveSection] = useState(false);
    const [videosIds, setVideosIds] = useState(null);
    const [sectionQuiz, setSectionQuiz] = useState(null);

    function getVideosIds() {
      fetch(`https://localhost:7187/api/Courses/Sections/Videos/${section.id}`)
        .then((res) => res.json())
        .then((data) => setVideosIds(data));
    }


    function getSectionQuiz() {
      fetch(`https://localhost:7187/api/Quizes/SectionQuiz/${section.id}`)
        .then((res) => res.json())
        .then((data) => setSectionQuiz(data));
    }
    


    useEffect(() => {
      getVideosIds();
      getSectionQuiz()
    }, []);
    console.log(sectionQuiz)
    
   
    const [video, setVideo] = useState(null);
    

    return (
      <div className="courseDetailsSectionsContainer">
      <div className="sectionHeader">
        <h3
         onClick={() => {
          setAtiveSection(!activeSection)
        }}>
          {section?.name}
          {
            <FaArrowCircleDown
           
              style={{
                transform: activeSection ? "rotate(180deg)" : "none",
                transition: " 0.2s ease-in-out",
              }}
            />
          }
        </h3>
    
        <div className="sectionIcons">
          <FaPlusCircle
            className="plusIcon"
            onClick={() => {
              setSectionId(section.id);
              setShowUploadVideo(true);
            }}
          />
          <FaRegEdit
            onClick={() => navigate(`/AddQuizToSection/${section.id}`)}
            className="plusIcon"
          />
         
        </div>
      </div>
    
      <div
        className="courseDetailsSectionVideos"
        style={{ display: activeSection ? "flex" : "none" }}
      >
        {videosIds?.map((video) => (
          <span
            // onClick={() => {
            //   setVideoId(video.id);
            //   setShowVideo(true);
            // }}
            onClick={()=>navigate(`/CourseForStudent/${section.id}/${video.id}`)}
            className="LinkVideoSection"
          >
            <span>{video?.title}</span>
          </span>
        ))}
        {/* <Link
          onClick={() => setShowQuiz(true)}
          className="LinkVideoSection"
        >
          {section.name} Quiz
        </Link> */}
        {sectionQuiz&&<span className="QuizTitle" onClick={()=>navigate(`/SectionQuiz/${section.id}`)}>{section.name} Quiz</span>}
       
      </div>
    </div>

    );
  };
  
  const UploadVideoCard = (props) => {
    const [video, setVideo] = useState(null);
    const [videoTitle, setVideoTitle] = useState("");
    

    const handleVideoUpload = (event) => {
      const file = event.target.files[0];
      setVideo(file);
    };

    const handleVideoSubmit = (event) => {
      event.preventDefault();
      const titleInput = document.getElementById("title");
    const titleValue = titleInput.value;
      const formData = new FormData();
      formData.append("file", video);
      formData.append("Title", titleValue);

      fetch(`https://localhost:7187/api/Courses/Videos/${sectionId}`, {
        method: "POST",
        body: formData,
      }).then(res=>{
        if(res.ok){
          props.onClose();
          getCourseSections();
        }else alert('failed to add video please try again later')
      })
    };

    // function getVideoTitle(e) {
    //   setVideoTitle(e.target.value);
    // }
    // console.log(videoTitle)

    if(!props.show)return null;
    return (
      <div
      style={{
        position: "fixed",
        left: "0",
        top: "0",
        right: "0",
        bottom: "0",
        backgroundColor: "rgba(0, 0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: "100",
      }}
      >
        <div className="uploadVideoContainer">
          <h2 style={{color:"black"}}>Upload Video</h2>

        {video && (
          <div className="contVideoInfo">
            <video
              className="videoW"
              src={URL.createObjectURL(video)}
              controls
            />
            <input
            id='title'
            className="InputUpload"
              type="text"
              placeholder="Video's Title"
              required
              name="Title"
              
            ></input>
            <button className="btnUpload" onClick={handleVideoSubmit}>Upload Video</button>
            
          </div>
        )}

<div className="ChooseAndCancel">
<input
            type="file"
            id="video-upload"
            onChange={handleVideoUpload}
           
          />

        <button className="cancelbtn" onClick={props.onClose}>Cancel</button>
</div>
         
        
        </div>


      </div>
    );
  };

  // console.log(video)

  const VideoCard = ({ videoId, show, onClose }) => {
    const [video, setVideo] = useState(null);

    useEffect(() => {
      fetch(`https://localhost:7187/api/courses/Videos/${videoId}`)
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
    }, []);

    if (!show) return null;
    return (
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          left: "0",
          top: "0",
          right: "0",
          bottom: "0",
          backgroundColor: "rgba(0, 0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: "100",
        }}
      >
        <div className="courseDetailesVideoDiv">
          <video className="Video" controls src={video} type="video/mp4" />
        </div>
      </div>
    );
  };

  


  const AddSectionCard = ({ show, onClose }) => {
    const [sectionData, setSectionData] = useState({ courseId: id, name: "" });

    function getSectionName(e) {
      setSectionData((prevFormData) => {
        return {
          ...prevFormData,
          [e.target.name]: e.target.value,
        };
      });
    }

    function addSection() {
      let data = [];
      data.push(sectionData);
      fetch(`https://localhost:7187/api/Courses/Sections?courseId=${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (response.ok) {
            getCourseSections();
            onClose();
          } else alert("Failed To Add new Section Please Try Again Later");
        })
        .then((data) => {});
    }

    if (!show) return null;
    return (
      <div
        style={{
          position: "fixed",
          left: "0",
          top: "0",
          right: "0",
          bottom: "0",
          backgroundColor: "rgba(0, 0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: "100",
        }}
      >
        <div className="addSectionDiv">
          <span>Enter Section Name: </span>
          <input
            onChange={getSectionName}
            name="name"
            placeholder="Enter Section Name"
          ></input>
          <div className="addSectionBtnsDiv">
            <button onClick={onClose} style={{ backgroundColor: "#ce0808" }}>
              Cancel
            </button>
            {sectionData.name !== "" && (
              <button style={{ backgroundColor: "green" }} onClick={addSection}>
                Finish
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };



  const DeleteCourseCard = ({ show, onClose }) => {

    function deleteCourse(){
      fetch(`https://localhost:7187/api/Courses/${id}`,{
        method:"DELETE",
      }).then(res=>{
        if(res.ok){
          navigate('/AdminPanel')
        }else alert('Error Happened Please Try Again Later')
      })
    }


    if (!show) return null;
    return (
      <div
        style={{
          position: "fixed",
          left: "0",
          top: "0",
          right: "0",
          bottom: "0",
          backgroundColor: "rgba(0, 0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: "100",
        }}
      >
        <div className="deleteCourseDiv">
          <h1>You Are About To Delete This Course</h1>
          <h3>Press Confirm To Delete</h3>
          <div>
            <button onClick={onClose} style={{ backgroundColor: "#ce0808" }}>Cancel</button>
            <button onClick={deleteCourse} style={{ backgroundColor: "green" }}>Confirm</button>
          </div>
        </div>
        
      </div>
    );
  };

 

  return (
    <div className="courseParent">
      <Header />

      <div className="LeftRight">
        <div className="LeftInfo">
          <h1 className="NameCourse">{courseDetails?.name}</h1>
          <p className="briefCourse">{courseDetails?.brief}</p>
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
              {courseDetails?.hours}
            </p>
            <p>
              <HiAcademicCap />
              Certificate Of Compiletion
            </p>
          </div>
        </div>

        <div className="courseDetailsCourseContentDiv">
          <div className="courseContentAndPlusButton">
            <h1 style={{marginRight:'auto'}}>Course Content</h1>
            <div style={{display:'flex',columnGap:'20px'}}>
            <FaPlusCircle
              onClick={() => setShowAddSection(true)}
              className="addBtn"
            />
            <FaTrash onClick={()=>setShowDeleteCourseModal(true)} className="delBtn"/>
            </div>
          </div>
          <div className="ContSections">
            {courseSections?.length === 0 && (
              <h3 style={{ textAlign: "center" }}>
                Click the plus button to start adding sections
              </h3>
            )}
            {courseSections?.map((section) => {
              return <SectionCard section={section} />;
            })}
          </div>
        </div>
        <div className="ContObjecInst">
          <div className="Objectives">
          <h5>Objectives :</h5>
            <h3>{courseDetails?.objectives}</h3>
          </div>
          <div className="Instructions">
            <h5>Instructions :</h5>
            <h3>{courseDetails?.instructions}</h3>
          </div>
        </div>
      </div>
      {videoId && (
        <VideoCard
          show={showVideo}
          onClose={() => setShowVideo(false)}
          videoId={videoId}
        />
      )}

      <AddSectionCard
        show={showAddSection}
        onClose={() => setShowAddSection(false)}
      />

    <UploadVideoCard
        show={showUploadVideo}
        onClose={() => setShowUploadVideo(false)}
      />
      <DeleteCourseCard
        show={showDeleteCourseModal}
        onClose={() => setShowDeleteCourseModal(false)}
      />
       <ModalForQuiz onClose={() => setShowQuiz(false)} show={showQuiz} />

      <Footer />
    </div>
  );
};
// #262626
// #484848
export default CourseDetails;
