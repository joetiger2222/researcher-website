import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../css/SectionQuiz.css";
import Header from "./Header";
import QuestionCard from "./QuestionCard";

export default function FinalQuiz() {
  const [finalQuizData, setFinalQuizData] = useState(null);
  const questions = finalQuizData?.questions;
  const [renderQ, setRenderQ] = useState(false);
  const [timeLimit, setTimeLimit] = useState({
    mins: "",
    secs: "00",
  });
  const [answers, setAnswers] = useState([]);
  const { skillId } = useParams();
  const userData = useLocation().state?.data;
  const [researcherId, setResearcherId] = useState("");
  const navigate = useNavigate();

  // console.log(finalQuizData)

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
    if (counter === 1)
      fetch(
        `https://localhost:7187/api/Quizes/FinalQuiz/${skillId}?studentId=${userData.userId}`,
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
            setTimeLimit((prevData) => {
              if (data?.timeLimit.slice(0, 1) * 1 === 0) {
                return {
                  ...prevData,
                  // hours: data.timeLimit.slice(1, 2),
                  mins: data.timeLimit.slice(1, 2),
                };
              }
              return {
                ...prevData,
                // hours: data.timeLimit.slice(0, 2),
                mins: data.timeLimit.slice(0, 2),
              };
            });

            setFinalQuizData(data);
          }
        });
    counter = counter - 1;
  }
  console.log(timeLimit);

  useEffect(() => {
    getFinalQuizData();
  }, []);

  // function getResearcherIdByStudentId() {
  //   fetch(
  //     `https://localhost:7187/api/Researchers/ResearcherId/${userData.userId}`,
  //     {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${userData.token}`,
  //       },
  //     }
  //   )
  //     .then((res) => (res.ok ? res.json() : null))
  //     .then((data) => {
  //       if (data) {
  //         userData.roles = "Researcher";
  //         userData.resercherId = data.researcherId;
  //         setResearcherId(data.researcherId);
  //       }
  //     })
  //     .catch((error) => console.error(error));
  // }

  // async function getResearcherIdByStudentId() {
  //   try {
  //     const response = await fetch(
  //       `https://localhost:7187/api/Researchers/ResearcherId/${userData.userId}`,
  //       {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${userData.token}`,
  //         },
  //       }
  //     );
  //     if (response.ok) {
  //       const data = await response.json();
  //       userData.roles = "Researcher";
  //       userData.researcherId = data.researcherId;
  //       setResearcherId(data.researcherId);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  function getResearcherIdByStudentId() {
    return fetch(
      `https://localhost:7187/api/Researchers/ResearcherId/${userData.userId}`,
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
    let arr = [];

    answers.map((ans) => {
      arr.push(ans.answerId);
    });

    fetch(
      `https://localhost:7187/api/Quizes/FinalQuiz/Submit?QuizId=${finalQuizData?.id}&StudentId=${userData.userId}&skillId=${skillId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userData.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(arr),
      }
    )
      .then((res) => (res.ok ? res.json() : alert("failed to submit quiz")))
      .then((data) => {
        if (data) {
          if (data.isSuccessed) {
            getResearcherIdByStudentId().then(() => {
              userData.roles = "Researcher";
              navigate(`/SuccededFianlQuiz`, { state: { data: userData } });
            });
          } else {
            navigate(`/FailedFinalQuiz/${skillId}`, {
              state: { data: userData },
            });
          }
        }
      });
  }

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
      alert("Your Timer Has Finished !");
      navigate("/HomePage", { state: { data: userData } });
    }
  }, [timer, timeLimit.mins, timeLimit.secs]);

  if (!finalQuizData) {
    return (
      <div>
        <h1>
          You Have Exceeded The Free Trials Limit You Need To Buy The Course In
          Order To Retake The Final Quiz
        </h1>
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
