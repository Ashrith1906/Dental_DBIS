import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const isValidJSON = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return isValidJSON(storedUser) ? JSON.parse(storedUser)?.role : null;
  });

  const navigate = useNavigate();

  const login = (user) => {
    if (user && user.role) {
      localStorage.setItem("user", JSON.stringify(user)); // Store the user data in localStorage
      setUserRole(user.role); // Set user role
      navigate(`/${user.role}`); // Redirect based on role
    } else {
      console.error("User data is invalid: no role found");
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUserRole(null);
    navigate("/login");
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (isValidJSON(storedUser)) {
      setUserRole(JSON.parse(storedUser)?.role || null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);