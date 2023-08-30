import React, { useEffect, useState } from "react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import "../css/Footer.css";
import { useContext } from "react";
import { MyContext } from '../Users/Redux';
import loader from '../loader.gif';
import { useNavigate } from "react-router-dom";
const Footer = () => {
  const [showProblemCard, setShowProblemCard] = useState(false);
  const userData = useContext(MyContext);
  const [load,setLoad]=useState(false);
 const navigate = useNavigate()
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const urlWhatSap = () => {
     
    let phoneNumber = "201064394735"; 
    let message = "Hello!"; 
    setWhatsappUrl(
      `https://api.whatsapp.com/send/?phone=${phoneNumber}&text&type=phone_number&app_absent=0`

     
    );
  };
  const ProblemCard = (props) => {
    const [problemCategories, setProblemCategories] = useState(null);
    const [problem, setProblem] = useState({
      description: "",
      studentId: userData.userId,
      problemCategoryId: 0,
    });

    function getProblemData(e) {
      setProblem((prev) => {
        return {
          ...prev,
          [e.target.name]: e.target.value,
        };
      });
    }

    function getProblemCategories() {
      fetch(`https://resweb-001-site1.htempurl.com/api/Admin/ProblemCategories`)
        .then((res) =>
          res.ok
            ? res.json()
            : toastr.error("failed to load problem categories", "Failed")
        )
        .then((data) => (data ? setProblemCategories(data) : null));
    }

    function sendProblem() {
      setLoad(true)
      fetch(`https://resweb-001-site1.htempurl.com/api/Students/Problems`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify(problem),
      }).then((res) => {
        setLoad(false)
        if (res.ok) {
          toastr.success("Problem Sent Successfully", "Success");
          props.onClose();
        } else toastr.error("Failed To Send Problem", "Failed");
      });
    }

    useEffect(() => {
      getProblemCategories();
      urlWhatSap();
    }, []);

    if (!props.show) return null;
    return (
      <div className="modal-overlay2">
        <div className="modal2"style={{height:"350px"}}>
          <div className="ContExitbtn">
            <div className="outer" onClick={props.onClose}>
              <div className="inner">
                <label className="label2">Exit</label>
              </div>
            </div>
          </div>

          <h2 className="headContact">Send Request</h2>
          <div className="FormModal2">
            <select
              className="InputModalHallDetails"
              name="problemCategoryId"
              onChange={(e) =>
                setProblem((prev) => {
                  return { ...prev, [e.target.name]: e.target.value * 1 };
                })
              }
            >
              <option selected disabled>
                Select Category
              </option>
              {problemCategories?.map((cat) => {
                return <option value={cat.id}>{cat.name}</option>;
              })}
            </select>
            <label className="AllLabeles">Enter Problem Description : </label>
            <input
            required
              className="InputModalHallDetails"
              name="description"
              onChange={getProblemData}
            ></input>

            <div className="buttonsOnModal">
              {problem.description!==''&&problem.problemCategoryId>0&&<button onClick={sendProblem}>Send</button>}
              <button onClick={props.onClose}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
  };







  if(load){
    return(
      <div style={{width:'100%',minHeight:'100vh',display:'flex',justifyContent:'center',alignItems:'center',backgroundColor:'white'}}>
        <img src={loader} />
      </div>
    )
  }



  return (
    <div className="Footer" style={{color:"#ffffffa8"}}>
      {!userData && (
        <div className="btnsFooter">
          <button>Login</button>
          <button>Sign Up</button>
        </div>
      )}
      
      <div className="IconsFooter">
        <a href="https://www.facebook.com/resweb.go">
          <FaFacebook className="icon-footer " />
        </a>
        <a href="https://www.linkedin.com/company/resweb/">
          <FaLinkedin className=" icon-footer" />
        </a>
        {/* <a href="https://www.facebook.com/resweb.go">
          <FaWhatsapp className=" icon-footer" />
        </a> */}

        {/* <div className="whatsap"> */}
        <a href="https://api.whatsapp.com/send?phone=201064394735&text=Hello%20there">
  <FaWhatsapp className="icon-footer" />
</a>

              {/* </div> */}
              {/* AiOutlineWhatsApp */}
        {/* <a href="https://www.facebook.com/resweb.go">

        <FaTwitterSquare className="  icon-footer" />
                </a> */}
        <a href="https://instagram.com/resweb.co">
          <FaInstagram className=" icon-footer" />
        </a>
      </div>
      <div className="aboutUsAndContact">
        <a  onClick={() => {
                    if (userData.userId !== "") {
                      navigate("/");
                     
                      
                      setTimeout(()=>{
                        const el = document.getElementById("aboutUsContainer");
                        if(el){
                          window.scrollTo({
                            top: el.offsetTop,
                            behavior: "smooth",
                          });
                        }
                       
                      },100)
                      // window.scrollTo(0, 1600);
                    } else {
                      toastr.info(
                        "You Nedd To Login First Before Unlocking This Page"
                      );
                    }
                  }}>About Us</a>
        <a href="#">Contact Us </a>
      </div>
      <div className="AllRightReserved">
        <p><span>&#169; All Rights Are Reserved For Teamwork</span> </p>
      </div>
      {userData.userId!==''&&<div style={{width:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
        <button style={{backgroundColor:"#ffffffa8",width:'80%',maxWidth:'200px'}}  className="bn54" onClick={() => setShowProblemCard(true)}>
         Talk To Us
        </button>
        {showProblemCard && (
          <ProblemCard
            show={showProblemCard}
            onClose={() => setShowProblemCard(false)}
          />
        )}
      </div>}
      
    </div>
  );
};

export default Footer;
