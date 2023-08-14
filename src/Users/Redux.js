import React, { createContext, useEffect, useState } from 'react';
import kariem from "../images/userImg.png";
export const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const [roles, setRoles] = useState('');
  const [resercherId,setResercherId] = useState('');
  const [studentImage, setStudentImage]=useState('');

  // Load data from sessionStorage on component mount
  useEffect(() => {
    const storedUserId = sessionStorage.getItem('userId');
    const storedToken = sessionStorage.getItem('token');
    const storedRoles = sessionStorage.getItem('roles');
    const storedResercherId = sessionStorage.getItem('resercherId');
    const storedStudentImage = sessionStorage.getItem('studentImage');
    console.log(`useEffect ~ storedStudentImage:`, storedStudentImage)
    
    // const storedRoles = JSON.parse(sessionStorage.getItem('roles'));

    if (storedUserId) {
      setUserId(storedUserId);
    }

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedRoles) {
      setRoles(storedRoles);
    }
    if(storedResercherId){
        setResercherId(storedResercherId);
    }
    if (storedStudentImage) {
      const byteCharacters = atob(storedStudentImage);
    const byteArrays = [];
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays.push(byteCharacters.charCodeAt(i));
    }
    
    const blob = new Blob([new Uint8Array(byteArrays)], { type: "image/jpeg" }); // Adjust the MIME type if needed
    setStudentImage(URL.createObjectURL(blob));
    }
  }, []);

  // Update sessionStorage when data changes
  useEffect(() => {
    sessionStorage.setItem('userId', userId);
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('roles', roles);
    sessionStorage.setItem('resercherId',resercherId);
    // sessionStorage.setItem('studentImage',studentImage);
  }, [userId, token, roles,resercherId]);

  const contextValue = {
    userId,
    setUserId,
    token,
    setToken,
    roles,
    setRoles,
    resercherId,
    setResercherId,
    studentImage,
    setStudentImage
  };

  return <MyContext.Provider value={contextValue}>{children}</MyContext.Provider>;
};
