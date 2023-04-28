import React, { useEffect, useState } from "react";
import { AiOutlineHourglass } from "react-icons/ai";
import { FaRegNewspaper, FaPlusCircle } from "react-icons/fa";
import { HiAcademicCap } from "react-icons/hi";
import "../css/CourseDetails.css";
import Header from "./Header.js";
import { Link, useParams } from "react-router-dom";
import { FaArrowCircleDown, FaArrowCircleUp } from "react-icons/fa";
const CourseDetails = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState(null);
  const [courseDetails, setCourseDetails] = useState(null);
  const [courseSections, setCourseSections] = useState(null);
  const [showVideo, setShowVideo] = useState(false);

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

    return (
      <div className="courseDetailsSectionsContainer">
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
            <FaPlusCircle className="addBtn" />
          </div>
          <div className="ContSections">
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
    </div>
  );
};
// #262626
// #484848
export default CourseDetails;
