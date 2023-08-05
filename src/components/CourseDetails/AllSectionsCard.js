import React from "react";
import { useState, useEffect } from "react";
import SectionCard from "./SectionCard";
import loader from "../../loader.gif";
export default function AllSectionsCard({
  userData,
  courseId,
  isStudentEnrolled,
  getFirstVideoId,
}) {
  const [courseSections, setCourseSections] = useState([]);
  const [firstVideoId, setFirstVideoId] = useState(null);
  const [load, setLoad] = useState(false);
  const abortController = new AbortController();
  
  

  function getCourseSections() {
    if (courseSections.length === 0) {
      setLoad(true);
      fetch(
        `https://resweb-001-site1.htempurl.com/api/Courses/SectionsToCourse?courseId=${courseId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
          signal: abortController.signal,
        }
      )
        .then((res) => {
          setLoad(false);
          if (res.ok) {
            return res.json();
          }
        })
        .then((data) => {
          if (data) {
            setCourseSections(data);
            if (data.length > 0) {
            }
          }
        }).catch((err) => {
          if (userData.userId !== "" || userData.userId !== null&&courseSections.length === 0) {
            getCourseSections();
          }
        });
        ;
    }
  }
useEffect(() => {
    getFirstVideoId(firstVideoId);
  }, [firstVideoId]);


  useEffect(() => {
    if (userData.userId !== "" || userData.userId !== null) {
      getCourseSections();
    }
  }, []);


  useEffect(() => {
    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <div className="ContSectionsNew custom-scrollbar">
      {load && (
        <img src={loader} style={{ width: "200px", alignSelf: "center" }} />
      )}
      {!load &&
        courseSections?.length === 0 &&
        (userData.roles === "Admin" ? (
          <h3 style={{ textAlign: "center" }}>
            Click the plus button to start adding sections
          </h3>
        ) : (
          <h3 style={{ textAlign: "center" }}>
            This Course Has No Sections Yet !
          </h3>
        ))}
      {courseSections.length > 0 &&
        courseSections?.map((section) => {
          return (
            <SectionCard
              section={section}
              userData={userData}
              isStudentEnrolled={isStudentEnrolled}
              firstSectionId={courseSections[0]?.id}
              getFirstVideo={(id) => setFirstVideoId(id)}
            />
          );
        })}
    </div>
  );
}
