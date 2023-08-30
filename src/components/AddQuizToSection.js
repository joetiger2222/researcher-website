import React from "react";
import "../css/AddQuizToSection.css";
import { useState, useEffect } from "react";
import {useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import AnswersCard from "./AnswerCard";
import toastr from "toastr";
import 'toastr/build/toastr.min.css';
import { useContext } from "react";
import { MyContext } from '../Users/Redux';
import { FaTrash } from "react-icons/fa";
export default function AddQuizToSection() {
  const userData = useContext(MyContext);
  const navigate = useNavigate();
  const { sectionId } = useParams();

  const [courseDetails, setCourseDetails] = useState(null);
  const [sectionData, setSectionData] = useState(null);

  const [showQuestionTemplate, setShowQuestionTemplate] = useState(false);
  const [answerCards, setAnswerCards] = useState([
    { id: 1, isCorrectAnswer: true, answerText: "" },
  ]);
  const [question, setQuestion] = useState({ name: "", score: 0, answers: [] });
  const [allQuestions, setAllQuestions] = useState([]);
  const [quizData, setQuizData] = useState({
    sectionId: sectionId,
    timeLimit: "",
    maxScore: 0,
    questions: [],
  });
  // const userData=useLocation().state?.data
  // const [isActive, setIsActive] = useState(false);

  // const handleClickSubmit = () => {
  //   setIsActive(true);
  // };
  function getSectionData() {
    fetch(`https://resweb-001-site1.htempurl.com/api/Courses/Sections/${sectionId}`,{
      
      method:"GET",
      headers:{
        "Authorization":`Bearer ${userData.token}`
      }
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => setSectionData(data))
      .then(getCourseDetatils());
  }

  function getCourseDetatils() {
    fetch(`https://resweb-001-site1.htempurl.com/api/Courses/${sectionData?.courseId}`,{
      method:"GET",
      headers:{
        "Authorization":`Bearer ${userData.token}`
      }
    })
      .then((res) => res.json())
      .then((data) => setCourseDetails(data));
  }

  useEffect(() => {
    getSectionData();
  }, [userData]);

  useEffect(() => {
    getCourseDetatils();
  }, [sectionData,userData]);

  function addNewAnswer() {
    if(answerCards[answerCards.length-1].answerText===''){
      toastr.error('Please Fill The Current Answer Before Adding New One');
      return;
    }
    setAnswerCards((prevCards) => {
      const newAnswer = {
        id: prevCards.length + 1,
        isCorrectAnswer: false,
        answerText: "",
      };
      return [...prevCards, newAnswer];
    });
  }

  function deleteAns(id) {
    setAnswerCards((prevCards) => prevCards.filter((card) => card.id !== id));
    
  }

  const handleCorrect = (id) => {
    setAnswerCards((prevCards) => {
      return prevCards.map((card) => {
        if (card.id === id) {
          return {
            ...card,
            isCorrectAnswer: true,
          };
        } else {
          return { ...card, isCorrectAnswer: false };
        }
      });
    });
  };

  const handleAnswerTextChange = (id, text) => {
    const updatedAnswerCards = answerCards.map((card) => {
      if (card.id === id) {
        return { ...card, answerText: text };
      } else {
        return card;
      }
    });
    setAnswerCards(updatedAnswerCards);
  };

 

  function getQuestion(e) {
    if (e.target.name !== "score") {
      setQuestion((prevQuestData) => {
        return {
          ...prevQuestData,
          [e.target.name]: e.target.value,
        };
      });
    } else {
      setQuestion((prevQuestData) => {
        return {
          ...prevQuestData,
          [e.target.name]: e.target.value * 1,
        };
      });
    }
    //   const updatedQuestion = { ...question, answers: answerCards };
    // setQuestion(updatedQuestion);
  }

  function saveQuest() {
    const updatedQuestion = { ...question, answers: answerCards };
    if(updatedQuestion.name===''){
      toastr.error('Invalid Question Name');
      return;
    }
    if(updatedQuestion.score===0){
      toastr.error('Invalid Question Points');
      return;
    }
    if(updatedQuestion.answers.length===0){
      toastr.error('Please Enter At Least One Answer For The Question');
      return;
    }
    const hasEmptyAnswer = updatedQuestion.answers.filter(ans => ans.answerText === '');
    if (hasEmptyAnswer.length>0) {
      toastr.error('One or more answers are empty');
      return;
    }
    setQuestion(updatedQuestion);
    setAllQuestions((prev) => [...prev, updatedQuestion]);
    setShowQuestionTemplate(false);
  }

  function getQuizData(e) {
    if (e.target.name !== "maxScore") {
      setQuizData((prevQuestData) => {
        return {
          ...prevQuestData,
          [e.target.name]: e.target.value,
        };
      });
    } else {
      setQuizData((prevQuestData) => {
        return {
          ...prevQuestData,
          [e.target.name]: e.target.value * 1,
        };
      });
    }
  }

  function sendQuizData() {
    const updatedQuizData = { ...quizData, questions: allQuestions };
    if(updatedQuizData.maxScore===0){
      toastr.error('Please Enter A Valid Score For The Quiz');
      return;
    }
    if(updatedQuizData.timeLimit===''){
      toastr.error('Please Enter A Valid Time Limit For The Quiz');
      return;
    }

    fetch(`https://resweb-001-site1.htempurl.com/api/Quizes/SectionQuiz`, {
      method: "POST",
      headers: {
        "Authorization":`Bearer ${userData.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedQuizData),
    })
      .then((res) => res.ok?navigate(`/CourseDetails/${courseDetails.id}`,{state:{data:userData}}):toastr.error('failed to add quiz to section',"Failed"))
      
    
  }
 

if(userData.roles!=='Admin'){
  return (
    <div style={{display:'flex',width:'100%',minHeight:'100vh',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
      <h1>Please Login First</h1>
      <button onClick={()=>navigate('/Login')}>Login</button>
    </div>
  )
}

  return (
    <div className="AddQuizToSectionContainer">
      <Header userData={userData} />
      <div className="ConquizHeaderAndBtnquizQiestionsDiv">
        {/* <div className="quizHeaderAndBtn"> */}
          <div className="quizHeaderData">
            <h2>
              <span>Create Quiz For </span>
               ({sectionData?.name})in Course ({courseDetails?.name})
            </h2>
            <h2>Enter Minimum Score To Pass Quiz And Time Limit </h2>
            <div className="ContInputs">
              <div className="quizHeaderOneLine">
                <span>Min Score: </span>
                <input
                type="number"
                  onChange={getQuizData}
                  name="maxScore"
                  placeholder="Min Score"
                ></input>
              </div>
              <div className="quizHeaderOneLine">
                <span>Time Limit (In Minutes): </span>
                <input
                  name="timeLimit"
                  type="number"
                  onChange={(e)=>{
                    if(e.target.value*1>=60){
                      let time=(e.target.value*1)/60;
                      let hours = Math.floor(time);
                      let minutes = Math.round((time - hours) * 60);
                      setQuizData(prev=>{return{...prev,[e.target.name]:`0${hours}:${minutes}:00`}})
                      
                      
                    }else{
                      setQuizData(prev=>{return{...prev,[e.target.name]:'00:'+e.target.value+':00'}})
                    }
                  }}
                 
                  placeholder="Ex: 20"
                />
              </div>
            </div>
          </div>
        

          {allQuestions.length> 0 && (
            <h2>Questions</h2>

          )}
          <div className="ContQuestions custom-scrollbar">
            {" "}
            {allQuestions.map((question,index) => {
              return (
                <div
                  style={{
                    backgroundColor: "#eee",
                    // padding: "20px",
                    borderRadius: "10px",
                    display:"flex",
                    flexDirection:"column",
                    width:"300px",
                    height:"190px",
                 }}
                >
                  <span style={{padding:"5px",borderBottom:"1px solid black",fontWeight:"bold",textAlign:"center"}}>Question {index+1}</span>
                  
               <div style={{padding:"10px",display:"flex",flexDirection:"column",justifyContent:"space-around",height:"100%"}}>
               <p className="custom-scrollbar" style={{maxHeight:"100px"}}>
                    <span style={{fontWeight:"bold"}}>Question: </span>
                    {question.name}
                  </p>
                  <p>
                    <span style={{fontWeight:"bold"}} className="">Min Score: </span>
                    {question.score}
                  </p>
                  <FaTrash style={{alignSelf:'center',color:'#ce1919',width:'20px',height:'20px',cursor:'pointer'}} 
                  onClick={()=>{
                    setAllQuestions(allQuestions.filter((q, i) => i !== index));
                  }}
                  />
               </div>
                </div>
              );
            })}
          </div>

          <div className="ContQuestionTempAndAddQ">
            <div
              style={{ display: showQuestionTemplate ? "flex" : "none" }}
              className="QestionTemplate"
            >
              <div className="ContQuestionScore">
              <div className="questionInput ">
                <span>Question:</span>
                <textarea className="custom-scrollbar InputInQuestion " onChange={getQuestion} name="name"></textarea>
              </div>
              <div className="questionInput1">
                <span>Score:</span>
                <input
                className="ScoreInAddQuis"
                  type="number"
                  style={{ width: "40px" }}
                  onChange={getQuestion}
                  name="score"
                ></input>
              </div>
              </div>
              {answerCards.map((card) => {
                return (
                  <AnswersCard
                    id={card.id}
                    delete={() => deleteAns(card.id)}
                    lastCard={card.id === answerCards.length ? true : false}
                    groupName={"test"}
                    correctAns={() => handleCorrect(card.id)}
                    setText={(text) => handleAnswerTextChange(card.id, text)}
                  />
                );
              })}
              <div className="AddNewAnswerSaveQuestion">
                {" "}
                <button className="AddNewAnswerWithHover" onClick={addNewAnswer}>
                  Add New Answer
                </button>
                <button className="SaveQuestionWithHover" onClick={saveQuest}>
                  Save Question
                </button>
              </div>
            </div>

          <div className="ContSubmitAndAddQues">
          {!showQuestionTemplate&& <button
              onClick={() => setShowQuestionTemplate(true)}
              className="addQuestionbtn button-arounder"
            >
               +Add Question
            </button>}
            {allQuestions.length>0 &&
              <button className="buttonbtn button-arounder" onClick={sendQuizData}>
            Submit{" "}
          </button>}
          </div>
        </div>

    </div>
    </div>

  );
}
