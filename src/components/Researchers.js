import React, { useEffect, useState ,useRef} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import "../css/Researchers.css";
import { BiChat } from 'react-icons/bi';
import { FaPaperPlane } from "react-icons/fa";
import { HubConnectionBuilder } from "@microsoft/signalr";
import kariem from "../images/userImg.png";
import user from "../images/imageUser.png"
import ToastrComponent from "./Cards/ToastrComponent";
import toastr from "toastr";
import 'toastr/build/toastr.min.css';

import Footer from "./Footer";
import { useContext } from "react";
import { MyContext } from '../Users/Redux';
export default function Researchers(){
  const userData = useContext(MyContext);
    // const userData=useLocation().state.data
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
        res.ok ? res.json() : null
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




  const PrivateChatCard = (props) => {
    const [messageToSend, setMessageToSend] = useState({
      content: "",
      date: new Date().toISOString(),
      senderId:userData.userId,
      reciverId:props.otherPersonId,
    });
    const [AllMessages, setAllMessages] = useState([]);
    const otherPersonData=researchers.filter(res=>res.studentObj.id===props.otherPersonId)
    console.log('other person data',otherPersonData);
    
    const latestChat = useRef(null);

    latestChat.current = AllMessages;


let counter=1;
    function getMyMessages() {
      if(counter===1){
      fetch(`https://localhost:7187/api/Chat/Private?senderId=${userData.userId}&reciverId=${props.otherPersonId}`, {
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
      fetch(`https://localhost:7187/api/Chat/Private?senderId=${props.otherPersonId}&reciverId=${userData.userId}`, {
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
    fetch(`https://localhost:7187/api/Students/Image/${props.res?.studentObj?.id}`,{
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



if(userData.userId===''){
  return (
    <div style={{display:'flex',width:'100%',minHeight:'100vh',justifyContent:'center',alignItems:'center',flexDirection:'column',rowGap:'20px'}}>
      <h1>Please Login First</h1>
      <button style={{width:'120px',height:'50px',borderRadius:'10px',backgroundColor:'rgb(21, 46, 125)',color:'white',fontSize:'20px',fontWeight:'bold'}} onClick={()=>navigate('/')}>Login</button>
    </div>
  )
}







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
