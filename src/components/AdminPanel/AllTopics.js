import React from 'react'
import { useState,useEffect } from 'react';
import loader from '../../loader.gif';
import toastr from 'toastr';
export default function AllTopics({userData}) {
    const [showTopic, setShowTopic] = useState(false);
  const [allTopics, setAllTopics] = useState([]);
  const [load,setLoad]=useState(false);



  function getAllTopics() {
    setLoad(true)
    fetch(`https://resweb-001-site1.htempurl.com/api/Researchers/Topics`, {
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
          setAllTopics(data);
        }
      });
  }



useEffect(()=>{
    if(userData.userId!==''&&allTopics.length===0){
        getAllTopics();
    }
},[userData])





const AddNewTopic = (props) => {
    const [topicName, setTopicName] = useState({ name: "", minmumPoints: 1 });
    

    function addTopic() {
      setLoad(true)
      fetch(`https://resweb-001-site1.htempurl.com/api/Admin/Topic`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userData.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(topicName),
      }).then((res) => {
        setLoad(false)
        if (res.ok) {
          props.onClose();
          getAllTopics();
        } else toastr.error("failed to add new Topic", "Failed");
      });
    }

    if (!props.show) return null;
    return (
      <div className=" modal-overlay2">
        <div className="modal2" style={{height:"400px"}}>
          <div className="ContExitbtn" onClick={props.onClose}>
            <div class="outer">
              <div class="inner">
                <label className="label2">Exit</label>
              </div>
            </div>
          </div>
          <h1 className="headContact2">Create New Study Design</h1>
          <form className="FormModal2" onSubmit={addTopic}>
            <label className="AllLabeles">Enter Study Name: </label>
            <input
              className="InputModalHallDetails"
              value={topicName.name}
              onChange={(e) => {
                setTopicName((prev) => {
                  return { ...prev, name: e.target.value };
                });
              }}
              placeholder="New Topic"
            ></input>
            <label className="AllLabeles">Enter Study Min Points</label>
            <input
            type="number"
            min={3}
              className="InputModalHallDetails"
              onChange={(e) => {
                setTopicName((prev) => {
                  return { ...prev, minmumPoints: e.target.value * 1 };
                });
              }}
              placeholder="Topic Min Points"
            ></input>
            <div className="buttonsOnModal">
              {topicName.name !== "" && (
                <button type="submit">Finish</button>
              )}
              <button onClick={props.onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  };





if(load){
    return(
        <div className="allSkillsDiv ">
            <img src={loader} />
          </div>
    )
}




  return (
    <div className="allSkillsDiv ">
            <h2 style={{ color: "#262626" }}> Study Design</h2>
            <div className="custom-scrollbar ContSpecialities">
              {allTopics?.map((topic) => {
                return (
                  <li
                    style={{
                      color: "rgb(21 46 125)",
                      fontSize: "16px",
                      fontWeight: "700",
                    }}
                  >
                    {topic?.name}
                  </li>
                );
              })}
            </div>

            <button className="plusBtn" onClick={() => setShowTopic(true)}>
              Create New Topic
            </button>
            <AddNewTopic show={showTopic} onClose={() => setShowTopic(false)} />
          </div>
  )
}
