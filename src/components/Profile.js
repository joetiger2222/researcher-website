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
import request from "../images/request.png";
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
  const [deletePaper, setDeletePaper] = useState(false);
  const [paperData, setPaperData] = useState(null);
  const [expertReqs, setExpertReqs] = useState(null);
  const [adminReponse,setAdminResponse]=useState(null);
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
      .then((res) => (res.ok ? res.json() : alert("Something Wrong Happened")))
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
      // .then((data) => (data ? getResearcherData(data.researcherId) : null));
      .then((data) => {
        if (data) {
          getResearcherData(data.researcherId);
          getResInvitations(data.researcherId);
          getResReqs(data.researcherId);
          getExpertReqs(data.researcherId);
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
      .then((res) =>
        res.ok ? res.json() : null
      )
      .then((data) => (data ? setResInvits(data) : null));
  }

  function getResReqs(resId) {
    fetch(`https://localhost:7187/api/Researchers/Requests/${resId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData?.token}`,
      },
    })
      .then((res) =>
        res.ok ? res.json() : null
      )
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
      .then((res) =>
        res.ok ? res.json() : null
      )
      .then((data) => (data ? setExpertReqs(data) : null));
  }

  function getAdminResponse(){
    fetch(`https://localhost:7187/api/Students/Responses/${studentId}`,{
      method:"GET",
      headers:{
        "Authorization":`Bearer ${userData.token}`
      },
    })
    .then(res=>res.ok?res.json():null)
    .then(data=>data?setAdminResponse(data):null)
  }

  useEffect(() => {
    getStudentData();
    if(userData.userId===studentId)getAdminResponse();
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
        alert("rejected successfully");
        setResInvits(resInvits.filter((res) => res.id !== i.id));
      } else alert("failed to reject Invitations");
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
        alert("Accepted successfully");
        setResInvits(resInvits.filter((res) => res.id !== i.id));
      } else alert("failed to accept Invitations");
    });
  }

  const WatchedCourse = () => (
    <div className="watchedCourse">
      <h4>Course Name</h4>
      <p>Category</p>
    </div>
  );

  const BadgeName = ({ b }) => (
    <div className="badge">
      <h4>{b?.name}</h4>
    </div>
  );

  const Task = () => <h4>Task</h4>;

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
        res.ok ? window.location.reload() : alert("failed to add paper")
      );
    }

    if (!props.show) return null;

    return (
      <div
        className="modal-overlay2"
      >
        <div
          className="modal2"
        >
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
            <button onClick={createPaper}>Create</button>
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
        .then((res) => (res.ok ? res.json() : alert("failed to Load specs")))
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
            Authorization: `Bearer ${userData?.token}`,
          },
        }
      ).then((res) => {
        if (res.ok) {
          props.onClose();
          getResearcherData(userData.resercherId);
        } else alert("Failed To Update Speciality Please Try Again Later");
      });
    }

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
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h1>Choose Speciality</h1>
          <select onChange={(e) => setNewSpec(e.target.value * 1)}>
            <option disabled selected>
              Choose Specality
            </option>
            {allSpecs?.map((spec) => {
              return <option value={spec.id}>{spec.name}</option>;
            })}
          </select>
          <button onClick={props.onClose}>Cancel</button>
          <button onClick={editSpec}>Confirm</button>
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
          "Content-Type":"application/json",
          "Authorization": `Bearer ${userData?.token}`,
        },
        body: JSON.stringify(paperToEdit),
      })
     
      .then(res=>{
        if(res.ok){
          alert("Paper Edited Successfully");
          window.location.reload();
        }else alert("Failed To Edit Paper Please Try Again Later")
      })
    }

    if (!props.show) return null;

    return (
      <div
       className="modal-overlay2"
      >
        <div
         className="modal2"
        >
          <div className="ContExitbtn"  onClick={props.onClose}>
            <div class="outer">
              <div class="inner">
                <label className="label2">Exit</label>
              </div>
            </div>
          </div>

          <h1 className="headContact2">Only Change The Fields You Want To Edit</h1>
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



  return (
    <div className="ParentHeadData">
      <Header userData={userData} />
      <div className="profile-header" style={{ marginTop: "130px" }}>
        <div className="imageProfDiv">
          <img src={kariem} alt="Profile" className="profile-image" />
          {researcherData && (
            <p className="nameUser">{researcherData?.specality?.name}</p>
          )}
          {userData.roles === "Researcher" &&
            userData?.userId === studentId && (
              <p
                onClick={() => setShowSpecCard(true)}
                style={{ fontSize: "12px", color: "blue", cursor: "pointer" }}
                className="nameUser"
              >
                Edit
              </p>
            )}
          {showSpecCard && (
            <SpecCard
              show={showSpecCard}
              onClose={() => setShowSpecCard(false)}
            />
          )}
        </div>
        <div className="profile-details">
          <h1 className="profile-name">
            {studentData?.firstName + " " + studentData?.lastName}
          </h1>
          <p className="profile-bio">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis
            beatae non rerum ab es.
          </p>
          <div className="social-icons">
            <a href="#">
              <FaInstagram />
            </a>
            <a href="#">
              <FaFacebook />
            </a>
            <a href="#">
              <FaTwitter />
            </a>
          </div>
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

      <div className="badgesAndPoints">
        <div className="badgesContainer">
          <h1>Badges</h1>
          <div className="badgesDiv">
            {researcherData?.badges.map((b) => {
              return <BadgeName b={b} />;
            })}
          </div>
        </div>

        <div className="pointsContainer">
          <h1>{`Points : ` + researcherData?.points}</h1>
          <div className="pointsDiv">
            <li
              className="profileBeg"
              style={{
                backgroundColor: researcherData?.level === 0 ? "gray" : "",
              }}
            >
              Beginner (0-2) Points
            </li>
            <li
              className="profileInter"
              style={{
                backgroundColor: researcherData?.level === 1 ? "gray" : "",
              }}
            >
              Intermediate (2-6) Points
            </li>
            <li
              className="profileExp"
              style={{
                backgroundColor: researcherData?.level >= 2 ? "gray" : "",
              }}
            >
              Expert (6{"<"}points)
            </li>
          </div>
        </div>
      </div>

      <div className="DataForLeftRight">
        {userData?.userId === studentId && (
          <div className="leftBox">
            <h1>Enrolled Courses</h1>
            <div>
              <WatchedCourse />
              <WatchedCourse />
              <WatchedCourse />
              <WatchedCourse />
            </div>
          </div>
        )}
        <div className="RightBox">
          <h1>Ideas</h1>
          <div className="tasksDiv">
            <Task />
            <Task />
            <Task />
            <Task />
            <Task />
          </div>
        </div>
      </div>

      {userData.roles === "Researcher" || userData.roles==='Admin' && (
        <div
          style={{
            color: "white",
            display: "flex",
            flexDirection: "column",
            padding: "20px",
            alignItems: "center",
            gap: "40px",
          }}
        >
          <h1>Papers</h1>
          <div
            style={{
              display: "flex",
              gap: "40px",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {researcherData?.papers?.map((paper) => {
              return (
                <div className="ContCardPaper">
                  {/* <PaperCardInProfile paper={paper}/> */}
                  <div>
                    <img src={paperPhoto} alt="paper" />
                  </div>
                  <div className="ContDataInCardPaper">
                    <p className="custom-scrollbar">{"Paper Name : " + paper?.name}</p>
                    <p className="custom-scrollbar">{"Paper citation : " + paper?.citation}</p>
                    <p className="custom-scrollbar">{"Paper url : " + paper?.url}</p>
                  </div>
                  <div className="Contbtns">
                    {userData?.userId === studentId && (
                      <button
                        className="editPaperbtn"
                        onClick={() => {
                          setShowEditPaper(true);
                          setPaperData(paper);
                        }}
                      >
                        Edit Paper
                      </button>
                    )}
                    {userData?.userId === studentId && (
                      <button className="deletePaperbtn">Delete Paper</button>
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
            {resInvits?.map((i,index) => {
              return (
                <div className="ContainerreauestWithBtn">
                  <p>Invitation {index+1}</p>
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
            <div className="ContAllRequestss">
            {resReqs?.map((r,index) => {
              return (
                <div className="ContainerreauestWithBtn">
                  <p>Request {index+1}</p>
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
          <div className="ContAllRequests">
          {expertReqs?.map((req) => {
            return (
              <div className="ContAllWithbtn">
                <div className="photoRequst">
                  <img src={request} alt="photo" />
                </div>
                <div className="ContainerInfoWithbtn">
                  <div className="ContTitleAndContent">
                    <p>{req.title}</p>
                    <p className="contentData">{req.content}</p>
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
      {userData.userId===studentId&&
      <div style={{color:'white'}}>
        <h1>Admin Reponses</h1>
        {adminReponse?.map(res=>{
          return(
            <div style={{border:'2px solid white'}}>
              <span>Problem :</span>
              <h5>{res.problem.description}</h5>
              <span>Admin Response :</span>
              <h5>{res.message}</h5>
            </div>
          )
        })}
      </div>
      }
    </div>
  );
};

export default Profile;
