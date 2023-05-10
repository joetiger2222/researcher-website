import React from "react";
import "../css/AddQuizToSection.css";
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import AnswersCard from "./AnswerCard";

export default function AddQuizToCourse (){
    const [showQuestionTemplate, setShowQuestionTemplate] = useState(false);
    const [answerCards, setAnswerCards] = useState([
      { id: 1, isCorrectAnswer: true, answerText: "" },
    ]);
    const [question, setQuestion] = useState({ name: "", score: 0, answers: [] });
    const [allQuestions, setAllQuestions] = useState([]);
    const {skillId}=useParams();
    const [quizData, setQuizData] = useState({
        skillId: skillId*1,
      timeLimit: "",
      maxScore: 0,
      questions: [],
    });
    const userData=useLocation().state?.data
    const navigate=useNavigate();


    function addNewAnswer() {
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
        console.log("delete id:", id);
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
}




function saveQuest() {
    const updatedQuestion = { ...question, answers: answerCards };
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

    fetch(`https://localhost:7187/api/Quizes/FinalQuiz`, {
      method: "POST",
      headers: {
        "Authorization":`Bearer ${userData.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedQuizData),
    })
      .then((res) => res.ok?navigate('/AdminPanel',{state:{data:userData}}):alert('failed to add quiz'))
      
  }


console.log(quizData)


  return (
    <div className="AddQuizToSectionContainer">
      <Header userData={userData} />
      <div className="ConquizHeaderAndBtnquizQiestionsDiv">
        <div className="quizHeaderAndBtn">
          <div className="quizHeaderData">
            <h2>Enter Minimum Score To Pass Quiz And Time Limit </h2>
            <div className="ContInputs">
              <div className="quizHeaderOneLine">
                <span>Min Score: </span>
                <input
                  onChange={getQuizData}
                  name="maxScore"
                  placeholder="Max Score"
                ></input>
              </div>
              <div className="quizHeaderOneLine">
                <span>Time Limit: </span>
                <input
                  name="timeLimit"
                  onChange={getQuizData}
                  placeholder="Ex: 2:00"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="quizQiestionsDiv">
          <div className="ContQuestions">
            {" "}
            {allQuestions.map((question) => {
              return (
                <div
                  style={{
                    backgroundColor: "#eee",
                    padding: "20px",
                    borderRadius: "10px",
                  }}
                >
                  <h3>
                    <span>Name: </span>
                    {question.name}
                  </h3>
                  <h4>
                    <span className="ScoreInAddQuis">Score: </span>
                    {question.score}
                  </h4>
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
                <input className="InputInQuestion" onChange={getQuestion} name="name"></input>
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
              <button
                onClick={() => setShowQuestionTemplate(true)}
                className="addQuestionbtn button-arounder"
              >
               +Add Question
              </button>
              {allQuestions.length>0 &&
              <button className="buttonbtn button-arounder" onClick={sendQuizData}>
            Submit{" "}
          </button>}
            </div>
          </div>

          {/* <button onClick={sendQuizData}>Submit</button> */}
          
          {/* <div>
          <button
          id="btn"
          onClick={sendQuizData}
          className={isActive ? "btnSubmitted active" : "btnSubmitted"}
        >
          <p id="btnText">{isActive ? "Submitted" : "Submit"}</p>
          <div className="check-box">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
              <path fill="transparent" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
          </div>
        </button>
          </div> */}

          {/* <button id="btn">
              <p id="btnText">Submit</p>
              <div class="check-box">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
                      <path fill="transparent" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                  </svg>
              </div>
          </button> */}
        </div>
      </div>
    </div>
  );
}