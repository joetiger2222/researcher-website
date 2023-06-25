import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import "../css/Paper.css";
import "../css/Idea.css";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { BiChat } from "react-icons/bi";
import { FaPaperPlane } from "react-icons/fa";

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
    // console.log(ress)

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
              ?.filter((res) => res.id !== userData?.resercherId.toLowerCase())
              .map((res) => {
                // console.log(res.id)
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
      <div
        className="modal-overlay2"
      >
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
          <input className="InputModalHallDetails" onChange={getTaskData} name="name"></input>
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
          <input className="InputModalHallDetails" onChange={getTaskData} name="description"></input>
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
      <div
        className="modal-overlay2"
      >
        <div className="modal2">
        <div class="ContExitbtn"><div className="outer" onClick={props.onClose}><div className="inner"><label className="label2">Exit</label></div></div></div>
        <h1 class="headContact2">Assign Participants</h1>
          <div className="ContInviteResearchers custom-scrollbar">
          {ideaPar?.map((par) => {
            return (
              <div className="DivContResearchers">
                <span style={{fontWeight:"bold",fontSize:"18px"}}>
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
          <button className="buttonExit2" onClick={props.onClose}>Close</button>
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
      <div
        className="modal-overlay2"
      >
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
              <div className="DivContResearchers">
                <span style={{fontWeight:"bold",fontSize:"18px"}}>{par.studentObj.firstName + " "}</span>
                <span style={{fontWeight:"bold",fontSize:"18px"}}>{par.studentObj.lastName}</span>
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
          <button className="buttonExit2" onClick={props.onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  };

  const IdeaChat = (props) => {
    const [messageToSend, setMessageToSend] = useState({
      content: "",
      date: new Date().toISOString(),
    });
    const [ideaMessages, setIdeaMessages] = useState([]);
    const latestChat = useRef(null);

    latestChat.current = ideaMessages;

    function getMessages() {
      fetch(`https://localhost:7187/api/Chat/Discussion/${ideaId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setIdeaMessages(data));
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

    const sendMessage = async (e) => {
      e.preventDefault();
      const chatMessage = {
        content: messageToSend.content,
        date: new Date().toISOString(),
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
        ).then((response) => console.log(response));
      } catch (e) {}
    };

    

    if (!props.show) return null;
    return (
      <div
       className="modal-overlay2"
      >
        <div className="modal2">
        <div className="ContExitbtn" onClick={props.onClose}>
            <div class="outer">
              <div class="inner">
                <label className="label2">Exit</label>
              </div>
            </div>
          </div>
<div className="ContAllDataWithInput">
  <div className="custom-scrollbar" style={{alignItems:"flex-start",width:"80%",padding:"20px",gap:"20px",height:"240px",overflow:"auto",display:"flex",flexDirection:"column"}}>
            {ideaMessages?.map((message) => {
              return (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <p className="spanChat">{message.content}</p>
                </div>
              );
            })}
          </div>
        <div style={{width:"100%",display:"flex",
      justifyContent:"center",alignItems:"center"}}>
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
            onChange={(e) =>
              setMessageToSend((prev) => {
                return { ...prev, [e.target.name]: e.target.value };
              })
            }
          ></input>
          <div className="DivContChatIcon">
          <button  style={{ backgroundColor: "transparent",border:"none" }}>
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
          
          {/* <butto>n onClick={sendMessage}>Send</butto> */}
          {/* <button onClick={props.onClose}>Close</button> */}
        </div>
      </div>
    );
  };

  const TaskChatCard = (props) => {
    const [messageToSend, setMessageToSend] = useState({
      content: "",
      date: new Date().toISOString(),
    });
    const [taskMessage, setTaskMessages] = useState([]);
    const latestChat = useRef(null);

    latestChat.current = taskMessage;

    function getMessages() {
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

    const sendMessage = async (e) => {
      e.preventDefault();
      const chatMessage = {
        content: messageToSend.content,
        date: new Date().toISOString(),
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
        ).then((response) => console.log(response));
      } catch (e) {}
    };

    if (!props.show) return null;
    return (
      <div
      className="modal-overlay2"
      >
        <div className="modal2">
        <div className="ContExitbtn" onClick={props.onClose}>
            <div class="outer">
              <div class="inner">
                <label className="label2">Exit</label>
              </div>
            </div>
          </div>
          <div className="ContAllDataWithInput">
          <div className="custom-scrollbar" style={{width:"80%",padding:"20px",gap:"20px",height:"240px",overflow:"auto",display:"flex",flexDirection:"column",alignItems:"flex-start"}}>
            {taskMessage?.map((message) => {
              return (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <p>{message.content}</p>
                </div>
              );
            })}
          </div>
          <div style={{width:"100%",display:"flex",
      justifyContent:"center",alignItems:"center"}}>
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
            onChange={(e) =>
              setMessageToSend((prev) => {
                return { ...prev, [e.target.name]: e.target.value };
              })
            }
          ></input>
          <div className="DivContChatIcon">
          <button  style={{ backgroundColor: "transparent",border:"none" }} onClick={sendMessage}>
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
            <span><span style={{fontWeight:"bold"}}>Name:</span> {idea?.name}</span>
            <span><span style={{fontWeight:"bold"}}>Participants Number: </span>{idea?.participantsNumber}</span>
            <span><span style={{fontWeight:"bold"}}>Max Participants Number:</span> {idea?.maxParticipantsNumber}</span>
            <span><span style={{fontWeight:"bold"}}>Specality:</span> {idea?.specalityObj.name}</span>
            <span>
              <span style={{fontWeight:"bold"}}>Deadline:</span>{" "}
              {new Date(idea?.deadline).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span><span style={{fontWeight:"bold"}}>Topic:</span> {idea?.topicObject.name}</span>
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

            {creator && (
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
                    <h3>
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
              {creator && (
                <button
                  className="buttonn"
                  onClick={() => setShowTaskCard(true)}
                >
                  Create New Task
                </button>
              )}
              {creator && showTaskCard && (
                <CreateTaskCard
                  show={showTaskCard}
                  onClose={() => setShowTaskCard(false)}
                />
              )}
              {isPart && (
                <button
                  className="buttonn"
                  onClick={() => setShowExpertReqModal(true)}
                >
                  Send Expert Request
                </button>
              )}
              {showExpertReqModal && (
                <SendExpertReqCard
                  show={showExpertReqModal}
                  onClose={() => setShowExpertReqModal(false)}
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
        <h1 style={{textAlign:"center",margin:"50px 0"}}>Tasks : {tasks?.length}</h1>
        <div className="AllIdeas">
        {tasks?.map((task) => {
          return (
            <div className="CardInAllIdeasInIdea">
              <div className="containerSpansData">
              <span><span style={{fontWeight:"bold"}}>Name :</span> {task.name}</span>
              <span><span style={{fontWeight:"bold"}}>Description :</span> {task.description}</span>
              <span><span style={{fontWeight:"bold"}}>ParticipantsNumber :</span> {task.participantsNumber}</span>
              <span><span style={{fontWeight:"bold"}}>Progress :</span> {task.progress}</span>
              <span>
                <span style={{fontWeight:"bold"}}>Deadline:</span>{" "}
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
              <button
              className="hoverBtn"
                onClick={() => {
                  setChoosenTask(task);
                  setShowTaskChat(true);
                }}
              >
                View Task Chat
              </button>
              {creator && (
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
        </div>
        
      </div>
    </div>
  );
}
