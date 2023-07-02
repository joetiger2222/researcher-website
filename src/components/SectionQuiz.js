import React, { useState, useEffect } from "react";
import {useLocation, useNavigate, useParams } from "react-router-dom";
import "../css/SectionQuiz.css";
import Header from "./Header";
import QuestionCard from "./QuestionCard";
export default function SectionQuiz() {
  const { sectionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [sectionData, setSectionData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [sectionQuizData, setSectionQuizData] = useState(null);
  const questions = sectionQuizData?.questions;
  const [renderQ, setRenderQ] = useState(false);
  // const [timeLimit,setTimeLimit]=useState({hours:'',mins:''})
  const [timeLimit, setTimeLimit] = useState({
    hours: "",
    mins: "",
    secs: "59",
  });
  const [timerStarted, setTimerStarted] = useState(false);
  const [answers, setAnswers] = useState([]);
  const userData=useLocation().state?.data

  const handleUpdate = (update) => {
    const index = answers.findIndex(
      (answer) => answer.questionId === update.questionId
    );
 
    if (index >= 0) {
      setAnswers((prevAnswers) =>
        prevAnswers.map((answer, i) => {
          if (i === index) {
            return {
              questionId: update.questionId,
              answerId: update.choosenAnsId,
            };
          } else {
            return answer;
          }
        })
      );
    } else {
      setAnswers((prevAnswers) => [
        ...prevAnswers,
        { questionId: update.questionId, answerId: update.choosenAnsId },
      ]);
    }
  };

  

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
    fetch(`https://localhost:7187/api/Quizes/SectionQuiz/${sectionId}`,{
      method:"GET",
      headers:{
        "Authorization":`Bearer ${userData.token}`
      }
    })
      .then((res) => res.ok?res.json():alert('failed to load section quiz'))
      .then((data) => {
        
        setTimeLimit((prevData) => {
          if (data.timeLimit.slice(0, 1) * 1 === 0) {
            return {
              ...prevData,
              hours: data.timeLimit.slice(1, 2),
              mins: data.timeLimit.slice(3, 5),
            };
          }
          return {
            ...prevData,
            hours: data.timeLimit.slice(0, 2),
            mins: data.timeLimit.slice(3, 5),
          };
        });

        setSectionQuizData(data);
      });
  }

  useEffect(() => {
    getSectionData();
    getSectionQuiz();
  }, []);

  useEffect(() => {
    getCourseDetatils();
  }, [sectionData]);

  // const QuestionCard = ({ question, id,handleAnsQ }) => {

  //   function handleQ(a){
  //     const update={questionId:question.id,choosenAnsId:a.id}
  //     handleAnsQ(update)
  //   }

  //   return (
  //     <div>
  //       <h1>{id + ". " + question?.name}</h1>
  //       <div style={{ paddingLeft: "40px" }}>
  //         {question.answers?.map((a) => {
  //           return <Answers a={a} id={id} chooseAns={()=>handleQ(a)}
  //           />;
  //         })}
  //       </div>
  //     </div>
  //   );
  // };

  // const Answers = ({ a ,id,chooseAns}) => {
  //   return (
  //     <div style={{ display: "flex" }}>
  //       <input onClick={chooseAns} type="radio" name={`answernum${id}`}></input>
  //       <p>{a?.answerText}</p>
  //     </div>
  //   );
  // };


  

  function handleSubmit(){
    let arr=[];

    answers.map(ans=>{
      arr.push(ans.answerId)
    })

    fetch(`https://localhost:7187/api/Quizes/SectionQuiz/Submit?QuizId=${sectionQuizData?.id}&StudentId=${userData.userId}`,{
      method:"POST",
      headers:{
        "Authorization":`Bearer ${userData.token}`,
        "Content-Type":"application/json"
      },
      body:JSON.stringify(arr)
    })
    .then(res=>res.json())
    .then(data=>console.log(data))
  }

  

  return (
    <div className="sectionQuizContainer">
      <Header userData={userData} />
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
          {timeLimit?.hours + ":" + timeLimit?.mins}
        </h4>
        <div className="startQBtn">
          <button

            style={{textAlign:'center', display: renderQ ? "none" : "flex" }}
            onClick={() => {
              setTimerStarted(true);
              setRenderQ(true);
            }}
          >
            Start
          </button>
        </div>
        {/* {timerStarted && <CountdownTimer timeLimit={timeLimit} />} */}
      </div>

      {renderQ && (
          <div className="questions">
            {questions?.map((q, index) => {
              return (
                <QuestionCard
                  question={q}
                  id={index + 1}
                  handleAnsQ={(update) => handleUpdate(update)}
                />
              );
            })}
            {answers?.length===questions?.length&&
            <div className="btnConSubmit">
            <button className="SubmitQuizInFinalAndSectionQuiz" onClick={handleSubmit}>Submit</button>
          </div>}
            
          </div>
          
      )}

      
    </div>
  );
}
