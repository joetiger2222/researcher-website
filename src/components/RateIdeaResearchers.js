import React from "react";
import { useState ,useEffect,useRef} from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import "../css/RatePage.css";
import toastr from "toastr";
import 'toastr/build/toastr.min.css';
import { MdOutlineFileUpload } from "react-icons/md";
import { FaFileUpload } from "react-icons/fa";
import Footer from "./Footer";
import { useContext } from "react";
import { MyContext } from '../Users/Redux';
export default function RateIdeaResearchers(){
    // const userData=useLocation().state.data;
    const userData = useContext(MyContext);
    const {ideaId}=useParams();
    const [idea, setIdea] = useState(null);
    const [ideaPar, setIdeaPar] = useState(null);
    const [rates,setRates]=useState([]);
    const [showUploadFinal,setShowUploadFinal]=useState(false);
    const creator = userData?.resercherId.toLowerCase() === idea?.creatorId;
    const navigate=useNavigate();


    function getIdeaData() {
        fetch(`https://localhost:7187/api/Ideas/SingleIdea/${ideaId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userData?.token}`,
          },
        })
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => (data ? setIdea(data) : null));
      }




      function getParticaptns() {
        fetch(`https://localhost:7187/api/Ideas/Participants/${ideaId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userData?.token}`,
          },
        })
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (data) {
              setIdeaPar(data);
            }
          });
      }



      useEffect(() => {
        getIdeaData();
        getParticaptns();
      }, [userData]);








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
    )
    // .then((res) => {
    //   if (res.ok) {
    //     toastr.success("File Uploaded Successfully","Success");
    //     props.onClose();
    //   } else toastr.error("failed to upload final document","Failed");
    // });
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
          toastr.error(body);
        });
      }else {
        toastr.success("File Uploaded Successfully","Success");
        sendRate();
        navigate(-1, { replace: true });
      }
    
      return readStream().then((chunks) => {
        const body = new TextDecoder().decode(
          new Uint8Array(chunks.flatMap((chunk) => Array.from(chunk)))
        );
        console.log(body);
      });
    })
    .catch((error) => console.error(error));
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
        {/* <input className="InputModalHallDetails"
         type="file" onChange={handleDocumentUpload} /> */}
        <label className="LableForinputTypeFile" htmlFor="img">
                <input
                  className="InputFile"
                  id="img"
                  type="file"
                  onChange={handleDocumentUpload}
                />
                <span className="SpanUpload">
                  {" "}
                  <FaFileUpload />
                  <span>Choose a File</span>
                </span>
              </label>
        
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



if(userData.userId===''){
  return (
    <div style={{display:'flex',width:'100%',minHeight:'100vh',justifyContent:'center',alignItems:'center',flexDirection:'column',rowGap:'20px'}}>
      <h1>Please Login First</h1>
      <button style={{width:'120px',height:'50px',borderRadius:'10px',backgroundColor:'rgb(21, 46, 125)',color:'white',fontSize:'20px',fontWeight:'bold'}} onClick={()=>navigate('/')}>Login</button>
    </div>
  )
}






if(creator){
    return (
        <div>
          <Header userData={userData} />
          <div className="AllDataInRatePage">
            <h1>Rate Then Submit Idea</h1>
            <div className="ContainerForCardsRate">
            {ideaPar?.filter(par=>par.id!==userData.resercherId.toLowerCase()).map(par=>{
                return (
                    <div className="CardRate">
                        <span  style={{borderBottom:"1px solid white",padding:"20px"}}>{'Name : '+par.studentObj.firstName+' '+ par.studentObj.lastName}</span>
                        <span className="padding20L">{'Points : '+par.points}</span>
                        <span className="padding20L">{'Level : '+par.level}</span>
                        <span className="padding20L">{'Email : '+par.studentObj.email}</span>
                        <span className="padding20L">{'Speciality : '+par.specalityObject.name}</span>
                        <select
                      style={{padding:"10px",borderRadius: "0px 0 10px 10px",cursor:"pointer",fontSize:"16px"}}
                        onChange={(e)=>updateRate(par.id,e.target.value*1)}>
                            <option selected disabled>Rate Me</option>
                            {[1,2,3,4,5,6,7,8,9,10].map(num=>{
                                return(
                                    <option value={num*1}>{num}</option>
                                )
                            })}
                        </select>
                    </div>
                )
            })}
            </div>
        
            {rates?.length===ideaPar?.length-1&&<button className="AddNewPaper" onClick={()=>setShowUploadFinal(true)}>Submit</button>}
            <UploadFileCard show={showUploadFinal} onClose ={()=>setShowUploadFinal(false)} />
        
          </div>
           <Footer userData={userData}/>
        </div>
    )
}else{
    return(
        <div><h1>You Are Not Authorized To This Page</h1></div>
    )
}
}