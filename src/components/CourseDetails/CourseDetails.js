import React, { useEffect, useState } from "react";
import { AiOutlineHourglass } from "react-icons/ai";
import { FaPlusCircle, FaTrash, FaRegEdit } from "react-icons/fa";
import { HiAcademicCap } from "react-icons/hi";
import "../../css/CourseDetails.css";
import Header from "../Header.js";
import { useParams } from "react-router-dom";
import Footer from "../Footer";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { useContext } from "react";
import { MyContext } from "../../Users/Redux";
import SideBar from "../SideBar";
import loader from "../../loader.gif";
import AllSectionsCard from "./AllSectionsCard";
import IntroVideoCard from "./IntroVideoCard";
import { useLocation } from "react-router-dom";
const CourseDetails = () => {
  const userData = useContext(MyContext);
  const [load, setLoad] = useState(false);
  const [sideBarVisible, setSideBarVisible] = useState(false);
  const navigate = useNavigate();
  const [showAddSection, setShowAddSection] = useState(false);
  const [showEditCourseDataModal, setShowEditCourseDataModal] = useState(false);
  const [isStudentEnrolled, setIsStudentEnrolled] = useState(false);
  const [firstVideoId, setFirstVideoId] = useState(null);
  const courseDetails = useLocation().state?.data;

  let { id } = useParams();

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
          style={{ zIndex: "300" }}
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

  function checkStudentEnrollment() {
    fetch(
      `https://resweb-001-site1.htempurl.com/api/Courses/CheckEnrollment?courseId=${id}&studentId=${userData.userId}`,

      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      }
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => (data ? setIsStudentEnrolled(data.isEnrolled) : null))
      .catch((e) => {
        if (!isStudentEnrolled && userData.userId !== "")
          checkStudentEnrollment();
      });
  }

  function deleteCourse() {
    Swal.fire({
      title: `Are You Syre To Delete The Course`,
      showCancelButton: true,
    }).then((data) => {
      if (data.isConfirmed) {
        setLoad(true);
        fetch(`https://resweb-001-site1.htempurl.com/api/Courses/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }).then((res) => {
          setLoad(false);
          if (res.ok) {
            navigate("/AdminPanel");
          } else
            toastr.error("Error Happened Please Try Again Later", "Failed");
        });
      }
    });
  }

  useEffect(() => {
    if (userData.userId !== "") {
      if (userData.roles === "Admin") setIsStudentEnrolled(true);
      else {
        checkStudentEnrollment();
      }
    }
    // if (userData.roles !== "Admin") {
    //   checkStudentEnrollment();
    // }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [userData]);

  const AddSectionCard = ({ show, onClose }) => {
    const [sectionData, setSectionData] = useState({ courseId: id, name: "" });

    function getSectionName(e) {
      setSectionData((prevFormData) => {
        return {
          ...prevFormData,
          [e.target.name]: e.target.value,
        };
      });
    }

    function addSection() {
      let data = [];
      data.push(sectionData);
      setLoad(true);
      fetch(
        `https://resweb-001-site1.htempurl.com/api/Courses/Sections?courseId=${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userData.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      ).then((response) => {
        setLoad(false);
        if (response.ok) {
          onClose();
        } else
          toastr.error(
            "Failed To Add new Section Please Try Again Later",
            "Failed"
          );
      });
    }

    if (!show) return null;
    return (
      <div className="modal-overlay2">
        <div className="modal2">
          <div className="ContExitbtn" onClick={onClose}>
            <div class="outer">
              <div class="inner">
                <label className="label2">Exit</label>
              </div>
            </div>
          </div>
          <h1 className="headContact2">Add Section</h1>

          <div
            className="FormModal2"
            style={{ justifyContent: "space-between", height: "100%" }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              <label className="AllLabeles">Enter Section Name: </label>
              <input
                className="InputModalHallDetails"
                onChange={getSectionName}
                name="name"
                placeholder="Enter Section Name"
              ></input>
            </div>

            <div className="buttonsOnModal">
              {sectionData.name !== "" && (
                <button onClick={addSection}>Finish</button>
              )}
              <button onClick={onClose}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const EditCourseDataCard = (props) => {
    const [editData, setEditData] = useState({
      name: courseDetails.name,
      instructions: courseDetails.instructions,
      objectives: courseDetails.objectives,
      price: courseDetails.price,
      hours: courseDetails.hours,
      brief: courseDetails.brief,
      driveLink: courseDetails.driveLink,
      // skillId: courseDetails.skillObj.id,
    });

    function editCourseData(e) {
      e.preventDefault();
      setLoad(true);
      fetch(`https://resweb-001-site1.htempurl.com/api/Courses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify(editData),
      }).then((res) => {
        setLoad(false);
        if (res.ok) {
          toastr.success("data updated successfuly", "Success");
          props.onClose();
        } else toastr.error("failed", "Failed");
      });
    }

    function getEditData(e) {
      setEditData((prev) => {
        return {
          ...prev,
          [e.target.name]: e.target.value,
        };
      });
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
          <h1 className="headContact2">Edit Course Data</h1>
          <div
            className="custom-scrollbar"
            style={{
              overflow: "auto",
              maxHeight: "420px",
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <form className="FormModal2" onSubmit={editCourseData}>
              <label className="AllLabeles">Name</label>
              <input
                className="InputModalHallDetails"
                placeholder={courseDetails.name}
                onChange={getEditData}
                name="name"
              ></input>
              <label className="AllLabeles">instructions</label>
              <input
                className="InputModalHallDetails"
                placeholder={courseDetails.instructions}
                onChange={getEditData}
                name="instructions"
              ></input>
              <label className="AllLabeles">objectives</label>
              <input
                className="InputModalHallDetails"
                placeholder={courseDetails.objectives}
                onChange={getEditData}
                name="objectives"
              ></input>
              <label className="AllLabeles">price</label>
              <input
                className="InputModalHallDetails"
                min={1}
                placeholder={courseDetails.price}
                onChange={(e) =>
                  setEditData((prev) => {
                    return { ...prev, [e.target.name]: e.target.value * 1 };
                  })
                }
                name="price"
                type="number"
              ></input>
              <label className="AllLabeles">hours</label>
              <input
                className="InputModalHallDetails"
                placeholder={courseDetails.hours}
                onChange={getEditData}
                name="hours"
                type="number"
              ></input>
              <label className="AllLabeles">brief</label>
              <input
                className="InputModalHallDetails"
                placeholder={courseDetails.brief}
                onChange={getEditData}
                name="brief"
              ></input>
              <label className="AllLabeles">Drive Link</label>
              <input
                className="InputModalHallDetails"
                placeholder={courseDetails.driveLink}
                onChange={getEditData}
                name="driveLink"
              ></input>
              <div className="buttonsOnModal">
                <button type="submit">Edit</button>
                <button onClick={props.onClose}>Cancel</button>
              </div>
            </form>
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

  if (load) {
    return (
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <img src={loader} />
      </div>
    );
  }

  return (
    <div className="courseParent">
      <Header />
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
      <div className="AllContentContainer">
        <div className="LeftCourseData custom-scrollbar">
          <div className="LeftIntroData">
            <h1 className="NameCourse" style={{ whiteSpace: "pre-line" }}>
              {courseDetails?.name}
            </h1>
            <h3
              className="briefCourseNew custom-scrollbar"
              style={{ whiteSpace: "pre-line" }}
            >
              {courseDetails?.brief}
            </h3>
            <h2>Price: {courseDetails?.price} EGP</h2>
            {userData.roles !== "Admin" && !isStudentEnrolled && (
              <button className="btnBUY" onClick={() => navigate("/BuyCourse")}>
                Buy Now
              </button>
            )}
          </div>
          <div className="ObjectivesNew">
            <h2>Objectives :</h2>
            <h3 className="custom-scrollbar" style={{ whiteSpace: "pre-line" }}>
              {courseDetails?.objectives}
            </h3>
          </div>
          <div className="InstructionsNew">
            <h2>Instructions :</h2>
            <h3 className="custom-scrollbar" style={{ whiteSpace: "pre-line" }}>
              {courseDetails?.instructions}
            </h3>
          </div>
          {isStudentEnrolled && (
            <div className="InstructionsNew">
              <h2>Link :</h2>
              <a
                href={courseDetails?.driveLink}
                target="_blank"
                className="custom-scrollbar"
                style={{ wordBreak: "break-all" }}
              >
                {courseDetails?.driveLink}
              </a>
            </div>
          )}
        </div>

        <div className="CenterAndRighCourseData">
          <div className="CourseSectionsData ">
            <div className="courseCOntAddDelSection">
              <h1>Course Content</h1>
              {userData.roles === "Admin" && (
                <div className="TrashPlus">
                  <FaPlusCircle
                    onClick={() => setShowAddSection(true)}
                    className="addBtn"
                  />
                  <FaRegEdit
                    onClick={() => setShowEditCourseDataModal(true)}
                    className="delBtn"
                  />
                  <FaTrash onClick={deleteCourse} className="delBtn" />
                </div>
              )}
              {showEditCourseDataModal && (
                <EditCourseDataCard
                  show={showEditCourseDataModal}
                  onClose={() => setShowEditCourseDataModal(false)}
                />
              )}
            </div>
            <AllSectionsCard
              userData={userData}
              courseId={id}
              isStudentEnrolled={isStudentEnrolled}
              getFirstVideoId={(id) => setFirstVideoId(id)}
            />
          </div>
          <div className="contVideoAndQuiz">
            <div className="RightVideoIntro">
              <IntroVideoCard videoId={firstVideoId} userData={userData} />

              <div className="BottomRightData">
                <h3 className="headInfo">This Course Includes:</h3>
                <p
                  style={{
                    display: "flex",
                    alignItems: "center",
                    columnGap: "5px",
                  }}
                >
                  <AiOutlineHourglass />
                  {courseDetails?.hours + " Hours"}
                </p>
                <p
                  style={{
                    display: "flex",
                    alignItems: "center",
                    columnGap: "5px",
                  }}
                >
                  <HiAcademicCap />
                  Certificate Of Completion
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddSectionCard
        show={showAddSection}
        onClose={() => setShowAddSection(false)}
      />

      <Footer />
    </div>
  );
};

export default CourseDetails;
