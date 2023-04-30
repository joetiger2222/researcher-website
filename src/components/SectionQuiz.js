import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../css/SectionQuiz.css";
import Header from "./Header";

export default function SectionQuiz() {
  const { sectionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [sectionData, setSectionData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [sectionQuizData, setSectionQuizData] = useState(null);
  const questions = sectionQuizData?.questions;
  const [renderQ,setRenderQ]=useState(false)

  function getSectionData() {
    fetch(`https://localhost:7187/api/Courses/Sections/${sectionId}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => setSectionData(data))
      .then(getCourseDetatils());
  }

  function getCourseDetatils() {
    fetch(`https://localhost:7187/api/Courses/${sectionData?.courseId}`)
      .then((res) => res.json())
      .then((data) => setCourseData(data));
  }

  function getSectionQuiz() {
    fetch(`https://localhost:7187/api/Quizes/SectionQuiz/${sectionId}`)
      .then((res) => res.json())
      .then((data) => setSectionQuizData(data));
  }

  useEffect(() => {
    getSectionData();
    getSectionQuiz();
  }, []);

  useEffect(() => {
    getCourseDetatils();
  }, [sectionData]);

  console.log(questions);

  const QuestionCard = ({ question, id }) => {
    // console.log('a',question.answers)
    return (
      <div>
        <h1>{id + ". " + question?.name}</h1>
        <div style={{ paddingLeft: "40px" }}>
          {question.answers?.map((a) => {
            return <Answers a={a} id={id} />;
          })}
        </div>
      </div>
    );
  };

  const Answers = ({ a ,id}) => {
    return (
      <div style={{ display: "flex" }}>
        <input type="radio" name={`answernum${id}`}></input>
        <p>{a?.answerText}</p>
      </div>
    );
  };
  

  return (
    <div className="sectionQuizContainer">
      <Header />
      <div className="sectionQuizHeader">
        <h1>
          <span>Course Name : </span>
          {courseData?.name}
        </h1>
        <h3>
          <span>Section Name : </span>
          {sectionData?.name}
        </h3>
        <h4>
          <span>Time Limit : </span>
          {sectionQuizData?.timeLimit}
        </h4>
        <div className="startQBtn" >
          <button style={{display:renderQ?'none':'flex'}} onClick={()=>setRenderQ(true)}>Start</button>
        </div>
      </div>



      {renderQ&&
      <div className="questions">
        {questions?.map((q, index) => {
          return <QuestionCard question={q} id={index + 1} />;
        })}
      </div>}


    </div>
  );
}
