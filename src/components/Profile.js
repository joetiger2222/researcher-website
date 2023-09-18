import React, { useEffect,useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import kariem from "../images/userImg.png";
import { useState } from "react";
import "../css/Modal.css";
import "../css/Profile.css";
import Header from "./Header";
import ModalEditProfile from "./ModalEditProfile";
import { FaCheckCircle } from "react-icons/fa";
import request from "../images/request.png";
import Swal from "sweetalert2";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { MdOutlineFileUpload } from "react-icons/md";
import { MdCameraAlt } from "react-icons/md";
import user from "../images/useer.png";
import Footer from "./Footer";
import { useContext } from "react";
import { MyContext } from '../Users/Redux';
import SideBar from "./SideBar";
import loader from '../loader.gif';
import { FaPaperPlane } from "react-icons/fa";
import { HubConnectionBuilder } from "@microsoft/signalr";
const Profile = () => {
  const [load,setLoad]=useState(false);
  const [sideBarVisible, setSideBarVisible] = useState(false);
  const userData = useContext(MyContext);
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
  const { studentId } = useParams();
  const [studentImage,setStuddentImage]=useState('');
  const [showChatModal,setShowChatModal]=useState(false);
  const navigate = useNavigate();
  


  function renderSideBar() {
    if (sideBarVisible) {
      return <SideBar />;
    }
  }

  function renderSideBarIcon() {
    if (sideBarVisible) {
      return (
        <svg
          className="closeSvg"
          stroke="currentColor"
          fill="black"
          stroke-width="0"
          viewBox="0 0 24 24"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g>
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"></path>
          </g>
        </svg>
      );
    } else {
      return (
        <svg
        style={{zIndex:'300'}}
          className="closeSvg"
          stroke="currentColor"
          fill="black"
          stroke-width="0"
          viewBox="0 0 24 24"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      );
    }
  }



  function getStudentData() {
    fetch(`https://resweb-001-site1.htempurl.com/api/Students/${studentId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData?.token}`,
      },
    })
      .then((res) =>
        res.ok ? res.json() : null
      )
      .then((data) => {
        if (data) {
          setStudentData(data);
          getResearcherId(data.id);
        }
      });
  }




  function getStudentImage(){
    fetch(`https://resweb-001-site1.htempurl.com/api/Students/Image/${studentId}`,{
      method:"GET",
      headers:{
        "Authorization":`Bearer ${userData.token}`
      }
    })
    .then(res=>{
      if(res.ok){
        return res.blob();
      }else {
        setStuddentImage(kariem);
      }
    }).then(blob=>{
      const image = URL.createObjectURL(blob);
      setStuddentImage(image);
    }).catch(e=>{
      setStuddentImage(kariem);
    })
    
  }







  function getResearcherId(studentId) {
    fetch(`https://resweb-001-site1.htempurl.com/api/Researchers/ResearcherId/${studentId}`, {
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
    fetch(`https://resweb-001-site1.htempurl.com/api/Researchers/${resId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData?.token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => (data ? setResearcherData(data) : null));
  }

  function getResInvitations(resId) {
    fetch(`https://resweb-001-site1.htempurl.com/api/Researchers/Invitations/${resId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData?.token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => (data ? setResInvits(data) : null));
  }

  function getResReqs(resId) {
    fetch(`https://resweb-001-site1.htempurl.com/api/Researchers/Requests/${resId}`, {
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
      `https://resweb-001-site1.htempurl.com/api/Researchers/Ideas/ExpertRequests/${resId}`,
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
    fetch(`https://resweb-001-site1.htempurl.com/api/Students/Responses/${studentId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => (data ? setAdminResponse(data) : null));
  }

  function getResearcherIdeas(resId) {
    fetch(`https://resweb-001-site1.htempurl.com/api/Researchers/Ideas/${resId}`, {
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

  

  function getStudentCourses(){
    fetch(`https://resweb-001-site1.htempurl.com/api/Students/Courses?studentId=${studentId}`,{
      method:"GET",
      headers:{
        "Authorization":`Bearer ${userData.token}`,
      }
    })
    .then(res=>res.ok?res.json():null)
    .then(data=>data?setStudentCourses(data):null)
  }


  function deleteRes(resId){
    Swal.fire({
      title: "Are You Sure To Delete The Response",
      showCancelButton: true,
    }).then(data=>{
      if(data.isConfirmed){
        fetch(`https://resweb-001-site1.htempurl.com/api/Students/responseId?responseId=${resId}`,{
          method:"DELETE",
          headers:{
            "Authorization":`Bearer ${userData.token}`
          }
        })
        .then(res=>{
          if(res.ok){
            toastr.success('Response Deleted Successfully');
            getAdminResponse();
          }else{
            toastr.error('Failed To Delete Response Please Try Again Later')
          }
        })
      }
    })
    
  }


  useEffect(() => {
    if(userData.userId!==''){
    getStudentData();
    getStudentCourses();
    }
    if (userData?.userId === studentId) getAdminResponse();
    if(userData?.userId!==studentId){
      getStudentImage();
    }
  }, [studentId,userData]);

  function rejectInvite(i) {
    fetch(
      `https://resweb-001-site1.htempurl.com/api/Ideas/RejectInvitation/${i.id}/${i.researcherId}`,
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
      `https://resweb-001-site1.htempurl.com/api/Ideas/AcceptInvitations/${i.id}/${i.researcherId}`,
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
        `https://resweb-001-site1.htempurl.com/api/Researchers/Papers/${researcherData?.id}`,
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
      fetch(`https://resweb-001-site1.htempurl.com/api/Researchers/Specialties`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
        .then((res) =>
          res.ok ? res.json() : null
        )
        .then((data) => (data ? setAllSpecs(data) : null));
    }

    useEffect(() => {
      getAllSpecs();
    }, []);

    function editSpec() {
      fetch(
        `https://resweb-001-site1.htempurl.com/api/Researchers/Speciality/${userData.resercherId}/${newSpec}`,
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
        <div className="modal2" style={{height:"300px"}}>
          <div className="ContExitbtn" onClick={props.onClose}>
            <div class="outer">
              <div class="inner">
                <label className="label2">Exit</label>
              </div>
            </div>
          </div>
          <h1 className="headContact2">Choose Speciality</h1>
          <div className="FormModal2" style={{justifyContent:"space-between",height:"100%"}}>
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
   
    const [paperToEdit, setPaperToEdit] = useState({
      name: paperData.name,
      citation: paperData.citation,
      url: paperData.url,
    });


    function getPaperDataToEdit(e) {
      setPaperToEdit((prev) => {
        return {
          ...prev,
          [e.target.name]: e.target.value,
        };
      });
    }

    function editPaper() {
      fetch(`https://resweb-001-site1.htempurl.com/api/Researchers/Papers/${paperData.id}`, {
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
        title: "Are You Sure To Delete The Paper",
        showCancelButton: true,
      }).then((data) => {
        if (data.isConfirmed) {
          fetch(
            `https://resweb-001-site1.htempurl.com/api/Researchers/Papers/${props.paper.id}`,
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
        <div className="modal2" style={{height:"200px"}}>
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

    

    function getEditData(e) {
      setEditData((prev) => {
        return { ...prev, [e.target.name]: e.target.value };
      });
    }

    function getAllNationalities() {
      fetch(`https://resweb-001-site1.htempurl.com/api/Students/Nationalites`)
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
      setLoad(true)
      fetch(
        `https://resweb-001-site1.htempurl.com/api/Students/studentId?studentId=${studentId}`,
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
        } else{
          toastr.error(
            "Failed To Update Data Please Try Again Later",
            "Failed"
          );
          setLoad(false)
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

  // console.log(userData.studentImage)

  const EditImageCard = (props) => {
    const [photo, setPhoto] = useState(null);
  

    function editPhoto() {
      setLoad(true)
      const formData = new FormData();
      formData.append("file", photo, photo.name);

      fetch(
        `https://resweb-001-site1.htempurl.com/api/Students/UploadImage?userId=${userData.userId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
          body: formData,
        }
      ).then((res) => {
        if (res.ok) {
          userData.setStudentImage('');
          setLoad(false)
          props.onClose();
         

        } else {
        toastr.error("failed to update photo", "Failed");
        setLoad(false)
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
  



  const PrivateChatCard = (props) => {
    console.log(props)
    const [messageToSend, setMessageToSend] = useState({
      content: "",
      date: new Date().toISOString(),
      senderId:userData.userId,
      reciverId:props.otherPersonId,
    });
    const [AllMessages, setAllMessages] = useState([]);
    // const otherPersonData=researchers.filter(res=>res.studentObj.id===props.otherPersonId)
    
    
    const latestChat = useRef(null);

    latestChat.current = AllMessages;


let counter=1;
    function getMyMessages() {
      if(counter===1){
      fetch(`https://resweb-001-site1.htempurl.com/api/Chat/Private?senderId=${userData.userId}&reciverId=${props.otherPersonId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
        .then((res) => res.ok?res.json():toastr.error('failed to load your messages',"Failed"))

        .then(data=>{
          
          setAllMessages(prev => [...prev, ...data]);
        })
        
    }
    counter=0;
    }


    let otherCounter=1;
    function getOtherMessages() {
      if(otherCounter===1){
      fetch(`https://resweb-001-site1.htempurl.com/api/Chat/Private?senderId=${props.otherPersonId}&reciverId=${userData.userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
        .then((res) => res.ok?res.json():toastr.error('failed to load your messages',"Failed"))

        .then(data=>{

          setAllMessages(prev => [...prev, ...data]);
        })
        
    }
    otherCounter=0;
    }



    AllMessages.sort((a, b) => new Date(a.date) - new Date(b.date));

    useEffect(() => {
      const connection = new HubConnectionBuilder()
        .withUrl("https://resweb-001-site1.htempurl.com/hubs/Privatechat")
        .withAutomaticReconnect()
        .build();

      connection
        .start()
        .then((result) => {
          connection.on("ReceivePrivate", (message) => {
            
            const updatedChat = [...latestChat.current];
            updatedChat.push(message);
            setAllMessages(updatedChat);
          });
        })
        .catch((e) => console.log("Connection failed: ", e));
    }, []);

    useEffect(() => {
      getMyMessages();
      getOtherMessages();
    }, []);



    const chatWindowRef = useRef(null);

    function scrollToBottom() {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }

    useEffect(() => {
      scrollToBottom();
    }, [AllMessages]);



    const sendMessage = async (e) => {
      e.preventDefault();
      if(messageToSend.content===''){
        toastr.error('Please Enter A Valid Message');
        return;
      }
      const chatMessage = {
        content: messageToSend.content,
        date: new Date().toISOString(),
        senderId:userData.userId,
        reciverId:props.otherPersonId,
      };
      

      try {
        await fetch(
          `https://resweb-001-site1.htempurl.com/api/Chat/Private`,
          {
            method: "POST",
            body: JSON.stringify(chatMessage),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userData.token}`,
            },
          }
        ).then((response) => setMessageToSend(prev=>{return {...prev,content:''}}));
      } catch (e) {}
    };




    if (!props.show) return null;
    return (
      <div className="modal-overlay2">
        <div className="modal2">
          <div style={{display: "flex",justifyContent: "space-between",width: "100%",margin: "0 0 10px"}} onClick={props.onClose}>
           
            <span style={{fontWeight:"bold"}}>{studentData?.firstName + " " + studentData?.lastName}</span>
            <div class="outer">
              <div class="inner">
                <label className="label2">Exit</label>
              </div>
            </div>
          </div>
          <div className="ContAllDataWithInput">
            <div
            ref={chatWindowRef}
              className="custom-scrollbar"
              style={{
                alignItems: "flex-start",
                width: "80%",
                padding: "20px",
                gap: "20px",
                height: "240px",
                overflow: "auto",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {AllMessages?.map((message) => {
                return (
                  <div style={{ gap:"5px",display:"flex",flexDirection:"column",alignSelf:message.senderId===userData.userId?'flex-end':null }}>
                    <p style={{padding:"8px",backgroundColor:"rgb(213,213,213)"}} className="borderR spanChat">{message.content}</p>
                  </div>
                );
              })}
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >

              <form
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "80%",
                  border: "2px solid var(--darkgreen-color)",
                  alignSelf: "center",
                  // margin: " 1px 0 20px 0",
                  columnGap: "7px",
                  borderRadius: "20px",
                }}
                onSubmit={sendMessage}
              >                
                <input
                  className="InputChat"
                  name="content"
                  placeholder="Enter Your Message"
                  value={messageToSend.content}
                  onChange={(e) =>
                    setMessageToSend((prev) => {
                      return { ...prev, [e.target.name]: e.target.value };
                    })
                  }
                ></input>
                <div className="DivContChatIcon">
                  <button
                    style={{ backgroundColor: "transparent", border: "none" }}
                  >
                    <FaPaperPlane
                      className="sendIcon"
                      style={{
                        width: "20px",
                        height: "20px",
                        color: "var(--darkgreen-color)",
                        cursor: "pointer",
                      }}
                    />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };








  if(userData.userId===''){
    return (
      <div style={{display:'flex',width:'100%',minHeight:'100vh',justifyContent:'center',alignItems:'center',flexDirection:'column',rowGap:'20px'}}>
        <h1>Please Login First</h1>
        <button style={{width:'120px',height:'50px',borderRadius:'10px',backgroundColor:'rgb(21, 46, 125)',color:'white',fontSize:'20px',fontWeight:'bold'}} onClick={()=>navigate('/Login')}>Login</button>
      </div>
    )
  }

  if(load){
    return(
      <div style={{width:'100%',minHeight:'100vh',display:'flex',justifyContent:'center',alignItems:'center',backgroundColor:'white'}}>
        <img src={loader} />
      </div>
    )
  }



  return (
    <div className="ParentHeadData">
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
      <div className="ContainerAllContentProfile">
      <div className="profile-header" style={{ marginTop: "130px" }}>
        <div className="imageProfDiv">
          <div className="image-container">
            {userData.studentImage===''&&userData.userId===studentId&&<img src={loader} />}
            {studentImage===''&&userData.userId!==studentId&&<img src={loader} />}
            {userData.studentImage!==''&&userData.userId===studentId&&<img
              src={userData.userId===studentId?userData.studentImage:studentImage}
              alt="Profile"
              className="profile-image"
              style={{boxShadow:'0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}}
            />}
            {studentImage!==''&&userData.userId!==studentId&&<img
              src={userData.userId===studentId?userData.studentImage:studentImage}
              alt="Profile"
              className="profile-image"
              style={{boxShadow:'0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}}
            />}

            {userData.userId===studentId&&<div className="button-container">
              {userData?.userId === studentId && (
                <p onClick={() => setShowImageCard(true)} className="">
                  <MdCameraAlt /> <span>Change Picture</span>
                </p>
              )}
            </div>}
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
                Edit Profile Data
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
              {userData.roles === "Researcher" &&
              userData?.userId !== studentId && (
                <p
                  onClick={() => setShowChatModal(true)}
                  className="detailsbtn"
                >
                  CHAT
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
            {studentData? studentData?.firstName + " " + studentData?.lastName:'Loading...'}
            {studentData?.isMentor && <FaCheckCircle />}
          </h1>
          <p className="profile-bio">
            {studentData?studentData?.bio?"Bio : "+studentData?.bio:'Bio : ':'Loading...'}
          </p>
          {/* <p className="profile-bio">
            {studentData?studentData?.googleSchoolerLink?"Google Schooler Link : "+studentData?.googleSchoolerLink:'Google Schooler Link :':'Loading...'}
          </p> */}
          <a style={{textDecoration:'none'}} className="profile-bio" href={studentData?.googleSchoolerLink!==''?studentData?.googleSchoolerLink:null} target="_blank">{studentData?studentData?.googleSchoolerLink?"Google Schooler Link : "+studentData?.googleSchoolerLink:'Google Schooler Link :':'Loading...'}</a>
          
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
          <h1>Badges Of Passed Skills</h1>
          <div className="badgesDiv custom-scrollbar">
            {studentData?.badges.map(badge=>{
              return (
                <div className="badge">
              <h4>{badge.name}</h4>
            </div>
              )
            })}
            {/* <div className="badge">
              <h4>Medical Coding</h4>
            </div> */}
            
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
                <div className="watchedCourse" onClick={()=>navigate(`/CourseDetails/${course.id}`,{state:{data:course}})}>
              <h4>{course.name}</h4>
              
            </div>
              )
            })}
          </div>
        </div>
      </div>
</div>
      

      {researcherIdeas.length > 0 && (
        <div className="ContainerAllIdeas">
          <h1 style={{ color: "black" }}>Ideas</h1>

          <div className="AllIdeas custom-scrollbar" style={{maxHeight:"400px",overflow:"auto",padding:"20px",width:"90%"}}>
            {researcherIdeas?.length > 0 ? (
              researcherIdeas?.map((idea, index) => {
                return (
                  <div
                    onClick={() =>
                      navigate(`/Idea/${idea.id}`)
                    }
                    className="CardInAllIdeas"

                    style={{ cursor: "pointer",height:"350px",justifyContent:"flex-start" }}
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
                          display:"flex",
                          alignItems:"center"
                        }}
                      >
                        topic:{" "}
                        <span style={{borderBottom: "none", fontWeight: "bold" }}>
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
                      <p style={{display:"flex",flexDirection:"column",gap:"10px"}} className="custom-scrollbar">
                        <span style={{fontWeight:"bold"}}>Paper Name :</span> <span>{paper?.name}</span>
                      </p>
                      <p style={{display:"flex",flexDirection:"column",gap:"10px"}} className="custom-scrollbar">
                        <span style={{fontWeight:"bold"}}>Paper citation :</span><span>{paper?.citation}</span>
                      </p>
                      <p style={{display:"flex",flexDirection:"column",gap:"10px"}} className="custom-scrollbar">
                        <span style={{fontWeight:"bold"}}>Paper url :</span><a target="_blank" href={paper?.url}>{paper?.url}</a>
                        
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
                      navigate(`/Idea/${i.ideaId}`)
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
                        navigate(`/Idea/${r.ideaId}`)
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
                          navigate(`/idea/${req.ideaId}`)
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
                   style={{height:"200px",justifyContent:"space-between",width:"280px"}}
                  className="CardInAllIdeas"
                >
                  <div style={{display:'flex',flexDirection:'column'}}>
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
                  <button className="buttonExit2" onClick={()=>deleteRes(res.id)}>Delete</button>
                </div>
              );
            })}
          </div>
        </div>
      )}
      </div>
      <Footer userData={userData}/>
      {showChatModal&&<PrivateChatCard otherPersonId={studentId} show={showChatModal} onClose={()=>setShowChatModal(false)} />}
    </div>
  );
          
          
};

export default Profile;
