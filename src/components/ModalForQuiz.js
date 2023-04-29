import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import "../css/Modal.css"
const ModalForQuiz = (props) => {
  

  if(!props.show){
    return null
  }
  return (
    <>
  
     <div className="modal-overlay">
      <div className="modal">
      <div className="exit"><button className="buttonExit" onClick={()=>props.onClose()}>X</button></div>

        <h2 className="headContact">Quiz</h2>

        
          <div className="resetAndCancel">
            <button className="cancel" onClick={()=> props.onClose()}>Cancel</button>
            <button className="submitForm" type="submit" >Submit</button>
            </div>
      </div>
    </div>
   
    </>
  );
};

export default ModalForQuiz;

