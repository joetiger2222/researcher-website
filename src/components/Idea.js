import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import "../css/Paper.css";
import "../css/Idea.css";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { BiChat } from "react-icons/bi";
import { FaPaperPlane } from "react-icons/fa";
import { FaCrown } from "react-icons/fa";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { MdOutlineFileUpload } from "react-icons/md";
import Footer from "./Footer";
import { useContext } from "react";
import { MyContext } from '../Users/Redux';
import SideBar from "./SideBar";
import loader from '../loader.gif';
export default function Idea() {
  const [load,setLoad]=useState(false);
  const userData = useContext(MyContext);
  const [sideBarVisible, setSideBarVisible] = useState(false);
  const { ideaId } = useParams();
  const [idea, setIdea] = useState(null);
  const [ideaReqs, setIdeaReqs] = useState(null);
  const [resReqsData, setResReqsData] = useState([]);
  const [showResModal, setShowResModal] = useState(false);
  const [showTaskCard, setShowTaskCard] = useState(false);
  const [ideaPar, setIdeaPar] = useState(null);
  const [tasks, setTasks] = useState(null);
  const [isPart, setIsPart] = useState(false);
  const [ideaChatPart, setIdeaChatPart] = useState(false);
  const [showExpertReqModal, setShowExpertReqModal] = useState(false);
  const [showAssignParticpantToTask, setShowAssingParticpantToTask] =
    useState(false);
  const [choosenTask, setChoosenTask] = useState(null);
  const [showTaskParticpants, setShowTaskParticpants] = useState(false);
  const [showIdeaChat, setShowIdeaChat] = useState(false);
  const [showTaskChat, setShowTaskChat] = useState(false);
  const [showUploadFile, setShowUploadFile] = useState(false);
  const [showIdeaFiles, setShowIdeaFiles] = useState(false);
  const [showTaskUploadDocument, setShowTaskUploadDocuemnt] = useState(false);
  const [showTaskDocuments, setShowTaskDocuments] = useState(false);
  const [showUpdateProgress, setShowUpdateProgress] = useState(false);
  const navigate = useNavigate();
  const creator =
    userData.roles === "Admin"
      ? true
      : userData?.resercherId.toLowerCase() === idea?.creatorId;

  function getIdeaData() {
    setLoad(true)
    fetch(`https://resweb-001-site1.htempurl.com/api/Ideas/SingleIdea/${ideaId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData?.token}`,
      },
    })
      // .then((res) =>
      //   res.ok ? res.json() : null
      // )
      .then(res=>{
        setLoad(false)
        if(res.ok){
          return res.json();
        }
      })
      .then((data) => (data ? setIdea(data) : null));
  }

  let counter = 1;
  function getIdeaReqs() {
    if (counter === 1) {
      fetch(`https://resweb-001-site1.htempurl.com/api/Ideas/Requests/${ideaId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData?.token}`,
        },
      })
        .then((res) =>
          res.ok ? res.json() : toastr.error("failed to load reqs", "Failed")
        )
        .then((data) => {
          if (data) {
            setIdeaReqs(data);
            for (let i = 0; i < data.length; i++) {
              getResearcherData(data[i].researcherId);
            }
          }
        });
    }
    counter = 50;
  }

  useEffect(() => {
    getIdeaData();
    getIdeaReqs();
    getParticaptns();
    getTasks();
    toastr.options = {
      positionClass: "toast-top-center",
    };
  }, [userData]);





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











  function getResearcherData(resId) {
    fetch(`https://resweb-001-site1.htempurl.com/api/Researchers/${resId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData?.token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) =>
        data
          ? setResReqsData((prev) => {
              return [...prev, data];
            })
          : null
      );
  }

  function acceptReq(resId) {
    const filterData = ideaReqs.find((req) => req.researcherId === resId);

    fetch(
      `https://resweb-001-site1.htempurl.com/api/Ideas/Requests/AcceptRequest/${filterData.id}/${filterData.researcherId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userData.token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) =>
        res.ok
          ? setResReqsData(resReqsData.filter((res) => res.id !== resId))
          : null
      )
      
  }

  function rejectReq(resId) {
    const filterData = ideaReqs.find((req) => req.researcherId === resId);
    fetch(`https://resweb-001-site1.htempurl.com/api/Ideas/Requests/${filterData.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    })
      .then((res) =>
        res.ok
          ? setResReqsData(resReqsData.filter((res) => res.id !== resId))
          : null
      )
      
  }

  function getParticaptns() {
    fetch(`https://resweb-001-site1.htempurl.com/api/Ideas/Participants/${ideaId}`, {
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
          setIdeaPar(data);
          const filter = data.filter(
            (par) => par.id === userData.resercherId.toLowerCase()
          );

          if (filter.length > 0 && filter[0].points > 3) setIsPart(true);
          if (filter.length > 0) setIdeaChatPart(true);
        }
      });
  }

  function getTasks() {
    fetch(`https://resweb-001-site1.htempurl.com/api/Ideas/Tasks/AllTasks/${ideaId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData?.token}`,
      },
    })
      .then((res) =>
        res.ok ? res.json() : null
      )
      .then((data) => (data ? setTasks(data) : null));
  }

  

  const AllResCard = (props) => {
    const [ress, setRess] = useState(null);
    const [search, setSearch] = useState("");

    function getAllRess() {
      fetch(`https://resweb-001-site1.htempurl.com/api/Researchers?SearchTerm=${search}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
        .then((res) =>
          res.ok
            ? res.json()
            : null
        )
        .then((data) => (data ? setRess(data) : null));
    }
    useEffect(() => {
      getAllRess();
    }, [search]);

    function sendInvitation(resId) {
      let invits = [];
      invits.push(resId);
      fetch(
        `https://resweb-001-site1.htempurl.com/api/Ideas/Invitations/SendInvitations/${ideaId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userData.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(invits),
        }
      ).then((res) =>
        res.ok
          ? toastr.success("Invitation Sent Successfully", "Success")
          : null
      );
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
          <h1 className="headContact2">All Researchers</h1>
          <div className="FormModal2" style={{justifyContent:"space-around",height:"100%"}}>
          <div style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <input
          placeholder="Search Name"
          className="search-input"
            name="search"
            onChange={(e) => setSearch(e.target.value)}
          ></input>
          </div>
          

          <div style={{maxHeight:"172px"}}  className="ContInviteResearchers custom-scrollbar">
            {ress
              ?.filter((res) => !ideaPar.some((par) => par.id === res.id))
              .map((res) => {
                return (
                  <div style={{justifyContent:"center",flexDirection:"row"}} className="DivContResearchers">
                    <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                      {res?.studentObj.firstName +
                        " " +
                        res?.studentObj.lastName}
                    </span>
                    <button
                      className="plusBtn"
                      onClick={() =>
                        navigate(`/Profile/${res?.studentObj.id}`)
                      }
                    >
                      View Profile
                    </button>
                    <button
                      className="bn54"
                      onClick={() => sendInvitation(res.id)}
                    >
                      Invite
                    </button>
                  </div>
                );
              })}
          </div>
          <div className="resetAndCancel2">
            <button className="buttonExit2" onClick={props.onClose}>
              Cancel
            </button>
          </div>
          </div>
         
         
        </div>
      </div>
    );
  };

  const CreateTaskCard = (props) => {
    const [taskData, setTaskData] = useState({
      name: "",
      participantsNumber: 0,
      description: "",
      deadline: "",
    });

    function getTaskData(e) {
      setTaskData((prev) => {
        return {
          ...prev,
          [e.target.name]: e.target.value,
        };
      });
    }

    function createfTask(e) {
      e.preventDefault();
      const currentYear = new Date().getFullYear();
const futureYearLimit = currentYear + 10; // You can adjust the limit as needed

const yearRangeRegex = new RegExp(
  `^(${currentYear}|${Array.from({ length: futureYearLimit - currentYear }, (_, i) => currentYear + i + 1).join('|')})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])$`
);

const val = yearRangeRegex.test(taskData.deadline);
      if (val) {
        setLoad(true)
        fetch(
          `https://resweb-001-site1.htempurl.com/api/Ideas/Tasks/InitiateTask/${ideaId}/${userData.resercherId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userData?.token}`,
            },
            body: JSON.stringify(taskData),
          }
        )
          .then((response) => {
            setLoad(false)
            const reader = response.body.getReader();
            let chunks = [];

            function readStream() {
              return reader.read().then(({ done, value }) => {
                if (done) {
                  return chunks;
                }
                chunks.push(value);
                return readStream();
              });
            }

            if (!response.ok) {
              return readStream().then((chunks) => {
                const body = new TextDecoder().decode(
                  new Uint8Array(chunks.flatMap((chunk) => Array.from(chunk)))
                );
                toastr.error(body);
              });
            } else {
              window.location.reload();
            }
          })
          .catch((error) => console.error(error));
      } else toastr.error("please enter a valid deadline yyyy-mm-dd", "Error");
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
          <h1 className="headContact2">Create New Task</h1>

          <form className="FormModal2" onSubmit={createfTask}>
            <label className="AllLabeles">Task Name: </label>
            <input
            required
              className="InputModalHallDetails"
              onChange={getTaskData}
              name="name"
            ></input>
            <label className="AllLabeles">participants Number: </label>
            <input
            type="number"
            min={1}
            required
              className="InputModalHallDetails"
              onChange={(e) =>
                setTaskData((prev) => {
                  return { ...prev, participantsNumber: e.target.value * 1 };
                })
              }
              name="participantsNumber"
            ></input>
            <label className="AllLabeles">description: </label>
            <input
            required
              className="InputModalHallDetails"
              onChange={getTaskData}
              name="description"
            ></input>
            <label className="AllLabeles">deadline</label>
            <input
            required
              className="InputModalHallDetails"
              type="text"
              name="deadline"
              onChange={getTaskData}
              placeholder="yyyy-mm-dd"
            ></input>
            <div className="buttonsOnModal">
              <button type="submit" >Create</button>
              <button onClick={props.onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const SendExpertReqCard = (props) => {
    const [expertReqData, setExpterReqData] = useState({
      title: "",
      content: "",
      ideaId: ideaId,
      participantId: userData.resercherId,
    });

    function getExpterReqData(e) {
      setExpterReqData((prev) => {
        return {
          ...prev,
          [e.target.name]: e.target.value,
        };
      });
    }

    function sendExpertReq() {
      setLoad(true)
      fetch(`https://resweb-001-site1.htempurl.com/api/Researchers/Ideas/ExpertRequest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify(expertReqData),
      })
        // .then(res=>res.ok?alert('Expert Request Sent Successfully'):alert('Failed To Send Please Try Again Later'))
        .then((res) => {
          setLoad(false)
          if (res.ok) {
            toastr.success("Expert Request Sent Successfully", "Success");
            props.onClose();
          } else
            toastr.error("Failed To Send Please Try Again Later", "Failed");
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
          <h1 className="headContact2">Create Expert Req</h1>
          <div className="FormModal2" style={{height:"100%",maxHeight:"330px",justifyContent:"space-evenly"}}>
            <label className="AllLabeles">TITLE : </label>
            <input
              className="InputModalHallDetails"
              name="title"
              onChange={getExpterReqData}
            ></input>

            <label className="AllLabeles">CONTENT : </label>
            <input
              className="InputModalHallDetails"
              name="content"
              onChange={getExpterReqData}
            ></input>
            <div className="buttonsOnModal">
              {expertReqData.title && expertReqData.content && (
                <button onClick={sendExpertReq}>Submit</button>
              )}
              <button onClick={props.onClose}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AssignParticpantToTask = (props) => {
    function assignToTask(id) {
      
      let data = [];
      data.push(id);
      setLoad(true)
      fetch(
        `https://resweb-001-site1.htempurl.com/api/Ideas/Tasks/Participants/${props.task.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
          body: JSON.stringify(data),
        }
      )
        .then((response) => {
          setLoad(false)
          const reader = response.body.getReader();
          let chunks = [];

          function readStream() {
            return reader.read().then(({ done, value }) => {
              if (done) {
                return chunks;
              }
              chunks.push(value);
              return readStream();
            });
          }

          if (!response.ok) {
            return readStream().then((chunks) => {
              const body = new TextDecoder().decode(
                new Uint8Array(chunks.flatMap((chunk) => Array.from(chunk)))
              );
              toastr.error(body);
            });
          } else toastr.success("Particpant Assigned Successfully", "Success");

          return readStream().then((chunks) => {
            const body = new TextDecoder().decode(
              new Uint8Array(chunks.flatMap((chunk) => Array.from(chunk)))
            );
            
          });
        })
        .catch((error) => console.error(error));
    }

    if (!props.show) return null;
    return (
      <div className="modal-overlay2">
        <div className="modal2">
          <div class="ContExitbtn">
            <div className="outer" onClick={props.onClose}>
              <div className="inner">
                <label className="label2">Exit</label>
              </div>
            </div>
          </div>
          <h1 class="headContact2">Assign Participants</h1>
          <div className="ContInviteResearchers custom-scrollbar" style={{maxHeight:"300px",height:"300px"}}>
            {ideaPar?.map((par) => {
              return (
                <div className="DivContResearchers2">
                  <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                    {par?.studentObj.firstName + " " + par?.studentObj.lastName}
                  </span>
                  <button
                    className="plusBtn"
                    onClick={() =>
                      navigate(`/profile/${par.studentObj.id}`)
                    }
                  >
                    View Profile
                  </button>
                  <button className="bn54" onClick={() => assignToTask(par.id)}>
                    Assign To Task
                  </button>
                </div>
              );
            })}
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <button className="buttonExit2" onClick={props.onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const TaskParticpantsCard = (props) => {
    const [taskParticpants, setTaskParticpants] = useState(null);

    function getTaskParticpants() {
      fetch(
        `https://resweb-001-site1.htempurl.com/api/Ideas/Tasks/Participants/${props.task.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      )
        .then((res) =>
          res.ok
            ? res.json()
            : toastr.error("failed to load particpants to task", "Failed")
        )
        .then((data) => (data ? setTaskParticpants(data) : null));
    }

    useEffect(() => {
      getTaskParticpants();
    }, []);

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
          <h1 className="headContact2">Task Participants</h1>
          <div className="ContInviteResearchers custom-scrollbar" style={{maxHeight:"300px",height:"300px"}}>
            {taskParticpants?.map((par) => {
              return (
                <div className="DivContResearchers1">
                  <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                    {par.studentObj.firstName + " "}
                    {par.studentObj.lastName}
                  </span>

                  <button
                    className="plusBtn"
                    onClick={() =>
                      navigate(`/Profile/${par.studentObj.id}`)
                    }
                  >
                    View Profile
                  </button>
                </div>
              );
            })}
           
          </div>
          <button className="buttonExit2" onClick={props.onClose}>
              Close
            </button>
        </div>
      </div>
    );
  };

  const IdeaChat = (props) => {
    const [messageToSend, setMessageToSend] = useState({
      content: "",
      date: new Date().toISOString(),
      researcherId: userData.roles === "Researcher" ? userData.resercherId : "",
    });

    const [ideaMessages, setIdeaMessages] = useState([]);
    const latestChat = useRef(null);

    latestChat.current = ideaMessages;

    let counter = 1;
    function getMessages() {
      if (counter === 1) {
        fetch(`https://resweb-001-site1.htempurl.com/api/Chat/Discussion/${ideaId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => setIdeaMessages(data));
      }
      counter = 0;
    }

    ideaMessages.sort((a, b) => new Date(a.date) - new Date(b.date));

    useEffect(() => {
      const connection = new HubConnectionBuilder()
        .withUrl("https://resweb-001-site1.htempurl.com/hubs/discussion")
        .withAutomaticReconnect()
        .build();

      connection
        .start()
        .then((result) => {
          connection.on("ReceiveMessage", (message) => {
            const updatedChat = [...latestChat.current];
            updatedChat.push(message);

            setIdeaMessages(updatedChat);
          });
        })
        .catch((e) => console.log("Connection failed: ", e));
    }, []);

    useEffect(() => {
      getMessages();
    }, []);

    const chatWindowRef = useRef(null);

    function scrollToBottom() {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }

    useEffect(() => {
      scrollToBottom();
    }, [ideaMessages]);

    const sendMessage = async (e) => {
      e.preventDefault();
      if(messageToSend.content===''){
        toastr.error('Please Enter A Valid Message');
        return;
      }
      const chatMessage = {
        content: messageToSend.content,
        date: new Date().toISOString(),
        researcherId: userData.resercherId,
      };

      try {
        await fetch(
          `https://resweb-001-site1.htempurl.com/api/Chat/Discussion/${ideaId}?researcherId=${userData.resercherId}`,
          {
            method: "POST",
            body: JSON.stringify(chatMessage),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userData.token}`,
            },
          }
        ).then((response) =>
          setMessageToSend((prev) => {
            return { ...prev, content: "" };
          })
        );
      } catch (e) {}
    };

    if (!props.show) return null;
    return (
      <div className="modal-overlay2">
        <div className="modal2" style={{height:"100%",maxHeight:"500px"}}>
          <div className="ContExitbtn" onClick={props.onClose}>
            <div class="outer">
              <div class="inner">
                <label className="label2">Exit</label>
              </div>
            </div>
          </div>
          <h1 className="headContact2">Idea Chat</h1>
          <div className="ContAllDataWithInput">
            <div
              ref={chatWindowRef}
              className="custom-scrollbar"
              style={{
                alignItems: "flex-start",
                width: "80%",
                padding: "20px",
                gap: "20px",
                height: "310px",
                overflow: "auto",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {ideaMessages?.map((message) => {
                return <IdeaMessageCard message={message} />;
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
                disabled={userData.roles==='Admin'}
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
                  disabled={userData.roles==='Admin'}
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

  const IdeaMessageCard = (props) => {
    const resData = ideaPar.filter((res) => res.id === props.message.researcherId)
        
    
    return (
      <div
        className={
          userData.roles === "Researcher"
            ? props.message.researcherId === userData.resercherId.toLowerCase()
              ? "borderR1 spanChat"
              : "borderR spanChat"
            : "borderR spanChat"
        }
        style={{
          backgroundColor: "#c2c2c2",
          gap: "5px",
          display: "flex",
          flexDirection: "column",
          alignSelf:
            userData.roles === "Researcher"
              ? props.message.researcherId ===
                userData.resercherId.toLowerCase()
                ? "flex-end"
                : "flex-start"
              : "flex-start",
        }}
      >
        <p
          style={{
            color: "var(--darkgreen-color)",
            padding: "8px",
            backgroundColor: "rgb(213 213 213)",
          }}
        >
          {resData
            ? resData[0].studentObj.firstName +
              " " +
              resData[0].studentObj.lastName
            : null}
        </p>
        <p
          style={{
            padding: "8px",
            // borderTop:
            // props.message.researcherId ===
            // userData.resercherId.toLowerCase()
            //   ? "10px solid red"
            //   : "10px solid blue",
          }}
          // className={ props.message.researcherId ===
          //   userData.resercherId.toLowerCase()
          //     ? "spanChat1"
          //     : "spanChat"}
        >
          {props.message.content}
        </p>
      </div>
    );
  };

  const TaskChatCard = (props) => {
    const [messageToSend, setMessageToSend] = useState({
      content: "",
      date: new Date().toISOString(),
      researcherId: userData.resercherId,
    });
    const [taskMessage, setTaskMessages] = useState([]);
    const latestChat = useRef(null);

    latestChat.current = taskMessage;
    let counter = 1;
    function getMessages() {
      if (counter === 1) {
        fetch(
          `https://resweb-001-site1.htempurl.com/api/Chat/Task/${ideaId})?taskId=${props.task.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${userData.token}`,
            },
          }
        )
          .then((res) => res.ok?res.json():alert('failed to get task chat'))
          .then((data) => setTaskMessages(data));
      }
      counter = 0;
    }

    taskMessage.sort((a, b) => new Date(a.date) - new Date(b.date));

    useEffect(() => {
      const connection = new HubConnectionBuilder()
        .withUrl("https://resweb-001-site1.htempurl.com/hubs/chat")
        .withAutomaticReconnect()
        .build();

      connection
        .start()
        .then((result) => {
          connection.on("ReceiveMessage", (message) => {
            const updatedChat = [...latestChat.current];
            updatedChat.push(message);

            setTaskMessages(updatedChat);
          });
        })
        .catch((e) => console.log("Connection failed: ", e));
    }, []);

    useEffect(() => {
      getMessages();
    }, []);

    const chatWindowRef = useRef(null);

    function scrollToBottom() {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }

    useEffect(() => {
      scrollToBottom();
    }, [taskMessage]);

    const sendMessage = async (e) => {
      e.preventDefault();
      if(messageToSend.content===''){
        toastr.error('Please Enter A Valid Message');
        return;
      }
      const chatMessage = {
        content: messageToSend.content,
        date: new Date().toISOString(),
        researcherId: userData.resercherId,
      };

      try {
        await fetch(
          `https://resweb-001-site1.htempurl.com/api/Chat/Task?taskId=${props.task.id}&researcherId=${userData.resercherId}`,
          {
            method: "POST",
            body: JSON.stringify(chatMessage),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userData.token}`,
            },
          }
        ).then((response) =>
          setMessageToSend((prev) => {
            return { ...prev, content: "" };
          })
        );
      } catch (e) {}
    };

    if (!props.show) return null;
    return (
      <div className="modal-overlay2">
        <div className="modal2" style={{height:"500px",maxHeight:"500px"}}>
          <div className="ContExitbtn" onClick={props.onClose}>
            <div class="outer">
              <div class="inner">
                <label className="label2">Exit</label>
              </div>
            </div>
          </div>
          <h1 className="headContact2">Task Chat</h1>
          <div className="ContAllDataWithInput">
            <div
              ref={chatWindowRef}
              className="custom-scrollbar"
              style={{
                width: "80%",
                padding: "20px",
                gap: "20px",
                height: "310px",
                overflow: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              {taskMessage?.map((message) => {
                return <TaskMessageCard message={message} />;
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
                disabled={userData.roles==='Admin'}
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
                  disabled={userData.roles==='Admin'}
                    style={{ backgroundColor: "transparent", border: "none" }}
                    onClick={sendMessage}
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

  const TaskMessageCard = (props) => {
    const [resData, setResData] = useState(null);
    

    function getResearcherData() {
     
      if (userData.roles==='Admin'||(userData.roles==='Researcher' &&props.message.researcherId !== userData.resercherId.toLowerCase())) {
        fetch(
          `https://resweb-001-site1.htempurl.com/api/Researchers/${props.message.researcherId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${userData?.token}`,
            },
          }
        )
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => (data ? setResData(data) : null));
      }
    
    }
    useEffect(() => {
      getResearcherData();
    }, []);

   

    return (
      <div
        className={
          userData.roles==='Researcher'?
          props.message.researcherId === userData.resercherId.toLowerCase()
            ? " borderR1 spanChat"
            : "borderR spanChat":"borderR spanChat"
        }
        style={{
          backgroundColor: "rgb(194, 194, 194)",
          gap: "5px",
          display: "flex",
          flexDirection: "column",
          alignSelf:
          userData.roles==='Researcher'?
            props.message.researcherId === userData.resercherId.toLowerCase()
              ? "flex-end"
              : "flex-start":"flex-start",
        }}
      >
        <p style={{ padding: "8px", backgroundColor: "rgb(213, 213, 213)" }}>
          {userData.roles==='Researcher'?props.message.researcherId === userData.resercherId.toLowerCase()
            ? ""
            : resData?.firstName + " " + resData?.lastName:resData?.firstName + " " + resData?.lastName}
        </p>
        <p
          style={{
            padding: "8px",
            // borderTop:
            // props.message.researcherId ===
            //  userData.resercherId.toLowerCase()
            //    ? "10px solid red"
            //    : "10px solid blue",
          }}
        >
          {props.message.content}
        </p>
      </div>
    );
  };

  const TaskCard = ({ task }) => {
    const [isTaskPart, setIsTaskPart] = useState(false);

    const [taskParticpants, setTaskParticpants] = useState(null);

    function getTaskParticpants() {
      fetch(`https://resweb-001-site1.htempurl.com/api/Ideas/Tasks/Participants/${task.id}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${userData.token}`,
        },
      })
        .then((res) =>
          res.ok
            ? res.json()
            : null
        )
        .then((data) => (data ? setTaskParticpants(data) : null));
    }

    useEffect(() => {
      getTaskParticpants();
    }, []);

    useEffect(() => {
      const arr = userData.roles==='Researcher'? taskParticpants?.filter(
        (obj) => obj.id === userData.resercherId.toLowerCase()
      ):[];
      if (arr?.length > 0) setIsTaskPart(true);
    }, [taskParticpants]);

  

    return (
      <div
        className="CardInAllIdeasInIdea"
        style={{ height: "350px", justifyContent: "space-around", gap: "0" }}
      >
        <div className="containerSpansData" style={{ height: "75%" }}>
          <span>
            <span style={{ fontWeight: "bold" }}>Name :</span> {task.name}
          </span>
          <span
className="descriptionContainer custom-scrollbar" 
          // className="custom-scrollbar" style={{overflow:"auto",maxHeight:"80px",maxWidth:"560px"}}
          >    
            <span style={{fontWeight: "bold" }}>Description :</span>{" "}
            <span>{task.description}</span>
          </span>
          <span>
            <span style={{ fontWeight: "bold" }}>
              Max Participants Number :
            </span>{" "}
            {task.participantsNumber}
          </span>
          <span>
            <span style={{ fontWeight: "bold" }}>Progress :</span>{" "}
            {task.progress === 0
              ? "Assigned"
              : task.progress === 1
              ? "In Progress"
              : task.progress === 2
              ? "Completed"
              : tasks.progress === 3
              ? "Closed"
              : 'Closed'}
          </span>
          <span>
            <span style={{ fontWeight: "bold" }}>Deadline:</span>{" "}
            {new Date(task?.deadline).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
        <div className="contButtonsInIdea">
          <button
            className="hoverBtn"
            onClick={() => {
              setChoosenTask(task);
              setShowTaskParticpants(true);
            }}
            style={{ width: "141px" }}
          >
            View Task Particpants
          </button>
          {isTaskPart && (
            <button
              style={{ width: "141px" }}
              className="hoverBtn"
              onClick={() => {
                setChoosenTask(task);
                setShowTaskChat(true);
              }}
            >
              View Task Chat
            </button>
          )}
          {userData.roles==='Admin' && (
            <button
              style={{ width: "141px" }}
              className="hoverBtn"
              onClick={() => {
                setChoosenTask(task);
                setShowTaskChat(true);
              }}
            >
              View Task Chat
            </button>
          )}
          {isTaskPart && !idea?.isCompleted &&!task?.isCompleted && (
            <button
              style={{ width: "141px" }}
              className="hoverBtn"
              onClick={() => {
                setChoosenTask(task);
                setShowTaskUploadDocuemnt(true);
              }}
            >
              Upload File
            </button>
          )}
          {isTaskPart && (
            <button
              style={{ width: "141px" }}
              className="hoverBtn"
              onClick={() => {
                setChoosenTask(task);
                setShowTaskDocuments(true);
              }}
            >
              View All Files
            </button>
            
          )}

{userData.roles==='Admin' && (
            <button
              style={{ width: "141px" }}
              className="hoverBtn"
              onClick={() => {
                setChoosenTask(task);
                setShowTaskDocuments(true);
              }}
            >
              View All Files
            </button>
            
          )}

          {isTaskPart &&!idea?.isCompleted&& !task?.isCompleted &&(
            <button
              style={{ width: "141px" }}
              className="hoverBtn"
              onClick={() => {
                setChoosenTask(task);
                setShowUpdateProgress(true);
              }}
            >
              Update Task Progress
            </button>
          )}

          {creator && !idea?.isCompleted && userData.roles==='Researcher' &&!task?.isCompleted &&(
            <button
              style={{ width: "141px" }}
              className="hoverBtn"
              onClick={() => {
                setChoosenTask(task);
                setShowAssingParticpantToTask(true);
              }}
            >
              Assign Particpants
            </button>
            
          )}

{isTaskPart && !idea?.isCompleted && !task?.isCompleted &&(
            <button
              style={{ width: "141px" }}
              className="hoverBtn"
              onClick={() => {
                navigate(`/UploadFinalTask/${task.id}`)
              }}
            >
              Submit Task
            </button>
            
          )}
        </div>
      </div>
    );
  };

  const UploadFileCard = (props) => {
    const titleRef = useRef(null);

    const [document, setDocument] = useState(null);

    const handleDocumentUpload = (event) => {
      const file = event.target.files[0];
      setDocument(file);
    };

    const handleDocumentSubmit = (event) => {
      event.preventDefault();
      const titleValue = titleRef.current.value;
      if(titleValue===''){
        toastr.error('Please Enter A Valid Name');
        return;
      }
      // const titleValue = titleInput.value;
      const formData = new FormData();
      formData.append("file", document);
      formData.append("Name", titleValue);
setLoad(true)
      fetch(
        `https://resweb-001-site1.htempurl.com/api/Ideas/IdeaFile?ideaId=${ideaId}&researcherId=${userData.resercherId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
          body: formData,
        }
      ).then((res) => {
        setLoad(false)
        if (res.ok) {
          toastr.success("File Uploaded Successfully", "Success");
          props.onClose();
        } else
          toastr.error("failed to add video please try again later", "Failed");
      });
    };

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
          <h1 className="headContact2">Upload File</h1>
          <div className="FormModal2" style={{justifyContent:"space-between",height:"100%"}}>
            {/* <input className="InputModalHallDetails"
           type="file"
            onChange={handleDocumentUpload} /> */}
            <label className="LableForinputTypeFile"htmlFor="img">
              <input
                className="InputFile"
                id="img"
                type="file"
                onChange={handleDocumentUpload}
              />
              <span className="SpanUpload" style={{padding:"5px",gap:"5px"}}>
                {" "}
                <MdOutlineFileUpload />
                <span style={{ borderBottom: "none", padding: "3px" }}>
                  Choose a File
                </span>
              </span>
            </label>
            {document && (
              <input
                id="title"
                className="InputModalHallDetails"
                type="text"
                placeholder="file name"
                required
                name="Title"
                ref={titleRef}
              ></input>
            )}

            <div className="buttonsOnModal">
              {document && (
                <button className="" onClick={handleDocumentSubmit}>
                  Upload Document
                </button>
              )}
              <button className="" onClick={props.onClose}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const IdeaFilesCard = (props) => {
    const [documents, setDocuments] = useState(null);
    console.log(`IdeaFilesCard ~ documents:`, documents)

    function getIdeaFiles() {
      fetch(`https://resweb-001-site1.htempurl.com/api/Ideas/IdeaFile/${ideaId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
        .then((res) =>
          res.ok
            ? res.json()
            : toastr.error("failed to load documents", "Failed")
        )
        .then((data) => (data ? setDocuments(data) : null));
    }

    useEffect(() => {
      getIdeaFiles();
    }, []);

    function downloadDoc(fileId) {
      fetch(`https://resweb-001-site1.htempurl.com/api/Ideas/IdeaFileStream/${fileId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            return res.blob(); // Convert the response to a Blob object
          } else {
            throw new Error("Failed to load documents");
          }
        })
        .then((blob) => {
          // Create a temporary URL for the blob object
          const url = URL.createObjectURL(blob);

          // Create an anchor element
          const link = document.createElement("a");
          link.href = url;
          link.download = `document.pdf`; // Specify the desired file name

          // Programmatically trigger the download
          link.click();

          // Clean up by revoking the temporary URL
          URL.revokeObjectURL(url);
        })
        .catch((error) => {
          console.error(error);
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
          <h1 className="headContact2">All Files</h1>
          <div style={{height:"100%",maxHeight:"290px",width:"85%"}} className="ContInviteResearchers custom-scrollbar">
            {documents?.map((doc) => {
              return (
                <div className="DivContResearchers1">
                  <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                    {doc.title}
                  </span>
                  <button
                    className="plusBtn"
                    onClick={() => downloadDoc(doc.id)}
                  >
                    Download
                  </button>
                </div>
              );
            })}
            
          </div>
          <button className="buttonExit2" onClick={props.onClose}>
              Cancel
            </button>
        </div>
      </div>
    );
  };

  const TaskUploadDocument = (props) => {
    const titleRef = useRef(null);

    const [document, setDocument] = useState(null);

    const handleDocumentUpload = (event) => {
      const file = event.target.files[0];
      setDocument(file);
    };

    const handleDocumentSubmit = (event) => {
      event.preventDefault();
      const titleValue = titleRef.current.value;
      if(titleValue===''){
        toastr.error('Please Enter A Valid Name');
        return;
      }
      // const titleValue = titleInput.value;
      const formData = new FormData();
      formData.append("file", document);
      formData.append("Name", titleValue);
setLoad(true)
      fetch(
        `https://resweb-001-site1.htempurl.com/api/Ideas/TaskFile?taskId=${props.task.id}&researcherId=${userData.resercherId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
          body: formData,
        }
      ).then((res) => {
        setLoad(false)
        if (res.ok) {
          toastr.success("File Uploaded Successfully", "Success");
          props.onClose();
        } else
          toastr.error("failed to add video please try again later", "Failed");
      });
    };

    if (!props.show) return null;
    return (
      <div className="modal-overlay2">
        <div className="modal2" style={{height:"350px",alignItems:"center"}}>
          <div className="ContExitbtn" onClick={props.onClose}>
            <div class="outer">
              <div class="inner">
                <label className="label2">Exit</label>
              </div>
            </div>
          </div>
          <h1 className="headContact2">Upload Document</h1>
          <div className="FormModal2" style={{justifyContent:"space-between",height:"100%"}}>
            {/* <input className="InputModalHallDetails"
           type="file"
            onChange={handleDocumentUpload} /> */}

            <label className="LableForinputTypeFile" htmlFor="img">
              <input
                className="InputFile"
                id="img"
                type="file"
                onChange={handleDocumentUpload}
              />
              <span className="SpanUpload"style={{gap:"8px",padding:"8px"}}>
                {" "}
                <MdOutlineFileUpload />
                <span>Choose a File</span>
              </span>
            </label>

            {document && (
              <input
                id="title"
                className="InputModalHallDetails"
                type="text"
                placeholder="file name"
                required
                name="Title"
                ref={titleRef}
              ></input>
            )}
            <div className="buttonsOnModal">
              {document && (
                <button className="" onClick={handleDocumentSubmit}>
                  Upload Document
                </button>
              )}
              <button className="" onClick={props.onClose}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TaskFilesCard = (props) => {
    const [documents, setDocuments] = useState(null);
    
    
    function getIdeaFiles() {
      fetch(`https://resweb-001-site1.htempurl.com/api/Ideas/TaskFile/${props.task.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
        .then((res) =>
          res.ok
            ? res.json()
            : toastr.error("failed to load documents", "Failed")
        )
        .then((data) => (data ? setDocuments(data) : null));
    }

    useEffect(() => {
      getIdeaFiles();
    }, []);

    function downloadDoc(fileId) {
      fetch(`https://resweb-001-site1.htempurl.com/api/Ideas/TaskFileStream/${fileId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            return res.blob(); 
          } else {
            throw new Error("Failed to load documents");
          }
        })
        .then((blob) => {
          
          const url = URL.createObjectURL(blob);

          const link = document.createElement("a");
          link.href = url;
          link.download = `document.pdf`; 

         
          link.click();

          
          URL.revokeObjectURL(url);
        })
        .catch((error) => {
          console.error(error);
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
          <h1 className="headContact2">All Files</h1>
          <div className="FormModal2">
            <div className="DivContResearchers">
              {documents?.map((doc) => {
                return (
                  <div className="DivContResearchers1">
                    <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                      {doc.title}
                    </span>
                    <button
                      className="plusBtn"
                      onClick={() => downloadDoc(doc.id)}
                    >
                      Download
                    </button>
                  </div>
                );
              })}
            </div>
            
          </div>
          <div className="resetAndCancel2">
              <button className="buttonExit2" onClick={props.onClose}>
                Cancel
              </button>
            </div>
        </div>
      </div>
    );
  };

  const UpdateTaskProgressCard = (props) => {
    const [progress, setProgress] = useState(null);

    function updateProgress(e) {
      e.preventDefault();
      if(progress!==1){
        if(progress!==2){
          toastr.error('Please Choose A Valid State');
          return;
        }
      }
      const progressObj = { progress: progress };
      setLoad(true)
      fetch(
        `https://resweb-001-site1.htempurl.com/api/Ideas/Tasks/TaskProgress/${props.task.id}/${userData.resercherId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
          body: JSON.stringify(progressObj),
        }
      )
        
        .then((res) => {
          setLoad(false)
          if (res.ok) {
            toastr.success("Task progress updated successfully", "Success");
            props.onClose();
            getTasks();
          } else toastr.error("failed to update progress", "Failed");
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
          <h1 className="headContact2">Update Task Progress</h1>
          <form className="FormModal2" onSubmit={updateProgress} style={{height:"100%",justifyContent:"space-evenly"}}>
            <label className="AllLabeles">Choose State </label>
            <select
            required
              className="InputModalHallDetails"
              onChange={(e) => setProgress(e.target.value * 1)}
            >
              <option selected disabled>
                Choose State
              </option>
              <option value={1}>In Progress</option>
              <option value={2}>Completed</option>
            </select>
            <div className="buttonsOnModal">
              <button type="submit">Update</button>
              <button onClick={props.onClose}>Cancel</button>
            </div>
          </form>
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
    <div>
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
      <h1 style={{ margin: "120px 0 30px", textAlign: "center" }}>
        Data For Idea
      </h1>
      <div className="AllIdeas">
        <div className="CardInAllIdeasInIdea1">
          <div className="shape5"></div>

          <div className="containerSpansData">
            <span>
              <span style={{ fontWeight: "bold" }}>Name:</span> {idea?.name}
            </span>
            <span>
              <span style={{ fontWeight: "bold" }}>Status:</span> {idea?.isCompleted?'Closed':'In Progress'}
            </span>
            <span>
              <span style={{ fontWeight: "bold" }}>Participants Number: </span>
              {idea?.participantsNumber}
            </span>
            <span>
              <span style={{ fontWeight: "bold" }}>
                Max Participants Number:
              </span>{" "}
              {idea?.maxParticipantsNumber}
            </span>
            <span>
              <span style={{ fontWeight: "bold" }}>Specality:</span>{" "}
              {idea?.specalityObj?.name}
            </span>
            <span>
              <span style={{ fontWeight: "bold" }}>Deadline:</span>{" "}
              {new Date(idea?.deadline).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span>
              <span style={{ fontWeight: "bold" }}>Topic:</span>{" "}
              {idea?.topicObject?.name}
            </span>
          </div>

          {userData.roles==='Researcher'&&<div className="ContainerParticipants">
            {creator && (
              <h2 style={{ textAlign: "center" }}>
                Requests : {resReqsData?.length}
              </h2>
            )}
            <div className="ContInviteResearchers custom-scrollbar">
              {creator &&
                resReqsData?.map((res) => {
                  return (
                    <div style={{flexDirection:"row"}} className="DivContResearchers">
                      <h3>
                        Researcher Name : {res.firstName + " " + res.lastName}
                      </h3>
                      <button
                        className="hoverBtn"
                        onClick={() =>
                          navigate(`/Profile/${res.studentId}`)
                        }
                      >
                        View Profile
                      </button>
                      <button
                        className="acceptReq"
                        onClick={() => acceptReq(res.id)}
                      >
                        Accept Request
                      </button>
                      <button
                        className="rejectReq"
                        onClick={() => rejectReq(res.id)}
                      >
                        Reject Request
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>}

          {creator && !idea?.isCompleted && userData.roles==='Researcher'&& (
            <button className="bn54" onClick={() => setShowResModal(true)}>
              Invite Researcher
            </button>
          )}
          {creator && showResModal && (
            <AllResCard
              show={showResModal}
              onClose={() => setShowResModal(false)}
            />
          )}
          <div className="ContainerParticipants">
            <h2>Participants : {ideaPar?.length}</h2>
            <div className="ContInviteResearchers custom-scrollbar" style={{width:"60%"}}>
              {ideaPar?.map((par) => {
                return (
                  <div className="DivContResearchers1">
                    <h3
                      style={{
                        display: "flex",
                        alignItems: "center",
                        columnGap: "5px",
                      }}
                    >
                      {idea?.creatorId === par?.id && <FaCrown />}
                      {par?.studentObj?.firstName +
                        " " +
                        par?.studentObj?.lastName}
                    </h3>
                    <button
                      className="hoverBtn"
                      onClick={() =>
                        navigate(`/profile/${par.studentObj?.id}`)
                      }
                    >
                      View Profile
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="contButtonsInIdea">
            {creator &&
              !idea?.isCompleted &&
              userData.roles === "Researcher" && (
                <button
                  className="buttonn"
                  onClick={() => setShowTaskCard(true)}
                >
                  Create New Task
                </button>
              )}
            {creator &&
              !idea?.isCompleted &&
              userData.roles === "Researcher" && (
                <button
                  className="buttonn"
                  onClick={() =>
                    navigate(`/RateIdeaResearchers/${ideaId}`)
                  }
                >
                  Submit Idea
                </button>
              )}
            {creator && showTaskCard && (
              <CreateTaskCard
                show={showTaskCard}
                onClose={() => setShowTaskCard(false)}
              />
            )}
            {isPart && !idea?.isCompleted && (
              <button
                className="buttonn"
                onClick={() => setShowExpertReqModal(true)}
              >
                Send Expert Request
              </button>
            )}
            {ideaChatPart && !idea?.isCompleted && (
              <button
                className="buttonn"
                onClick={() => setShowUploadFile(true)}
              >
                Upload File
              </button>
            )}
            {ideaChatPart && (
              <button
                className="buttonn"
                onClick={() => setShowIdeaFiles(true)}
              >
                View All Files
              </button>
            )}
            {userData.roles === "Admin" && (
              <button
                className="buttonn"
                onClick={() => setShowIdeaFiles(true)}
              >
                View All Files
              </button>
            )}
            {showExpertReqModal && (
              <SendExpertReqCard
                show={showExpertReqModal}
                onClose={() => setShowExpertReqModal(false)}
              />
            )}
            {showUploadFile && (
              <UploadFileCard
                show={showUploadFile}
                onClose={() => setShowUploadFile(false)}
              />
            )}
            {showIdeaFiles && (
              <IdeaFilesCard
                show={showIdeaFiles}
                onClose={() => setShowIdeaFiles(false)}
              />
            )}
            {ideaChatPart && (
              <button className="buttonn" onClick={() => setShowIdeaChat(true)}>
                Chat <BiChat />
              </button>
            )}
            {userData.roles === "Admin" && (
              <button className="buttonn" onClick={() => setShowIdeaChat(true)}>
                Chat <BiChat />
              </button>
            )}
            {ideaChatPart && showIdeaChat && (
              <IdeaChat
                show={showIdeaChat}
                onClose={() => setShowIdeaChat(false)}
              />
            )}
            {userData.roles === "Admin" && showIdeaChat && (
              <IdeaChat
                show={showIdeaChat}
                onClose={() => setShowIdeaChat(false)}
              />
            )}
          </div>
        </div>
      </div>

      {ideaChatPart&&
        <div>
          <h1 style={{ textAlign: "center", margin: "50px 0" }}>
            Tasks : {tasks?.length}
          </h1>
          <div className="AllIdeas">
            {tasks?.map((task) => {
              return <TaskCard task={task} />;
            })}
            {choosenTask && showAssignParticpantToTask && (
              <AssignParticpantToTask
                show={showAssignParticpantToTask}
                onClose={() => setShowAssingParticpantToTask(false)}
                task={choosenTask}
              />
            )}
            {choosenTask && showTaskParticpants && (
              <TaskParticpantsCard
                show={showTaskParticpants}
                onClose={() => setShowTaskParticpants(false)}
                task={choosenTask}
              />
            )}
            {choosenTask && showTaskChat && (
              <TaskChatCard
                show={showTaskChat}
                onClose={() => setShowTaskChat(false)}
                task={choosenTask}
              />
            )}
            {choosenTask && showTaskUploadDocument && (
              <TaskUploadDocument
                show={showTaskUploadDocument}
                onClose={() => setShowTaskUploadDocuemnt(false)}
                task={choosenTask}
              />
            )}
            {choosenTask && showTaskDocuments && (
              <TaskFilesCard
                show={showTaskDocuments}
                onClose={() => setShowTaskDocuments(false)}
                task={choosenTask}
              />
            )}
            {choosenTask && showUpdateProgress && (
              <UpdateTaskProgressCard
                show={showUpdateProgress}
                onClose={() => setShowUpdateProgress(false)}
                task={choosenTask}
              />
            )}
          </div>
        </div>
      }
      {userData.roles==='Admin'&&
        <div>
          <h1 style={{ textAlign: "center", margin: "50px 0" }}>
            Tasks : {tasks?.length}
          </h1>
          <div className="AllIdeas">
            {tasks?.map((task) => {
              return <TaskCard task={task} />;
            })}
            {choosenTask && showAssignParticpantToTask && (
              <AssignParticpantToTask
                show={showAssignParticpantToTask}
                onClose={() => setShowAssingParticpantToTask(false)}
                task={choosenTask}
              />
            )}
            {choosenTask && showTaskParticpants && (
              <TaskParticpantsCard
                show={showTaskParticpants}
                onClose={() => setShowTaskParticpants(false)}
                task={choosenTask}
              />
            )}
            {choosenTask && showTaskChat && (
              <TaskChatCard
                show={showTaskChat}
                onClose={() => setShowTaskChat(false)}
                task={choosenTask}
              />
            )}
            {choosenTask && showTaskUploadDocument && (
              <TaskUploadDocument
                show={showTaskUploadDocument}
                onClose={() => setShowTaskUploadDocuemnt(false)}
                task={choosenTask}
              />
            )}
            {choosenTask && showTaskDocuments && (
              <TaskFilesCard
                show={showTaskDocuments}
                onClose={() => setShowTaskDocuments(false)}
                task={choosenTask}
              />
            )}
            {choosenTask && showUpdateProgress && (
              <UpdateTaskProgressCard
                show={showUpdateProgress}
                onClose={() => setShowUpdateProgress(false)}
                task={choosenTask}
              />
            )}
            
           
          </div>
        </div>
      }
      <Footer userData={userData} />
    </div>
  );
}
