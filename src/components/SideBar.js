import React, { useState, useRef, useEffect } from "react";
import "../css/HomePage.css";
import "../css/SideBar.css";
import LOGO from "../images/Logo - Text Only.png";
import { FaGraduationCap, FaUser } from "react-icons/fa";
import { BiUserCircle, BiLogOut } from "react-icons/bi";
import { IoInformationCircleSharp } from "react-icons/io5";
import marketplace from "../images/marketplace.png";
import { FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { MyContext } from "../Users/Redux";
import { FaPaperPlane } from "react-icons/fa";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { FaBell } from "react-icons/fa";
import toastr from "toastr";
export default function SideBar() {
  const navigate = useNavigate();
  const userData = useContext(MyContext);
  const [choosenRes, setChoosenRes] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [shwoNotification, setshowNotification] = useState(false);

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

  const Notifications = (props) => {
    const [resNotifications, setResNotifications] = useState(null);
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
      if (userData.userId !== "" && resNotifications === null) {
        getResNotifications();
      }
    }, [userData]);
    return (
      <div className="modal-overlay2">
        <div className="modal2" style={{ width: "60%", height: "auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              margin: "0 0 10px",
            }}
            onClick={props.onClose}
          >
            <div class="outer">
              <div class="inner"></div>
            </div>
          </div>
          {resNotifications?.map((notification) => {
            return (
              <div
                className="singleNotification"
                onClick={() => {
                  setChoosenRes(notification);
                  setShowChatModal(true);
                  props.onClose();
                  deleteNotification(notification.id);
                }}
              >
                <span style={{ fontSize: "12px", border: "none" }}>
                  {notification.content}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        display: "none",
        position: "fixed",
        top: "0",
        height: "100%",
        width: "33%",
        left: "0",
        zIndex: "200",
        padding: "6px",
      }}
      className="sideBar"
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          rowGap: "40px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          onClick={() =>
            userData.roles === "Admin"
              ? navigate("/AdminPanel")
              : navigate(`/`)
          }
          src={LOGO}
          style={{ width: "70%", cursor: "pointer" }}
        />

        <div
          className=""
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            rowGap: "20px",
            alignItems: "center",
            padding: "20px",
          }}
        >
          
            <div
              onClick={() =>{ 
                if(userData.roles==='Researcher'){
                  navigate(`/MarketPlace`)
                }else if(userData.userId!==''){
                  toastr.info('You Need To Have At Least One Point To Access This Page');
                }else {
                  toastr.info('You Need To Login To Access This Page');
                }
                
            }}
              style={{
                display: "flex",
                alignItems: "center",
                columnGap: "10px",

              }}
            >
             
              <span
                className="sideBarName"
                style={{ fontWeight: "bold", fontSize: "16px", color: "black",textAlign:'center' }}
              >
                Research opportunities
              </span>
            </div>
          
          {userData.roles !== "Admin" && (
            <div
              onClick={() => {
                if(userData.userId!==''){
                  navigate("/");
                  setTimeout(()=>{
                    const el = document.getElementById("couresesContainer");
                    if(el){
                      window.scrollTo({
                        top: el.offsetTop,
                        behavior: "smooth",
                      });
                    }
                     
                   
                  },100)
                }else {
                  toastr.info('You Need To Login To Access This Page');
                }
                
              }}
              style={{
                display: "flex",
                alignItems: "center",
                columnGap: "10px",
              }}
            >
              <FaGraduationCap style={{ width: "30px", height: "30px" }} />
              <span
                className="sideBarName"
                style={{ fontWeight: "bold", fontSize: "20px", color: "black" }}
              >
                Courses
              </span>
            </div>
          )}
          
            <div
              onClick={() => {
                if(userData.roles==='Researcher'){
                navigate(`/Researchers`)
                }else if(userData.userId!==''){
                  toastr.info('You Need To Have At Least One Point To Access This Page');
                }else{
                  toastr.info('You Need To Login To Access This Page');
                }
              }}
              style={{
                display: "flex",
                alignItems: "center",
                columnGap: "10px",
              }}
            >
              <BiUserCircle style={{ width: "30px", height: "30px" }} />
              <span
                className="sideBarName"
                style={{ fontWeight: "bold", fontSize: "20px", color: "black" }}
              >
                Researchers
              </span>
            </div>
          
          {userData.roles !== "Admin" && (
            <div
            onClick={() => {
              
                navigate("/");
                setTimeout(()=>{
                  const el = document.getElementById("aboutUsContainer");
                  if(el){
                    window.scrollTo({
                      top: el.offsetTop,
                      behavior: "smooth",
                    });
                  }
                   
                 
                },100)
              
              
            }}
              style={{
                display: "flex",
                alignItems: "center",
                columnGap: "10px",
              }}
            >
              <IoInformationCircleSharp
                style={{ width: "30px", height: "30px" }}
              />
              <span
                className="sideBarName"
                style={{ fontWeight: "bold", fontSize: "20px", color: "black" }}
              >
                About Us
              </span>
            </div>
          )}
          {userData.roles !== "Admin" && userData.userId!==''&& (
            <div
              onClick={() => navigate(`/Profile/${userData.userId}`)}
              style={{
                display: "flex",
                alignItems: "center",
                columnGap: "10px",
              }}
            >
              <FiUser style={{ width: "30px", height: "30px" }} />
              <span
                className="sideBarName"
                style={{ fontWeight: "bold", fontSize: "20px", color: "black" }}
              >
                Profile
              </span>
            </div>
          )}
          {userData.roles==='Researcher'&&userData.userId!==''&&<div
            onClick={() => setshowNotification(true)}
            style={{ display: "flex", alignItems: "center", columnGap: "10px" }}
          >
            <FaBell style={{ width: "30px", height: "30px" }} />
            <span
              className="sideBarName"
              style={{ fontWeight: "bold", fontSize: "20px", color: "black" }}
            >
              Notifications
            </span>
          </div>}
          {userData.userId!==''&&<div
            onClick={() => {
              userData.setUserId("");
              userData.setToken("");
              userData.setRoles("");
              navigate("/");
            }}
            style={{ display: "flex", alignItems: "center", columnGap: "10px" }}
          >
            <BiLogOut style={{ width: "30px", height: "30px" }} />
            <span
              className="sideBarName"
              style={{ fontWeight: "bold", fontSize: "20px", color: "black" }}
            >
              Logout
            </span>
          </div>}
          {userData.userId===''&&<div
            onClick={() => {
             
              navigate("/Login");
            }}
            style={{ display: "flex", alignItems: "center", columnGap: "10px" }}
          >
            <FaUser style={{ width: "30px", height: "30px" }} />
            <span
              className="sideBarName"
              style={{ fontWeight: "bold", fontSize: "20px", color: "black" }}
            >
              Login
            </span>
          </div>}
          {userData.userId===''&&<div
            onClick={() => {
              
              navigate("/Registration");
            }}
            style={{ display: "flex", alignItems: "center", columnGap: "10px" }}
          >
            <FaUser style={{ width: "30px", height: "30px" }} />
            <span
              className="sideBarName"
              style={{ fontWeight: "bold", fontSize: "20px", color: "black" }}
            >
              SignUp
            </span>
          </div>}
        </div>
      </div>
      {choosenRes && showChatModal && (
        <PrivateChatCard
          otherPersonId={choosenRes.senderId}
          show={showChatModal}
          onClose={() => setShowChatModal(false)}
        />
      )}
      {shwoNotification && (
        <Notifications
          show={shwoNotification}
          onClose={() => setshowNotification(false)}
        />
      )}
    </div>
  );
}
