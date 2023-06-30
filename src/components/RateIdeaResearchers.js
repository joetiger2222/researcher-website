import React from "react";
import { useState ,useEffect} from "react";
import { useLocation, useParams } from "react-router-dom";
import Header from "./Header";

export default function RateIdeaResearchers(){
    const userData=useLocation().state.data;
    const {ideaId}=useParams();
    const [idea, setIdea] = useState(null);
    const [ideaPar, setIdeaPar] = useState(null);
    const [rates,setRates]=useState([]);
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
                        <span>{par.studentObj.gender===0?'Gender : Female':'Gender : Male'}</span>
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
            {rates?.length===ideaPar?.length-1&&<button>Submit</button>}
        </div>
    )
}else{
    return(
        <div><h1>You Are Not Authorized To This Page</h1></div>
    )
}
}