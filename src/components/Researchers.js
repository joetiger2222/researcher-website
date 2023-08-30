import React, { useEffect, useState ,useRef} from "react";
import {  useNavigate } from "react-router-dom";
import Header from "./Header";
import "../css/Researchers.css";
import { BiChat } from 'react-icons/bi';
import { FaPaperPlane } from "react-icons/fa";
import { HubConnectionBuilder } from "@microsoft/signalr";
import kariem from "../images/userImg.png";
import toastr from "toastr";
import 'toastr/build/toastr.min.css';
import { useContext } from "react";
import { MyContext } from '../Users/Redux';
import SideBar from "./SideBar";
export default function Researchers(){
  const [sideBarVisible, setSideBarVisible] = useState(false);
  const userData = useContext(MyContext);
    
    const [researchers,setResearchers]=useState(null);
    const [searchData,setSearchData]=useState({SearchTerm:'',Level:'',Specality:0,PageSize:10})
    const [allSpecs, setAllSpecs] = useState(null);
    const [choosenRes,setChoosenRes]=useState(null);
    const [showChatModal,setShowChatModal]=useState(false);
    const navigate=useNavigate();
    
    





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







  function getAllResearchers() {
    fetch(
      `https://resweb-001-site1.htempurl.com/api/Researchers?SearchTerm=${searchData.SearchTerm}&Level=${searchData.Level}&Specality=${searchData.Specality}&PageSize=${searchData.PageSize}`,
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
      .then((data) => (data ? setResearchers(data) : null));
  }

  function getAllSpecs() {
    fetch(`https://resweb-001-site1.htempurl.com/api/Researchers/Specialties`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setAllSpecs(data);
        }
      });
  }

  useEffect(() => {
    getAllSpecs();
  }, [userData]);

  useEffect(() => {
    getAllResearchers();
  }, [searchData,userData]);

  useEffect(()=>{
    window.scrollTo(0, 0);
  },[])


  const PrivateChatCard = (props) => {
    console.log(props)
    const [messageToSend, setMessageToSend] = useState({
      content: "",
      date: new Date().toISOString(),
      senderId:userData.userId,
      reciverId:props.otherPersonId,
    });
    const [AllMessages, setAllMessages] = useState([]);
    const otherPersonData=researchers.filter(res=>res.studentObj.id===props.otherPersonId)
    
    
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
           
            <span style={{fontWeight:"bold"}}>{otherPersonData[0].studentObj.firstName+" "+ otherPersonData[0].studentObj.lastName}</span>
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


const ResCard=(props)=>{

  const[studentImage,setStudentImage]=useState({url:kariem});


  function getStudentImage(){
    fetch(`https://resweb-001-site1.htempurl.com/api/Students/Image/${props.res?.studentObj?.id}`,{
      method:"GET",
      headers:{
        "Authorization":`Bearer ${userData.token}`
      }
    })
    .then(res=>res.ok?setStudentImage(res):null)
    
  }

  useEffect(()=>{
    getStudentImage();
  },[])


  return (
    <div className="ContCarduserInfo">
      <div className="photoUserCard">
        <div className="ContainerImgRes">
        <img src={studentImage.url} alt="photo" />

        </div>
      </div>
      <div className="containerSpansData padding20px">
      <span>
        {"Name : " +
          props.res?.studentObj?.firstName +
          " " +
          props.res?.studentObj?.lastName}
      </span>
      <span>{"Age : " + props.res?.studentObj?.age}</span>
      {/* <span>{"Nationality : " + props.res?.studentObj?.nationality}</span> */}
      <span>{"Speciality : " + props.res?.specalityObject?.name}</span>
      <span>{"Points : " + props.res?.points}</span>
      <span>{"Level : " + props.res?.level}</span>
      
      <div className="ContainerbtnData">
      <button
      className="bn54"
        onClick={() =>
          navigate(`/Profile/${props.res?.studentObj?.id}`)
        }
      >
        View Profile
      </button>
      <button
      onClick={()=>{setChoosenRes(props.res?.studentObj?.id);setShowChatModal(true)}}
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
}



if(userData.userId===''||userData.roles!=='Researcher'){
  return (
    <div style={{display:'flex',width:'100%',minHeight:'100vh',justifyContent:'center',alignItems:'center',flexDirection:'column',rowGap:'20px'}}>
      <h1>Please Login First</h1>
      <button style={{width:'120px',height:'50px',borderRadius:'10px',backgroundColor:'rgb(21, 46, 125)',color:'white',fontSize:'20px',fontWeight:'bold'}} onClick={()=>navigate('/Login')}>Login</button>
    </div>
  )
}


  return (
    <>
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
      <div className="AllResearchersPage">
        <h1 className="">Seacrch For Researchers</h1>
        {/* <Header userData={userData}/> */}
        <div className="AllIdeas searchPanel">
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
            {[{num:0,level:'Beginner'}, {num:1,level:'Intermediate'}, {num:2,level:'Professional'}, {num:3,level:'Expert'}]?.map((arr) => {
              return <option value={arr.num}>{arr.level}</option>;
            })}
          </select>

        </div>
        <div className="AllIdeas">
          {researchers?.filter(res=>res.id!==userData.resercherId.toLowerCase()).map((res) => {
            return(
            <ResCard res={res} />
            )
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
