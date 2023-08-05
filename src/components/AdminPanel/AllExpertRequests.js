import React from 'react'
import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toastr from 'toastr';
import Swal from 'sweetalert2';
export default function AllExpertRequests({userData}) {
    const navigate=useNavigate();
    const [allExpertReqs, setAllExpertReqs] = useState(null);
    const [showExpertReqsModal, setShowExpertReqsModal] = useState(false);
    const [expertIdea, setExpertIdea] = useState(null);


    function getAllExpertReqs() {
        fetch(`https://resweb-001-site1.htempurl.com/api/Admin/ExpertRequests`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        })
        //   .then((res) =>
        //     res.ok ? res.json() : null
        //   )
        .then(res=>{
            if(res){
               return res.json();
            }
        })
          .then((data) => (data ? setAllExpertReqs(data) : null));
      }



useEffect(()=>{
    if(userData.userId!==''){
        getAllExpertReqs();
    }
},[userData])






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
                  toastr.success("Request Successfully deleted", "Success");
                  props.onClose();
                  getAllExpertReqs();
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









  return (
    <div className="ContainerAllIdeas">
        <h1 style={{ color: "white" }}>All Expert Requestes</h1>
        <div
          style={{ maxHeight: "350px", overflow: "auto" }}
          className="AllIdeas custom-scrollbar"
        >
          {allExpertReqs?.length > 0 &&
            allExpertReqs?.map((req, index) => {
              return (
                
                <SingleExpertReqCard req={req} />
              );
            })}
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
