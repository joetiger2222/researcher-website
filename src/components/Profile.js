import React, { useEffect } from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import kariem from "../images/userImg.png";
import { useState } from "react";
import "../css/Modal.css";
import "../css/Profile.css";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import paperPhoto from "../images/paper.jpg";
import ModalEditProfile from "./ModalEditProfile";
import PaperCardInProfile from "./Cards/PaperCardInProfile";
import { FaCheckCircle } from "react-icons/fa";
import request from "../images/request.png";
import Swal from "sweetalert2";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { MdOutlineFileUpload } from "react-icons/md";
import { MdCameraAlt } from "react-icons/md";

import user from "../images/useer.png";
import ToastrComponent from "./Cards/ToastrComponent";
const Profile = () => {
  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [researcherData, setResearcherData] = useState(null);
  const [resInvits, setResInvits] = useState(null);
  const [resReqs, setResReqs] = useState(null);
  const [showAddPaper, setShowAddPaper] = useState(false);
  const [showSpecCard, setShowSpecCard] = useState(false);
  const [showEditPaper, setShowEditPaper] = useState(false);
  const [showDeletePaper, setShowDeletePaper] = useState(false);
  const [showEditAllData, setShowEditAllData] = useState(false);
  const [showImageCard, setShowImageCard] = useState(false);
  const [paperData, setPaperData] = useState(null);
  const [expertReqs, setExpertReqs] = useState(null);
  const [adminReponse, setAdminResponse] = useState(null);
  const [researcherIdeas, setResearcherIdeas] = useState([]);
  const [studentCourses,setStudentCourses]=useState([]);
  const [studentImage, setStudentImage] = useState({ url: kariem });
  const userData = useLocation().state?.data;
  const { studentId } = useParams();
  const navigate = useNavigate();

  function getStudentData() {
    fetch(`https://localhost:7187/api/Students/${studentId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData?.token}`,
      },
    })
      .then((res) =>
        res.ok ? res.json() : toastr.error("Something Wrong Happened", "Error")
      )
      .then((data) => {
        if (data) {
          setStudentData(data);
          getResearcherId(data.id);
        }
      });
  }

  function getResearcherId(studentId) {
    fetch(`https://localhost:7187/api/Researchers/ResearcherId/${studentId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData?.token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          getResearcherData(data.researcherId);
          getResInvitations(data.researcherId);
          getResReqs(data.researcherId);
          getExpertReqs(data.researcherId);
          getResearcherIdeas(data.researcherId);
        }
      });
  }

  function getResearcherData(resId) {
    fetch(`https://localhost:7187/api/Researchers/${resId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData?.token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => (data ? setResearcherData(data) : null));
  }

  function getResInvitations(resId) {
    fetch(`https://localhost:7187/api/Researchers/Invitations/${resId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData?.token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => (data ? setResInvits(data) : null));
  }

  function getResReqs(resId) {
    fetch(`https://localhost:7187/api/Researchers/Requests/${resId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData?.token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => (data ? setResReqs(data) : null));
  }

  function getExpertReqs(resId) {
    fetch(
      `https://localhost:7187/api/Researchers/Ideas/ExpertRequests/${resId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      }
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => (data ? setExpertReqs(data) : null));
  }

  function getAdminResponse() {
    fetch(`https://localhost:7187/api/Students/Responses/${studentId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => (data ? setAdminResponse(data) : null));
  }

  function getResearcherIdeas(resId) {
    fetch(`https://localhost:7187/api/Researchers/Ideas/${resId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData?.token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setResearcherIdeas(data);
        }
      });
  }

  function getStudentImage() {
    fetch(`https://localhost:7187/api/Students/Image/${studentId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    }).then((res) => (res.ok ? setStudentImage(res) : null));
  }

  function getStudentCourses(){
    fetch(`https://localhost:7187/api/Students/Courses?studentId=${studentId}`,{
      method:"GET",
      headers:{
        "Authorization":`Bearer ${userData.token}`,
      }
    })
    .then(res=>res.ok?res.json():alert('failed to get student courses'))
    .then(data=>data?setStudentCourses(data):null)
  }
console.log(studentCourses)

  useEffect(() => {
    getStudentData();
    getStudentImage();
    getStudentCourses();
    if (userData.userId === studentId) getAdminResponse();
  }, [studentId]);

  function rejectInvite(i) {
    fetch(
      `https://localhost:7187/api/Ideas/RejectInvitation/${i.id}/${i.researcherId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userData?.token}`,
        },
      }
    ).then((res) => {
      if (res.ok) {
        toastr.success("rejected successfully", "Success");
        setResInvits(resInvits.filter((res) => res.id !== i.id));
      } else toastr.error("failed to reject Invitations", "Failed");
    });
  }

  function acceptInvitation(i) {
    fetch(
      `https://localhost:7187/api/Ideas/AcceptInvitations/${i.id}/${i.researcherId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userData?.token}`,
          "Content-Type": "application/json",
        },
      }
    ).then((res) => {
      if (res.ok) {
        toastr.success("Accepted successfully", "Success");
        setResInvits(resInvits.filter((res) => res.id !== i.id));
      } else toastr.error("failed to accept Invitations", "Failed");
    });
  }

  const AddPaperModal = (props) => {
    const [paperData, setPaperData] = useState({
      name: "",
      citation: "",
      url: "",
    });

    function getPaperData(e) {
      setPaperData((prev) => {
        return {
          ...prev,
          [e.target.name]: e.target.value,
        };
      });
    }

    function createPaper() {
      let peperArr = [];
      peperArr.push(paperData);
      fetch(
        `https://localhost:7187/api/Researchers/Papers/${researcherData?.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userData?.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(peperArr),
        }
      ).then((res) =>
        res.ok
          ? window.location.reload()
          : toastr.error("failed to add paper", "Failed")
      );
    }

    if (!props.show) return null;

    return (
      <div className="modal-overlay2">
        <div className="modal2">
          <div className="ContExitbtn">
            <div class="outer" onClick={props.onClose}>
              <div class="inner">
                <label className="label2">Exit</label>
              </div>
            </div>
          </div>
          <h1 className="headContact2">Create New Paper</h1>
          <div className="FormModal2">
            <label className="AllLabeles">Paper Name:</label>
            <input
              required
              className="InputModalHallDetails"
              onChange={getPaperData}
              name="name"
              placeholder="Name..."
            ></input>

            <label className="AllLabeles">Paper Citation:</label>
            <input
              required
              className="InputModalHallDetails"
              onChange={getPaperData}
              name="citation"
              placeholder="Citation..."
            ></input>

            <label className="AllLabeles">Paper Url:</label>
            <input
              required
              className="InputModalHallDetails"
              onChange={getPaperData}
              name="url"
              placeholder="Url..."
            ></input>
            <div className="buttonsOnModal">
              {paperData.name && paperData.citation && paperData.url && (
                <button onClick={createPaper}>Create</button>
              )}
              <button onClick={props.onClose}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SpecCard = (props) => {
    const [allSpecs, setAllSpecs] = useState(null);
    const [newSpec, setNewSpec] = useState(researcherData?.specality?.id);

    function getAllSpecs() {
      fetch(`https://localhost:7187/api/Researchers/Specialties`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
        .then((res) =>
          res.ok ? res.json() : toastr.error("failed to Load specs", "Failed")
        )
        .then((data) => (data ? setAllSpecs(data) : null));
    }

    useEffect(() => {
      getAllSpecs();
    }, []);

    function editSpec() {
      fetch(
        `https://localhost:7187/api/Researchers/Speciality/${userData.resercherId}/${newSpec}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData?.token}`,
          },
        }
      ).then((res) => {
        if (res.ok) {
          props.onClose();
          getResearcherData(userData.resercherId);
        } else
          toastr.error(
            "Failed To Update Speciality Please Try Again Later",
            "Failed"
          );
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
          <h1 className="headContact2">Choose Speciality</h1>
          <div className="FormModal2">
            <select
              className="InputModalHallDetails"
              onChange={(e) => setNewSpec(e.target.value * 1)}
            >
              <option disabled selected>
                Choose Specality
              </option>
              {allSpecs?.map((spec) => {
                return <option value={spec.id}>{spec.name}</option>;
              })}
            </select>
            <div className="buttonsOnModal">
              <button onClick={editSpec}>Confirm</button>
              <button onClick={props.onClose}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const EditPaper = (props) => {
    console.log("edit paper", paperData.id);
    const [paperToEdit, setPaperToEdit] = useState({
      name: paperData.name,
      citation: paperData.citation,
      url: paperData.url,
    });
    //  console.log(paperToEdit)

    function getPaperDataToEdit(e) {
      setPaperToEdit((prev) => {
        return {
          ...prev,
          [e.target.name]: e.target.value,
        };
      });
    }

    function editPaper() {
      fetch(`https://localhost:7187/api/Researchers/Papers/${paperData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.token}`,
        },
        body: JSON.stringify(paperToEdit),
      }).then((res) => {
        if (res.ok) {
          toastr.success("Paper Edited Successfully", "Success");
          window.location.reload();
        } else
          toastr.error("Failed To Edit Paper Please Try Again Later", "Failed");
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

          <h1 className="headContact2">
            Only Change The Fields You Want To Edit
          </h1>
          <div className="FormModal2">
            <label className="AllLabeles">Paper Name :</label>
            <input
              className="InputModalHallDetails"
              placeholder={paperData.name}
              name="name"
              onChange={getPaperDataToEdit}
            ></input>
            <label className="AllLabeles">Paper citation :</label>
            <input
              className="InputModalHallDetails"
              placeholder={paperData.citation}
              name="citation"
              onChange={getPaperDataToEdit}
            ></input>
            <label className="AllLabeles">Paper url :</label>
            <input
              className="InputModalHallDetails"
              placeholder={paperData.url}
              name="url"
              onChange={getPaperDataToEdit}
            ></input>
            <div className="buttonsOnModal">
              <button onClick={editPaper}>Confirm</button>
              <button onClick={props.onClose}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const DeletePaperCard = (props) => {
    function deletePaper() {
      Swal.fire({
        title: "Are You Sure To Delete The Course",
        showCancelButton: true,
      }).then((data) => {
        if (data.isConfirmed) {
          fetch(
            `https://localhost:7187/api/Researchers/Papers/${props.paper.id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${userData.token}`,
              },
            }
          ).then((res) => {
            if (res.ok) {
              toastr.success("Paper Successfully Deleted", "Success");
              window.location.reload();
            } else {
              toastr.error("Failed To Delete Paper", "Failed");
            }
          });
        }
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
          <h1 className="headContact2">
            Are You Sure You Want To Delete This Paper?
          </h1>
          <div className="buttonsOnModal">
            <button onClick={deletePaper}>Delete</button>
            <button onClick={props.onClose}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  
  const EditData = (props) => {
    const [editData, setEditData] = useState({
      firstname: studentData.firstName,
      lastname: studentData.lastName,
      gender: studentData.gender,
      email: studentData.email,
      age: studentData.age,
      nationalityId: studentData.nationality.id,
      type: 0,
      bio:studentData.bio,
      googleSchoolerLink: "",
    });

    const [allNationalities, setAllNationalities] = useState([]);

    console.log(editData);

    function getEditData(e) {
      setEditData((prev) => {
        return { ...prev, [e.target.name]: e.target.value };
      });
    }

    function getAllNationalities() {
      fetch(`https://localhost:7187/api/Students/Nationalites`)
        .then((res) =>
          res.ok
            ? res.json()
            : toastr.error("failed to load nationalities", "Failed")
        )
        .then((data) => (data ? setAllNationalities(data) : null));
    }

    useEffect(() => {
      getAllNationalities();
    }, []);

    function sendEditData() {
      fetch(
        `https://localhost:7187/api/Students/studentId?studentId=${studentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
          body: JSON.stringify(editData),
        }
      ).then((res) => {
        if (res.ok) {
          toastr.success("Data Successfully Updated", "Success");
          window.location.reload();
        } else
          toastr.error(
            "Failed To Update Data Please Try Again Later",
            "Failed"
          );
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
          <h1 className="headContact2">Edit only data you want to change</h1>
          <div className="FormModal2 custom-scrollbar">
            <label className="AllLabeles">First Name</label>
            <input
              className="InputModalHallDetails"
              placeholder={studentData?.firstName}
              name="firstname"
              onChange={getEditData}
            ></input>
            <label className="AllLabeles">Last Name</label>
            <input
              className="InputModalHallDetails"
              placeholder={studentData?.lastName}
              name="lastname"
              onChange={getEditData}
            ></input>
            
            <label className="AllLabeles">Age</label>
            <input
              className="InputModalHallDetails"
              placeholder={studentData?.age}
              type="number"
              name="age"
              onChange={(e) =>
                setEditData((prev) => {
                  return { ...prev, [e.target.name]: e.target.value * 1 };
                })
              }
            ></input>
            <label className="AllLabeles">Nationality</label>
            <select
              className="InputModalHallDetails"
              name="nationalityId"
              onChange={(e) =>
                setEditData((prev) => {
                  return { ...prev, [e.target.name]: e.target.value * 1 };
                })
              }
            >
              <option selected disabled>
                {studentData?.nationality.name}
              </option>
              {allNationalities?.map((nat) => {
                return <option value={nat.id}>{nat.name}</option>;
              })}
            </select>
            <label className="AllLabeles">Type</label>
            <select
              className="InputModalHallDetails"
              name="type"
              onChange={(e) =>
                setEditData((prev) => {
                  return { ...prev, [e.target.name]: e.target.value * 1 };
                })
              }
            >
              <option value={0}>Student</option>
              <option value={1}>Graduate</option>
              <option value={2}>Doctor / Specialist</option>
              <option value={3}>Other</option>
            </select>
            <label className="AllLabeles">Google Schooler Link</label>
            <input
              className="InputModalHallDetails"
              placeholder={studentData?.googleSchoolerLink}
              name="googleSchoolerLink"
              onChange={getEditData}
            ></input>
            <label className="AllLabeles">Bio</label>
            <input
              className="InputModalHallDetails"
              placeholder={studentData?.bio}
              name="bio"
              onChange={getEditData}
            ></input>
            <div className="buttonsOnModal">
              <button onClick={sendEditData}>Submit</button>
              <button onClick={props.onClose}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const EditImageCard = (props) => {
    const [photo, setPhoto] = useState(null);

    function editPhoto() {
      const formData = new FormData();
      formData.append("file", photo, photo.name);

      fetch(
        `https://localhost:7187/api/Students/UploadImage?userId=${userData.userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
          body: formData,
        }
      ).then((res) => {
        if (res.ok) {
          window.location.reload();
        } else toastr.error("failed to update photo", "Failed");
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
          <h1 className="headContact2">Upload profile photo</h1>

          <div className="FormModal2">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                id="user"
                src={user}
                style={{ width: "150px", margin: "0 0 20px 0" }}
              />

              <label className="LableForinputTypeFile" htmlFor="img">
                <input
                  className="InputFile"
                  id="img"
                  type="file"
                  onChange={(e) => setPhoto(e.target.files[0])}
                />
                <span className="SpanUpload">
                  {" "}
                  <MdOutlineFileUpload />
                  <span>Choose a File</span>
                </span>
              </label>
            </div>{" "}
            <div className="buttonsOnModal">
              {photo && <button onClick={editPhoto}>Finish</button>}
              <button onClick={props.onClose} id="Next_Step">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="ParentHeadData">
      <Header userData={userData} />
      
      <div className="ContainerAllContentProfile">
      <div className="profile-header" style={{ marginTop: "130px" }}>
        <div className="imageProfDiv">
          <div className="image-container">
            <img
              src={studentImage?.url}
              alt="Profile"
              className="profile-image"
            />

            <div className="button-container">
              {userData?.userId === studentId && (
                <p onClick={() => setShowImageCard(true)} className="">
                  <MdCameraAlt /> <span>Change Picture</span>
                </p>
              )}
            </div>
            {showImageCard && (
              <EditImageCard
                show={showImageCard}
                onClose={() => setShowImageCard(false)}
              />
            )}
          </div>
          <div className="ContEditProfile">
            {researcherData && (
              <p className="nameUser">{researcherData?.specality?.name} </p>
            )}
            <div style={{display:"flex",gap:"10px",flexWrap:"wrap"}}>
            {userData?.userId === studentId && (
              <p
                onClick={() => setShowEditAllData(true)}
                className="detailsbtn"
              >
                Edit Student Data
              </p>
            )}
            {userData.roles === "Researcher" &&
              userData?.userId === studentId && (
                <p
                  onClick={() => setShowSpecCard(true)}
                  className="detailsbtn"
                >
                  Edit Speciality
                </p>
              )}
            </div>

            {showSpecCard && (
              <SpecCard
                show={showSpecCard}
                onClose={() => setShowSpecCard(false)}
              />
            )}

            {showEditAllData && (
              <EditData
                show={showEditAllData}
                onClose={() => setShowEditAllData(false)}
              />
            )}
          </div>
        </div>
        <div className="profile-details">
          <h1 className="profile-name">
            {studentData?.firstName + " " + studentData?.lastName}
            {studentData?.isMentor && <FaCheckCircle />}
          </h1>
          <p className="profile-bio">
            {studentData?.bio}
          </p>
          {userData.roles === "Researcher" && (
            <span
              style={{ color: "black",fontWeight:"bold" }}
            >{`Rate : ${researcherData?.overallRate}`}</span>
          )}
        </div>
        <div className="btnsPlannerProf">
          <div className="planner-prof-btn-div">
            <Link
              className="btn-flip"
              data-back="Contact"
              data-front="Contact"
              to="#"
            ></Link>
          </div>
          <div className="planner-prof-btn-div">
            <Link
              onClick={() => setShowEdit(true)}
              className="btn-flip"
              data-back="Edit"
              data-front="Edit"
            ></Link>
            <ModalEditProfile
              onClose={() => setShowEdit(false)}
              show={showEdit}
            />
          </div>

          <div className="planner-prof-btn-div">
            <Link
              onClick={() => setShow(true)}
              className="btn-flip"
              data-back="AddPlan"
              data-front="AddPlan"
              to="#"
            ></Link>
            <ModalEditProfile onClose={() => setShow(false)} show={show} />
          </div>
        </div>
      </div>
<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"30px",backgroundColor:"aliceblue"}}>
  <h1 style={{color:"black",margin:"10px"}}>Achievements</h1>
  <div className="badgesAndPoints">
        <div className="badgesContainer">
          <h1>Badges</h1>
          <div className="badgesDiv custom-scrollbar">
            <div className="badge">
              <h4>Medical Coding</h4>
            </div>
            <div className="badge">
              <h4>Medical Coding</h4>
            </div>
          </div>
        </div>
        <div className="badgesContainer">
          <h1>Points : {researcherData?.points}</h1>
          <div className="pointsDiv">
            <li
              className="profileBeg"
              style={{
                backgroundColor:
                  researcherData?.level === 0 ? "gray" : "transparent",
              }}
            >
              Beginner (1-3) Points
            </li>
            <li
              className="profileInter"
              style={{
                borderRadius: "5px",
                backgroundColor:
                  researcherData?.level === 1 ? "#346da0" : "transparent",
              }}
            >
              Intermediate (4-6) Points
            </li>
            <li
              className="profileInter"
              style={{
                backgroundColor:
                  researcherData?.level === 2 ? "gray" : "transparent",
              }}
            >
              Professional (7-8) Points
            </li>
            <li
              className="profileExp"
              style={{
                backgroundColor:
                  researcherData?.level > 2 ? "gray" : "transparent",
              }}
            >
              Expert (8&lt;points)
            </li>
          </div>
        </div>
        <div className="badgesContainer">
          <h1>Enrolled Courses</h1>
          <div className="pointsDiv custom-scrollbar">
            

            {studentCourses?.map(course=>{
              return(
                <div className="watchedCourse" onClick={()=>navigate(`/CourseDetails/${course.id}`,{state:{data:userData}})}>
              <h4>{course.name}</h4>
              
            </div>
              )
            })}
          </div>
        </div>
      </div>
</div>
      

      {researcherIdeas > 0 && (
        <div className="ContainerAllIdeas">
          <h1 style={{ color: "black" }}>Ideas</h1>

          <div className="AllIdeas">
            {researcherIdeas?.length > 0 ? (
              researcherIdeas?.map((idea, index) => {
                return (
                  <div
                    onClick={() =>
                      navigate(`/Idea/${idea.id}`, {
                        state: { data: userData },
                      })
                    }
                    className="CardInAllIdeas"
                    style={{ cursor: "pointer" }}
                  >
                    <h2>Idea: {index + 1}</h2>
                    <div className="containerSpansData">
                      <span
                        style={{
                          borderBottom: "1px solid black",
                          padding: "5px",
                        }}
                      >
                        Name:{" "}
                        <span style={{ fontWeight: "bold" }}>{idea.name}</span>
                      </span>

                      <span
                        style={{
                          borderBottom: "1px solid black",
                          padding: "5px",
                        }}
                      >
                        specality:{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {idea?.specalityObj.name}
                        </span>
                      </span>
                      <span
                        style={{
                          borderBottom: "1px solid black",
                          padding: "5px",
                        }}
                      >
                        deadline:{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {new Date(idea?.deadline).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </span>
                      <span
                        style={{
                          borderBottom: "1px solid black",
                          padding: "5px",
                        }}
                      >
                        Participants Number:{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {idea?.participantsNumber}
                        </span>
                      </span>
                      <span
                        style={{
                          borderBottom: "1px solid black",
                          padding: "5px",
                        }}
                      >
                        max Participants Number:{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {idea?.maxParticipantsNumber}
                        </span>
                      </span>
                      <span
                        style={{
                          borderBottom: "1px solid black",
                          padding: "5px",
                        }}
                      >
                        topic:{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {idea?.topicObject.name}
                        </span>
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <span>You Have No Ideas Yet!</span>
            )}
          </div>
        </div>
      )}

      {(userData.roles === "Researcher" || userData.roles === "Admin") &&
         (
          <div
            style={{
              color: "black",
              display: "flex",
              flexDirection: "column",
              // padding: "20px",
              alignItems: "center",
              gap: "40px",
              width: "100%",
            }}
          >
            <h1>Papers</h1>
            <div className="PapersContainer custom-scrollbar">
              {researcherData?.papers?.map((paper) => {
                return (
                  <div className="ContCardPaper">
                    {/* <PaperCardInProfile paper={paper}/> */}
                    {/* <div>
                      <img src={paperPhoto} alt="paper" />
                    </div> */}
                    <div className="ContDataInCardPaper">
                      <p style={{display:"flex",flexDirection:"row",gap:"10px"}} className="custom-scrollbar">
                        <span style={{fontWeight:"bold"}}>Paper Name :</span> <span>{paper?.name}</span>
                      </p>
                      <p style={{display:"flex",flexDirection:"row",gap:"10px"}} className="custom-scrollbar">
                        <span style={{fontWeight:"bold"}}>Paper citation :</span><span>{paper?.citation}</span>
                      </p>
                      <p style={{display:"flex",flexDirection:"column",gap:"10px"}} className="custom-scrollbar">
                        <span style={{fontWeight:"bold"}}>Paper url :</span><span>{paper?.url}</span>
                        
                      </p>
                    </div>
                    <div className="Contbtns">
                      {userData?.userId === studentId && (
                        <button
                          // className="editPaperbtn"
                          className="detailsbtn"
                          onClick={() => {
                            setShowEditPaper(true);
                            setPaperData(paper);
                          }}
                        >
                          Edit Paper
                        </button>
                      )}
                      {userData?.userId === studentId && (
                        <button
                          onClick={() => {
                            setPaperData(paper);
                            setShowDeletePaper(true);
                          }}
                          className="deletebtn"
                        >
                          Delete Paper
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              {showEditPaper && (
                <EditPaper
                  show={showEditPaper}
                  onClose={() => setShowEditPaper(false)}
                />
              )}
              {showDeletePaper && paperData && (
                <DeletePaperCard
                  show={showDeletePaper}
                  onClose={() => setShowDeletePaper(false)}
                  paper={paperData}
                />
              )}
            </div>
            {userData?.userId === studentId && (
              <button
                className="AddNewPaper"
                onClick={() => setShowAddPaper(true)}
              >
                Add New Paper
              </button>
            )}
            {userData?.userId === studentId && showAddPaper && (
              <AddPaperModal
                show={showAddPaper}
                onClose={() => setShowAddPaper(false)}
              />
            )}
          </div>
        )}

      <div className="ContInviteAndRequest">
        {userData.roles === "Researcher" && userData?.userId === studentId && (
          <div className="Invitation">
            <h1>Invitations : {resInvits?.length}</h1>
            {resInvits?.map((i, index) => {
              return (
                <div className="ContainerreauestWithBtn">
                  <p>Invitation {index + 1}</p>
                  <button
                    onClick={() =>
                      navigate(`/Idea/${i.ideaId}`, {
                        state: { data: userData },
                      })
                    }
                  >
                    View Idea
                  </button>
                  <button onClick={() => acceptInvitation(i)}>Accept</button>
                  <button onClick={() => rejectInvite(i)}>Reject</button>
                </div>
              );
            })}
          </div>
        )}

        {userData.roles === "Researcher" && userData?.userId === studentId && (
          <div className="Invitation">
            <h1>Your Requests : {resReqs?.length}</h1>
            <div className="ContAllRequestss custom-scrollbar">
              {resReqs?.map((r, index) => {
                return (
                  <div className="ContainerreauestWithBtn">
                    <p>Request {index + 1}</p>
                    <button
                      onClick={() =>
                        navigate(`/Idea/${r.ideaId}`, {
                          state: { data: userData },
                        })
                      }
                    >
                      View Idea
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {userData.roles === "Researcher" && userData?.userId === studentId && (
        <div className="ContExpertRequests">
          <h1>Your Expert Requests : {expertReqs?.length}</h1>
          <div className="ContAllRequests custom-scrollbar">
            {expertReqs?.map((req) => {
              return (
                <div className="ContAllWithbtn">
                  <div className="photoRequst">
                    <img src={request} alt="photo" />
                  </div>
                  <div className="ContainerInfoWithbtn">
                    <div className="ContTitleAndContent">
                      <p>{req.title}</p>
                      <p className="contentData custom-scrollbar">
                        {req.content}
                      </p>
                    </div>
                    <div>
                      <button
                        className="viewData"
                        onClick={() =>
                          navigate(`/idea/${req.ideaId}`, {
                            state: { data: userData },
                          })
                        }
                      >
                        View Idea
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {userData.userId === studentId && (
        <div className="ContainerAllIdeasInProfile">
          {adminReponse?.length > 0 && (
            <h1 style={{ color: "black" }}>Admin Reponses</h1>
          )}
          <div className="AllIdeasWidth80">
            {adminReponse?.map((res) => {
              return (
                <div
                  //  style={{border:'2px solid white'}}
                  className="CardInAllIdeas"
                >
                  <span className="custom-scrollbar">
                    <span style={{ fontWeight: "bold" }}>
                      Problem Description :
                    </span>{" "}
                    {res.problem.description}
                  </span>
                  <span className="spanForScroll custom-scrollbar ">
                    <span style={{ fontWeight: "bold" }}>Admin Response :</span>{" "}
                    {res.message}
                  </span>
                  <span className="custom-scrollbar">
                    <span style={{ fontWeight: "bold" }}>
                      Problem Category :
                    </span>{" "}
                    {res.problem.problemCategory.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Profile;
