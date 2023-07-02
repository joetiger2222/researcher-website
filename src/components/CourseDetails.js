import React, { useEffect, useState } from "react";
import { AiOutlineHourglass } from "react-icons/ai";
import { FaPlusCircle, FaTrash, FaRegEdit } from "react-icons/fa";
import { HiAcademicCap } from "react-icons/hi";
import "../css/CourseDetails.css";
import Header from "./Header.js";
import { useLocation, useParams } from "react-router-dom";
import { FaArrowCircleDown } from "react-icons/fa";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import ModalForQuiz from "./ModalForQuiz";
import video from "../1.mp4";
import Swal from "sweetalert2";

const CourseDetails = () => {
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState(null);
  const [courseDetails, setCourseDetails] = useState(null);
  const [courseSections, setCourseSections] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  const [isQuizes, setIsQuizes] = useState(false);
  const [showAddSection, setShowAddSection] = useState(false);
  const [sectionId, setSectionId] = useState(null);
  const [showUploadVideo, setShowUploadVideo] = useState(false);
  const [showDeleteCourseModal, setShowDeleteCourseModal] = useState(false);
  const [showEditCourseDataModal, setShowEditCourseDataModal] = useState(false);
  const [isStudentEnrolled,setIsStudentEnrolled]=useState(false);
  const userData = useLocation()?.state?.data;

  let { id } = useParams();

  function getCourseDetatils() {
    fetch(`https://localhost:7187/api/Courses/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setCourseDetails(data));
  }

  function getCourseSections() {
    fetch(
      `https://localhost:7187/api/Courses/SectionsToCourse?courseId=${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => setCourseSections(data));
  }



  function checkStudentEnrollment(){
    fetch(`https://localhost:7187/api/Courses/CheckEnrollment?courseId=${id}&studentId=${userData.userId}`,{
      method:"GET",
      headers:{
        "Authorization":`Bearer ${userData.token}`
      }
    })
    .then(res=>res.ok?res.json():alert('failed to check enrollment'))
    .then(data=>data?setIsStudentEnrolled(data.isEnrolled):null)
  }


  useEffect(() => {
    getCourseDetatils();
    getCourseSections();
    if(userData.roles!=='Admin')
    checkStudentEnrollment();
    if(userData.roles==='Admin')setIsStudentEnrolled(true)
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const SectionCard = ({ section }) => {
    const [activeSection, setAtiveSection] = useState(false);
    const [videosIds, setVideosIds] = useState(null);
    const [sectionQuiz, setSectionQuiz] = useState(null);

    function getVideosIds() {
      fetch(
        `https://localhost:7187/api/Courses/Sections/Videos/${section.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => setVideosIds(data));
    }

    function getSectionQuiz() {
      fetch(`https://localhost:7187/api/Quizes/SectionQuiz/${section.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => setSectionQuiz(data));
    }

    useEffect(() => {
      getVideosIds();
      getSectionQuiz();
    }, []);

    
console.log('enrollment',isStudentEnrolled)


    return (
      <div className="courseDetailsSectionsContainerNew">
        <div className="sectionHeader">
          <h3
            onClick={() => {
              setAtiveSection(!activeSection);
            }}
          >
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

          {userData.roles === "Admin" && (
            <div className="sectionIcons">
              <FaPlusCircle
                className="plusIcon"
                onClick={() => {
                  setSectionId(section.id);
                  setShowUploadVideo(true);
                }}
              />
              <FaRegEdit
                onClick={() =>isStudentEnrolled?
                  navigate(`/AddQuizToSection/${section.id}`, {
                    state: { data: userData },
                  }):null
                }
                className="plusIcon"
              />
            </div>
          )}
        </div>

        <div
          className="courseDetailsSectionVideosNew"
          style={{ display: activeSection ? "flex" : "none" }}
        >
          {videosIds?.map((video,index) => (
            <span
              onClick={() =>isStudentEnrolled?
                navigate(`/CourseForStudent/${section.id}/${video.id}`, {
                  state: { data: userData },
                }):alert('Buy The Course First')
              }
              className="LinkVideoSection"
            >
              <span>{isStudentEnrolled?video?.title:`video ${index+1}`}</span>
            </span>
          ))}

          {sectionQuiz && (
            <span
              className="QuizTitle"
              onClick={() =>{
                if(isStudentEnrolled){
                navigate(`/SectionQuiz/${section.id}`, {
                  state: { data: userData },
                })
              }
              }
              }
            >
              {section.name} Quiz
            </span>
          )}
        </div>
      </div>
    );
  };

  const UploadVideoCard = (props) => {
    const [video, setVideo] = useState(null);
    

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
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
        body: formData,
      }).then((res) => {
        if (res.ok) {
          props.onClose();
          getCourseSections();
        } else alert("failed to add video please try again later");
      });
    };

    

    if (!props.show) return null;
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
          <h2 style={{ color: "black" }}>Upload Video</h2>

          {video && (
            <div className="contVideoInfo">
              <video
                className="videoW"
                src={URL.createObjectURL(video)}
                controls
              />
              <input
                id="title"
                className="InputUpload"
                type="text"
                placeholder="Video's Title"
                required
                name="Title"
              ></input>
              <button className="btnUpload" onClick={handleVideoSubmit}>
                Upload Video
              </button>
            </div>
          )}

          <div className="ChooseAndCancel">
            <input type="file" id="video-upload" onChange={handleVideoUpload} />

            <button className="cancelbtn" onClick={props.onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const VideoCard = ({ videoId, show, onClose }) => {
    const [video, setVideo] = useState(null);

    useEffect(() => {
      fetch(`https://localhost:7187/api/courses/Videos/${videoId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
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
          Authorization: `Bearer ${userData.token}`,
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
      <div className="modal-overlay2">
        <div className="modal2">
          <div className="ContExitbtn" onClick={onClose}>
            <div class="outer">
              <div class="inner">
                <label className="label2">Exit</label>
              </div>
            </div>
          </div>
          <h1 className="headContact2">Add Section</h1>

          <div className="FormModal2">
            <label className="AllLabeles">Enter Section Name: </label>
            <input
              className="InputModalHallDetails"
              onChange={getSectionName}
              name="name"
              placeholder="Enter Section Name"
            ></input>
            <div className="buttonsOnModal">
              {sectionData.name !== "" && (
                <button onClick={addSection}>Finish</button>
              )}
              <button onClick={onClose}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const DeleteCourseCard = ({ show, onClose }) => {
    function deleteCourse() {
      Swal.fire({
        title: `Are You Syre To Delete The Course`,
        showCancelButton: true,
      }).then((data) => {
        if (data.isConfirmed) {
          fetch(`https://localhost:7187/api/Courses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
      .then((res) => {
        if (res.ok) {
          navigate("/AdminPanel", { state: { data: userData } });
        } else alert("Error Happened Please Try Again Later");
      });
        }
      });
      
    }

    if (!show) return null;
    return (
      <div className="modal-overlay2">
        <div className="modal2">
          <div className="ContExitbtn" onClick={onClose}>
            <div class="outer">
              <div class="inner">
                <label className="label2">Exit</label>
              </div>
            </div>
          </div>
          <h1 className="headContact2"> You Are About To Delete This Course</h1>
          <h3 className="headContact2">Press Confirm To Delete</h3>

          <div className="buttonsOnModal">
            <button onClick={deleteCourse }>Delete</button>
            <button onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  const EditCourseDataCard = (props) => {
    const [editData, setEditData] = useState({
      name: courseDetails.name,
      instructions: courseDetails.instructions,
      objectives: courseDetails.objectives,
      price: courseDetails.price,
      hours: courseDetails.hours,
      brief: courseDetails.brief,
      skillId: courseDetails.skillObj.id,
    });
    console.log(editData);

    function editCourseData() {
      fetch(`https://localhost:7187/api/Courses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify(editData),
      }).then((res) => {
        if (res.ok) {
          alert("data updated successfuly");
          props.onClose();
          getCourseDetatils();
        } else alert("failed");
      });
    }

    function getEditData(e) {
      setEditData((prev) => {
        return {
          ...prev,
          [e.target.name]: e.target.value,
        };
      });
    }

    if (!props.show) return null;
    return (
      <div className="modal-overlay2">
        <div className="modal2">
          <div className="ContExitbtn" onClick={props.onClose}>
            <div class="outer">
              <div class="inner">
                <label className="label2">Exit</label>
              </div>
            </div>
          </div>
          <h1 className="headContact2">Edit Course Data</h1>
          <div
            className="custom-scrollbar"
            style={{ overflow: "auto", maxHeight: "420px" }}
          >
            <div className="FormModal2">
              <label className="AllLabeles">Name</label>
              <input
                className="InputModalHallDetails"
                placeholder={courseDetails.name}
                onChange={getEditData}
                name="name"
              ></input>
              <label className="AllLabeles">instructions</label>
              <input
                className="InputModalHallDetails"
                placeholder={courseDetails.instructions}
                onChange={getEditData}
                name="instructions"
              ></input>
              <label className="AllLabeles">objectives</label>
              <input
                className="InputModalHallDetails"
                placeholder={courseDetails.objectives}
                onChange={getEditData}
                name="objectives"
              ></input>
              <label className="AllLabeles">price</label>
              <input
                className="InputModalHallDetails"
                placeholder={courseDetails.price}
                onChange={(e) =>
                  setEditData((prev) => {
                    return { ...prev, [e.target.name]: e.target.value * 1 };
                  })
                }
                name="price"
                type="number"
              ></input>
              <label className="AllLabeles">hours</label>
              <input
                className="InputModalHallDetails"
                placeholder={courseDetails.hours}
                onChange={getEditData}
                name="hours"
                type="number"
              ></input>
              <label className="AllLabeles">brief</label>
              <input
                className="InputModalHallDetails"
                placeholder={courseDetails.brief}
                onChange={getEditData}
                name="brief"
              ></input>
              <div className="buttonsOnModal">
                <button onClick={editCourseData}>Edit</button>
                <button onClick={props.onClose}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="courseParent">
      <Header userData={userData} />

      <div className="AllContentContainer">
        <div className="LeftCourseData">
          <div className="LeftIntroData">
            <h1 className="NameCourse">{courseDetails?.name}</h1>
            <p className="briefCourseNew">{courseDetails?.brief}</p>
            <h2>Price: {courseDetails?.price} EGP</h2>
            {userData.roles !== "Admin" && (
              !isStudentEnrolled&&<button className="btnBUY">Buy Now</button>
            )}
          </div>
          <div className="ObjectivesNew">
            <h2>Objectives :</h2>
            <h3>{courseDetails?.objectives}</h3>
          </div>
          <div className="InstructionsNew">
            <h2>Instructions :</h2>
            <h3>{courseDetails?.instructions}</h3>
          </div>
        </div>

        <div className="CenterAndRighCourseData">
          <div className="CourseSectionsData">
            <div className="courseCOntAddDelSection">
              <h1>Course Content</h1>
              {userData.roles === "Admin" && (
                <div className="TrashPlus">
                  <FaPlusCircle
                    onClick={() => setShowAddSection(true)}
                    className="addBtn"
                  />
                  <FaRegEdit
                    onClick={() => setShowEditCourseDataModal(true)}
                    className="delBtn"
                  />
                  <FaTrash
                    onClick={() => setShowDeleteCourseModal(true)}
                    className="delBtn"
                  />
                </div>
              )}
              {showEditCourseDataModal && (
                <EditCourseDataCard
                  show={showEditCourseDataModal}
                  onClose={() => setShowEditCourseDataModal(false)}
                />
              )}
            </div>
            <div className="ContSectionsNew">
              {courseSections?.length === 0 &&
                (userData.roles === "Admin" ? (
                  <h3 style={{ textAlign: "center" }}>
                    Click the plus button to start adding sections
                  </h3>
                ) : (
                  <h3 style={{ textAlign: "center" }}>
                    This Course Has No Sections Yet !
                  </h3>
                ))}
              {courseSections?.map((section) => {
                return <SectionCard section={section} />;
              })}
            </div>
          </div>
          <div className="contVideoAndQuiz">
            <div className="RightVideoIntro">
              <div className="VideoDv">
                {/* {videoUrl ? (
                  <video
                    className="Video"
                    controls
                    src={videoUrl}
                    type="video/mp4"
                  />
                ) : (
                  <h1>Intro Video</h1>
                )} */}
                <video controls>
                  <source src={video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              <div className="BottomRightData">
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
            {/* <div>
              <h2 className="h2Quizes">Quizes</h2>
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
            </div> */}
          </div>
        </div>
      </div>

      {/* <div className="LeftRight">
        <div className="LeftInfo">
          <h1 className="NameCourse">{courseDetails?.name}</h1>
          <p className="briefCourse">{courseDetails?.brief}</p>
          <h2>Price: {courseDetails?.price} EGP</h2>
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
              {courseDetails?.hours} HRS
            </p>
            <p>
              <HiAcademicCap />
              Certificate Of Compiletion
            </p>
          </div>
        </div>

        <div className="courseDetailsSectionsContainer">
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
      </div> */}
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
