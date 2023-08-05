import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import loader from "../../loader.gif";
export default function AllSkills({ userData }) {
  const [allSkills, setAllSkills] = useState([]);
  const [skillId, setSkillId] = useState(null);
  const [showEditSkillName, setShowEditSkillName] = useState(false);
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();

  function getAllSkills() {
    setLoad(true);
    fetch(`https://resweb-001-site1.htempurl.com/api/Admin/Skills`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    })
      // .then((res) => (res.ok ? res.json() : null))
      .then((res) => {
        setLoad(false);
        if (res.ok) {
          return res.json();
        }
      })
      .then((data) => setAllSkills(data))
      .catch((error) => console.error(error));
  }

  useEffect(() => {
    if (userData.userId !== "" && allSkills.length === 0) {
      getAllSkills();
    }
  }, [userData]);

  const EditSkillCard = (props) => {
    const [skillName, setSkillName] = useState({ name: "" });

    function editSkillName() {
      setLoad(true);
      fetch(
        `https://resweb-001-site1.htempurl.com/api/Admin/Skills/${skillId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${userData.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(skillName),
        }
      ).then((res) => {
        setLoad(false);
        if (res.ok) {
          alert("skill successfully edited");
          props.onClose();
          getAllSkills();
        } else {
          alert("Failed to edit skill name");
        }
      });
    }

    if (!props.show) return null;
    return (
      <div className="modal-overlay2">
        <div className="modal2" style={{ height: "300px" }}>
          <div className="ContExitbtn" onClick={props.onClose}>
            <div class="outer">
              <div class="inner">
                <label className="label2">Exit</label>
              </div>
            </div>
          </div>
          <h1 className="headContact2">Edit Skill Name</h1>
          <div className="FormModal2">
            <label className="AllLabeles">Skill Name</label>
            <input
              placeholder="Enter Skill Name"
              className="InputModalHallDetails"
              type="text"
              name="name"
              onChange={(e) =>
                setSkillName((prev) => {
                  return { ...prev, [e.target.name]: e.target.value };
                })
              }
            ></input>
            <div className="buttonsOnModal">
              {skillName.name !== "" && (
                <button onClick={editSkillName}>Submit</button>
              )}
              <button onClick={props.onClose}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (load) {
    return (
      <div className="allSkillsDiv">
        <img src={loader} />
      </div>
    );
  }

  return (
    <div className="allSkillsDiv">
      <h2>Let's Choose a Skill Then Create Final Quiz </h2>
      <select
        onChange={(e) => {
          setSkillId(e.target.value * 1);
        }}
        className="SelectSkill"
        name="skillId"
        id="skill"
        class="select-field-skillInAdminPanel"
      >
        <option selected disabled value="">
          Choose a Skill
        </option>
        {allSkills?.map((skill) => {
          return <option value={skill.id}>{skill.name}</option>;
        })}
      </select>
      {skillId && (
        <button
          className="plusBtn"
          onClick={() => navigate(`/AddQuizToCourse/${skillId}`)}
        >
          Create New Quiz
        </button>
      )}
      {skillId && (
        <button className="plusBtn" onClick={() => setShowEditSkillName(true)}>
          Edit Skill Name
        </button>
      )}
      {showEditSkillName && skillId && (
        <EditSkillCard
          show={showEditSkillName}
          onClose={() => setShowEditSkillName(false)}
        />
      )}
    </div>
  );
}
