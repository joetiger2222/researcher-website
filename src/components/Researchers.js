import React, { useEffect, useState ,useRef} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import "../css/Researchers.css";
import { BiChat } from 'react-icons/bi';
import { FaPaperPlane } from "react-icons/fa";
import { HubConnectionBuilder } from "@microsoft/signalr";

import user from "../images/imageUser.png"
export default function Researchers(){

    const userData=useLocation().state.data
    const [researchers,setResearchers]=useState(null);
    const [searchData,setSearchData]=useState({SearchTerm:'',Level:'',Specality:0,PageSize:10})
    const [allSpecs, setAllSpecs] = useState(null);
    const [choosenRes,setChoosenRes]=useState(null);
    const [showChatModal,setShowChatModal]=useState(false);
    const navigate=useNavigate();
    
    

  function getAllResearchers() {
    fetch(
      `https://localhost:7187/api/Researchers?SearchTerm=${searchData.SearchTerm}&Level=${searchData.Level}&Specality=${searchData.Specality}&PageSize=${searchData.PageSize}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      }
    )
      .then((res) =>
        res.ok ? res.json() : alert("failed to load Researchers")
      )
      .then((data) => (data ? setResearchers(data) : null));
  }

  function getAllSpecs() {
    fetch(`https://localhost:7187/api/Researchers/Specialties`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : alert("failed to Load specs")))
      .then((data) => {
        if (data) {
          setAllSpecs(data);
        }
      });
  }

  useEffect(() => {
    getAllSpecs();
  }, []);

  useEffect(() => {
    getAllResearchers();
  }, [searchData]);




  const PrivateChatCard = (props) => {
    const [messageToSend, setMessageToSend] = useState({
      content: "",
      date: new Date().toISOString(),
      senderId:userData.userId,
      reciverId:props.otherPersonId,
    });
    const [AllMessages, setAllMessages] = useState([]);
    const latestChat = useRef(null);

    latestChat.current = AllMessages;


let counter=1;
    function getMessages() {
      if(counter===1){
      fetch(`https://localhost:7187/api/Chat/Private?senderId=${userData.userId}&reciverId=${props.otherPersonId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setAllMessages(data)); 
        
    }
    counter=0;
    }



    AllMessages.sort((a, b) => new Date(a.date) - new Date(b.date));

    useEffect(() => {
      const connection = new HubConnectionBuilder()
        .withUrl("https://localhost:7187/hubs/Privatechat")
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
      getMessages();
    }, []);



    const chatWindowRef = useRef(null);

    function scrollToBottom() {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }

    useEffect(() => {
      scrollToBottom();
    }, [AllMessages]);


console.log(messageToSend)
    const sendMessage = async (e) => {
      e.preventDefault();
      const chatMessage = {
        content: messageToSend.content,
        date: new Date().toISOString(),
        senderId:userData.userId,
        reciverId:props.otherPersonId,
      };
      

      try {
        await fetch(
          `https://localhost:7187/api/Chat/Private`,
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
              {AllMessages?.map((message) => {
                return (
                  <div style={{ display: "flex", flexDirection: "column",alignSelf:message.senderId===userData.userId?'flex-end':null }}>
                    <p className="spanChat">{message.content}</p>
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
    <>
      <Header userData={userData} />
      <div className="AllResearchersPage">
        <h1 className="">Seacrch For Researchers</h1>
        {/* <Header userData={userData}/> */}
        <div className="AllIdeas ">
          <input
            className="search-input"
            placeholder="Search By Name"
            name="SearchTerm"
            onChange={(e) =>
              setSearchData((prev) => {
                return { ...prev, [e.target.name]: e.target.value };
              })
            }
          ></input>
          <select
            className="search-select"
            name="Specality"
            onChange={(e) =>
              setSearchData((prev) => {
                return { ...prev, [e.target.name]: e.target.value * 1 };
              })
            }
          >
            <option value={0} selected>
              Speciality
            </option>
            {allSpecs?.map((spec) => {
              return <option value={spec.id}>{spec.name}</option>;
            })}
          </select>
          <select
            className="search-select"
            name="Level"
            onChange={(e) =>
              setSearchData((prev) => {
                return { ...prev, [e.target.name]: e.target.value };
              })
            }
          >
            <option value={""} selected>
              Level
            </option>
            {[0, 1, 2, 3]?.map((level) => {
              return <option value={level}>{level}</option>;
            })}
          </select>

        </div>
        <div className="AllIdeas">
          {researchers?.filter(res=>res.id!==userData.resercherId.toLowerCase()).map((res) => {
            return (
              <div className="ContCarduserInfo">
                <div className="photoUserCard">
                    <img src={user} alt="photo" />
                </div>
                <div className="containerSpansData padding20px">
                <span>
                  {"Name : " +
                    res.studentObj.firstName +
                    " " +
                    res.studentObj.lastName}
                </span>
                <span>{"Age : " + res.studentObj.age}</span>
                <span>{"Nationality : " + res.studentObj.nationality}</span>
                <span>{"Speciality : " + res.specalityObject.name}</span>
                <span>{"Points : " + res.points}</span>
                <span>{"Level : " + res.level}</span>
                
                <div className="ContainerbtnData">
                <button
                className="bn54"
                  onClick={() =>
                    navigate(`/Profile/${res.studentObj.id}`, {
                      state: { data: userData },
                    })
                  }
                >
                  View Profile
                </button>
                <button
                onClick={()=>{setChoosenRes(res.studentObj.id);setShowChatModal(true)}}
            className="plusBtn"            
            >
              Chat
              <BiChat/>
              {/* <PiChatCircleTextBold/> */}
            </button>
                </div>
                </div>
               
              </div>
            );
          })}
          {choosenRes&&showChatModal&&<PrivateChatCard otherPersonId={choosenRes} show={showChatModal} onClose={()=>setShowChatModal(false)} />}
        </div>
        <div className="">
            <button
            className="plusBtn"
              onClick={() =>
                setSearchData((prev) => {
                  return { ...prev, PageSize: searchData.PageSize + 10 };
                })
              }
            >
              View More
            </button>
           
          </div>
      </div>
    </>
  );
}
