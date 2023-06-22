import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "./Header";

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
  const [showExpertReqModal, setShowExpertReqModal] = useState(false);
  const [showAssignParticpantToTask,setShowAssingParticpantToTask]=useState(false);
  const [choosenTask,setChoosenTask]=useState(null);
  const [showTaskParticpants,setShowTaskParticpants]=useState(false);
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
          
          if (filter.length > 0 && filter[0].points>3) setIsPart(true);
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
      <div
        style={{
          position: "fixed",
          left: "0",
          top: "0",
          right: "0",
          bottom: "0",
          backgroundColor: "rgba(0, 0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: "100",
        }}
      >
        <div style={{ backgroundColor: "white", width: "50%" }}>
          {ress
            ?.filter((res) => res.id !== userData?.resercherId.toLowerCase())
            .map((res) => {
              // console.log(res.id)
              return (
                <div>
                  <span>
                    {res?.studentObj.firstName + " " + res?.studentObj.lastName}
                  </span>
                  <button
                    onClick={() =>
                      navigate(`/Profile/${res?.studentObj.id}`, {
                        state: { data: userData },
                      })
                    }
                  >
                    View Profile
                  </button>
                  <button onClick={() => sendInvitation(res.id)}>Invite</button>
                </div>
              );
            })}
          <button onClick={props.onClose}>Cancel</button>
        </div>
      </div>
    );
  };


  const CreateTaskCard = (props) => {
    
    const [taskData, setTaskData] = useState({
      name: '',
      participantsNumber: 0,
      description: '',
      deadline: '',
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
      const val=/^\d{4}-\d{2}-\d{2}$/.test(taskData.deadline)
      if(val){
      fetch(
        `https://localhost:7187/api/Ideas/Tasks/InitiateTask/${ideaId}/${userData.resercherId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userData?.token}`,
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
        }
      
        else{ window.location.reload()}
      })
      .catch((error) => console.error(error));
      
      }else alert('please enter a valid deadline yyyy-mm-dd')
      
    }

   

    if (!props.show) return null;
    return (
      <div
        style={{
          position: "fixed",
          left: "0",
          top: "0",
          right: "0",
          bottom: "0",
          backgroundColor: "rgba(0, 0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: "100",
        }}
      >
        <div style={{ backgroundColor: "white", width: "50%" }}>
          <span>Task Name: </span>
          <input onChange={getTaskData} name="name"></input>
          <span>participants Number: </span>
          <input
            onChange={(e) =>
              setTaskData((prev) => {
                return { ...prev, participantsNumber: e.target.value * 1 };
              })
            }
            name="participantsNumber"
          ></input>
          <span>description: </span>
          <input onChange={getTaskData} name="description"></input>
          <input
            type="text"
            name="deadline"
            onChange={getTaskData}
            placeholder="yyyy-mm-dd"
          ></input>
          <button onClick={props.onClose}>Canel</button>
          <button onClick={createfTask}>Create</button>
        </div>
      </div>
    );
  };

  const SendExpertReqCard = (props) => {

    const [expertReqData,setExpterReqData]=useState({title:'',content:'',ideaId:ideaId,participantId:userData.resercherId})

    console.log(expertReqData)

    function getExpterReqData(e){
      setExpterReqData(prev=>{
        return{
          ...prev,
          [e.target.name]:e.target.value
        }
      })
    }

    function sendExpertReq(){
      fetch(`https://localhost:7187/api/Researchers/Ideas/ExpertRequest`,{
        method:'POST',
        headers:{
          "Content-Type":"application/json",
          "Authorization":`Bearer ${userData.token}`
        },
        body:JSON.stringify(expertReqData)
      })
      // .then(res=>res.ok?alert('Expert Request Sent Successfully'):alert('Failed To Send Please Try Again Later'))
      .then(res=>{
        if(res.ok){
          alert('Expert Request Sent Successfully')
          props.onClose()
        }else alert('Failed To Send Please Try Again Later')
      })
    }

    if (!props.show) return null;
    return (
      <div
        style={{
          position: "fixed",
          left: "0",
          top: "0",
          right: "0",
          bottom: "0",
          backgroundColor: "rgba(0, 0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: "100",
        }}
      >
        <div style={{ backgroundColor: "white", width: "50%" }}>
          <span>TITLE : </span>
          <input name="title" onChange={getExpterReqData}></input>

          <span>CONTENT : </span>
          <input name="content" onChange={getExpterReqData}></input>
          <div>
            {expertReqData.title&&expertReqData.content&&<button onClick={sendExpertReq}>Submit</button>}
            <button onClick={props.onClose}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };


const AssignParticpantToTask=(props)=>{

  function assignToTask(id){
    console.log(id)
    let data=[];
    data.push(id)
    fetch(`https://localhost:7187/api/Ideas/Tasks/Participants/${props.task.id}`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Authorization":`Bearer ${userData.token}`
      },
      body:JSON.stringify(data)
    })
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
      }else alert('Particpant Assigned Successfully')
    
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
      style={{
        position: "fixed",
        left: "0",
        top: "0",
        right: "0",
        bottom: "0",
        backgroundColor: "rgba(0, 0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: "100",
      }}
    >
      <div style={{ backgroundColor: "white", width: "50%" }}>
        {ideaPar?.map(par=>{
          return(
            <div>
                <span>
                  {par?.studentObj.firstName + " " + par?.studentObj.lastName}
                  <button
                    onClick={() =>
                      navigate(`/profile/${par.studentObj.id}`, {
                        state: { data: userData },
                      })
                    }
                  >
                    View Profile
                  </button>
                  <button onClick={()=>assignToTask(par.id)}>Assign To Task</button>
                </span>
              </div>
          )
        })}
        <button onClick={props.onClose}>Close</button>
      </div>
      </div>
  )
}

const TaskParticpantsCard=(props)=>{
  const [taskParticpants,setTaskParticpants]=useState(null)

  function getTaskParticpants(){
    fetch(`https://localhost:7187/api/Ideas/Tasks/Participants/${props.task.id}`,{
      method:"GET",
      headers:{
        "Authorization":`Bearer ${userData.token}`
      }
    })
    .then(res=>res.ok?res.json():alert('failed to load particpants to task'))
    .then(data=>data?setTaskParticpants(data):null)
  }

  useEffect(()=>{
    getTaskParticpants();
  },[])

  console.log(taskParticpants)

  if (!props.show) return null;
  return (
    <div
      style={{
        position: "fixed",
        left: "0",
        top: "0",
        right: "0",
        bottom: "0",
        backgroundColor: "rgba(0, 0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: "100",
      }}
    >
      <div style={{ backgroundColor: "white", width: "50%" }}>
        {taskParticpants?.map(par=>{
          return(
            <div>
              <span>{par.studentObj.firstName+" "}</span>
              <span>{par.studentObj.lastName}</span>
              <button onClick={()=>navigate(`/Profile/${par.studentObj.id}`,{state:{data:userData}})}>View Profile</button>
              </div>
          )
        })}
        <button onClick={props.onClose}>Close</button>
      </div>
      </div>
  )
}



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
        {creator && <h1>Requests : {resReqsData?.length}</h1>}
        {creator &&
          resReqsData?.map((res) => {
            return (
              <div style={{ display: "flex" }}>
                <h1>Researcher Name : {res.firstName + " " + res.lastName}</h1>
                <button
                  onClick={() =>
                    navigate(`/Profile/${res.studentId}`, {
                      state: { data: userData },
                    })
                  }
                >
                  View Profile
                </button>
                <button onClick={() => acceptReq(res.id)}>
                  Accept Request
                </button>
                <button onClick={() => rejectReq(res.id)}>
                  Reject Request
                </button>
              </div>
            );
          })}
        {creator && (
          <button onClick={() => setShowResModal(true)}>
            Invite Researcher
          </button>
        )}
        {creator && showResModal && (
          <AllResCard
            show={showResModal}
            onClose={() => setShowResModal(false)}
          />
        )}
        <div>
          <h1>Participants : {ideaPar?.length}</h1>
          {ideaPar?.map((par) => {
            return (
              <div>
                <span>
                  {par?.studentObj.firstName + " " + par?.studentObj.lastName}
                  <button
                    onClick={() =>
                      navigate(`/profile/${par.studentObj.id}`, {
                        state: { data: userData },
                      })
                    }
                  >
                    View Profile
                  </button>
                </span>
              </div>
            );
          })}
        </div>
        <div>
          <h1>Tasks : {tasks?.length}</h1>
          {tasks?.map((task) => {
            return (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span>Name : {task.name}</span>
                <span>description : {task.description}</span>
                <span>participantsNumber : {task.participantsNumber}</span>
                <span>progress : {task.progress}</span>
                <span>
                  deadline:{" "}
                  {new Date(task?.deadline).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <button onClick={()=>{setChoosenTask(task);setShowTaskParticpants(true)}}>View Task Particpants</button>
                {creator&&<button onClick={()=>{setChoosenTask(task);setShowAssingParticpantToTask(true)}}>Assign Particpants</button>}
                
              </div>
            );
          })}
          {choosenTask&&showAssignParticpantToTask&&<AssignParticpantToTask show={showAssignParticpantToTask} onClose={()=>setShowAssingParticpantToTask(false)} task={choosenTask} />}
          {choosenTask&&showTaskParticpants&&<TaskParticpantsCard show={showTaskParticpants} onClose={()=>setShowTaskParticpants(false)} task={choosenTask} />}
          {creator && (
            <button onClick={() => setShowTaskCard(true)}>
              Create New Task
            </button>
          )}
          {creator && showTaskCard && (
            <CreateTaskCard
              show={showTaskCard}
              onClose={() => setShowTaskCard(false)}
            />
          )}
        </div>
        {isPart &&  (
          <button onClick={() => setShowExpertReqModal(true)}>
            Send Expert Request
          </button>
        )}
        {showExpertReqModal && (
          <SendExpertReqCard
            show={showExpertReqModal}
            onClose={() => setShowExpertReqModal(false)}
          />
        )}
      </div>
    </div>
  );
}
