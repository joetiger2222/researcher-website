import React, { useState, useEffect } from "react";
import {useLocation, useNavigate, useParams } from "react-router-dom";
import "../css/SectionQuiz.css";
import Header from "./Header";
import toastr from "toastr";
import 'toastr/build/toastr.min.css';

import QuestionCard from "./QuestionCard";
import { useContext } from "react";
import { MyContext } from '../Users/Redux';
export default function SectionQuiz() {
  const userData = useContext(MyContext);
  const { sectionId } = useParams();
  const navigate = useNavigate();
  const [sectionData, setSectionData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [sectionQuizData, setSectionQuizData] = useState(null);
  const questions = sectionQuizData?.questions;
  const [renderQ, setRenderQ] = useState(false);
  const [timeLimit, setTimeLimit] = useState({
    mins: "",
    secs: "00",
  });
  const [answers, setAnswers] = useState([]);
  // const userData=useLocation().state?.data




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
      .then((res) => res.ok?res.json():null)
      .then((data) => setSectionData(data))
      .then(getCourseDetatils());
  }

  function getCourseDetatils() {
    fetch(`https://localhost:7187/api/Courses/${sectionData?.courseId}`)
      .then((res) => res.ok? res.json():null)
      .then((data) => setCourseData(data));
  }

  function getSectionQuiz() {
    fetch(`https://localhost:7187/api/Quizes/SectionQuiz/${sectionId}`,{
      method:"GET",
      headers:{
        "Authorization":`Bearer ${userData.token}`
      }
    })
      .then((res) => res.ok?res.json():null)
      .then((data) => {
        if (data) {
          setTimeLimit((prevData) => {
            if(data?.timeLimit.slice(1,2)*1!==0){
              let hours=data?.timeLimit.slice(1,2)*1;
              let hoursToMins=hours*60
              let allMins=hoursToMins+(data?.timeLimit.slice(3,5)*1);
              console.log('all mins',allMins)
              return{
                ...prevData,
                mins:allMins
              }
              // return allMins;

              // console.log('mins',hoursToMins)
            }


            if (data?.timeLimit.slice(3, 4) * 1 === 0) {
              return {
                ...prevData,
                // hours: data.timeLimit.slice(1, 2),
                mins: data.timeLimit.slice(4, 5),
              };
            }
            return {
              ...prevData,
              // hours: data.timeLimit.slice(0, 2),
              mins: data.timeLimit.slice(3, 5),
            };
          });

          setSectionQuizData(data);
        }
      });
  }

  useEffect(() => {
    getSectionData();
    getSectionQuiz();
  }, [userData]);

  useEffect(() => {
    getCourseDetatils();
  }, [sectionData,userData]);


  

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
    
    .then(data=>{
      if(data.isSuccessed===true){
        toastr.success('you succedded',"Success");
      }else{
        toastr.error('you failed the exam',"Error");
      }
      navigate(-1);
    })
  }

  


  const [timer, setTimer] = useState(null);

  const startTimer = () => {
    let totalSeconds = parseInt(timeLimit.mins) * 60 + parseInt(timeLimit.secs);

    if (isNaN(totalSeconds) || totalSeconds <= 0) {
      
      return;
    }

    setTimer(
      setInterval(() => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        setTimeLimit({
          mins: String(minutes).padStart(2, "0"),
          secs: String(seconds).padStart(2, "0"),
        });

        if (totalSeconds === 0) {
          clearInterval(timer);
         
        } else {
          totalSeconds--;
        }
      }, 1000)
    );
  };

  const stopTimer = () => {
    clearInterval(timer);
    setTimer(null);
  };

  useEffect(() => {
    return () => {
      clearInterval(timer);
    };
  }, [timer]);

  useEffect(() => {
    if (parseInt(timeLimit.mins) === 0 && parseInt(timeLimit.secs) === 0) {
      toastr.warning("Your Timer Has Finished !,you failed");
      navigate(-1);
    }
  }, [timer, timeLimit.mins, timeLimit.secs]);


console.log(courseData)





if(userData.userId===''){
  return (
    <div style={{display:'flex',width:'100%',minHeight:'100vh',justifyContent:'center',alignItems:'center',flexDirection:'column',rowGap:'20px'}}>
      <h1>Please Login First</h1>
      <button style={{width:'120px',height:'50px',borderRadius:'10px',backgroundColor:'rgb(21, 46, 125)',color:'white',fontSize:'20px',fontWeight:'bold'}} onClick={()=>navigate('/')}>Login</button>
    </div>
  )
}

  return (
    <div className="sectionQuizContainer">
      <Header userData={userData} />
      <div className="sectionQuizHeader">
        <h1>
          Quiz for <span>{sectionData?.name}</span> In {courseData?.name}
          
           
          
        </h1>
       
        <h4>
        <span>Time Limit : </span>
          {timeLimit?.mins + ":" + timeLimit?.secs}
        </h4>
        <div className="startQBtn">
          <button

            style={{textAlign:'center', display: renderQ ? "none" : "flex" }}
            onClick={() => {
              startTimer(true);
              setRenderQ(true);
            }}
          >
            Start
          </button>
        </div>
      </div>

      {renderQ && (
          <div className="questions custom-scrollbar">
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
