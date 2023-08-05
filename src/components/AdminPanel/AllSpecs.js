import React from 'react'
import { useState,useEffect } from 'react';
import loader from '../../loader.gif';
import toastr from 'toastr';
export default function AllSpecs({userData}) {
    const [allSpecs, setAllSpecs] = useState([]);
    const [showSpec, setShowSpec] = useState(false);
    const [load,setLoad]=useState(false);


    function getAllSpecs() {
        setLoad(true)
        fetch(`https://resweb-001-site1.htempurl.com/api/Researchers/Specialties`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        })
        //   .then((res) =>
        //     res.ok ? res.json() : null
        //   )
        .then(res=>{
            setLoad(false)
            if(res.ok){
                return res.json();
            }
        })
          .then((data) => {
            if (data) {
              setAllSpecs(data);
            }
          });
      }





      useEffect(()=>{
        if(userData.userId!==''&&allSpecs.length===0){
            getAllSpecs();
        }
      },[userData])





      const AddNewSpec = (props) => {
        const [specName, setSpecName] = useState({ name: "" });
       
    
        function addSPec() {
          setLoad(true)
          fetch(`https://resweb-001-site1.htempurl.com/api/Admin/Speciality`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${userData.token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(specName),
          }).then((res) => {
            setLoad(false)
            if (res.ok) {
              props.onClose();
              getAllSpecs();
            } else toastr.error("failed to add new speciality", "Failed");
          });
        }
    
        if (!props.show) return null;
        return (
          <div className="modal-overlay2">
            <div className="modal2" style={{height:"300px"}}>
              <div className="ContExitbtn" onClick={props.onClose}>
                <div class="outer">
                  <div class="inner">
                    <label className="label2">Exit</label>
                  </div>
                </div>
              </div>
              <h1 className="headContact2">Enter Specality Name:</h1>
              <div className="FormModal2">
                <label className="AllLabeles">Name:</label>
                <input
                  className="InputModalHallDetails"
                  value={specName.name}
                  onChange={(e) => {
                    setSpecName((prev) => {
                      return { ...prev, name: e.target.value };
                    });
                  }}
                  placeholder="New Speciality"
                ></input>
                <div className="buttonsOnModal">
                  {specName.name !== "" && (
                    <button onClick={addSPec}>Finish</button>
                  )}
                  <button onClick={props.onClose}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        );
      };




      if(load){
        return (
            <div className="allSkillsDiv">
            <img src={loader} />
          </div>
        )
      }

  return (
    <div className="allSkillsDiv">
            <h2 style={{ color: "#262626" }}>All Specialties</h2>
            <div className="ContSpecialities custom-scrollbar">
              {allSpecs?.map((spec) => {
                return (
                  <li
                    style={{
                      color: "rgb(21 46 125)",
                      fontSize: "16px",
                      fontWeight: "700",
                    }}
                  >
                    {spec?.name}
                  </li>
                );
              })}
            </div>

            <button
              // className="buttonn"
              className="plusBtn"
              // className="button-arounder1"
              // className="bn54"
              onClick={() => setShowSpec(true)}
            >
              Create New Specality
            </button>
            <AddNewSpec show={showSpec} onClose={() => setShowSpec(false)} />
          </div>
  )
}
