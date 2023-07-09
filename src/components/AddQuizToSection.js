import React from "react";
import "../css/AddQuizToSection.css";
import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import AnswersCard from "./AnswerCard";
import toastr from "toastr";
import 'toastr/build/toastr.min.css';
export default function AddQuizToSection() {
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
  const userData=useLocation().state?.data
  // const [isActive, setIsActive] = useState(false);

  // const handleClickSubmit = () => {
  //   setIsActive(true);
  // };
  function getSectionData() {
    fetch(`https://localhost:7187/api/Courses/Sections/${sectionId}`,{
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
    fetch(`https://localhost:7187/api/Courses/${sectionData?.courseId}`,{
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
  }, []);

  useEffect(() => {
    getCourseDetatils();
  }, [sectionData]);

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

  // const AnswersCard = (props) => {
  //   const [text,setText]=useState('')
  //   return (
  //     <div>
  //       <input type="radio"></input>
  //       <input
  //       value={text}
  //         type="text"
  //         onChange={(e)=>setText(e.target.value)}
  //       ></input>
  //       <button onClick={props.delete}>Delete</button>
  //     </div>
  //   );
  // };

  // console.log(answerCards);

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

    fetch(`https://localhost:7187/api/Quizes/SectionQuiz`, {
      method: "POST",
      headers: {
        "Authorization":`Bearer ${userData.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedQuizData),
    })
      .then((res) => res.ok?navigate(`/CourseDetails/${courseDetails.id}`,{state:{data:userData}}):toastr.error('failed to add quiz to section',"Failed"))
      
    
  }
  console.log(quizData);



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
                  onChange={getQuizData}
                  name="maxScore"
                  placeholder="Min Score"
                ></input>
              </div>
              <div className="quizHeaderOneLine">
                <span>Time Limit (In Minutes): </span>
                <input
                  name="timeLimit"
                  onChange={(e)=>setQuizData(prev=>{return{...prev,[e.target.name]:'00:'+e.target.value+':00'}})}
                  // onChange={getQuizData}
                  placeholder="Ex: 20"
                />
              </div>
            </div>
          </div>
        {/* </div> */}

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
