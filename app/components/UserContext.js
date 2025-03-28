// Context provider managing global user state (e.g., user id, username, email), offering convenient state management across the application.

import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // e.g. { userid, username, email }

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook for easy access
export const useUser = () => useContext(UserContext);
