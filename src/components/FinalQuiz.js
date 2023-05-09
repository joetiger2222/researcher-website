import React, { useState, useEffect } from "react";
import {useLocation, useNavigate, useParams } from "react-router-dom";
import "../css/SectionQuiz.css";
import Header from "./Header";
import QuestionCard from "./QuestionCard";

export default function FinalQuiz(){
    
  const [finalQuizData, setFinalQuizData] = useState(null);
  const questions = finalQuizData?.questions;
  const [renderQ, setRenderQ] = useState(false);
  const [timeLimit, setTimeLimit] = useState({
    hours: "",
    mins: "",
    secs: "59",
  });
  const [answers, setAnswers] = useState([]);
  const {skillId}=useParams();
  const userData=useLocation().state?.data
  const navigate=useNavigate();
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

let counter =1;
  function getFinalQuizData() {
    if(counter === 1)
    fetch(`https://localhost:7187/api/Quizes/FinalQuiz/${skillId}?studentId=${userData.userId}`,{
      method:"GET",
      headers:{
        "Authorization":`Bearer ${userData.token}`
      }
    })
      .then((res) => res.ok?res.json():alert('failed to load quiz'))
      .then((data) => {
        setTimeLimit((prevData) => {
          if (data?.timeLimit.slice(0, 1) * 1 === 0) {
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

        setFinalQuizData(data);
      });
      counter =counter -1
  }


  useEffect(()=>{
    getFinalQuizData();
  },[])


  function handleSubmit(){
    let arr=[];

    answers.map(ans=>{
      arr.push(ans.answerId)
    })

    fetch(`https://localhost:7187/api/Quizes/FinalQuiz/Submit?QuizId=${finalQuizData?.id}&StudentId=${userData.userId}&skillId=${skillId}`,{
      method:"POST",
      headers:{
        "Authorization":`Bearer ${userData.token}`,
        "Content-Type":"application/json"
      },
      body:JSON.stringify(arr)
    }).then(res=>res.ok?res.json():alert('failed to submit quiz'))
    .then(data=>{
    
        // if(data)navigate(`/FinalQuizResult/${skillId}/${data.isSuccessed}`,{state:{data:userData}})
        if(data){
          if(data.isSuccessed){
            userData.roles='Researcher'
            navigate(`/FinalQuizResult/${skillId}`,{state:{data:userData}})
          }else{
            navigate(`/FinalQuizResult/${skillId}`,{state:{data:userData}})
          }
          
        }
       
      
    })
    // .then((response) => {
    //   const reader = response.body.getReader();
    //   let chunks = [];

    //   function readStream() {
    //     return reader.read().then(({ done, value }) => {
    //       if (done) {
    //         return chunks;
    //       }
    //       chunks.push(value);
    //       return readStream();
    //     });
    //   }

    //   return readStream();
    // })
    // .then((chunks) => {
    //   const body = new TextDecoder().decode(
    //     new Uint8Array(chunks.flatMap((chunk) => Array.from(chunk)))
    //   );
    //   console.log(body);
     
    // })
    // .catch((error) => console.error(error));
}

  return (
    <div className="sectionQuizContainer">
      <Header />
      <div className="sectionQuizHeader">
        
        <h4>
          <span>Time Limit : </span>
          {timeLimit?.hours + ":" + timeLimit?.mins}
        </h4>
        <div className="startQBtn">
          <button
            style={{ display: renderQ ? "none" : "flex" }}
            onClick={() => {
            //   setTimerStarted(true);
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