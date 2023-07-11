import React, { createContext, useEffect, useState } from 'react';

export const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const [roles, setRoles] = useState('');
  const [resercherId,setResercherId] = useState('');

  // Load data from sessionStorage on component mount
  useEffect(() => {
    const storedUserId = sessionStorage.getItem('userId');
    const storedToken = sessionStorage.getItem('token');
    const storedRoles = sessionStorage.getItem('roles');
    const storedResercherId = sessionStorage.getItem('resercherId');
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
  }, []);

  // Update sessionStorage when data changes
  useEffect(() => {
    sessionStorage.setItem('userId', userId);
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('roles', roles);
    sessionStorage.setItem('resercherId',resercherId);
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
  };

  return <MyContext.Provider value={contextValue}>{children}</MyContext.Provider>;
};
