import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState,useRef } from "react";
import toastr from "toastr";
import { MdOutlineFileUpload } from "react-icons/md";
export default function UploadFinalTask(){
    const userData=useLocation().state.data;
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
            `https://localhost:7187/api/Ideas/Tasks/Submit?taskId=${taskId}&participantId=${userData.resercherId}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${userData.token}`,
              },
              body: formData,
            }
          )
        //   .then((res) => {
        //     if (res.ok) {
        //       toastr.success("File Uploaded Successfully", "Success");
        //       navigate(-1, { replace: true });
              
        //     } else
        //       toastr.error("failed to add file please try again later", "Failed");
        //   });
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
              console.log(body);
            });
          })
          .catch((error) => console.error(error));
        };
    


    return (
        <div style={{width:'100%',minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
            
            <h1 className="headContact2">Upload Document</h1>
          <div className="FormModal2">
            <label className="LableForinputTypeFile" htmlFor="img">
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



// const UploadFinalTaskFile=(props)=>{
//     console.log('renders')
//     const titleRef = useRef(null);
//     const [document, setDocument] = useState(null);


//     const handleDocumentUpload = (event) => {
//       const file = event.target.files[0];
//       setDocument(file);
//     };

//     const handleDocumentSubmit = (event) => {
//       event.preventDefault();
//       const titleValue = titleRef.current.value;
//       const formData = new FormData();
//       formData.append("file", document);
//       formData.append("Name", titleValue);

//       fetch(
//         `https://localhost:7187/api/Ideas/Tasks/Submit?taskId=${props.task.id}&participantId=${userData.resercherId}`,
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${userData.token}`,
//           },
//           body: formData,
//         }
//       ).then((res) => {
//         if (res.ok) {
//           toastr.success("File Uploaded Successfully", "Success");
//           props.onClose();
//         } else
//           toastr.error("failed to add video please try again later", "Failed");
//       });
//     };

// console.log('from modal',props);

//     if (!props.show) return null;
//     return (
//       <div className="modal-overlay2">
//         <div className="modal2">
//           <div className="ContExitbtn" onClick={props.onClose}>
//             <div class="outer">
//               <div class="inner">
//                 <label className="label2">Exit</label>
//               </div>
//             </div>
//           </div>
//           <h1 className="headContact2">Upload Document</h1>
//           <div className="FormModal2">
//             <label className="LableForinputTypeFile" htmlFor="img">
//               <input
//                 className="InputFile"
//                 id="img"
//                 type="file"
//                 onChange={handleDocumentUpload}
//               />
//               <span className="SpanUpload">
//                 {" "}
//                 <MdOutlineFileUpload />
//                 <span>Choose a File</span>
//               </span>
//             </label>

//             {document && (
//               <input
//                 id="title"
//                 className="InputModalHallDetails"
//                 type="text"
//                 placeholder="file name"
//                 required
//                 name="Title"
//                 ref={titleRef}
//               ></input>
//             )}
//             <div className="buttonsOnModal">
//               {document && (
//                 <button className="" onClick={handleDocumentSubmit}>
//                   Upload Document
//                 </button>
//               )}
//               <button className="" onClick={props.onClose}>
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }