import React, { useEffect, useState } from "react";
import { AiOutlineHourglass } from "react-icons/ai";
import { FaRegNewspaper, FaPlusCircle } from "react-icons/fa";
import { HiAcademicCap } from "react-icons/hi";
import "../css/CourseDetails.css";
import Header from "./Header.js";
import { Link, useParams } from "react-router-dom";
import { FaArrowCircleDown, FaArrowCircleUp } from "react-icons/fa";
import Footer from "./Footer";
import axios from "axios";
const CourseDetails = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState(null);
  const [courseDetails, setCourseDetails] = useState(null);
  const [courseSections, setCourseSections] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [showAddSection, setShowAddSection] = useState(false);
  const [sectionId,setSectionId]=useState(null);
  const [showUploadVideo,setShowUploadVideo]=useState(false);
  
  // useEffect(() => {
  //   fetch(`https://localhost:7187/api/courses/Videos/1`)
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch video.");
  //       }

  //       return response.blob();
  //     })
  //     .then((blob) => {
  //       const videoUrl = URL.createObjectURL(blob);
  //       setVideoUrl(videoUrl);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }, []);

  // console.log(videoUrl);

  let { id } = useParams();
  // console.log(id)

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
  }, []);

  const SectionCard = ({ section }) => {
    const [activeSection, setAtiveSection] = useState(false);
    const [videosIds, setVideosIds] = useState(null);

    function getVideosIds() {
      fetch(`https://localhost:7187/api/Courses/Sections/Videos/${section.id}`)
        .then((res) => res.json())
        .then((data) => setVideosIds(data));
    }

    useEffect(() => {
      getVideosIds();
    }, []);

    const [video, setVideo] = useState(null);
    //   const [videoTitle, setVideoTitle] = useState("");

    //   const handleVideoUpload = (event) => {
    //     const file = event.target.files[0];
    //     setVideo(file);
    //   };

    //   const handleVideoSubmit = (event) => {
    //     event.preventDefault();
    //     const formData = new FormData();
    //     formData.append("file", video);
    //     formData.append('Title', videoTitle);

    //     fetch(`https://localhost:7187/api/Courses/Videos/${section.id}`, {
    //       method: "POST",
    //       body: formData,
    //     }).then((response) => {
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

    //       return readStream().then((chunks) => {
    //         const body = new TextDecoder().decode(
    //           new Uint8Array(chunks.flatMap((chunk) => Array.from(chunk)))
    //         );
    //         console.log(body);

    //       });
    //     });
    // }

    //   function getVideoTitle(e) {
    //     setVideoTitle(e.target.value);
    //   }

    return (
      <div className="courseDetailsSectionsContainer">
        <div className="sectionHeader">
          <h3 onClick={(e) => setAtiveSection(!activeSection)}>
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
          {/* For Uploading Video */}

          {/* <h4>
            <input
              type="file"
              id="video-upload"
              onChange={handleVideoUpload}
              style={{ display: "none" }}
            />*/}

            <FaPlusCircle
              onClick={() => {setSectionId(section.id);setShowUploadVideo(true)}}
            />
          {/* </h4>  */}
          {/* {video && (
            <div>
              <video
                className="videoW"
                src={URL.createObjectURL(video)}
                controls
              />
              <input
                type="text"
                placeholder="Video's Title"
                required
                name="Title"
                onChange={getVideoTitle}
              ></input>
              <button onClick={handleVideoSubmit}>Upload Video</button>
            </div>
          )} */}
        </div>

        <div
          className="courseDetailsSectionVideos"
          style={{ display: activeSection ? "flex" : "none" }}
        >
          {videosIds?.map((video) => (
            <Link
              onClick={() => {
                setVideoId(video.id);
                setShowVideo(true);
              }}
              className="LinkVideoSection"
            >
              {video?.title}
            </Link>
          ))}
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
      const formData = new FormData();
      formData.append("file", video);
      formData.append("Title", videoTitle);

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

        {video && (
          <div>
            <video
              className="videoW"
              src={URL.createObjectURL(video)}
              controls
            />
            <input
              type="text"
              placeholder="Video's Title"
              required
              name="Title"
              onChange={(e)=>setVideoTitle(e.target.value)}
            ></input>
            <button onClick={handleVideoSubmit}>Upload Video</button>
          </div>
        )}


        <h4>
          <input
            type="file"
            id="video-upload"
            onChange={handleVideoUpload}
           
          />

        </h4>
        <button onClick={props.onClose}>Cancel</button>
        
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
            <h1>Course Content</h1>
            <FaPlusCircle
              onClick={() => setShowAddSection(true)}
              className="addBtn"
            />
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
          <div className="Objectives">Objectives</div>
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

      <Footer />
    </div>
  );
};
// #262626
// #484848
export default CourseDetails;
