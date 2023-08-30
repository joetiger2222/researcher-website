import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../css/SectionQuiz.css";
import Header from "./Header";
import QuestionCard from "./QuestionCard";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { useContext } from "react";
import { MyContext } from "../Users/Redux";
import loader from "../loader.gif";
export default function FinalQuiz() {
  const userData = useContext(MyContext);
  const [load, setLoad] = useState(false);
  const [finalQuizData, setFinalQuizData] = useState(null);
  const questions = finalQuizData?.questions;
  const [renderQ, setRenderQ] = useState(false);
  const [timeLimit, setTimeLimit] = useState({
    mins: "",
    secs: "00",
  });
  const [answers, setAnswers] = useState([]);
  const { skillId } = useParams();
  const [researcherId, setResearcherId] = useState("");
  const navigate = useNavigate();

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

  let counter = 1;
  function getFinalQuizData() {
    setLoad(true);
    if (counter === 1)
      fetch(
        `https://resweb-001-site1.htempurl.com/api/Quizes/FinalQuiz/${skillId}?studentId=${userData.userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      )
        // .then((res) => (res.ok ? res.json() : null))
        .then((res) => {
          setLoad(false)
          if (res.ok) {
            
            return res.json();

          }else return null
        })
        .then((data) => {
          if (data) {
            setTimeLimit((prevData) => {
              if (data?.timeLimit.slice(1, 2) * 1 !== 0) {
                let hours = data?.timeLimit.slice(1, 2) * 1;
                let hoursToMins = hours * 60;
                let allMins = hoursToMins + data?.timeLimit.slice(3, 5) * 1;

                return {
                  ...prevData,
                  mins: allMins,
                };
              }

              if (data?.timeLimit.slice(3, 4) * 1 === 0) {
                return {
                  ...prevData,
                  mins: data.timeLimit.slice(4, 5),
                };
              }
              return {
                ...prevData,
                mins: data.timeLimit.slice(3, 5),
              };
            });

            setFinalQuizData(data);
          }
        });
    counter = counter - 1;
  }

  useEffect(() => {
    getFinalQuizData();
  }, [userData]);

  function getResearcherIdByStudentId() {
    return fetch(
      `https://resweb-001-site1.htempurl.com/api/Researchers/ResearcherId/${userData.userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      }
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          userData.roles = "Researcher";
          userData.resercherId = data.researcherId;
          setResearcherId(data.researcherId);
        }
      })
      .catch((error) => console.error(error));
  }

  function handleSubmit() {
    setLoad(true);
    let arr = [];

    answers.map((ans) => {
      arr.push(ans.answerId);
    });

    fetch(
      `https://resweb-001-site1.htempurl.com/api/Quizes/FinalQuiz/Submit?QuizId=${finalQuizData?.id}&StudentId=${userData.userId}&skillId=${skillId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userData.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(arr),
      }
    )
      // .then((res) =>
      //   res.ok ? res.json() : toastr.error("failed to submit quiz", "Failed")
      // )
      .then(res=>{
        setLoad(false)
        if(res.ok){
          return res.json();
        }else {
          toastr.error("failed to submit quiz", "Failed")
        }
      })
      .then((data) => {
        if (data) {
          if (data.isSuccessed) {
            getResearcherIdByStudentId().then(() => {
              userData.roles = "Researcher";
              navigate(`/SuccededFianlQuiz`, { replace: true });
            });
          } else {
            navigate(`/FailedFinalQuiz/${skillId}`, { replace: true });
            // toastr.error('You Failed Final Quiz');
            // navigate(-1,{replace:true})
          }
        }
      });
  }

  useEffect(() => {
    const handleNavigation = (event) => {
      // Prevent going back to the current page
      event.preventDefault();

      // Replace the current page with the previous page
      navigate(-1, { replace: true });
    };

    // Listen for the 'popstate' event when the user navigates back
    window.addEventListener("popstate", handleNavigation);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener("popstate", handleNavigation);
    };
  }, [navigate]);

  const [timer, setTimer] = useState(null);

  const startTimer = () => {
    let totalSeconds = parseInt(timeLimit.mins) * 60 + parseInt(timeLimit.secs);

    if (isNaN(totalSeconds) || totalSeconds <= 0) {
      // Invalid input, do nothing
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
          // Timer finished, do something
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
      toastr.warning("Your Timer Has Finished !");
      navigate(-1);
    }
  }, [timer, timeLimit.mins, timeLimit.secs]);

  if(load){
    return(
      <div style={{width:'100%',minHeight:'100vh',display:'flex',justifyContent:'center',alignItems:'center',backgroundColor:'white'}}>
        <img src={loader} />
      </div>
    )
  }

  if (!finalQuizData) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          width: "60%",
          margin: "auto",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            backgroundColor: "aliceblue",
            padding: "20px",
          }}
        >
          You Have Exceeded The Free Trials Limit You Need To Buy The Course In
          Order To Retake The Final Quiz
        </h1>
      </div>
    );
  }

  if (userData.userId === "") {
    return (
      <div
        style={{
          display: "flex",
          width: "100%",
          minHeight: "100vh",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          rowGap: "20px",
        }}
      >
        <h1>Please Login First</h1>
        <button
          style={{
            width: "120px",
            height: "50px",
            borderRadius: "10px",
            backgroundColor: "rgb(21, 46, 125)",
            color: "white",
            fontSize: "20px",
            fontWeight: "bold",
          }}
          onClick={() => navigate("/Login")}
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="sectionQuizContainer">
      <Header userData={userData} />
      <div className="sectionQuizHeader">
        <h4>
          <span>Time Limit : </span>
          {timeLimit?.mins + ":" + timeLimit?.secs}
        </h4>
        <div className="startQBtn">
          <button
            style={{ display: renderQ ? "none" : "flex" }}
            onClick={() => {
              startTimer();
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
          {answers?.length === questions?.length && (
            <div className="btnConSubmit">
              <button
                className="SubmitQuizInFinalAndSectionQuiz"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
