import React from "react";
import { useState ,useEffect,useRef} from "react";
import { useLocation, useParams } from "react-router-dom";
import Header from "./Header";
import toastr from "toastr";
import 'toastr/build/toastr.min.css';
export default function RateIdeaResearchers(){
    const userData=useLocation().state.data;
    const {ideaId}=useParams();
    const [idea, setIdea] = useState(null);
    const [ideaPar, setIdeaPar] = useState(null);
    const [rates,setRates]=useState([]);
    const [showUploadFinal,setShowUploadFinal]=useState(false);
    const creator = userData?.resercherId.toLowerCase() === idea?.creatorId;



    function getIdeaData() {
        fetch(`https://localhost:7187/api/Ideas/SingleIdea/${ideaId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userData?.token}`,
          },
        })
          .then((res) => (res.ok ? res.json() : toastr.error("failed to load idea data","Failed")))
          .then((data) => (data ? setIdea(data) : null));
      }




      function getParticaptns() {
        fetch(`https://localhost:7187/api/Ideas/Participants/${ideaId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userData?.token}`,
          },
        })
          .then((res) => (res.ok ? res.json() : toastr.error("failed to get Partipants","Failed")))
          .then((data) => {
            if (data) {
              setIdeaPar(data);
            }
          });
      }



      useEffect(() => {
        getIdeaData();
        getParticaptns();
      }, []);




console.log(rates)



const updateRate = (researcherId, rate) => {
  
  const updatedData = [...rates];
  
  const objectToUpdate = updatedData.find(obj => obj.researcherId === researcherId);

  if (objectToUpdate) {
    
    objectToUpdate.rate = rate;
  } else {
    updatedData.push({ researcherId, rate });
  }
  
  setRates(updatedData);
};



function sendRate(){
  fetch(`https://localhost:7187/api/Ideas/AddRateToParticipants/${ideaId}/${idea.creatorId}`,{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization":`Bearer ${userData.token}`
    },
    body:JSON.stringify(rates)
  })
  .then(res=>res.ok?toastr.success('rate successfully',"Success"):toastr.error('failed to rate',"Failed"))
}



const UploadFileCard = (props) => {
  const titleRef = useRef(null);

  const [document, setDocument] = useState(null);

  const handleDocumentUpload = (event) => {
    const file = event.target.files[0];
    setDocument(file);
  };

  const handleDocumentSubmit = (event) => {
    event.preventDefault();
    sendRate();
    const titleValue = titleRef.current.value;
    
    const formData = new FormData();
    formData.append("file", document);
    formData.append("Name", titleValue);

    fetch(
      `https://localhost:7187/api/Ideas/Submit?ideaId=${ideaId}&creatorId=${idea?.creatorId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
        body: formData,
      }
    ).then((res) => {
      if (res.ok) {
        toastr.success("File Uploaded Successfully","Success");
        props.onClose();
      } else toastr.error("failed to upload final document","Failed");
    });
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
        <h1 className="headContact2">Upload File</h1>
        <div className="FormModal2">
        <input className="InputModalHallDetails" type="file" onChange={handleDocumentUpload} />
        {document && (
          <input
            id="title"
            className="InputModalHallDetails"
            type="text"
            placeholder="file name"
            required
            name="Title"
            ref={titleRef}
          ></input>
        )}
        
         <div className="buttonsOnModal">
         {document && (
          <button className="" onClick={handleDocumentSubmit}>
            Submit Idea
          </button>
        )}
         <button className="" onClick={props.onClose}>
          Cancel
        </button>
        </div>
        
         </div>
       
      </div>
    </div>
  );
};









if(creator){
    return (
        <div>
          <Header userData={userData} />
            {ideaPar?.filter(par=>par.id!==userData.resercherId.toLowerCase()).map(par=>{
                return (
                    <div style={{display:'flex',flexDirection:'column',margin:'20px',backgroundColor:'gray'}}>
                        <span>{'Name : '+par.studentObj.firstName+' '+ par.studentObj.lastName}</span>
                        <span>{'Points : '+par.points}</span>
                        <span>{'Level : '+par.level}</span>
                        <span>{'Email : '+par.studentObj.email}</span>
                        <span>{'Speciality : '+par.specalityObject.name}</span>
                        <select
                        onChange={(e)=>updateRate(par.id,e.target.value*1)}>
                            <option selected disabled>Rate</option>
                            {[1,2,3,4,5,6,7,8,9,10].map(num=>{
                                return(
                                    <option value={num*1}>{num}</option>
                                )
                            })}
                        </select>
                    </div>
                )
            })}
            {rates?.length===ideaPar?.length-1&&<button onClick={()=>setShowUploadFinal(true)}>Submit</button>}
            <UploadFileCard show={showUploadFinal} onClose ={()=>setShowUploadFinal(false)} />
        </div>
    )
}else{
    return(
        <div><h1>You Are Not Authorized To This Page</h1></div>
    )
}
}