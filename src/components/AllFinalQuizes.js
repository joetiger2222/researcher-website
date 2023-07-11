import React, { useEffect ,useState} from "react";
import { useLocation, useNavigate, useParams} from "react-router-dom";
import "../css/AllFinalQuizes.css"
import Swal from "sweetalert2";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { useContext } from "react";
import { MyContext } from '../Users/Redux';
export default function AllFinalQuizes(){
    const userData = useContext(MyContext);
    // const userData = useLocation().state?.data;
    const {skillId}=useParams();
    const[allFinalQuizes,setAllFinalQuizes]=useState(null);
    const navigate=useNavigate();

    function getAllFinalQuizes(){
        fetch(`https://localhost:7187/api/Admin/Quizzes/${skillId}`,{
          method:"GET",
          headers:{
            "Authorization":`Bearer ${userData.token}`
          }
        })
        .then(res=>res.ok?res.json():null)
        .then(data=>data?setAllFinalQuizes(data):null)
      }

      useEffect(()=>{
        getAllFinalQuizes();
      },[userData])



function deleteFinalQuiz(quizId){
    Swal.fire({
         title: "Are You Sure To Delete The Quiz",
        showCancelButton: true,
    }).then((data) => {
        if(data.isConfirmed){
           fetch(`https://localhost:7187/api/Admin/Quizzes/${quizId}`,{
      method:"DELETE",
      headers:{
        "Authorization":`Bearer ${userData.token}`
      }
    })
    .then(res=>{
        if(res.ok){
            toastr.success('Quiz Successfully Deleted',"Success")
            getAllFinalQuizes();
        }else toastr.error('Failed to delete quiz',"Error")
    }) 
        }
    })
    
  }


  if(userData.userId===''){
    return (
      <div style={{display:'flex',width:'100%',minHeight:'100vh',justifyContent:'center',alignItems:'center',flexDirection:'column',rowGap:'20px'}}>
        <h1>Please Login First</h1>
        <button style={{width:'120px',height:'50px',borderRadius:'10px',backgroundColor:'rgb(21, 46, 125)',color:'white',fontSize:'20px',fontWeight:'bold'}} onClick={()=>navigate('/')}>Login</button>
      </div>
    )
  }

    return (
        <div className="ContainerAllQuizes">
            {allFinalQuizes?.map((quiz,index)=>{
                return(
                    <div className="ContainerDataForQuiz">
                        <h1 style={{textAlign:"center",borderBottom:"1px solid black"}}>Quiz Number : {index+1}</h1>
                        <h3 style={{textAlign:"center"}}>Time Limit : {quiz.timeLimit}</h3>
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
                                            <span className="custom-scrollbar" style={{lineBreak:"auto", display:'flex',flexDirection:'row',textAlign:"justify",gap:"5px",overflow:"auto",width:"100%"}}><span style={{fontWeight:"bold"}}>{index+1+")"} </span> {a.answerText}</span>
                                        )
                                    })}
                                    </div>
                                    
                                </div>
                            )
                        })}
                        </div>
                       <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
                       <button className="buttonExit2" style={{width:"160px"}} onClick={()=>deleteFinalQuiz(quiz.id)}>Delete This Quiz</button>

                       </div>
                    </div>
                )
            })}
        </div>
    )
}