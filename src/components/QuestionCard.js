import React from "react";
import { useMemo } from "react";

const QuestionCard = ({ question, id,handleAnsQ }) => {

    function handleQ(a){
      const update={questionId:question.id,choosenAnsId:a.id}
      handleAnsQ(update)
    }
    const MemoizedAnswersCard = useMemo(() => {
    return (
      <div>
        <h1>{id + ". " + question?.name}</h1>
        <div style={{ paddingLeft: "40px" }}>
          {question.answers?.map((a) => {
            return <Answers a={a} id={id} chooseAns={()=>handleQ(a)}
            />;
          })}
        </div>
      </div>
    );
     },[question, id,handleAnsQ])
        return MemoizedAnswersCard;
  };


  const Answers = ({ a ,id,chooseAns}) => {
    return (
      <div style={{ display: "flex",gap:"10px" }}>
        <input onClick={chooseAns} type="radio" name={`answernum${id}`}></input>
        <p>{a?.answerText}</p>
      </div>
    );
  };

  export default QuestionCard;