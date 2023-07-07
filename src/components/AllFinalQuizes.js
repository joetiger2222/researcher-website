import React, { useEffect ,useState} from "react";
import { useLocation, useParams} from "react-router-dom";
import "../css/AllFinalQuizes.css"
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
        <div className="ContainerAllQuizes">
            {allFinalQuizes?.map((quiz,index)=>{
                return(
                    <div className="ContainerDataForQuiz">
                        <h1 style={{textAlign:"center",borderBottom:"1px solid black"}}>Quiz Number : {index+1}</h1>
                        <h3 style={{textAlign:"center"}}>Time Limit : {quiz.timeLimit.slice(0,5)}</h3>
                        <h3>Questions</h3>

                        <div className="custom-scrollbar" style={{maxHeight: "515px",overflow:"auto"}}>
                            
                        {quiz.questions.map((q,indexQ)=>{
                            return(
                                <div>
                                    <h4>Question Number : {indexQ+1}</h4>
                                    <p style={{fontWeight:"500",textTransform:"capitalize",textAlign:"justify",padding:"10px"}}>{q.name}</p>
                                    <h4>Answers</h4>
                                    <div style={{padding:"10px",display:"flex",flexDirection:"column",gap:"5px"}}>
                                    {q.answers.map((a,index)=>{
                                        return(
                                            <span style={{lineBreak:"auto", display:'flex',flexDirection:'row',textAlign:"justify",gap:"5px"}}><span style={{fontWeight:"bold"}}>{index+1+")"} </span> {a.answerText}</span>
                                        )
                                    })}
                                    </div>
                                    
                                </div>
                            )
                        })}
                        </div>
                       <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
                       <button className="buttonExit2" style={{width:"120px"}} onClick={()=>deleteFinalQuiz(quiz.id)}>Delete This Quiz</button>

                       </div>
                    </div>
                )
            })}
        </div>
    )
}