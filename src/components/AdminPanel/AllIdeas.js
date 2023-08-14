import React from 'react'
import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import toastr from 'toastr';
import loader from '../../loader.gif';
export default function AllIdeas({userData}) {
    const [allIdeas, setAllIdeas] = useState(null);
    const [searchIdea, setSearchIdea] = useState("");
    const [expertIdea, setExpertIdea] = useState(null);
    const [showExpertReqsModal, setShowExpertReqsModal] = useState(false);
    const [load,setLoad]=useState(false);
    const navigate=useNavigate();
    function getAllIdeas() {
        
        fetch(`https://resweb-001-site1.htempurl.com/api/Ideas?SearchTerm=${searchIdea}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userData?.token}`,
          },
        })
        .then(res=>{
            if(res.ok){
                return res.json();
            }
        })
          .then((data) => {
            if (data) {
              setAllIdeas(data);
            }
          });
      }



      useEffect(() => {
        if(userData.userId!==''){
        getAllIdeas();
        }
      }, [searchIdea,userData]);



      const ExpertReqsCard = (props) => {
        const [expertReqForSingleIdea, setExpertReqForSingleIdea] = useState([]);
    
        function getExpertReqs() {
          fetch(
            `https://resweb-001-site1.htempurl.com/api/Ideas/ExpertRequests/${props.idea.id}`,
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
                : toastr.error("failed to load Requests for this idea", "Failed")
            )
            .then((data) => (data ? setExpertReqForSingleIdea(data) : null));
        }
    
        useEffect(() => {
          getExpertReqs();
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
              <h1 className="headContact2">Expert Req For Idea</h1>
    
              <div className="FormModal2">
                <div className="AllExpertReq custom-scrollbar">
                  {expertReqForSingleIdea.length > 0 ? (
                    expertReqForSingleIdea?.map((req) => {
                      return <SingleExpertReqCard req={req} />;
                    })
                  ) : (
                    <div style={{ textAlign: "center" }}>No Expert Reqs</div>
                  )}
                </div>
    
                <div className="resetAndCancel2">
                  <button className="buttonExit2" onClick={props.onClose}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      };

      const SingleExpertReqCard = (props) => {
        const [resData, setResData] = useState(null);
    
        function getResData() {
          fetch(
            `https://resweb-001-site1.htempurl.com/api/Researchers/${props.req.participantId}`,
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
    
        useEffect(() => {
          getResData();
        }, []);
    
        function deleteExpertReq(req) {
          Swal.fire({
            title: "Are You Sure To Delete The Request",
            showCancelButton: true,
          }).then((data) => {
            if (data.isConfirmed) {
              fetch(`https://resweb-001-site1.htempurl.com/api/Admin/ExpertRequests/${req?.id}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${userData.token}`,
                },
              }).then((res) => {
                if (res.ok) {
                  toastr.success("Request Successfully deleted It will not be here when you renter the page", "Success");
                  props.onClose();
                } else {
                  toastr.error("Failed To Delete Request", "Failed");
                }
              });
            }
          });
        }
    
        return (
          <div className="ContExpertReqAdmin" style={{ backgroundColor: "white" }}>
            <span
              style={{
                padding: "10px",
                textAlign: "center",
                width: "100%",
                borderBottom: "1px solid black",
              }}
            >
              <span style={{ fontWeight: "bold" }}>Sender Name : </span>
              {resData?.firstName + " " + resData?.lastName}
            </span>
            <div className="ContBTNSData">
              <div className="contTitleAndContnentReq">
                <span>
                  <span style={{ fontWeight: "bold" }}>Title : </span>
                  {props.req.title}
                </span>
                <span
                  className="custom-scrollbar"
                  style={{ overflow: "auto", maxHeight: "150px" }}
                >
                  <span style={{ fontWeight: "bold" }}>Content : </span>
                  {props.req.content}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <button
                  className="detailsbtn"
                  onClick={() =>
                    navigate(`/Idea/${props.req.ideaId}`)
                  }
                >
                  View Idea
                </button>
                <button
                  className="buttonExit2"
                  onClick={() => deleteExpertReq(props.req)}
                >
                  Delete Expert Request
                </button>
              </div>
            </div>
          </div>
        );
      };



      if(load){
        return (
            <div className="ContainerAllIdeas">
                <img src={loader} />
      </div>
        )
      }

  return (
    <div className="ContainerAllIdeas">
        <h1 style={{ color: "white" }}>All Ideas</h1>
        <input
          placeholder="Search by name"
          className="search-input"
          onChange={(e) => setSearchIdea(e.target.value)}
        ></input>
        <div
          style={{ maxHeight: "480px", overflow: "auto" }}
          className="AllIdeas custom-scrollbar"
        >
          {allIdeas?.length > 0 ? (
            allIdeas?.map((idea, index) => {
              return (
                <div className="CardInAllIdeas">
                  <h2>Idea {index + 1}</h2>
                  <div className="containerSpansData">
                    <span
                      style={{
                        borderBottom: "1px solid black",
                        padding: "5px",
                      }}
                    >
                      Name:{" "}
                      <span style={{ fontWeight: "bold" }}>{idea.name}</span>
                    </span>
                    <span
                      style={{
                        borderBottom: "1px solid black",
                        padding: "5px",
                      }}
                    >
                      Status:{" "}
                      <span style={{ fontWeight: "bold" }}>{idea?.isCompleted?'Closed':'In Progress'}</span>
                    </span>

                    <span
                      style={{
                        borderBottom: "1px solid black",
                        padding: "5px",
                      }}
                    >
                      specality:{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {idea?.specalityObj?.name}
                      </span>
                    </span>
                    <span
                      style={{
                        borderBottom: "1px solid black",
                        padding: "5px",
                      }}
                    >
                      deadline:{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {new Date(idea?.deadline).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </span>
                    <span
                      style={{
                        borderBottom: "1px solid black",
                        padding: "5px",
                      }}
                    >
                      topic:{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {idea?.topicObject?.name}
                      </span>
                    </span>
                    <span
                      style={{
                        borderBottom: "1px solid black",
                        padding: "5px",
                      }}
                    >
                      Participants Number:{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {idea?.participantsNumber}
                      </span>
                    </span>
                    <span
                      style={{
                        borderBottom: "1px solid black",
                        padding: "5px",
                      }}
                    >
                      max Participants Number:{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {idea?.maxParticipantsNumber}
                      </span>
                    </span>
                  </div>
                  <div className="ContainerbtnData">
                    <button
                      className="button-arounder1"
                      onClick={() => {
                        setExpertIdea(idea);
                        setShowExpertReqsModal(true);
                      }}
                    >
                      View Expert Requests
                    </button>
                    <button
                      className="button-arounder1"
                      onClick={() =>
                        navigate(`/Idea/${idea.id}`)
                      }
                    >
                      View Idea
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <span> No Ideas Yet!</span>
          )}
        </div>

        {showExpertReqsModal && (
          <ExpertReqsCard
            show={showExpertReqsModal}
            onClose={() => setShowExpertReqsModal(false)}
            idea={expertIdea}
          />
        )}
      </div>
  )
}
