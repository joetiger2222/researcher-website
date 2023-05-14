import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function MarketPalce() {
  const userData = useLocation().state.data;
  const [researcherIdeas, setResearcherIdeas] = useState(null);
  const [allIdeas, setAllIdeas] = useState(null);

  function getResearcherIdeas() {
    fetch(
      `https://localhost:7187/api/Researchers/Ideas/${userData?.resercherId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData?.token}`,
        },
      }
    )
      .then((res) => (res.ok ? res.json() : alert("failed to Load Your Ideas")))
      .then((data) => {
        if (data) {
          setResearcherIdeas(data);
        }
      });
  }

  function getAllIdeas() {
    fetch(`https://localhost:7187/api/Ideas`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData?.token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : alert("failed to Load All Ideas")))
      .then((data) => {
        if (data) {
          setAllIdeas(data);
        }
      });
  }

  useEffect(() => {
    getResearcherIdeas();
    getAllIdeas();
  }, []);


  function sendReq(ideaId){
    fetch(`https://localhost:7187/api/Ideas/Requests/SendRequest/${userData?.resercherId}/${ideaId}`,{
        method:"POST",
        headers:{
            "Authorization":`Bearer ${userData.token}`
        }
    })
    .then(res=>res.ok?alert('request sent successfully !'):alert('Failed To Send Request'))
  }




  console.log(allIdeas);

  return (
    <div>
      <div>
        <h1>Your Ideas</h1>
        {researcherIdeas?.length > 0 ? (
          researcherIdeas?.map((idea) => {
            return (
              <div>
                <span>Name: {idea.name}</span>
              </div>
            );
          })
        ) : (
          <span>You Have No Ideas Yet!</span>
        )}
        <button>Create New Idea</button>
      </div>

      <div>
        <h1>All Ideas</h1>
        {allIdeas?.length > 0 ? (
          allIdeas?.map((idea) => {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "20px",
                  backgroundColor: "gray",
                  width: "30%",
                  color: "white",
                }}
              >
                <span>Name: {idea.name}</span>
                <span>Participants Number: {idea?.participantsNumber}</span>
                <span>
                  max Participants Number: {idea?.maxParticipantsNumber}
                </span>
                <span>specality: {idea?.specalityObj.name}</span>
                <span>
                  deadline:{" "}
                  {new Date(idea?.deadline).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span>topicObject: {idea?.topicObject.name}</span>
                {idea?.participantsNumber < idea?.maxParticipantsNumber && (
                  <button onClick={()=>sendReq(idea.id)}>Send Request</button>
                )}
              </div>
            );
          })
        ) : (
          <span> No Ideas Yet!</span>
        )}
      </div>
    </div>
  );
}
