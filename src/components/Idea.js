import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "./Header";

export default function Idea() {
  const userData = useLocation()?.state.data;
  const { ideaId } = useParams();
  const [idea, setIdea] = useState(null);
  const [ideaReqs, setIdeaReqs] = useState(null);
  const [resReqsData, setResReqsData] = useState([]);
  const navigate=useNavigate();

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

  function acceptReq(resId){
    const filterData = ideaReqs.find(req => req.researcherId === resId);


    fetch(`https://localhost:7187/api/Ideas/Requests/AcceptRequest/${filterData.id}/${filterData.researcherId}`,{
        method:"POST",
        headers:{
            "Authorization":`Bearer ${userData.token}`,
            "Content-Type":"application/json",
        }
    })
    .then(res=>res.ok?setResReqsData(resReqsData.filter(res=>res.id!==resId)):alert('failed to accept req'))
    .then(data=>data?console.log(data):null)
    
  }

  function rejectReq(resId){
    const filterData=ideaReqs.find(req=>req.researcherId===resId)
    fetch(`https://localhost:7187/api/Ideas/Requests/${filterData.id}`,{
        method:"DELETE",
        headers:{
            "Authorization":`Bearer ${userData.token}`,
            
        }
    })
    .then(res=>res.ok?setResReqsData(resReqsData.filter(res=>res.id!==resId)):alert('failed to reject req'))
    .then(data=>data?console.log(data):null)
  }
 

  console.log(resReqsData); 

  return (
    <div>
      <Header userData={userData} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "gray",
          marginTop: "130px",
        }}
      >
        <span>Name: {idea?.name}</span>
        <span>Participants Number: {idea?.participantsNumber}</span>
        <span>max Participants Number: {idea?.maxParticipantsNumber}</span>
        <span>specality: {idea?.specalityObj.name}</span>
        <span>
          deadline:{" "}
          {new Date(idea?.deadline).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        <span>topic: {idea?.topicObject.name}</span>
        <h1>Requests : {resReqsData?.length}</h1>
        {resReqsData?.map((res) => {
          return (
            <div style={{display:'flex'}}>
              <h1>Researcher Name : {res.firstName+' '+ res.lastName}</h1>
              <button onClick={()=>navigate(`/Profile/${res.studentId}`,{state:{data:userData}})}>View Profile</button>
              <button onClick={()=>acceptReq(res.id)}>Accept Request</button>
              <button onClick={()=>rejectReq(res.id)}>Reject Request</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
