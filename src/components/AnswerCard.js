import React, { useState, useMemo } from "react";

const AnswersCard = (props) => {
//   const [text, setText] = useState("");
  const MemoizedAnswersCard = useMemo(() => {
    return (
      <div>
        <input type="radio" name={props.groupName} onClick={props.correctAns}></input>
        <input type="text" onChange={(e) => props.setText(e.target.value)} ></input>
        {props.lastCard&&<button onClick={props.delete}>Delete</button>}
      </div>
    );
  }, [props.delete,]);

  return MemoizedAnswersCard;
};

export default AnswersCard;
