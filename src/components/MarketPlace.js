import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import "../css/Marketplace.css";
export default function MarketPalce() {
  const userData = useLocation().state.data;
  const [researcherIdeas, setResearcherIdeas] = useState(null);
  const [allIdeas, setAllIdeas] = useState(null);
  const [showCreateIdeaCard, setShowIdeaCard] = useState(false);
  const [allTopics, setAllTopics] = useState(null);
  const [allSpecs, setAllSpecs] = useState(null);
  const [ideaSearch, setIdeaSearch] = useState({
    SearchTerm: "",
    Topic: 0,
    Specality: 0,
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
      `https://localhost:7187/api/Ideas?SearchTerm=${ideaSearch.SearchTerm}&Topic=${ideaSearch.Topic}&Specality=${ideaSearch.Specality}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData?.token}`,
        },
      }
    )
      .then((res) => (res.ok ? res.json() : alert("failed to Load All Ideas")))
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
      .then((res) => (res.ok ? res.json() : alert("failed to Load specs")))
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
      .then((res) => (res.ok ? res.json() : alert("failed to Load topics")))
      .then((data) => {
        if (data) {
          setAllTopics(data);
        }
      });
  }

  useEffect(() => {
    getResearcherIdeas();
    getAllSpecs();
    getAllTopics();
  }, []);

  useEffect(() => {
    getAllIdeas();
  }, [ideaSearch]);

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
              alert("You Already Joined This Idea");
            } else alert(body);
          } else alert("Request Sent Successfully");
        });
      })
      .catch((error) => console.error(error));
  }

  const CreateNewIdeaCard = (props) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
    const [allSpecs, setAllSpecs] = useState(null);
    const [allTopics, setAllTopics] = useState(null);
    const [date, setDate] = useState("");
    const [ideaData, setIdeaData] = useState({
      name: "",
      maxParticipantsNumber: 0,
      topicId: 0,
      specalityId: 0,
      deadline: date,
    });
    console.log(ideaData);

    const handleDateChange = (event) => {
      const inputValue = event.target.value;

      // Remove any existing hyphens from the input value
      const formattedValue = inputValue.replace(/-/g, "");

      // Add hyphens after every 4th and 7th character
      const dateWithHyphens =
        formattedValue.slice(0, 4) +
        "-" +
        formattedValue.slice(4, 6) +
        "-" +
        formattedValue.slice(6, 8);

      setDate(dateWithHyphens);
    };

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
        .then((res) => (res.ok ? res.json() : alert("failed to Load specs")))
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
        .then((res) => (res.ok ? res.json() : alert("failed to Load topics")))
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
      ).then((res) => {
        if (res.ok) {
          window.location.reload();
        } else {
          if (res.status === 400)
            alert("you don't have enough points to initiate idea");
        }
      });
    }

    if (!props.show) return null;
    return (
      <div
        style={{
          position: "fixed",
          left: "0",
          top: "0",
          right: "0",
          bottom: "0",
          backgroundColor: "rgba(0, 0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: "100",
        }}
      >
        <div
          style={{ width: "50%", backgroundColor: "white", padding: "20px" }}
        >
          <span>Idea Name: </span>
          <input onChange={getIdeaData} name="name"></input>
          <span>Participants Number: </span>
          <input
            onChange={(e) =>
              setIdeaData((prev) => {
                return { ...prev, maxParticipantsNumber: e.target.value * 1 };
              })
            }
            name="maxParticipantsNumber"
            type="number"
          ></input>
          <select
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
          <span>Deadline</span>
          <input
            type="text"
            onChange={handleDateChange}
            value={date}
            placeholder="yyyy-mm-dd"
          ></input>
          <button onClick={props.onClose}>Cancel</button>
          <button onClick={createNewIdea}>Create</button>
        </div>
      </div>
    );
  };

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
                  onClick={() =>
                    navigate(`/Idea/${idea.id}`, { state: { data: userData } })
                  }
                  className="CardInAllIdeas"
                  style={{ cursor: "pointer" }}
                >
                  <h2>Idea: {index + 1}</h2>
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
          <button className="plusBtn" onClick={() => setShowIdeaCard(true)}>
            Create New Idea
          </button>
          {showCreateIdeaCard && (
            <CreateNewIdeaCard
              show={showCreateIdeaCard}
              onClose={() => setShowIdeaCard(false)}
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
                          {idea?.topicObject.name}
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
                        idea?.maxParticipantsNumber && (
                        <button
                        className="bn54"
                        onClick={() => sendReq(idea.id)}>
                          Send Request
                        </button>
                      )}
                      <button
                       className="plusBtn"
                        onClick={() =>
                          navigate(`/Idea/${idea.id}`, {
                            state: { data: userData },
                          })
                        }
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
      </div>

    </div>
  );
}
