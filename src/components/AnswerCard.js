import React, { useState, useMemo } from "react";
import {
  FaTrash
} from "react-icons/fa";
const AnswersCard = (props) => {
//   const [text, setText] = useState("");
  const MemoizedAnswersCard = useMemo(() => {
    return (
      <div className="ContAnswerCard">
        <input className="Radio" type="radio" name={props.groupName} onClick={props.correctAns}></input>
        <input className="InputWithDelete"placeholder="Add Answer" type="text" onChange={(e) => props.setText(e.target.value)} ></input>
        {props.lastCard&&<FaTrash className="FaTrash" onClick={props.delete}/>}
      </div>
    );
  }, [props.delete,]);

  return MemoizedAnswersCard;
};

export default AnswersCard;
