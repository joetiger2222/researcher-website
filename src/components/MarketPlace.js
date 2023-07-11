import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import "../css/Marketplace.css";
import "../css/Modal.css";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { FaCrown } from "react-icons/fa";
import Footer from "./Footer";
import { useContext } from "react";
import { MyContext } from "../Users/Redux";
export default function MarketPalce() {
  // const userData = useLocation().state.data;
  const [researcherIdeas, setResearcherIdeas] = useState([]);
  const [allIdeas, setAllIdeas] = useState(null);
  const [showCreateIdeaCard, setShowIdeaCard] = useState(false);
  const [showTermsAndCondsCard, setShowTermsAndCondsCard] = useState(false);
  const [allTopics, setAllTopics] = useState(null);
  const [allSpecs, setAllSpecs] = useState(null);
  const [completedIdeas, setCompletedIdea] = useState(null);

  const userData = useContext(MyContext);
  const [ideaSearch, setIdeaSearch] = useState({
    SearchTerm: "",
    Topic: 0,
    Specality: 0,
    Month: 0,
  });
  const [completeIdeaSearch, setCompleteIdeaSearch] = useState({
    SearchTerm: "",
    Topic: 0,
    Specality: 0,
    Month: 0,
  });
  const navigate = useNavigate();

  function getResearcherIdeas() {
    fetch(
      `https://localhost:7187/api/Researchers/Ideas/${userData?.resercherId}`,
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
      `https://localhost:7187/api/Ideas?SearchTerm=${ideaSearch.SearchTerm}&Topic=${ideaSearch.Topic}&Specality=${ideaSearch.Specality}&Month=${ideaSearch.Month}`,
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
          setAllIdeas(data);
        }
      });
  }

  function getAllSpecs() {
    fetch(`https://localhost:7187/api/Researchers/Specialties`, {
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
    fetch(`https://localhost:7187/api/Researchers/Topics`, {
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
      `https://localhost:7187/api/Ideas/CompletedIdeas?SearchTerm=${completeIdeaSearch.SearchTerm}&Specality=${completeIdeaSearch.Specality}&Month=${completeIdeaSearch.Month}`,
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

  function sendReq(ideaId) {
    fetch(
      `https://localhost:7187/api/Ideas/Requests/SendRequest/${userData?.resercherId}/${ideaId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
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
    console.log(ideaData);

    function getIdeaData(e) {
      setIdeaData((prev) => {
        return {
          ...prev,
          [e.target.name]: e.target.value,
        };
      });
    }

    function getAllSpecs() {
      fetch(`https://localhost:7187/api/Researchers/Specialties`, {
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
      fetch(`https://localhost:7187/api/Researchers/Topics`, {
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

    function createNewIdea() {
      // const val = /^\d{4}-\d{2}-\d{2}$/.test(ideaData.deadline);
      const val = /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])$/.test(
        ideaData.deadline
      );

      console.log(val);
      if (val) {
        fetch(
          `https://localhost:7187/api/Ideas/InitiateIdea/${userData.resercherId}`,
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
              console.log(body);
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

          <div className="FormModal2">
            <label className="AllLabeles">Idea Name: </label>
            <input
              className="InputModalHallDetails"
              onChange={getIdeaData}
              name="name"
            ></input>
            <label className="AllLabeles">Participants Number: </label>
            <input
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
              className="InputModalHallDetails"
              onChange={(e) =>
                setIdeaData((prev) => {
                  return { ...prev, topicId: e.target.value * 1 };
                })
              }
            >
              <option selected disabled value="">
                Choose a Topic
              </option>
              {allTopics?.map((spec) => {
                return <option value={spec.id}>{spec.name}</option>;
              })}
            </select>
            <label className="AllLabeles">Deadline</label>
            <input
              className="InputModalHallDetails"
              type="text"
              onChange={getIdeaData}
              placeholder="yyyy-mm-dd"
              name="deadline"
            ></input>
            <div className="buttonsOnModal">
              <button className="" onClick={createNewIdea}>
                Create
              </button>
              <button className="" onClick={props.onClose}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TermsAndConds = (props) => {
    if (!props.show) return null;
    return (
      <div className="modal-overlay2" >
        <div className="modal2" style={{width:'50%'}}>
          <div className="ContExitbtn" onClick={props.onClose}>
            <div class="outer">
              <div class="inner">
                <label className="label2">Exit</label>
              </div>
            </div>
          </div>
          <h1 className="headContact2">Terms & Conditions</h1>

          <div className="FormModal2">
            <p >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              eleifend tellus non libero posuere, id convallis diam fermentum.
              Phasellus a erat sed arcu volutpat suscipit a non mauris. Maecenas
              blandit eros id nunc convallis fringilla. In dapibus nibh a
              pulvinar aliquam. Nunc interdum lectus nec turpis placerat
              consequat. Pellentesque habitant morbi tristique senectus et netus
              et malesuada fames ac turpis egestas. Vestibulum at tincidunt
              urna. Morbi rhoncus, enim ut pellentesque posuere, risus mauris
              pellentesque lectus, vel egestas nulla dolor sit amet felis. Nam
              in leo quis ex aliquet cursus sed nec mauris. Vivamus bibendum,
              justo at egestas luctus, nisl sem pellentesque nunc, nec elementum
              odio elit vitae ligula. Aliquam erat volutpat. Nulla facilisi.
              Praesent ullamcorper, sapien id volutpat finibus, justo mauris
              placerat orci, nec lacinia lacus est vitae purus. Nam non
              consequat lectus. Suspendisse potenti. Mauris nec rutrum dui.
              Integer semper urna ac tincidunt eleifend. Donec mattis massa id
              lorem sollicitudin, sit amet posuere elit maximus. Aliquam eget
              nibh in enim maximus fringilla. Phasellus pellentesque, lectus
              vitae tempor dapibus, nunc nulla tincidunt magna, id pretium eros
              metus at ligula. Curabitur consectetur nisl mi, et convallis
              tellus ullamcorper in. Integer gravida efficitur feugiat. Quisque
              eu dui at erat fermentum rhoncus. Fusce eget urna ac nunc lobortis
              condimentum. Sed pretium consectetur dolor, id congue ex
              ullamcorper non. Vestibulum auctor mauris neque, at elementum
              tortor dapibus eu. Integer sagittis tellus sit amet sem facilisis,
              sed elementum metus efficitur. Duis sollicitudin nibh at
              condimentum lobortis. Suspendisse ac consectetur tellus, ut
              finibus mauris. Morbi hendrerit, turpis at placerat posuere, est
              sapien luctus ex, non efficitur neque neque a elit. Sed vehicula
              lectus vel consequat euismod. Fusce elementum nisi a hendrerit
              bibendum. Vestibulum ut eros sem. Nunc malesuada felis in commodo
              tempor. Cras volutpat felis enim, a accumsan ipsum consequat sit
              amet. Fusce lacinia sapien eu dapibus eleifend. Curabitur sit amet
              odio eleifend, lobortis turpis vitae, aliquet dui. Integer sit
              amet lobortis nunc, id commodo mauris. Proin maximus luctus ex, a
              fringilla dui sollicitudin non.
              
            </p>
            

            <div className="buttonsOnModal">
              <button className="" onClick={()=>{props.onClose();setShowIdeaCard(true)}}>Accept</button>
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
          onClick={() => navigate("/")}
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div>
      <Header userData={userData} />
      <div
        style={{
          margin: "130px 0",
          gap: "30px",
          display: "flex",
          flexDirection: "column",
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
                    Idea: {index + 1}
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

          <div className="AllIdeas">
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
                      <h2>Idea: {index + 1}</h2>
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
                              onClick={() => sendReq(idea.id)}
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
          </div>
        </div>

        <div className="ContainerAllIdeas">
          <h1>Completed Ideas</h1>

          <div className="AllIdeas">
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
                      <h2>Idea: {index + 1}</h2>
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
