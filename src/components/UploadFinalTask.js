import React from "react";
import {  useNavigate, useParams } from "react-router-dom";
import { useState,useRef } from "react";
import toastr from "toastr";
import { MdOutlineFileUpload } from "react-icons/md";
import { useContext } from "react";
import { MyContext } from '../Users/Redux';
export default function UploadFinalTask(){
    
    const userData = useContext(MyContext);
    const {taskId}=useParams();
    const navigate=useNavigate();



    const titleRef = useRef(null);
        const [document, setDocument] = useState(null);
    
    
        const handleDocumentUpload = (event) => {
          const file = event.target.files[0];
          setDocument(file);
        };
    
        const handleDocumentSubmit = (event) => {
          event.preventDefault();
          const titleValue = titleRef.current.value;
          const formData = new FormData();
          formData.append("file", document);
          formData.append("Name", titleValue);
    
          fetch(
            `https://resweb-001-site1.htempurl.com/api/Ideas/Tasks/Submit?taskId=${taskId}&participantId=${userData.resercherId}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${userData.token}`,
              },
              body: formData,
            }
          )
        
        .then((response) => {
            const reader = response.body.getReader();
            let chunks = [];
          
            function readStream() {
              return reader.read().then(({ done, value }) => {
                if (done) {
                  return chunks;
                }
                chunks.push(value);
                return readStream();
              });
            }
          
            if (!response.ok) {
              return readStream().then((chunks) => {
                const body = new TextDecoder().decode(
                  new Uint8Array(chunks.flatMap((chunk) => Array.from(chunk)))
                );
                toastr.error(body);
              });
            }else {
                toastr.success("File Uploaded Successfully", "Success");
              navigate(-1, { replace: true });
            }
          
            return readStream().then((chunks) => {
              const body = new TextDecoder().decode(
                new Uint8Array(chunks.flatMap((chunk) => Array.from(chunk)))
              );
              
            });
          })
          .catch((error) => console.error(error));
        };
    
        if(userData.userId===''){
          return (
            <div style={{display:'flex',width:'100%',minHeight:'100vh',justifyContent:'center',alignItems:'center',flexDirection:'column',rowGap:'20px'}}>
              <h1>Please Login First</h1>
              <button style={{width:'120px',height:'50px',borderRadius:'10px',backgroundColor:'rgb(21, 46, 125)',color:'white',fontSize:'20px',fontWeight:'bold'}} onClick={()=>navigate('/Login')}>Login</button>
            </div>
          )
        }

    return (
        <div style={{width:'100%',minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
            
            <h1 className="headContact2">Upload Document</h1>
          <div className="FormModal2" style={{width:"500px"}}>
            <label className="LableForinputTypeFile"style={{justifyContent:"center"}} htmlFor="img">
              <input
                className="InputFile"
                id="img"
                type="file"
                onChange={handleDocumentUpload}
              />
              <span className="SpanUpload">
                {" "}
                <MdOutlineFileUpload />
                <span>Choose a File</span>
              </span>
            </label>

            {document && (
              <input
                id="title"
                className="InputModalHallDetails"
                type="text"
                placeholder="file name"
                required
                name="Title"
                ref={titleRef}
              ></input>
            )}
            <div className="buttonsOnModal">
              {document && (
                <button className="" onClick={handleDocumentSubmit}>
                  Upload Document
                </button>
              )}
              
            </div>
          </div>
        </div>
    )
}



