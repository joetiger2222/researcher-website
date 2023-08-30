import React, { useEffect, useRef, useState } from "react";
import "../css/Header.css";
import { useNavigate } from "react-router-dom";
import kariem from "../images/userImg.png";
import LOGO from "../images/Logo - Text Only2.png";
import { useContext } from "react";
import { MyContext } from "../Users/Redux";
import loader from "../loader.gif";
import "toastr/build/toastr.min.css";
import toastr from "toastr";
import { FaPaperPlane } from "react-icons/fa";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { FaBell } from "react-icons/fa";
export default function Header() {
  const navigate = useNavigate();
  const userData = useContext(MyContext);
  const [choosenRes, setChoosenRes] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [resNotifications, setResNotifications] = useState(null);

  function getStudentImage() {
    fetch(
      `https://resweb-001-site1.htempurl.com/api/Students/Image/${userData?.userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.blob();
        } else {
          userData.setStudentImage(kariem);
        }
      })
      .then((blob) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64Image = reader.result.split(",")[1]; // Extract base64 data
          sessionStorage.setItem("studentImage", base64Image);
          userData.setStudentImage(URL.createObjectURL(blob));
        };
        reader.readAsDataURL(blob);
      })
      .catch((e) => {
        userData.setStudentImage(kariem);
      });
  }

  function getResearcherIdByStudentId() {
    fetch(
      `https://resweb-001-site1.htempurl.com/api/Researchers/ResearcherId/${userData.userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      }
    )
      .then((res) =>
        res.ok ? res.json() : userData.setResercherId("not found")
      )
      .then((data) => {
        if (data) {
          userData.setRoles("Researcher");
          userData.resercherId = data.researcherId;
          userData.setResercherId(data.researcherId);
        }
      })
      .catch((error) => console.error(error));
  }

  function getResNotifications() {
    fetch(
      `https://resweb-001-site1.htempurl.com/api/Researchers/Notifications/${userData.resercherId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else toastr.error("Failed TO Load Notifications", "Failed");
      })
      .then((data) => {
        if (data) {
          setResNotifications(data);
        }
      });
  }

  function deleteNotification(id) {
    fetch(
      `https://resweb-001-site1.htempurl.com/api/Researchers/Notifications/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      }
    ).then((res) => {
      if (res.ok) {
        setResNotifications(
          resNotifications.filter((notification) => notification.id !== id)
        );
      } else
        toastr.error("Failed To Delete Notification Please Try Again Later");
    });
  }

  useEffect(() => {
    if (userData.userId != null && userData.userId !== "") {
      if (userData.studentImage === "" && userData.roles !== "Admin") {
        getStudentImage();
      }
      if (userData.resercherId === "") {
        getResearcherIdByStudentId();
      }
      if (userData.roles === "Researcher") {
        getResNotifications();
      }
    }
  }, [userData]);

  const PrivateChatCard = (props) => {
    console.log(props);
    const [messageToSend, setMessageToSend] = useState({
      content: "",
      date: new Date().toISOString(),
      senderId: userData.userId,
      reciverId: props.otherPersonId,
    });
    const [AllMessages, setAllMessages] = useState([]);
    // const otherPersonData=researchers.filter(res=>res.studentObj.id===props.otherPersonId)

    const latestChat = useRef(null);

    latestChat.current = AllMessages;

    let counter = 1;
    function getMyMessages() {
      if (counter === 1) {
        fetch(
          `https://resweb-001-site1.htempurl.com/api/Chat/Private?senderId=${userData.userId}&reciverId=${props.otherPersonId}`,
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
              : toastr.error("failed to load your messages", "Failed")
          )

          .then((data) => {
            setAllMessages((prev) => [...prev, ...data]);
          });
      }
      counter = 0;
    }

    let otherCounter = 1;
    function getOtherMessages() {
      if (otherCounter === 1) {
        fetch(
          `https://resweb-001-site1.htempurl.com/api/Chat/Private?senderId=${props.otherPersonId}&reciverId=${userData.userId}`,
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
              : toastr.error("failed to load your messages", "Failed")
          )

          .then((data) => {
            setAllMessages((prev) => [...prev, ...data]);
          });
      }
      otherCounter = 0;
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
      if (messageToSend.content === "") {
        toastr.error("Please Enter A Valid Message");
        return;
      }
      const chatMessage = {
        content: messageToSend.content,
        date: new Date().toISOString(),
        senderId: userData.userId,
        reciverId: props.otherPersonId,
      };

      try {
        await fetch(`https://resweb-001-site1.htempurl.com/api/Chat/Private`, {
          method: "POST",
          body: JSON.stringify(chatMessage),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
        }).then((response) =>
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              margin: "0 0 10px",
            }}
            onClick={props.onClose}
          >
            <span style={{ fontWeight: "bold" }}>
              {choosenRes.firstName + " " + choosenRes.lastName}
            </span>
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
                  <div
                    style={{
                      gap: "5px",
                      display: "flex",
                      flexDirection: "column",
                      alignSelf:
                        message.senderId === userData.userId
                          ? "flex-end"
                          : null,
                    }}
                  >
                    <p
                      style={{
                        padding: "8px",
                        backgroundColor: "rgb(213,213,213)",
                      }}
                      className="borderR spanChat"
                    >
                      {message.content}
                    </p>
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

  return (
    <div className="headerParent">
      <div className="headerContainer">
        <div style={{ width: "100px", height: "50px" }} className="headerLeft">
          <img
            src={LOGO}
            style={{ cursor: "pointer", width: "100%", height: "100%" }}
            onClick={() =>
              userData.roles === "Admin"
                ? navigate("/AdminPanel")
                : navigate("/")
            }
          />
        </div>

        <div className="headerRight">
          <ul className="headerUl">
            <li
              onClick={() =>
                userData?.roles === "Researcher"
                  ? navigate("/MarketPlace")
                  : userData.userId !== ""
                  ? toastr.info(
                      "You Need To Have At Least One Point Before Unlocking This Page"
                    )
                  : toastr.info(
                      "You Need To Login First Before Unlocking This Page"
                    )
              }
            >
              Research opportunities
            </li>

            {userData.roles !== "Admin" && (
              <li class="dropdown">
                <a
                  onClick={() => {
                    if (userData.userId !== "") {
                      navigate("/");

                      setTimeout(() => {
                        const el = document.getElementById("couresesContainer");
                        if (el) {
                          window.scrollTo({
                            top: el.offsetTop,
                            behavior: "smooth",
                          });
                        }
                      }, 100);
                      // window.scrollTo(0, 1600);
                    } else {
                      toastr.info(
                        "You Need To Login First Before Unlocking This Page"
                      );
                    }
                  }}
                >
                  Courses
                </a>
              </li>
            )}

            <li
              onClick={() =>
                userData?.roles === "Researcher"
                  ? navigate(`/Researchers`)
                  : userData.userId !== ""
                  ? toastr.info(
                      "You Need To Have At Least One Point Before Unlocking This Page"
                    )
                  : toastr.info(
                      "You Need To Login First Before Unlocking This Page"
                    )
              }
            >
              Researchers
            </li>
            {userData.roles !== "Admin" && (
              <li class="dropdown">
                {/* <a
                  onClick={() => {
                    navigate("/");
                    window.scrollTo(0, 2000);
                  }}
                >
                  About Us
                </a> */}
                <a
                  onClick={() => {
                    
                      navigate("/");

                      setTimeout(() => {
                        const el = document.getElementById("aboutUsContainer");
                        console.log(`setTimeout ~ el:`, el)
                        if (el) {
                          window.scrollTo({
                            top: el.offsetTop,
                            behavior: "smooth",
                          });
                        }
                      }, 100);
                      // window.scrollTo(0, 1600);
                    
                  }}
                >
                  About Us
                </a>
              </li>
            )}
            {userData.roles === "Researcher" && (
              <li class="dropdown">
                <FaBell style={{ width: "30px", height: "30px" }} />

                <div class="dropdown-content">
                  {resNotifications?.map((notification) => {
                    return (
                      <div
                        className="singleNotification"
                        onClick={() => {
                          setChoosenRes(notification);
                          setShowChatModal(true);
                          deleteNotification(notification.id);
                        }}
                      >
                        <span>{notification.content}</span>
                        {/* <FaTrash onClick={()=>deleteNotification(notification.id)} style={{color:'red',width:'20px',height:'20px'}} /> */}
                      </div>
                    );
                  })}
                </div>
              </li>
            )}
          </ul>

          <div className="headerBtnsContainer">
            {userData.userId !== "" && (
              <button
                onClick={() => {
                  userData.setUserId("");
                  userData.setToken("");
                  userData.setRoles("");
                  userData.setResercherId("");
                  userData.setStudentImage("");
                  sessionStorage.setItem('userId', '');
                  sessionStorage.setItem('token', '');
                  sessionStorage.setItem('roles', '');
                  sessionStorage.setItem('resercherId','');
                      navigate("/");
                }}
                className="headerSignBtn"
              >
                Logout
              </button>
            )}
            {userData.userId === "" && (
              <button
                onClick={() => {
                  navigate("/Login");
                }}
                className="headerSignBtn"
              >
                Login
              </button>
            )}
            {userData.userId === "" && (
              <button
                onClick={() => {
                  navigate("/Registration");
                }}
                className="headerSignBtn"
              >
                Signup
              </button>
            )}
          </div>

          {userData.roles !== "Admin" && (
            <li class="dropdown">
              {userData.studentImage === "" && userData.userId !== "" && (
                <img src={loader} class="dropbtn userImgHeader" />
              )}
              {userData.studentImage !== "" && userData.userId !== "" && (
                <img
                  src={userData.studentImage}
                  class="dropbtn userImgHeader"
                />
              )}
              <div class="dropdown-content">
                <a
                  className="singleNotification"
                  onClick={() =>
                    userData.roles === "Admin"
                      ? navigate("/AdminPanel")
                      : navigate(`/Profile/${userData.userId}`)
                  }
                >
                  Profile
                </a>
              </div>
            </li>
          )}
        </div>
      </div>
      {choosenRes && showChatModal && (
        <PrivateChatCard
          otherPersonId={choosenRes.senderId}
          show={showChatModal}
          onClose={() => setShowChatModal(false)}
        />
      )}
    </div>
  );
}
