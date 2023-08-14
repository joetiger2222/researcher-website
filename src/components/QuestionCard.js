import React from "react";
import { useMemo } from "react";
const QuestionCard = ({ question, id,handleAnsQ }) => {

    function handleQ(a){
      const update={questionId:question.id,choosenAnsId:a.id}
      handleAnsQ(update)
    }
    const MemoizedAnswersCard = useMemo(() => {
    return (
      <div style={{padding:"20px",display:"flex",flexDirection:"column",gap:"10px"}}>
        <h3 style={{textAlign:"justify",whiteSpace: "pre-line"}}>{id + ". " + question?.name}</h3>
        <div style={{ paddingLeft: "40px",display: "flex",flexDirection: "column",gap: "10px"}}>
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
      <div className="custom-scrollbar" style={{ display: "flex",gap:"10px",width:"100%",maxHeight:"60px",overflow:"auto",textAlign:"justify",wordBreak:"break-word" }}>
        <input onClick={chooseAns} type="radio" name={`answernum${id}`}></input>
        <p style={{padding:"5px"}} className="custom-scrollbar">{a?.answerText}</p>
      </div>
    );
  };

  export default QuestionCard;