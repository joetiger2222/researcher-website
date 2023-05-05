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

  // console.log('answers state',answers);
  // console.log(sectionQuizData)

  // function CountdownTimer({ timeLimit }) {
  //   const [remainingTime, setRemainingTime] = useState(timeLimit);

  //   useEffect(() => {
  //     if (remainingTime.hours === '' || remainingTime.mins === '' || remainingTime.secs === '') {
  //       return;
  //     }

  //     const intervalId = setInterval(() => {
  //       setRemainingTime(prevTime => {
  //         let hours = prevTime.hours;
  //         let mins = prevTime.mins;
  //         let secs = prevTime.secs;

  //         if (secs === 0 && mins === 0 && hours === 0) {
  //           clearInterval(intervalId);
  //           return prevTime;
  //         } else if (secs === 0 && mins === 0) {
  //           hours--;
  //           mins = 59;
  //           secs = 59;
  //         } else if (secs === 0) {
  //           mins--;
  //           secs = 59;
  //         } else {
  //           secs--;
  //         }

  //         return { hours, mins, secs };
  //       });
  //     }, 1000);

  //     return () => clearInterval(intervalId);
  //   }, [remainingTime]);

  //   const formattedTime = `${remainingTime.hours}:${remainingTime.mins}:${remainingTime.secs
  //     .toString()
  //     .padStart(2, '0')}`;

  //   return <div>{formattedTime}</div>;
  // }

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
      .then((data) => {
        // let hours=data.timeLimit.slice(0,2)
        // let mins=data.timeLimit.slice(3,5)
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

    fetch(`https://localhost:7187/api/Quizes/SectionQuiz/Submit?QuizId=${sectionQuizData?.id}&StudentId=ffc9b4ad-d9f5-4330-b76f-6f83fa5c6cd9`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(arr)
    })
    .then(res=>res.json())
    .then(data=>console.log(data))
  }

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
          {timeLimit?.hours + ":" + timeLimit?.mins}
        </h4>
        <div className="startQBtn">
          <button
            style={{ display: renderQ ? "none" : "flex" }}
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
        </div>
      )}

      {answers?.length===questions?.length&&<div>
        <button onClick={handleSubmit}>Submit</button>
      </div>}
    </div>
  );
}
