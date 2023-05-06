import React, { useEffect, useState } from "react";
import Header from "./Header";

export default function AddPaper(){
    const [researcherId,setResearcherId]=useState(null);
    const [researchData,setResearcherData]=useState(null);
    const [paperData,setPaperData]=useState({name:'',citation:'',url:''})

    function getResearcherIdByStudentId(){
        fetch(`https://localhost:7187/api/Researchers/ResearcherId/5471da49-1983-434f-a2b8-fa9f21cf1b00`)
        .then(res=>res.json())
        .then(data=>setResearcherId(data.researcherId))
    }

    // console.log(researchData)




    function getResearcherData(){
        fetch(`https://localhost:7187/api/Researchers/${researcherId}`)
        .then(res=>res.json())
        .then(data=>setResearcherData(data))
    }


    useEffect(()=>{
        getResearcherIdByStudentId();
    },[])


    useEffect(()=>{
        getResearcherData();
    },[researcherId])


    function getPaperData(e){
        setPaperData(prev=>{
            return{
                ...prev,
                [e.target.name]:e.target.value
            }
        })
    }
console.log(paperData)

    function createPaper(){
        let peperArr=[];
        peperArr.push(paperData)
        fetch(`https://localhost:7187/api/Researchers/Papers/${researcherId}`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(peperArr)
        }).then(res=>console.log(res))
      }

    return(
        <div style={{width:'100%',minHeight:'100vh',backgroundColor:'black',display:'flex',flexDirection:'column',alignItems:'center'}}>
            <Header/>
            <div style={{backgroundColor:'white',padding:'20px',borderRadius:'10px'}}>
                <h1>Create New Paper</h1>
                <div style={{display:'flex',flexDirection:'column',backgroundColor:'white',}}>
                    <label>Paper Name:</label>
                    <input onChange={getPaperData} name="name" placeholder="Name..."></input>
                </div>
                <div style={{display:'flex',flexDirection:'column',backgroundColor:'white',}}>
                    <label>Paper Citation:</label>
                    <input onChange={getPaperData} name="citation" placeholder="Citation..."></input>
                </div>
                <div style={{display:'flex',flexDirection:'column',backgroundColor:'white',}}>
                    <label>Paper Url:</label>
                    <input onChange={getPaperData} name="url" placeholder="Url..."></input>
                </div>
                <button onClick={createPaper}>Create</button>
            </div>
        </div>
    )
}