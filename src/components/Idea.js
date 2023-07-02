import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import "../css/Paper.css";
import "../css/Idea.css";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { BiChat } from "react-icons/bi";
import { FaPaperPlane } from "react-icons/fa";
import { FaCrown } from 'react-icons/fa';
export default function Idea() {
  const userData = useLocation()?.state.data;
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
  const[showUpdateProgress,setShowUpdateProgress]=useState(false);
  const navigate = useNavigate();
  const creator = userData?.resercherId.toLowerCase() === idea?.creatorId;

  function getIdeaData() {
    fetch(`https://localhost:7187/api/Ideas/SingleIdea/${ideaId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData?.token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : alert("failed to load idea data")))
      .then((data) => (data ? setIdea(data) : null));
  }

  let counter = 1;
  function getIdeaReqs() {
    if (counter === 1) {
      fetch(`https://localhost:7187/api/Ideas/Requests/${ideaId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData?.token}`,
        },
      })
        .then((res) => (res.ok ? res.json() : alert("failed to load reqs")))
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
  }, []);

  function getResearcherData(resId) {
    fetch(`https://localhost:7187/api/Researchers/${resId}`, {
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
      `https://localhost:7187/api/Ideas/Requests/AcceptRequest/${filterData.id}/${filterData.researcherId}`,
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
          : alert("failed to accept req")
      )
      .then((data) => (data ? console.log(data) : null));
  }

  function rejectReq(resId) {
    const filterData = ideaReqs.find((req) => req.researcherId === resId);
    fetch(`https://localhost:7187/api/Ideas/Requests/${filterData.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    })
      .then((res) =>
        res.ok
          ? setResReqsData(resReqsData.filter((res) => res.id !== resId))
          : alert("failed to reject req")
      )
      .then((data) => (data ? console.log(data) : null));
  }

  function getParticaptns() {
    fetch(`https://localhost:7187/api/Ideas/Participants/${ideaId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData?.token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : alert("failed to get Partipants")))
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
    fetch(`https://localhost:7187/api/Ideas/Tasks/AllTasks/${ideaId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData?.token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : alert("failed to load Tasks")))
      .then((data) => (data ? setTasks(data) : null));
  }

  const AllResCard = (props) => {
    const [ress, setRess] = useState(null);

    function getAllRess() {
      fetch(`https://localhost:7187/api/Researchers`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
        .then((res) =>
          res.ok ? res.json() : alert("failed to get Researchers")
        )
        .then((data) => (data ? setRess(data) : null));
    }
    useEffect(() => {
      getAllRess();
    }, []);

    function sendInvitation(resId) {
      let invits = [];
      invits.push(resId);
      fetch(
        `https://localhost:7187/api/Ideas/Invitations/SendInvitations/${ideaId}`,
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
          ? alert("Invitation Sent Successfully")
          : alert("Failed To Send Invitation")
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

          <div className="ContInviteResearchers custom-scrollbar">
            {ress
              ?.filter((res) => !ideaPar.some((par) => par.id === res.id))
              .map((res) => {
                return (
                  <div className="DivContResearchers">
                    <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                      {res?.studentObj.firstName +
                        " " +
                        res?.studentObj.lastName}
                    </span>
                    <button
                      className="plusBtn"
                      onClick={() =>
                        navigate(`/Profile/${res?.studentObj.id}`, {
                          state: { data: userData },
                        })
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
            <div className="">
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

    function createfTask() {
      const val = /^\d{4}-\d{2}-\d{2}$/.test(taskData.deadline);
      if (val) {
        fetch(
          `https://localhost:7187/api/Ideas/Tasks/InitiateTask/${ideaId}/${userData.resercherId}`,
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
                alert(body);
              });
            } else {
              window.location.reload();
            }
          })
          .catch((error) => console.error(error));
      } else alert("please enter a valid deadline yyyy-mm-dd");
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

          <div className="FormModal2">
            <label className="AllLabeles">Task Name: </label>
            <input
              className="InputModalHallDetails"
              onChange={getTaskData}
              name="name"
            ></input>
            <label className="AllLabeles">participants Number: </label>
            <input
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
              className="InputModalHallDetails"
              onChange={getTaskData}
              name="description"
            ></input>
            <label className="AllLabeles">deadline</label>
            <input
              className="InputModalHallDetails"
              type="text"
              name="deadline"
              onChange={getTaskData}
              placeholder="yyyy-mm-dd"
            ></input>
            <div className="buttonsOnModal">
              <button onClick={createfTask}>Create</button>
              <button onClick={props.onClose}>Cancel</button>
            </div>
          </div>
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
      fetch(`https://localhost:7187/api/Researchers/Ideas/ExpertRequest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify(expertReqData),
      })
        // .then(res=>res.ok?alert('Expert Request Sent Successfully'):alert('Failed To Send Please Try Again Later'))
        .then((res) => {
          if (res.ok) {
            alert("Expert Request Sent Successfully");
            props.onClose();
          } else alert("Failed To Send Please Try Again Later");
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
          <div className="FormModal2">
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
      console.log(id);
      let data = [];
      data.push(id);
      fetch(
        `https://localhost:7187/api/Ideas/Tasks/Participants/${props.task.id}`,
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
              alert(body);
            });
          } else alert("Particpant Assigned Successfully");

          return readStream().then((chunks) => {
            const body = new TextDecoder().decode(
              new Uint8Array(chunks.flatMap((chunk) => Array.from(chunk)))
            );
            console.log(body);
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
          <div className="ContInviteResearchers custom-scrollbar">
            {ideaPar?.map((par) => {
              return (
                <div className="DivContResearchers">
                  <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                    {par?.studentObj.firstName + " " + par?.studentObj.lastName}
                  </span>
                  <button
                    className="plusBtn"
                    onClick={() =>
                      navigate(`/profile/${par.studentObj.id}`, {
                        state: { data: userData },
                      })
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
        `https://localhost:7187/api/Ideas/Tasks/Participants/${props.task.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      )
        .then((res) =>
          res.ok ? res.json() : alert("failed to load particpants to task")
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
          <div className="ContInviteResearchers custom-scrollbar">
            {taskParticpants?.map((par) => {
              return (
                <div className="DivContResearchers1">
                  <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                    {par.studentObj.firstName + " "}{par.studentObj.lastName}
                  </span>
                  
                  <button
                    className="plusBtn"
                    onClick={() =>
                      navigate(`/Profile/${par.studentObj.id}`, {
                        state: { data: userData },
                      })
                    }
                  >
                    View Profile
                  </button>
                </div>
              );
            })}
            <button className="buttonExit2" onClick={props.onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const IdeaChat = (props) => {
    const [messageToSend, setMessageToSend] = useState({
      content: "",
      date: new Date().toISOString(),
      researcherId: userData.resercherId,
    });
    const [ideaMessages, setIdeaMessages] = useState([]);
    const latestChat = useRef(null);

    latestChat.current = ideaMessages;

    let counter = 1;
    function getMessages() {
      if (counter === 1) {
        fetch(`https://localhost:7187/api/Chat/Discussion/${ideaId}`, {
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
        .withUrl("https://localhost:7187/hubs/discussion")
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
      const chatMessage = {
        content: messageToSend.content,
        date: new Date().toISOString(),
        researcherId: userData.resercherId,
      };

      try {
        await fetch(
          `https://localhost:7187/api/Chat/Discussion/${ideaId}?researcherId=${userData.resercherId}`,
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
        <div className="modal2">
          <div className="ContExitbtn" onClick={props.onClose}>
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
              {ideaMessages?.map((message) => {
                return (
                  <IdeaMessageCard message={message} />
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


  const IdeaMessageCard=(props)=>{
    
    const resData=ideaPar.filter(res=>res.id===props.message.researcherId)
    console.log('resData',resData)
    return (
      <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignSelf:
                        props.message.researcherId ===
                        userData.resercherId.toLowerCase()
                          ? "flex-end"
                          : "flex-start",
                    }}
                  >
                    <p>{resData[0].studentObj.firstName+" "+resData[0].studentObj.lastName}</p>
                    <p style={{
                      borderTop:
                      props.message.researcherId ===
                       userData.resercherId.toLowerCase()
                         ? "10px solid red"
                         : "10px solid blue",
                    }} className={ props.message.researcherId ===
                      userData.resercherId.toLowerCase()
                        ? "spanChat1"
                        : "spanChat"}
                    
                    >{props.message.content}</p>
                  </div>
    )
  }

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
          `https://localhost:7187/api/Chat/Task/${ideaId})?taskId=${props.task.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${userData.token}`,
            },
          }
        )
          .then((res) => res.json())
          .then((data) => setTaskMessages(data));
      }
      counter = 0;
    }

    taskMessage.sort((a, b) => new Date(a.date) - new Date(b.date));

    useEffect(() => {
      const connection = new HubConnectionBuilder()
        .withUrl("https://localhost:7187/hubs/chat")
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
      const chatMessage = {
        content: messageToSend.content,
        date: new Date().toISOString(),
        researcherId: userData.resercherId,
      };

      try {
        await fetch(
          `https://localhost:7187/api/Chat/Task?taskId=${props.task.id}&researcherId=${userData.resercherId}`,
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
        <div className="modal2">
          <div className="ContExitbtn" onClick={props.onClose}>
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
                width: "80%",
                padding: "20px",
                gap: "20px",
                height: "240px",
                overflow: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              {taskMessage?.map((message) => {
                return (
                  <TaskMessageCard message={message} />
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
            {/* <button onClick={props.onClose}>Close</button> */}
          </div>
        </div>
      </div>
    );
  };


  const TaskMessageCard=(props)=>{

    const [resData,setResData]=useState(null);
    // console.log('task message',props.message);

    function getResearcherData() {
      if(props.message.researcherId!==userData.resercherId.toLowerCase()){
      fetch(`https://localhost:7187/api/Researchers/${props.message.researcherId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData?.token}`,
        },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => (data ? setResData(data) : null));
    }
    }
    useEffect(()=>{
      getResearcherData();
    },[])

    console.log('res task data',resData)

    return (
      <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignSelf:
                      props.message.researcherId ===
                        userData.resercherId.toLowerCase()
                          ? "flex-end"
                          : "flex-start",
                    }}
                  >
                    <p>
                      {
                      props.message.researcherId===userData.resercherId.toLowerCase()?'':
                      resData?.firstName+" "+resData?.lastName
                      }
                    </p>
                    <p 
                    style={{
                      borderTop:
                      props.message.researcherId ===
                       userData.resercherId.toLowerCase()
                         ? "10px solid red"
                         : "10px solid blue",
                    }}
                     className= { props.message.researcherId ===
                      userData.resercherId.toLowerCase()
                        ? "spanChat1"
                        : "spanChat"}
                    
                     >{props.message.content}</p>
                  </div>
    )
  }

  const TaskCard = ({ task }) => {
    const [isTaskPart, setIsTaskPart] = useState(false);

    const [taskParticpants, setTaskParticpants] = useState(null);

    function getTaskParticpants() {
      fetch(`https://localhost:7187/api/Ideas/Tasks/Participants/${task.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
        .then((res) =>
          res.ok ? res.json() : alert("failed to load particpants to task")
        )
        .then((data) => (data ? setTaskParticpants(data) : null));
    }

    useEffect(() => {
      getTaskParticpants();
    }, []);

    useEffect(() => {
      const arr = taskParticpants?.filter(
        (obj) => obj.id === userData.resercherId.toLowerCase()
      );
      if (arr?.length > 0) setIsTaskPart(true);
    }, [taskParticpants]);

    return (
      <div className="CardInAllIdeasInIdea">
        <div className="containerSpansData">
          <span>
            <span style={{ fontWeight: "bold" }}>Name :</span> {task.name}
          </span>
          <span className="custom-scrollbar" style={{overflow:"auto",maxHeight:"80px",maxWidth:"560px"}}>
            <span  style={{ fontWeight: "bold" }}>Description :</span>{" "}
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
            {task.progress===0 ?'Assigned':task.progress===1?'In Progress':task.progress===2?'Completed':tasks.progress===3?'Closed':null}
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
          >
            View Task Particpants
          </button>
          {isTaskPart && (
            <button
              className="hoverBtn"
              onClick={() => {
                setChoosenTask(task);
                setShowTaskChat(true);
              }}
            >
              View Task Chat
            </button>
          )}
          {isTaskPart && !idea.isCompleted && (
            <button
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
              className="hoverBtn"
              onClick={() => {
                setChoosenTask(task);
                setShowTaskDocuments(true);
              }}
            >
              View All Files
            </button>



          )}
          




          {isTaskPart && (
            <button
              className="hoverBtn"
              onClick={() => {
                setChoosenTask(task);
                setShowUpdateProgress(true);
              }}
            >
              Update Task Progress
            </button>



          )}





          {creator && !idea.isCompleted && (
            <button
              className="hoverBtn"
              onClick={() => {
                setChoosenTask(task);
                setShowAssingParticpantToTask(true);
              }}
            >
              Assign Particpants
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
      // const titleValue = titleInput.value;
      const formData = new FormData();
      formData.append("file", document);
      formData.append("Name", titleValue);

      fetch(
        `https://localhost:7187/api/Ideas/IdeaFile?ideaId=${ideaId}&researcherId=${userData.resercherId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
          body: formData,
        }
      ).then((res) => {
        if (res.ok) {
          alert("File Uploaded Successfully");
          props.onClose();
        } else alert("failed to add video please try again later");
      });
    };

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
          <h1 className="headContact2">Upload File</h1>
          <div className="FormModal2">
          <input className="InputModalHallDetails" type="file" onChange={handleDocumentUpload} />
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

    function getIdeaFiles() {
      fetch(`https://localhost:7187/api/Ideas/IdeaFile/${ideaId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
        .then((res) =>
          res.ok ? res.json() : alert("failed to load documents")
        )
        .then((data) => (data ? setDocuments(data) : null));
    }

    useEffect(() => {
      getIdeaFiles();
    }, []);

    function downloadDoc(fileId) {
      fetch(`https://localhost:7187/api/Ideas/IdeaFileStream/${fileId}`, {
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
          <div className="ContInviteResearchers custom-scrollbar">  
          {documents?.map((doc) => {
            return (
              <div className="DivContResearchers1">
                <span style={{fontWeight:"bold",fontSize:"18px"}}>{doc.title}</span>
                <button className="plusBtn" onClick={() => downloadDoc(doc.id)}>Download</button>
              </div>
            );
          })}
          <button className="buttonExit2" onClick={props.onClose}>
            Cancel
          </button>
          </div>
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
      // const titleValue = titleInput.value;
      const formData = new FormData();
      formData.append("file", document);
      formData.append("Name", titleValue);

      fetch(
        `https://localhost:7187/api/Ideas/TaskFile?taskId=${props.task.id}&researcherId=${userData.resercherId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
          body: formData,
        }
      ).then((res) => {
        if (res.ok) {
          alert("File Uploaded Successfully");
          props.onClose();
        } else alert("failed to add video please try again later");
      });
    };

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
          <h1 className="headContact2">Upload Document</h1>
          <div className="FormModal2">
          <input className="InputModalHallDetails" type="file" onChange={handleDocumentUpload} />
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
      fetch(`https://localhost:7187/api/Ideas/TaskFile/${props.task.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
        .then((res) =>
          res.ok ? res.json() : alert("failed to load documents")
        )
        .then((data) => (data ? setDocuments(data) : null));
    }

    useEffect(() => {
      getIdeaFiles();
    }, []);

    function downloadDoc(fileId) {
      fetch(`https://localhost:7187/api/Ideas/TaskFileStream/${fileId}`, {
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
          <div className="FormModal2">
            <div className="DivContResearchers">
          {documents?.map((doc) => {
            return (
              <div className="DivContResearchers1">
                <span style={{fontWeight:"bold",fontSize:"18px"}}>{doc.title}</span>
                <button className="plusBtn" onClick={() => downloadDoc(doc.id)}>Download</button>
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




const UpdateTaskProgressCard=(props)=>{
  const [progress,setProgress]=useState(null);
  

  function updateProgress(){
    const progressObj={progress:progress}
    fetch(`https://localhost:7187/api/Ideas/Tasks/TaskProgress/${props.task.id}/${userData.resercherId}`,{
      method:"PUT",
      headers:{
        "Content-Type":"application/json",
        "Authorization":`Bearer ${userData.token}`
      },
      body:JSON.stringify(progressObj)
    })
    // .then(res=>res.ok?alert('Task progress updated successfully'):alert('failed to update progress'))
    .then(res=>{
      if(res.ok){
        alert('Task progress updated successfully');
        props.onClose();
        getTasks();
      }else alert('failed to update progress')
    })
  }


  if (!props.show) return null;
    return (
      <div className="modal-overlay2">
        <div className="modal2">
          <select onChange={(e)=>setProgress(e.target.value*1)}>
            <option selected disabled>Choose State</option>
            <option value={1}>In Progress</option>
            <option value={2}>Completed</option>
          </select>
          <button onClick={updateProgress}>Update</button>
          <button onClick={props.onClose}>Cancel</button>
        </div>
        </div>
    )
}




  

  console.log(idea)

  return (
    <div>
      <Header userData={userData} />
      <h1 style={{ margin: "120px 0 30px", textAlign: "center" }}>
        Data For Idea
      </h1>
      <div className="AllIdeas">
        <div className="CardInAllIdeasInIdea">
          <div className="shape5"></div>

          <div className="containerSpansData">
            <span>
              <span style={{ fontWeight: "bold" }}>Name:</span> {idea?.name}
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
              {idea?.specalityObj.name}
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
              {idea?.topicObject.name}
            </span>
            {creator && (
              <h2 style={{ textAlign: "center" }}>
                Requests : {resReqsData?.length}
              </h2>
            )}
            <div className="ContInviteResearchers custom-scrollbar">
              {creator &&
                resReqsData?.map((res) => {
                  return (
                    <div className="DivContResearchers">
                      <h3>
                        Researcher Name : {res.firstName + " " + res.lastName}
                      </h3>
                      <button
                        className="hoverBtn"
                        onClick={() =>
                          navigate(`/Profile/${res.studentId}`, {
                            state: { data: userData },
                          })
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

            {creator && !idea.isCompleted && (
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
            <div className="ContInviteResearchers custom-scrollbar">
              <h2>Participants : {ideaPar?.length}</h2>
              {ideaPar?.map((par) => {
                return (
                  <div className="DivContResearchers">
                    <h3 style={{display:'flex',alignItems:'center',columnGap:'5px'}}>
                    {idea.creatorId===par.id&&<FaCrown/>}
                      {par?.studentObj.firstName +
                        " " +
                        par?.studentObj.lastName}
                        
                    </h3>
                    <button
                      className="hoverBtn"
                      onClick={() =>
                        navigate(`/profile/${par.studentObj.id}`, {
                          state: { data: userData },
                        })
                      }
                    >
                      View Profile
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="contButtonsInIdea">
              {creator && !idea.isCompleted &&(
                <button
                  className="buttonn"
                  onClick={() => setShowTaskCard(true)}
                >
                  Create New Task
                </button>
              )}
              {creator && !idea.isCompleted && (
                <button
                  className="buttonn"
                  onClick={() =>
                    navigate(`/RateIdeaResearchers/${ideaId}`, {
                      state: { data: userData },
                    })
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
              {isPart && !idea.isCompleted && (
                <button
                  className="buttonn"
                  onClick={() => setShowExpertReqModal(true)}
                >
                  Send Expert Request
                </button>
              )}
              {ideaChatPart && !idea.isCompleted && (
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
                <button
                  className="buttonn"
                  onClick={() => setShowIdeaChat(true)}
                >
                  Chat <BiChat />
                </button>
              )}
              {ideaChatPart && showIdeaChat && (
                <IdeaChat
                  show={showIdeaChat}
                  onClose={() => setShowIdeaChat(false)}
                />
              )}
            </div>
          </div>
        </div>
      </div>

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
    </div>
  );
}
