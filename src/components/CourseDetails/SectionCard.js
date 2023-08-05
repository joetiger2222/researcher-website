import { useState,useEffect } from "react";
import Swal from "sweetalert2";
import toastr from "toastr";
import { FaPlusCircle, FaTrash, FaRegEdit } from "react-icons/fa";
import { FaArrowCircleDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import loader from '../../loader.gif';
import { MdOutlineFileUpload } from "react-icons/md";
export default function SectionCard ({ section,userData,isStudentEnrolled,firstSectionId,getFirstVideo}) { 

    const [activeSection, setAtiveSection] = useState(false);
    const [videosIds, setVideosIds] = useState(null);
    const [sectionQuiz, setSectionQuiz] = useState(null);
    const [sectionLoading,setSectionLoading]=useState(true);
    const [showUploadVideo, setShowUploadVideo] = useState(false);
    const [showUpdateVideo, setShowUpdateVideo] = useState(false);
    const [videoToUpdate, setVideoToUpdate] = useState(null);
    
    const navigate=useNavigate();
   
    function getVideosIds() {
      
        setSectionLoading(true)
        
        fetch(
          `https://resweb-001-site1.htempurl.com/api/Courses/Sections/Videos/${section.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${userData.token}`,
            },
          }
        )
          .then(res=>{
            setSectionLoading(false)
            if(res.ok){
              return res.json();
            }
          })
          
          .then(data=>{
            
            if(data){
              setVideosIds(data);
              if(section.id===firstSectionId){
                getFirstVideo(data[0].id);
                
              }
            }
          })
          
      
      
    }

    function getSectionQuiz() {
      
      fetch(`https://resweb-001-site1.htempurl.com/api/Quizes/SectionQuiz/${section.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => setSectionQuiz(data));
    }

    function deleteSection() {
      Swal.fire({
        title: `Are You Sure You Want To Delete This Section ?`,
        showCancelButton: true,
      }).then((data) => {
        if (data.isConfirmed) {
          fetch(`https://resweb-001-site1.htempurl.com/api/Courses/Sections/${section.id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${userData.token}`,
            },
          }).then((res) => {
            if (res.ok) {
              toastr.success("Section Deleted Successfully,when you refresh the page it will not be here !");
            } else
              toastr.error("Failed To Delete Section Please Try Again Later");
          });
        }
      });
    }

    function deleteVideo(videoId) {
      Swal.fire({
        title: `Are You Sure You Want To Delete This Video ?`,
        showCancelButton: true,
      }).then((data) => {
        if (data.isConfirmed) {
          fetch(`https://resweb-001-site1.htempurl.com/api/Courses/Videos/${videoId}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${userData.token}`,
            },
          }).then((res) => {
            if (res.ok) {
              toastr.success("Video Deleted Successfully");
              getVideosIds();
            } else
              toastr.error("Failed To Delete Video Please Try Again Later");
          });
        }
      });
    }
    
    useEffect(() => {
      
      getVideosIds();
      getSectionQuiz();
      
      
    }, []);







    const UploadVideoCard = (props) => {
      const [video, setVideo] = useState(null);
  
      const handleVideoUpload = (event) => {
        const file = event.target.files[0];
        setVideo(file);
      };
  
     
      const handleVideoSubmit = (event) => {
        event.preventDefault();
        console.log(section.id)
        const titleInput = document.getElementById("title");
        const titleValue = titleInput.value;
        if (titleValue === "") {
          toastr.error("Please Enter A Valid Title");
          return;
        }
        
        const formData = new FormData();
        formData.append("file", video);
        formData.append("Title", titleValue);
  
        const progressBar = document.getElementById("progress-bar");
        const progressBarText = document.getElementById("progress-bar-text");
  
        const xhr = new XMLHttpRequest();
        xhr.open(
          "POST",
          `https://resweb-001-site1.htempurl.com/api/Courses/Videos/${section.id}`
        );
        xhr.setRequestHeader("Authorization", `Bearer ${userData.token}`);
  
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            progressBar.style.width = `${progress}%`;
            progressBarText.textContent = `Uploading: ${progress.toFixed(2)}%`;
          }
        };
  
        xhr.onload = () => {
          
          if (xhr.status === 204) {
            props.onClose();
            toastr.success("Video Added Successfully");
            getVideosIds();
          } else {
            toastr.error("Failed to add video. Please try again later", "Failed");
          }
        };
  
        xhr.onerror = () => {
          toastr.error("Failed to add video. Please try again later", "Failed");
        };
  
        xhr.send(formData);
      };
  
      if (!props.show) return null;
      return (
        <div className="modal-overlay2">
          <div
            className="modal2"
            style={{ height: "500px", alignItems: "center" }}
          >
            <div>
              <div
                id="progress-bar"
                style={{ width: "0%", backgroundColor: "#ddd", height: "20px" }}
              ></div>
              <div id="progress-bar-text"></div>
            </div>
  
            <div className="ContExitbtn" onClick={props.onClose}>
              <div class="outer">
                <div class="inner">
                  <label className="label2">Exit</label>
                </div>
              </div>
            </div>
            <h1 className="headContact2">Upload Video</h1>
  
            <div className="FormModal2 custom-scrollbar" style={{maxWidth:'600px'}}>
              {video && (
                <div className="contVideoInfo">
                  <video
                    className="videoW"
                    src={URL.createObjectURL(video)}
                    controls
                  />
                  <div
                    style={{
                      alignItems: "center",
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "20px",
                    }}
                  >
                    <label style={{ marginBottom: "0" }} className="AllLabeles">
                      Video Title:{" "}
                    </label>
                    <input
                      style={{ marginBottom: "0" }}
                      id="title"
                      className="InputModalHallDetails"
                      type="text"
                      placeholder="Video's Title"
                      required
                      name="Title"
                    ></input>
                    <button className="detailsbtn" onClick={handleVideoSubmit}>
                      Upload Video
                    </button>
                  </div>
                </div>
              )}
  
              <label className="LableForinputTypeFile" htmlFor="upload">
                <input
                  className="InputFile"
                  id="upload"
                  type="file"
                  onChange={handleVideoUpload}
                />
                <span className="SpanUpload">
                  {" "}
                  <MdOutlineFileUpload />
                  <span>Choose a File</span>
                </span>
              </label>
              <div className="ChooseAndCancel">
                {/* <input type="file" id="video-upload" onChange={handleVideoUpload} /> */}
  
                <button className="deletebtn" onClick={props.onClose}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    };



const UpdateVideoCard = (props) => {
    const [video, setVideo] = useState(null);
    const handleVideoUpload = (event) => {
      const file = event.target.files[0];
      setVideo(file);
    };

    const handleVideoSubmit = (event) => {
      event.preventDefault();
      const titleInput = document.getElementById("title");
      const titleValue = titleInput.value;
      if (titleValue === "") {
        toastr.error("Please Enter A Valid Title");
        return;
      }
      const formData = new FormData();
      formData.append("NewVideoFile", video);
      formData.append("NewTitle", titleValue);

      const progressBar = document.getElementById("progress-bar");
      const progressBarText = document.getElementById("progress-bar-text");

      const xhr = new XMLHttpRequest();
      xhr.open(
        "PUT",
        `https://resweb-001-site1.htempurl.com/api/Courses/Videos/${videoToUpdate}`
      );
      xhr.setRequestHeader("Authorization", `Bearer ${userData.token}`);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          progressBar.style.width = `${progress}%`;
          progressBarText.textContent = `Uploading: ${progress.toFixed(2)}%`;
        }
      };

      xhr.onload = () => {
        
        if (xhr.status === 204) {
          props.onClose();
          toastr.success("Video Updated Successfully");
          getVideosIds();
        } else {
          toastr.error("Failed to Update video. Please try again later", "Failed");
        }
      };

      xhr.onerror = () => {
        toastr.error("Failed to Update video. Please try again later", "Failed");
      };

      xhr.send(formData);
    };
    

    if (!props.show) return null;
    return (
      <div className="modal-overlay2">
        <div
          className="modal2"
          style={{ height: "500px", alignItems: "center" }}
        >
          <div>
            <div
              id="progress-bar"
              style={{ width: "0%", backgroundColor: "#ddd", height: "20px" }}
            ></div>
            <div id="progress-bar-text"></div>
          </div>

          <div className="ContExitbtn" onClick={props.onClose}>
            <div class="outer">
              <div class="inner">
                <label className="label2">Exit</label>
              </div>
            </div>
          </div>
          <h1 className="headContact2">Upload Video</h1>

          <div className="FormModal2 custom-scrollbar" style={{maxWidth:'600px'}}>
            {video && (
              <div className="contVideoInfo">
                <video
                  className="videoW"
                  src={URL.createObjectURL(video)}
                  controls
                />
                <div
                  style={{
                    alignItems: "center",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "20px",
                  }}
                >
                  <label style={{ marginBottom: "0" }} className="AllLabeles">
                    Video Title:{" "}
                  </label>
                  <input
                    style={{ marginBottom: "0" }}
                    id="title"
                    className="InputModalHallDetails"
                    type="text"
                    placeholder="Video's Title"
                    required
                    name="Title"
                  ></input>
                  <button className="detailsbtn" onClick={handleVideoSubmit}>
                    Upload Video
                  </button>
                </div>
              </div>
            )}

            <label className="LableForinputTypeFile" htmlFor="upload">
              <input
                className="InputFile"
                id="upload"
                type="file"
                onChange={handleVideoUpload}
              />
              <span className="SpanUpload">
                {" "}
                <MdOutlineFileUpload />
                <span>Choose a File</span>
              </span>
            </label>
            <div className="ChooseAndCancel">
              {/* <input type="file" id="video-upload" onChange={handleVideoUpload} /> */}

              <button className="deletebtn" onClick={props.onClose}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };





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
                  // setSectionId(section.id);
                  setShowUploadVideo(true);
                }}
              />
              <FaRegEdit
                onClick={() =>
                  userData.roles === "Admin"
                    ? navigate(`/AddQuizToSection/${section.id}`)
                    : null
                }
                className="plusIcon"
              />

              <FaTrash onClick={deleteSection} className="plusIcon" />
            </div>
          )}
        </div>

        <div
          className="courseDetailsSectionVideosNew"
          style={{ display: activeSection ? "flex" : "none" }}
        >
          {sectionLoading&&<img src={loader} style={{maxWidth:'200px',width:'70%'}} />}
          {!sectionLoading&&videosIds?.map((video, index) => (
            <span
              style={{ display: "flex", justifyContent: "space-between" }}
              className="LinkVideoSection"
            >
              <span
                onClick={() =>
                  isStudentEnrolled || 
                  userData.roles === "Admin"
                    ? navigate(`/CourseForStudent/${section.id}/${video.id}/${index}`,{state:{data:videosIds}})
                    : toastr.warning("Buy The Course First", "Alert")
                }
              >
                
                  {video?.title}
                 
              </span>
              <div
                style={{
                  alignSelf: "flex-end",
                  display: "flex",
                  alignItems: "center",
                  columnGap: "10px",
                }}
              >
                {userData.roles === "Admin" && (
                  <FaTrash
                    style={{ marginLeft: "auto", cursor: "pointer" }}
                    onClick={() => deleteVideo(video.id)}
                  />
                )}
                {userData.roles === "Admin" && (
                  <FaRegEdit
                    style={{ marginLeft: "auto", cursor: "pointer" }}
                    onClick={() => {
                    //   setChoosenUpdateVideo(video.id);
                    setVideoToUpdate(video.id);
                      setShowUpdateVideo(true);
                    }}
                  />
                )}
              </div>
              
            </span>

          ))}

          {sectionQuiz &&
           isStudentEnrolled && 
           userData.roles !== "Admin" && (
            <span
              className="QuizTitle"
              onClick={() => {
                if (isStudentEnrolled) {
                  navigate(`/SectionQuiz/${section.id}`);
                }
              }}
            >
              {section.name} Quiz
            </span>
          )}
        </div>
        {showUploadVideo&&<UploadVideoCard
        show={showUploadVideo}
        onClose={() => setShowUploadVideo(false)}
      />}
{showUpdateVideo && (
        <UpdateVideoCard
          show={showUpdateVideo}
          onClose={() => setShowUpdateVideo(false)}
        />
      )}
      
      </div>
    );
  };