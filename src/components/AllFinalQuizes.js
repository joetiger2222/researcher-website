import React, { useEffect ,useState} from "react";
import { useLocation, useParams} from "react-router-dom";

export default function AllFinalQuizes(){
    
    const userData = useLocation().state?.data;
    const {skillId}=useParams();
    const[allFinalQuizes,setAllFinalQuizes]=useState(null);


    function getAllFinalQuizes(){
        fetch(`https://localhost:7187/api/Admin/Quizzes/${skillId}`,{
          method:"GET",
          headers:{
            "Authorization":`Bearer ${userData.token}`
          }
        })
        .then(res=>res.ok?res.json():alert('failed to load all quizes'))
        .then(data=>data?setAllFinalQuizes(data):null)
      }

      useEffect(()=>{
        getAllFinalQuizes();
      },[])
console.log(allFinalQuizes)


function deleteFinalQuiz(quizId){
    fetch(`https://localhost:7187/api/Admin/Quizzes/${quizId}`,{
      method:"DELETE",
      headers:{
        "Authorization":`Bearer ${userData.token}`
      }
    })
    .then(res=>{
        if(res.ok){
            alert('Quiz Successfully Deleted')
            getAllFinalQuizes();
        }else alert('Failed to delete quiz')
    })
  }




    return (
        <div>
            {allFinalQuizes?.map((quiz,index)=>{
                return(
                    <div>
                        <h1>Quiz Number : {index+1}</h1>
                        <h3>Time Limit : {quiz.timeLimit.slice(0,5)}</h3>
                        <h4>Questions</h4>
                        {quiz.questions.map((q,indexQ)=>{
                            return(
                                <div>
                                    <span>Question Number : {indexQ+1}</span>
                                    <h3>{q.name}</h3>
                                    <span>Answers</span>
                                    {q.answers.map(a=>{
                                        return(
                                            <span style={{display:'flex',flexDirection:'column'}}>{a.answerText}</span>
                                        )
                                    })}
                                </div>
                            )
                        })}
                        <button onClick={()=>deleteFinalQuiz(quiz.id)}>Delete This Quiz</button>
                    </div>
                )
            })}
        </div>
    )
}