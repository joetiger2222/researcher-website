import React, { useEffect, useState } from "react";
import {useNavigate } from "react-router-dom";
import Header from "./Header";
import "../css/Marketplace.css";
import "../css/Modal.css";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { FaCrown } from "react-icons/fa";
import Footer from "./Footer";
import { useContext } from "react";
import { MyContext } from "../Users/Redux";
import SideBar from "./SideBar";
import loader from '../loader.gif';
export default function MarketPalce() {
  const [load,setLoad]=useState(false);
  const [sideBarVisible, setSideBarVisible] = useState(false);
  const [researcherIdeas, setResearcherIdeas] = useState([]);
  const [allIdeas, setAllIdeas] = useState(null);
  const [showCreateIdeaCard, setShowIdeaCard] = useState(false);
  const [showTermsAndCondsCard, setShowTermsAndCondsCard] = useState(false);
  const [showTermsForReq, setShowTermsForReq] = useState(false);
  const [choosenIdea, setChoosenIdea] = useState(null);
  const [allTopics, setAllTopics] = useState(null);
  const [allSpecs, setAllSpecs] = useState(null);
  const [completedIdeas, setCompletedIdea] = useState(null);

  const userData = useContext(MyContext);
  const [ideaSearch, setIdeaSearch] = useState({
    SearchTerm: "",
    Topic: 0,
    Specality: 0,
    Month: 0,
    counter:5,
  });
  const [completeIdeaSearch, setCompleteIdeaSearch] = useState({
    SearchTerm: "",
    Topic: 0,
    Specality: 0,
    Month: 0,
  });
  const navigate = useNavigate();




function renderSideBar() {
    if (sideBarVisible) {
      return <SideBar />;
    }
  }

  function renderSideBarIcon() {
    if (sideBarVisible) {
      return (
        <svg
          className="closeSvg"
          stroke="currentColor"
          fill="black"
          stroke-width="0"
          viewBox="0 0 24 24"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g>
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"></path>
          </g>
        </svg>
      );
    } else {
      return (
        <svg
        style={{zIndex:'300'}}
          className="closeSvg"
          stroke="currentColor"
          fill="black"
          stroke-width="0"
          viewBox="0 0 24 24"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      );
    }
  }



  function getResearcherIdeas() {
    fetch(
      `https://resweb-001-site1.htempurl.com/api/Researchers/Ideas/${userData?.resercherId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData?.token}`,
        },
      }
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setResearcherIdeas(data);
        }
      });
  }

  function getAllIdeas() {
    fetch(
      `https://resweb-001-site1.htempurl.com/api/Ideas?SearchTerm=${ideaSearch.SearchTerm}&Topic=${ideaSearch.Topic}&Specality=${ideaSearch.Specality}&Month=${ideaSearch.Month}&PageSize=${ideaSearch.counter}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData?.token}`,
        },
      }
    )
      
      .then(res=>{
        
        if(res.ok){
          return res.json();
        }
      })
      .then((data) => {
        if (data) {
          setAllIdeas(data);
        }
      });
  }

  function getAllSpecs() {
    fetch(`https://resweb-001-site1.htempurl.com/api/Researchers/Specialties`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setAllSpecs(data);
        }
      });
  }

  function getAllTopics() {
    fetch(`https://resweb-001-site1.htempurl.com/api/Researchers/Topics`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setAllTopics(data);
        }
      });
  }

  function getCompletedIdeas() {
    fetch(
      `https://resweb-001-site1.htempurl.com/api/Ideas/CompletedIdeas?SearchTerm=${completeIdeaSearch.SearchTerm}&Specality=${completeIdeaSearch.Specality}&Month=${completeIdeaSearch.Month}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      }
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setCompletedIdea(data);
        }
      });
  }

  useEffect(() => {
    getResearcherIdeas();
    getAllSpecs();
    getAllTopics();
  }, [userData]);

  useEffect(() => {
    getAllIdeas();
  }, [ideaSearch, userData]);

  useEffect(() => {
    getCompletedIdeas();
  }, [completeIdeaSearch, userData]);

  useEffect(()=>{
    window.scrollTo(0, 0);
  },[])

  function sendReq(ideaId) {
    setLoad(true)
    fetch(
      `https://resweb-001-site1.htempurl.com/api/Ideas/Requests/SendRequest/${userData?.resercherId}/${ideaId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      }
    )
      .then((response) => {
        setLoad(false)
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

        return readStream().then(() => {
          if (!response.ok) {
            const body = new TextDecoder().decode(
              new Uint8Array(chunks.flatMap((chunk) => Array.from(chunk)))
            );
            if (body.includes("joined")) {
              toastr.info("You Already Joined This Idea");
            } else toastr.info(body);
          } else toastr.success("Request Sent Successfully", "Success");
        });
      })
      .catch((error) => console.error(error));
  }

  const CreateNewIdeaCard = (props) => {
    const [allSpecs, setAllSpecs] = useState(null);
    const [allTopics, setAllTopics] = useState(null);
    const [ideaData, setIdeaData] = useState({
      name: "",
      maxParticipantsNumber: 0,
      topicId: 0,
      specalityId: 0,
      deadline: "",
    });
    

    function getIdeaData(e) {
      setIdeaData((prev) => {
        return {
          ...prev,
          [e.target.name]: e.target.value,
        };
      });
    }

    function getAllSpecs() {
      fetch(`https://resweb-001-site1.htempurl.com/api/Researchers/Specialties`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
        .then((res) =>
          res.ok ? res.json() : toastr.error("failed to Load specs", "Failed")
        )
        .then((data) => {
          if (data) {
            setAllSpecs(data);
          }
        });
    }

    function getAllTopics() {
      fetch(`https://resweb-001-site1.htempurl.com/api/Researchers/Topics`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
        .then((res) =>
          res.ok ? res.json() : toastr.error("failed to Load topics", "Failed")
        )
        .then((data) => {
          if (data) {
            setAllTopics(data);
          }
        });
    }

    useEffect(() => {
      getAllSpecs();
      getAllTopics();
    }, []);

    function createNewIdea(e) {
      e.preventDefault();
     
      const currentYear = new Date().getFullYear();
const futureYearLimit = currentYear + 10; // You can adjust the limit as needed

const yearRangeRegex = new RegExp(
  `^(${currentYear}|${Array.from({ length: futureYearLimit - currentYear }, (_, i) => currentYear + i + 1).join('|')})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])$`
);

const val = yearRangeRegex.test(ideaData.deadline);

     
      if (val) {
        setLoad(true)
        fetch(
          `https://resweb-001-site1.htempurl.com/api/Ideas/InitiateIdea/${userData.resercherId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${userData.token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(ideaData),
          }
        )
          .then((response) => {
            setLoad(false)
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
                toastr.info(body);
              });
            } else window.location.reload();

            return readStream().then((chunks) => {
              const body = new TextDecoder().decode(
                new Uint8Array(chunks.flatMap((chunk) => Array.from(chunk)))
              );
              
            });
          })
          .catch((error) => console.error(error));
      } else toastr.error("please enter a valid deadline yyyy-mm-dd", "Error");
    }

    if (!props.show) return null;
    return (
      <div className="modal-overlay2">
        <div className="modal2">
          <div className="ContExitbtn" onClick={props.onClose}>
            <div class="outer">
              <div class="inner">
                <label className="label2">Exit</label>
              </div>
            </div>
          </div>
          <h1 className="headContact2">Create New Idea</h1>

          <form className="FormModal2" onSubmit={createNewIdea}>
            <label className="AllLabeles">Idea Name: </label>
            <input
            required
              className="InputModalHallDetails"
              onChange={getIdeaData}
              name="name"
            ></input>
            <label className="AllLabeles">Participants Number: </label>
            <input
            min={1}
            required
              className="InputModalHallDetails"
              onChange={(e) =>
                setIdeaData((prev) => {
                  return { ...prev, maxParticipantsNumber: e.target.value * 1 };
                })
              }
              name="maxParticipantsNumber"
              type="number"
            ></input>
            <select
            required
              className="InputModalHallDetails"
              onChange={(e) =>
                setIdeaData((prev) => {
                  return { ...prev, specalityId: e.target.value * 1 };
                })
              }
            >
              <option selected disabled value="">
                Choose a Speciality
              </option>
              {allSpecs?.map((spec) => {
                return <option value={spec.id}>{spec.name}</option>;
              })}
            </select>
            <select
            required
              className="InputModalHallDetails"
              onChange={(e) =>
                setIdeaData((prev) => {
                  return { ...prev, topicId: e.target.value * 1 };
                })
              }
            >
              <option selected disabled value="">
                Study Design
              </option>
              {allTopics?.map((spec) => {
                return <option value={spec.id}>{spec.name}</option>;
              })}
            </select>
            <label className="AllLabeles">Deadline</label>
            <input
            required
              className="InputModalHallDetails"
              type="text"
              onChange={getIdeaData}
              placeholder="yyyy-mm-dd"
              name="deadline"
            ></input>
            <div className="buttonsOnModal">
              <button className=""  type="submit">
                Create
              </button>
              <button className="" onClick={props.onClose}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const TermsAndConds = (props) => {
    if (!props.show) return null;
    return (
      <div className="modal-overlay2">
        <div className="modal2" >
          <div className="ContExitbtn" onClick={props.onClose}>
            <div class="outer">
              <div class="inner">
                <label className="label2">Exit</label>
              </div>
            </div>
          </div>
          <h1 className="headContact2">Terms & Conditions</h1>

          <div style={{gap:"20px"}} className="FormModal2">
            <p className="custom-scrollbar">
              Welcome to [ResWeb] ("the Platform"). By accessing or using the
              Platform, you agree to be bound by the following terms and
              conditions:<br></br><br></br> 1. Registration and User Accounts:<br></br> a. Eligibility:
              Only individuals who meet the eligibility criteria may register
              and use the Platform.<br></br> b. Account Information: You must provide
              accurate and complete information during the registration process.
              <br></br> c. Account Security: You are responsible for maintaining the
              confidentiality and security of your account.<br></br><br></br> 2. Idea Submission
              and Ownership:<br></br> a. Ownership: The creator of the submitted idea
              retains ownership of their intellectual property rights but the
              leader has the right to be from the first authors.<br></br> b.
              Responsibility for Content: The leader ensures that the submitted
              idea is original, does not contain plagiarism, and complies with
              all ethical and legal requirements.<br></br> c. Data Source: The Platform
              is not responsible for the authenticity or accuracy of the data
              provided with the submitted idea.<br></br> d. License to the Platform:
              Researchers grant the Platform a non-exclusive license to display,
              promote, and distribute the submitted ideas.<br></br> e. No Ownership
              Claim: The Platform does not claim ownership of the ideas or
              research papers.<br></br> f. Affiliation claim: The Platform has the right
              to be affiliated in any idea conducted by it, any idea which is
              led by a researcher from our side or by doing an agreement (oral
              or written) with the leader of the idea.<br></br><br></br> 3. Application and
              Selection Process: <br></br>a. Eligibility: Researchers must meet the
              specified criteria to apply for project ideas.<br></br> b. Selection
              Criteria: The Leader reserves the right to select researchers who
              are joining the idea based which is led by this leader based on
              their qualifications, expertise, and proposal quality.<br></br> c.
              Attribution: The leader's name will be attributed as the author or
              co-author of the research paper resulting from the idea.<br></br> d.
              Discretion: The leader or platform retains the right to accept or
              reject applications at its sole discretion except if the leader is
              not the creator of the idea, he cannot reject the creator of the
              idea.<br></br><br></br> 4. Rights and Responsibilities:<br></br> a. Leader's Responsibility:
              The leader of the idea is responsible for leading the research
              paper from start to finish, reviewing all steps, and ensuring its
              quality and accuracy.<br></br> b. Publication Responsibility: The leader is
              responsible for deciding whether and where to publish the research
              paper, in compliance with relevant policies and guidelines.<br></br> c.
              Platform's Limited Liability: The Platform is not responsible for
              the content, accuracy, or outcomes of the research papers
              conducted by researchers. The platform is also not responsible for
              the actions, conduct, or outcomes of individual researchers.<br></br> d.
              Compliance: Researchers must comply with all applicable laws,
              regulations, and ethical guidelines while conducting their
              research.<br></br> e. Members joining an idea: The leader of the idea must
              ensure that all the joining members are mentioned in the paper as
              authors or co-authors.<br></br><br></br> 5. Confidentiality and Data Protection:<br></br> a.
              Confidentiality: The Platform will handle research ideas and
              personal data collected in accordance with its Privacy Policy.<br></br> b.
              Data Protection: The Platform is committed to protecting user data
              and complying with applicable data protection laws.<br></br> c.
              Anonymization and Aggregation: The Platform may use anonymization
              or aggregation techniques to protect privacy.<br></br><br></br> 6. Dispute
              Resolution:<br></br> a. Mediation: Any disputes between researchers and the
              Platform shall be resolved through mediation in good faith.<br></br> b.
              Jurisdiction: The laws of [Egypt] shall govern any legal disputes
              arising from the use of the Platform.<br></br> c. Venue: Any legal
              proceedings shall be exclusively conducted in the courts of
              [Egypt].<br></br><br></br> 7. Termination and Suspension:<br></br> a. Termination Rights: The
              Platform reserves the right to terminate or suspend a researcher's
              account for noncompliance with the terms or unethical conduct.<br></br> b.
              Notice and Appeal: In the event of termination or suspension, the
              Platform may provide notice and an opportunity to appeal the
              decision.<br></br><br></br> 8. Modifications to the Terms and Conditions:<br></br> a.
              Updates: The Platform may update or modify these terms and
              conditions from time to time.<br></br> b. Notification: Users will be
              notified of any changes to the terms and conditions, and the
              revised terms will become effective as of the specified date.<br></br> c.
              Termination Option: If you do not agree to the updated terms, you
              have the option to terminate your account.<br></br><br></br> By using the Platform,
              you acknowledge that you have read, understood, and agreed to
              these terms and conditions. If you do not agree to these terms,
              please do not use the Platform.<br></br><br></br> [ResWeb Research Platform]<br></br><br></br> [10th
              July 2023]<br></br><br></br> <h3>Privacy & Policy</h3><br></br> Effective Date: [10th July 2023]<br></br> Thank
              you for using [ResWeb] ("the Platform"). This Privacy Policy
              outlines how we collect, use, and protect your personal
              information when you access and use our services. By using the
              Platform, you agree to the terms of this Privacy Policy.<br></br><br></br>
              <h3>Information We Collect</h3> <br></br><br></br>Personal Information: [name, email address,
              qualifications, skills, courses, previous research experience,
              phone number, age, gender, nationality and degree] <br></br>Usage Data: [IP
              addresses, browser information, usage patterns]<br></br><br></br> <h3>Use of Information</h3><br></br>
              Purpose: We use the collected information to provide and improve
              the services offered by the Platform, facilitate idea submission
              and researcher applications, and communicate with users.<br></br>
              Communication: We may use the provided email addresses to send
              notifications, updates, and important information related to the
              Platform.<br></br> <br></br><h3>Data Security</h3><br></br> Security Measures: We implement
              appropriate security measures to protect your personal information
              against unauthorized access, alteration, disclosure, or
              destruction.<br></br> Data Retention: We retain your personal information
              for as long as necessary to fulfill the purposes outlined in this
              Privacy Policy or as required by law.<br></br> Third-Party Disclosure<br></br>
              Sharing Information: We do not sell, trade, or transfer your
              personal information to third parties without your explicit
              consent, except as required to provide the Platform's services or
              comply with legal obligations.<br></br> Service Providers: We may engage
              trusted third-party service providers to assist in operating the
              Platform, subject to confidentiality obligations.<br></br> <br></br><h3>Your Rights</h3><br></br>
              Access and Correction: You have the right to access and correct
              the personal information we hold about you.<br></br> Account Deletion: You
              can request the deletion of your account and associated personal
              information by contacting our support.<br></br><br></br> <h3>Cookies and Tracking
              Technologies</h3> <br></br><br></br>Usage: We may use cookies and similar tracking
              technologies to enhance your user experience and collect
              information about usage patterns.<br></br> Control: You can control and
              manage your cookie preferences through your browser settings.<br></br>
              <h3>Changes to the Privacy Policy</h3><br></br> Updates: We reserve the right to
              update or modify this Privacy Policy from time to time.<br></br>
              Notification: We will notify you of any changes to the Privacy
              Policy, and the revised policy will become effective as of the
              specified date.<br></br> If you have any questions or concerns regarding
              this Privacy Policy, please contact us at our WhatsApp number
              +201064394735 or any of our social media platforms.
            </p>

            <div className="buttonsOnModal">
              <button
                className=""
                onClick={() => {
                  props.onClose();
                  setShowIdeaCard(true);
                }}
              >
                Accept
              </button>
              <button className="" onClick={props.onClose}>
                Decline
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TermsForReq = (props) => {
    if (!props.show) return null;
    return (
      <div className="modal-overlay2">
        <div className="modal2" >
          <div className="ContExitbtn" onClick={props.onClose}>
            <div class="outer">
              <div class="inner">
                <label className="label2">Exit</label>
              </div>
            </div>
          </div>
          <h1 className="headContact2">Terms & Conditions</h1>

          <div style={{gap:"20px"}} className="FormModal2">
            <p className="custom-scrollbar">
              Welcome to [Your Research Platform] ("the Platform"). By accessing
              or using the Platform, you agree to be bound by the following
              terms and conditions:<br></br><br></br> 1. Registration and User Accounts:<br></br> a.
              Eligibility: Only individuals who meet the eligibility criteria
              may register and use the Platform.<br></br> b. Account Information: You
              must provide accurate and complete information during the
              registration process.<br></br> c. Account Security: You are responsible for
              maintaining the confidentiality and security of your account.<br></br><br></br> 2.
              Idea Submission and Ownership:<br></br> a. Ownership: The creator of the
              submitted idea retains ownership of their intellectual property
              rights but the leader has the right to be from the first authors.<br></br>
              b. Responsibility for Content: The leader ensures that the
              submitted idea is original, does not contain plagiarism, and
              complies with all ethical and legal requirements.<br></br> c. Data Source:
              The Platform is not responsible for the authenticity or accuracy
              of the data provided with the submitted idea.<br></br> d. License to the
              Platform: Researchers grant the Platform a non-exclusive license
              to display, promote, and distribute the submitted ideas.<br></br> e. No
              Ownership Claim: The Platform does not claim ownership of the
              ideas or research papers.<br></br> f. Affiliation claim: The Platform has
              the right to be affiliated in any idea conducted by it, any idea
              which is led by a researcher from our side or by doing an
              agreement (oral or written) with the leader of the idea.<br></br> 3.
              Application and Selection Process:<br></br> a. Eligibility: Researchers
              must meet the specified criteria to apply for project ideas.<br></br> b.
              Selection Criteria: The leader reserves the right to select
              researchers who are joining the idea based which is led by this
              leader on their qualifications, expertise, and suitability for the
              assigned tasks.<br></br> c. Attribution: The researcher's name will be
              attributed as an author or co-author of the research paper
              resulting from the idea.<br></br><br></br> 4. Rights and Responsibilities:<br></br> a.
              Researcher's Responsibility: Researchers are responsible for
              conducting the assigned tasks with diligence, ensuring the quality
              and accuracy of their work.<br></br> b. Publication Rights: The researcher
              shall not have any claim or right to publish or disclose the
              research paper without the leader's approval.<br></br> c. No Financial
              Compensation: The researcher shall not receive any monetary
              compensation for their work; their motivation is to be recognized
              as an author or co-author.<br></br><br></br> 5. Confidentiality and Data Protection:<br></br>
              a. Confidentiality: The Platform will handle research ideas and
              personal data collected in accordance with its Privacy Policy. The
              Platform can view the paper data only for reviewing, reports and
              checking problems, but not able to change or edit any of the
              research idea’s data.<br></br> b. Data Protection: The Platform is
              committed to protecting user data and complying with applicable
              data protection laws.<br></br> c. Anonymization and Aggregation: The
              Platform may use anonymization or aggregation techniques to
              protect privacy.<br></br><br></br> 6. Dispute Resolution:<br></br> a. Mediation: Any disputes
              between researchers and the Platform shall be resolved through
              mediation in good faith.<br></br> b. Jurisdiction: The laws of [Egypt]
              shall govern any legal disputes arising from the use of the
              Platform.<br></br> c. Venue: Any legal proceedings shall be exclusively
              conducted in the courts of [Egypt].<br></br><br></br> 7. Termination and Suspension:<br></br>
              a. Termination Rights: The Platform reserves the right to
              terminate or suspend a researcher's account for noncompliance with
              the terms or unethical conduct.<br></br> b. Notice and Appeal: In the event
              of termination or suspension, the Platform may provide notice and
              an opportunity to appeal the decision.<br></br><br></br> 8. Modifications to the
              Terms and Conditions:<br></br> a. Updates: The Platform may update or
              modify these terms and conditions from time to time.<br></br> b.
              Notification: Users will be notified of any changes to the terms
              and conditions, and the revised terms will become effective as of
              the specified date.<br></br> c. Termination Option: If you do not agree to
              the updated terms, you have the option to terminate your account.<br></br><br></br>
              By using the Platform, you acknowledge that you have read,
              understood, and agreed to these terms and conditions. If you do
              not agree to these terms, please do not use the Platform.<br></br><br></br> [ResWeb
              Research Platform]<br></br> [10th July 2023] <br></br><br></br><h3>Privacy & Policy</h3> <br></br>Effective
              Date: [10th July 2023]<br></br> Thank you for using [ResWeb] ("the
              Platform"). This Privacy Policy outlines how we collect, use, and
              protect your personal information when you access and use our
              services. By using the Platform, you agree to the terms of this
              Privacy Policy.<br></br><br></br> <h3>Information We Collect</h3><br></br> Personal Information:
              [name, email address, qualifications, skills, courses, previous
              research experience, phone number, age, gender, nationality and
              degree]<br></br> Usage Data: [IP addresses, browser information, usage
              patterns]<br></br><br></br> <h3>Use of Information</h3> <br></br>Purpose: We use the collected
              information to provide and improve the services offered by the
              Platform, facilitate idea submission and researcher applications,
              and communicate with users.<br></br> Communication: We may use the provided
              email addresses to send notifications, updates, and important
              information related to the Platform.<br></br><br></br> <h3>Data Security</h3><br></br> Security
              Measures: We implement appropriate security measures to protect
              your personal information against unauthorized access, alteration,
              disclosure, or destruction.<br></br> Data Retention: We retain your
              personal information for as long as necessary to fulfill the
              purposes outlined in this Privacy Policy or as required by law.<br></br>
              Third-Party Disclosure<br></br> Sharing Information: We do not sell, trade,
              or transfer your personal information to third parties without
              your explicit consent, except as required to provide the
              Platform's services or comply with legal obligations.<br></br> Service
              Providers: We may engage trusted third-party service providers to
              assist in operating the Platform, subject to confidentiality
              obligations.<br></br><br></br> <h3>Your Rights</h3><br></br> Access and Correction: You have the right
              to access and correct the personal information we hold about you.<br></br>
              Account Deletion: You can request the deletion of your account and
              associated personal information by contacting our support.<br></br><br></br> <h3>Cookies
              and Tracking Technologies</h3><br></br> Usage: We may use cookies and similar
              tracking technologies to enhance your user experience and collect
              information about usage patterns.<br></br> Control: You can control and
              manage your cookie preferences through your browser settings.<br></br><br></br>
              <h3>Changes to the Privacy Policy</h3><br></br> Updates: We reserve the right to
              update or modify this Privacy Policy from time to time.<br></br>
              Notification: We will notify you of any changes to the Privacy
              Policy, and the revised policy will become effective as of the
              specified date.<br></br> If you have any questions or concerns regarding
              this Privacy Policy, please contact us at our WhatsApp number
              +201064394735 or any of our social media platforms.
            </p>

            <div className="buttonsOnModal">
              <button
                className=""
                onClick={() => {
                  props.onClose();
                  sendReq(props.idea.id);
                }}
              >
                Accept
              </button>
              <button className="" onClick={props.onClose}>
                Decline
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (userData.userId === "") {
    return (
      <div
        style={{
          display: "flex",
          width: "100%",
          minHeight: "100vh",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          rowGap: "20px",
        }}
      >
        <h1>Please Login First</h1>
        <button
          style={{
            width: "120px",
            height: "50px",
            borderRadius: "10px",
            backgroundColor: "rgb(21, 46, 125)",
            color: "white",
            fontSize: "20px",
            fontWeight: "bold",
          }}
          onClick={() => navigate("/Login")}
        >
          Login
        </button>
      </div>
    );
  }



  if(load){
    return(
      <div style={{width:'100%',minHeight:'100vh',display:'flex',justifyContent:'center',alignItems:'center',backgroundColor:'white'}}>
        <img src={loader} />
      </div>
    )
  }




  return (
    <div>
      <Header userData={userData} />
      {renderSideBar()}
          <div
            style={{
              display: "none",
              position: "fixed",
              top: "20px",
              right: "50px",
              zIndex: "200",
            }}
            onClick={() => setSideBarVisible(!sideBarVisible)}
            class="sidebarClodeIcon"
          >
            {renderSideBarIcon()}
          </div>
      <div
      className="marketPlaceContainer"
        style={{
          margin: "130px 0",
          gap: "30px",
          display: "flex",
          flexDirection: "column",
          alignItems:'center',
        }}
      >
        <h1 style={{ textAlign: "center" }}>Your Ideas</h1>
        <div className="AllIdeas">
          {researcherIdeas?.length > 0 ? (
            researcherIdeas?.map((idea, index) => {
              return (
                <div
                  onClick={() => navigate(`/Idea/${idea.id}`)}
                  className="CardInAllIdeas"
                  style={{ cursor: "pointer" }}
                >
                  <h2
                    style={{
                      display: "flex",
                      alignItems: "center",
                      columnGap: "5px",
                      justifyContent: "center",
                    }}
                  >
                    {idea.creatorId === userData.resercherId.toLowerCase() && (
                      <FaCrown />
                    )}{" "}
                    
                  </h2>
                  <div className="containerSpansData">
                    <span
                      style={{
                        borderBottom: "1px solid black",
                        padding: "5px",
                      }}
                    >
                      Name:{" "}
                      <span style={{ fontWeight: "bold" }}>{idea.name}</span>
                    </span>

                    <span
                      style={{
                        borderBottom: "1px solid black",
                        padding: "5px",
                      }}
                    >
                      specality:{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {idea?.specalityObj.name}
                      </span>
                    </span>

                    <span
                      style={{
                        borderBottom: "1px solid black",
                        padding: "5px",
                      }}
                    >
                      Status:{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {idea?.isCompleted ? "Completed" : "In Progress"}
                      </span>
                    </span>

                    <span
                      style={{
                        borderBottom: "1px solid black",
                        padding: "5px",
                      }}
                    >
                      deadline:{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {new Date(idea?.deadline).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </span>
                    <span
                      style={{
                        borderBottom: "1px solid black",
                        padding: "5px",
                      }}
                    >
                      Participants Number:{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {idea?.participantsNumber}
                      </span>
                    </span>
                    <span
                      style={{
                        borderBottom: "1px solid black",
                        padding: "5px",
                      }}
                    >
                      max Participants Number:{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {idea?.maxParticipantsNumber}
                      </span>
                    </span>
                    <span
                      style={{
                        borderBottom: "1px solid black",
                        padding: "5px",
                      }}
                    >
                      topic:{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {idea?.topicObject.name}
                      </span>
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <span>You Have No Ideas Yet!</span>
          )}
        </div>
        <div className="ContainerbtnData">
          <button
            className="plusBtn"
            onClick={() => setShowTermsAndCondsCard(true)}
          >
            Create New Idea
          </button>

          {showCreateIdeaCard && (
            <CreateNewIdeaCard
              show={showCreateIdeaCard}
              onClose={() => setShowIdeaCard(false)}
            />
          )}
          {showTermsAndCondsCard && (
            <TermsAndConds
              show={showTermsAndCondsCard}
              onClose={() => setShowTermsAndCondsCard(false)}
            />
          )}
        </div>

        <div className="ContainerAllIdeas">
          <h1>All Ideas</h1>

          <div className="AllIdeas searchPanel">
            <input
              name="SearchTerm"
              onChange={(e) =>
                setIdeaSearch((prev) => {
                  return { ...prev, [e.target.name]: e.target.value };
                })
              }
              placeholder="Search Idea"
              type="text"
              className="search-input"
            ></input>
            <select
              onChange={(e) =>
                setIdeaSearch((prev) => {
                  return { ...prev, [e.target.name]: e.target.value * 1 };
                })
              }
              name="Specality"
              className="search-select"
            >
              <option selected value={0}>
                Speciality
              </option>
              {allSpecs?.map((spec) => {
                return <option value={spec.id}>{spec.name}</option>;
              })}
            </select>
            <select
              onChange={(e) =>
                setIdeaSearch((prev) => {
                  return { ...prev, [e.target.name]: e.target.value * 1 };
                })
              }
              name="Topic"
              className="search-select"
            >
              <option selected value={0}>
                Topic
              </option>
              {allTopics?.map((topic) => {
                return <option value={topic.id}>{topic.name}</option>;
              })}
            </select>

            <select
              onChange={(e) =>
                setIdeaSearch((prev) => {
                  return { ...prev, [e.target.name]: e.target.value * 1 };
                })
              }
              name="Month"
              className="search-select"
            >
              <option selected value={0}>
                Month
              </option>
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ]?.map((month, index) => {
                return <option value={index + 1}>{month}</option>;
              })}
            </select>
          </div>

          <div className="AllIdeas">
            {allIdeas?.length > 0 ? (
              allIdeas
                ?.filter(
                  (idea) =>
                    !researcherIdeas?.map((idea) => idea.id).includes(idea.id)
                )
                .map((idea, index) => {
                  return (
                    <div className="CardInAllIdeas">
                      
                      <div className="containerSpansData">
                        <span
                          style={{
                            borderBottom: "1px solid black",
                            padding: "5px",
                          }}
                        >
                          Name:{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {idea.name}
                          </span>
                        </span>
                        <span
                          style={{
                            borderBottom: "1px solid black",
                            padding: "5px",
                          }}
                        >
                          specality:{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {idea?.specalityObj?.name}
                          </span>
                        </span>
                        <span
                          style={{
                            borderBottom: "1px solid black",
                            padding: "5px",
                          }}
                        >
                          Status:{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {idea?.isCompleted ? "Completed" : "In Progress"}
                          </span>
                        </span>
                        <span
                          style={{
                            borderBottom: "1px solid black",
                            padding: "5px",
                          }}
                        >
                          deadline:{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {new Date(idea?.deadline).toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </span>
                        <span
                          style={{
                            borderBottom: "1px solid black",
                            padding: "5px",
                          }}
                        >
                          topic:{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {idea?.topicObject?.name}
                          </span>
                        </span>
                        <span
                          style={{
                            borderBottom: "1px solid black",
                            padding: "5px",
                          }}
                        >
                          Participants Number:{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {idea?.participantsNumber}
                          </span>
                        </span>
                        <span
                          style={{
                            borderBottom: "1px solid black",
                            padding: "5px",
                          }}
                        >
                          max Participants Number:{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {idea?.maxParticipantsNumber}
                          </span>
                        </span>
                      </div>
                      <div className="ContainerbtnData">
                        {idea?.participantsNumber <
                          idea?.maxParticipantsNumber &&
                          !idea.isCompleted && (
                            <button
                              className="bn54"
                              // onClick={() => sendReq(idea.id)}
                              onClick={() => {
                                setChoosenIdea(idea);
                                setShowTermsForReq(true);
                              }}
                            >
                              Send Request
                            </button>
                          )}
                        <button
                          className="plusBtn"
                          onClick={() => navigate(`/Idea/${idea.id}`)}
                        >
                          View Idea
                        </button>
                      </div>
                      
                    </div>
                  );
                })
            ) : (
              <span> No Ideas Yet!</span>
            )}
            {showTermsForReq && (
              <TermsForReq
                idea={choosenIdea}
                show={showTermsForReq}
                onClose={() => setShowTermsForReq(false)}
              />
            )}
          </div>
          <button className="plusBtn" onClick={()=>setIdeaSearch(prev=>{return{...prev,counter:ideaSearch.counter+5}})}>View More</button>
        </div>

        <div className="ContainerAllIdeas">
          <h1>Completed Ideas</h1>

          <div className="AllIdeas searchPanel">
            <input
              name="SearchTerm"
              onChange={(e) =>
                setCompleteIdeaSearch((prev) => {
                  return { ...prev, [e.target.name]: e.target.value };
                })
              }
              placeholder="Search Idea"
              type="text"
              className="search-input"
            ></input>
            <select
              onChange={(e) =>
                setCompleteIdeaSearch((prev) => {
                  return { ...prev, [e.target.name]: e.target.value * 1 };
                })
              }
              name="Specality"
              className="search-select"
            >
              <option selected value={0}>
                Speciality
              </option>
              {allSpecs?.map((spec) => {
                return <option value={spec.id}>{spec.name}</option>;
              })}
            </select>

            <select
              onChange={(e) =>
                setCompleteIdeaSearch((prev) => {
                  return { ...prev, [e.target.name]: e.target.value * 1 };
                })
              }
              name="Month"
              className="search-select"
            >
              <option selected value={0}>
                Month
              </option>
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ]?.map((month, index) => {
                return <option value={index + 1}>{month}</option>;
              })}
            </select>
          </div>

          <div className="AllIdeas">
            {completedIdeas?.length > 0 ? (
              completedIdeas
                ?.filter(
                  (idea) =>
                    !researcherIdeas?.map((idea) => idea.id).includes(idea.id)
                )
                .map((idea, index) => {
                  return (
                    <div className="CardInAllIdeas">
                      
                      <div className="containerSpansData">
                        <span
                          style={{
                            borderBottom: "1px solid black",
                            padding: "5px",
                          }}
                        >
                          Name:{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {idea.name}
                          </span>
                        </span>
                        <span
                          style={{
                            borderBottom: "1px solid black",
                            padding: "5px",
                          }}
                        >
                          specality:{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {idea?.specalityObj?.name}
                          </span>
                        </span>
                        <span
                          style={{
                            borderBottom: "1px solid black",
                            padding: "5px",
                          }}
                        >
                          Status:{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {idea?.isCompleted ? "Completed" : "In Progress"}
                          </span>
                        </span>
                        <span
                          style={{
                            borderBottom: "1px solid black",
                            padding: "5px",
                          }}
                        >
                          deadline:{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {new Date(idea?.deadline).toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </span>
                        <span
                          style={{
                            borderBottom: "1px solid black",
                            padding: "5px",
                          }}
                        >
                          topic:{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {idea?.topicObject?.name}
                          </span>
                        </span>
                        <span
                          style={{
                            borderBottom: "1px solid black",
                            padding: "5px",
                          }}
                        >
                          Participants Number:{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {idea?.participantsNumber}
                          </span>
                        </span>
                        <span
                          style={{
                            borderBottom: "1px solid black",
                            padding: "5px",
                          }}
                        >
                          max Participants Number:{" "}
                          <span style={{ fontWeight: "bold" }}>
                            {idea?.maxParticipantsNumber}
                          </span>
                        </span>
                      </div>
                      <div className="ContainerbtnData">
                        <button
                          className="plusBtn"
                          onClick={() => navigate(`/Idea/${idea.id}`)}
                        >
                          View Idea
                        </button>
                      </div>
                    </div>
                  );
                })
            ) : (
              <span> No Ideas!</span>
            )}
          </div>
        </div>
      </div>
      <Footer userData={userData} />
    </div>
  );
}
