import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";

export default function Researchers(){

    const userData=useLocation().state.data
    const [researchers,setResearchers]=useState(null);
    const [searchData,setSearchData]=useState({SearchTerm:'',Level:'',Specality:0,PageSize:10})
    const [allSpecs, setAllSpecs] = useState(null);
    const navigate=useNavigate();
    
    console.log(searchData)

    function getAllResearchers(){
        fetch(`https://localhost:7187/api/Researchers?SearchTerm=${searchData.SearchTerm}&Level=${searchData.Level}&Specality=${searchData.Specality}&PageSize=${searchData.PageSize}`,{
            method:"GET",
            headers:{
                "Authorization":`Bearer ${userData.token}`
            }
        })
        .then(res=>res.ok?res.json():alert('failed to load Researchers'))
        .then(data=>data?setResearchers(data):null)
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

useEffect(()=>{
    getAllSpecs()
},[])

    useEffect(()=>{
        getAllResearchers();
    },[searchData])

   

    return(
        <div style={{display:'flex',flexDirection:'column'}}>
            {/* <Header userData={userData}/> */}
            <div>
            <input  name="SearchTerm" onChange={(e)=>setSearchData(prev=>{return{...prev,[e.target.name]:e.target.value}})}></input>
            <select name="Specality" onChange={(e)=>setSearchData(prev=>{return{...prev,[e.target.name]:e.target.value*1}})}>
                <option value={0} selected>Speciality</option>
                {allSpecs?.map(spec=>{
                    return(
                        <option value={spec.id}>{spec.name}</option>
                    )
                })}
            </select>
            <select name="Level" onChange={(e)=>setSearchData(prev=>{return{...prev,[e.target.name]:e.target.value}})}>
                <option value={''} selected>Level</option>
                {[0,1,2,3]?.map(level=>{
                    return(
                        <option value={level}>{level}</option>
                    )
                })}
            </select>
            <button onClick={()=>setSearchData(prev=>{return {...prev,PageSize:searchData.PageSize+10}})}>View More</button>
            </div>
            <div>
                {researchers?.map(res=>{
                    return(
                        <div style={{backgroundColor:'gray',margin:'20px',display:'flex',flexDirection:'column',color:'white'}}>
                            <span>{'Name : '+res.studentObj.firstName+' '+ res.studentObj.lastName}</span>
                            <span>{'Age : '+res.studentObj.age}</span>
                            <span>{'Nationality : '+res.studentObj.nationality}</span>
                            <span>{'Speciality : '+res.specalityObject.name}</span>
                            <span>{'Points : '+res.points}</span>
                            <span>{'Level : '+res.level}</span>
                            <button onClick={()=>navigate(`/Profile/${res.studentObj.id}`,{state:{data:userData}})}>View Profile</button>
                            </div>
                    )
                })}
            </div>
        </div>
    )
}