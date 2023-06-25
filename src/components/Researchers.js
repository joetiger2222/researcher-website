import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import "../css/Researchers.css";
import { BiChat } from 'react-icons/bi';

// import PiChatCircleTextBold from "react-icons/"
import user from "../images/imageUser.png"
export default function Researchers(){

    const userData=useLocation().state.data
    const [researchers,setResearchers]=useState(null);
    const [searchData,setSearchData]=useState({SearchTerm:'',Level:'',Specality:0,PageSize:10})
    const [allSpecs, setAllSpecs] = useState(null);
    const navigate=useNavigate();
    
    

  function getAllResearchers() {
    fetch(
      `https://localhost:7187/api/Researchers?SearchTerm=${searchData.SearchTerm}&Level=${searchData.Level}&Specality=${searchData.Specality}&PageSize=${searchData.PageSize}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      }
    )
      .then((res) =>
        res.ok ? res.json() : alert("failed to load Researchers")
      )
      .then((data) => (data ? setResearchers(data) : null));
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

  useEffect(() => {
    getAllSpecs();
  }, []);

  useEffect(() => {
    getAllResearchers();
  }, [searchData]);

  return (
    <>
      <Header userData={userData} />
      <div className="AllResearchersPage">
        <h1 className="">Seacrch For Researchers</h1>
        {/* <Header userData={userData}/> */}
        <div className="AllIdeas ">
          <input
            className="search-input"
            placeholder="Search By Name"
            name="SearchTerm"
            onChange={(e) =>
              setSearchData((prev) => {
                return { ...prev, [e.target.name]: e.target.value };
              })
            }
          ></input>
          <select
            className="search-select"
            name="Specality"
            onChange={(e) =>
              setSearchData((prev) => {
                return { ...prev, [e.target.name]: e.target.value * 1 };
              })
            }
          >
            <option value={0} selected>
              Speciality
            </option>
            {allSpecs?.map((spec) => {
              return <option value={spec.id}>{spec.name}</option>;
            })}
          </select>
          <select
            className="search-select"
            name="Level"
            onChange={(e) =>
              setSearchData((prev) => {
                return { ...prev, [e.target.name]: e.target.value };
              })
            }
          >
            <option value={""} selected>
              Level
            </option>
            {[0, 1, 2, 3]?.map((level) => {
              return <option value={level}>{level}</option>;
            })}
          </select>

        </div>
        <div className="AllIdeas">
          {researchers?.map((res) => {
            return (
              <div className="ContCarduserInfo">
                <div className="photoUserCard">
                    <img src={user} alt="photo" />
                </div>
                <div className="containerSpansData padding20px">
                <span>
                  {"Name : " +
                    res.studentObj.firstName +
                    " " +
                    res.studentObj.lastName}
                </span>
                <span>{"Age : " + res.studentObj.age}</span>
                <span>{"Nationality : " + res.studentObj.nationality}</span>
                <span>{"Speciality : " + res.specalityObject.name}</span>
                <span>{"Points : " + res.points}</span>
                <span>{"Level : " + res.level}</span>
                
                <div className="ContainerbtnData">
                <button
                className="bn54"
                  onClick={() =>
                    navigate(`/Profile/${res.studentObj.id}`, {
                      state: { data: userData },
                    })
                  }
                >
                  View Profile
                </button>
                <button
            className="plusBtn"            
            >
              Chat
              <BiChat/>
              {/* <PiChatCircleTextBold/> */}
            </button>
                </div>
                </div>
               
              </div>
            );
          })}
        </div>
        <div className="">
            <button
            className="plusBtn"
              onClick={() =>
                setSearchData((prev) => {
                  return { ...prev, PageSize: searchData.PageSize + 10 };
                })
              }
            >
              View More
            </button>
           
          </div>
      </div>
    </>
  );
}
