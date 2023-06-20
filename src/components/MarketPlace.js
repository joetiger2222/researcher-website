import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";

export default function MarketPalce() {
  const userData = useLocation().state.data;
  const [researcherIdeas, setResearcherIdeas] = useState(null);
  const [allIdeas, setAllIdeas] = useState(null);
  const [showCreateIdeaCard, setShowIdeaCard] = useState(false);
  const [allTopics, setAllTopics] = useState(null);
  const [allSpecs, setAllSpecs] = useState(null);
  const [ideaSearch,setIdeaSearch]=useState({SearchTerm:'',Topic:0,Specality:0})
  const navigate=useNavigate();









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
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setResearcherIdeas(data);
        }
      });
  }

  function getAllIdeas() {
    fetch(`https://localhost:7187/api/Ideas?SearchTerm=${ideaSearch.SearchTerm}&Topic=${ideaSearch.Topic}&Specality=${ideaSearch.Specality}`, {
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

  function getAllTopics() {
    fetch(`https://localhost:7187/api/Researchers/Topics`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : alert("failed to Load topics")))
      .then((data) => {
        if (data) {
          setAllTopics(data);
        }
      });
  }


  



  useEffect(() => {
    getResearcherIdeas();
    getAllSpecs();
    getAllTopics();
  }, []);

  useEffect(()=>{
    getAllIdeas();
  },[ideaSearch])




function sendReq(ideaId) {
  fetch(
    `https://localhost:7187/api/Ideas/Requests/SendRequest/${userData?.resercherId}/${ideaId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
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

      return readStream().then(() => {
        if (!response.ok) {
          const body = new TextDecoder().decode(
            new Uint8Array(chunks.flatMap((chunk) => Array.from(chunk)))
          );
          if(body.includes('joined')){
            alert('You Already Joined This Idea')
          }else alert(body)
        }else alert('Request Sent Successfully')
      });
    })
    .catch((error) => console.error(error));
}



  const CreateNewIdeaCard = (props) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; 
    const [allSpecs, setAllSpecs] = useState(null);
    const [allTopics, setAllTopics] = useState(null);
  const [date, setDate] = useState('');
    const [ideaData, setIdeaData] = useState({
      name: "",
      maxParticipantsNumber: 0,
      topicId: 0,
      specalityId: 0,
      deadline: date,
    });
   console.log(ideaData)




   

   const handleDateChange = (event) => {
     const inputValue = event.target.value;
 
     // Remove any existing hyphens from the input value
     const formattedValue = inputValue.replace(/-/g, '');
 
     // Add hyphens after every 4th and 7th character
     const dateWithHyphens = formattedValue
       .slice(0, 4) + '-' + formattedValue.slice(4, 6) + '-' + formattedValue.slice(6, 8);
 
     setDate(dateWithHyphens);
   };


    function getIdeaData(e) {
      setIdeaData((prev) => {
        return {
          ...prev,
          [e.target.name]: e.target.value,
        };
      });
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
  
    function getAllTopics() {
      fetch(`https://localhost:7187/api/Researchers/Topics`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
        .then((res) => (res.ok ? res.json() : alert("failed to Load topics")))
        .then((data) => {
          if (data) {
            setAllTopics(data);
          }
        });
    }

    

    useEffect(()=>{
      getAllSpecs();
      getAllTopics();
    },[])


    function createNewIdea(){
      fetch(`https://localhost:7187/api/Ideas/InitiateIdea/${userData.resercherId}`,{
        method:"POST",
        headers:{
          "Authorization":`Bearer ${userData.token}`,
          "Content-Type":"application/json"
        },
        body:JSON.stringify(ideaData)
      })
      .then(res=>{
        if(res.ok){
          window.location.reload();
        }
        else {
          if(res.status===400)alert("you don't have enough points to initiate idea")
        }
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
        <div
          style={{ width: "50%", backgroundColor: "white", padding: "20px" }}
        >
          <span>Idea Name: </span>
          <input onChange={getIdeaData} name="name"></input>
          <span>Participants Number: </span>
          <input
            onChange={(e) =>
              setIdeaData((prev) => {
                return { ...prev, maxParticipantsNumber: e.target.value * 1 };
              })
            }
            name="maxParticipantsNumber"
            type="number"
          ></input>
          <select onChange={(e)=>setIdeaData(prev=>{return{...prev,specalityId:e.target.value*1}})}>
            <option selected disabled value="">
              Choose a Speciality
            </option>
            {allSpecs?.map((spec) => {
              return <option value={spec.id}>{spec.name}</option>;
            })}
          </select>
          <select onChange={(e)=>setIdeaData(prev=>{return{...prev,topicId:e.target.value*1}})}>
            <option selected disabled value="">
              Choose a Topic
            </option>
            {allTopics?.map((spec) => {
              return <option value={spec.id}>{spec.name}</option>;
            })}
          </select>
          <span>Deadline</span>
          <input type="text" onChange={handleDateChange} value={date} placeholder="yyyy-mm-dd"></input>
          <button onClick={props.onClose}>Cancel</button>
          <button onClick={createNewIdea}>Create</button>
        </div>
      </div>
    );
  };

  

  return (
    <div>
      <Header userData={userData}/>
      <div style={{marginTop:'130px'}}>
        <h1>Your Ideas</h1>
        {researcherIdeas?.length > 0 ? (
          researcherIdeas?.map((idea) => {
            return (
              <div
              onClick={()=>navigate(`/Idea/${idea.id}`,{state:{data:userData}})}
               style={{
                display: "flex",
                flexDirection: "column",
                padding: "20px",
                backgroundColor: "gray",
                width: "30%",
                color: "white",
                cursor:'pointer',
                margin:'40px',
              }}>
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
                <span>topic: {idea?.topicObject.name}</span>
              </div>
            );
          })
        ) : (
          <span>You Have No Ideas Yet!</span>
        )}
        <button onClick={() => setShowIdeaCard(true)}>Create New Idea</button>
        {showCreateIdeaCard && (
          <CreateNewIdeaCard
            show={showCreateIdeaCard}
            onClose={() => setShowIdeaCard(false)}
          />
        )}
      </div>

      <div>
        <h1>All Ideas</h1>
        <input name='SearchTerm' onChange={(e)=>setIdeaSearch(prev=>{return{...prev,[e.target.name]:e.target.value}})} placeholder="Search Idea" type="text"></input>
        <select onChange={(e)=>setIdeaSearch(prev=>{return{...prev,[e.target.name]:e.target.value*1}})} name="Specality">
          <option selected value={0}>Speciality</option>
          {allSpecs?.map(spec=>{
            return (
              <option value={spec.id}>{spec.name}</option>
            )
          })}
          
        </select>



        <select onChange={(e)=>setIdeaSearch(prev=>{return{...prev,[e.target.name]:e.target.value*1}})} name="Topic">
          <option selected value={0}>Topic</option>
          {allTopics?.map(topic=>{
            return (
              <option value={topic.id}>{topic.name}</option>
            )
          })}

</select>


        {allIdeas?.length > 0 ? (
          allIdeas?.filter(idea=> !researcherIdeas?.map(idea=>idea.id).includes(idea.id)).map((idea) => {
            return (
              <div
              
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "20px",
                  backgroundColor: "gray",
                  width: "30%",
                  color: "white",
                  cursor:'pointer',
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
                <span>topic: {idea?.topicObject.name}</span>
                {/* <span>topic: {idea?.creatorId}</span> */}
                {idea?.participantsNumber < idea?.maxParticipantsNumber && (
                  <button onClick={() => sendReq(idea.id)}>Send Request</button>
                )}
                 <button onClick={()=>navigate(`/Idea/${idea.id}`,{state:{data:userData}})}>View Idea</button>
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
