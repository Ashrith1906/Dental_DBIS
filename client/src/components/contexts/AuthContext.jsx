// import React, { createContext, useContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const AuthContext = createContext();

// const isValidJSON = (str) => {
//   try {
//     JSON.parse(str);
//     return true;
//   } catch {
//     return false;
//   }
// };

// export const AuthProvider = ({ children }) => {
//   const [userRole, setUserRole] = useState(() => {
//     const storedUser = localStorage.getItem("user");
//     return isValidJSON(storedUser) ? JSON.parse(storedUser)?.role : null;
//   });

//   const navigate = useNavigate();

//   const login = (user) => {
//     if (user && user.role) {
//       localStorage.setItem("user", JSON.stringify(user)); // Store the user data in localStorage
//       setUserRole(user.role); // Set user role
//       navigate(`/${user.role}`); // Redirect based on role
//     } else {
//       console.error("User data is invalid: no role found");
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("user");
//     setUserRole(null);
//     navigate("/login");
//   };

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (isValidJSON(storedUser)) {
//       const parsedUser = JSON.parse(storedUser);
//       setUserRole(parsedUser?.role || null);
//     }
//   }, []);

//   return (
//     <AuthContext.Provider value={{ userRole, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

// AuthContext.jsx
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

  const [dentistId, setDentistId] = useState(() => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = isValidJSON(storedUser) ? JSON.parse(storedUser) : null;
    return parsedUser?.role === "Dentist" ? parsedUser?.dentistId : null;
  });

  const navigate = useNavigate();

  const login = (user) => {
    if (user && user.role) {
      localStorage.setItem("user", JSON.stringify(user));
      setUserRole(user.role);
      // Set dentistId only if the user's role is "Dentist"
      setDentistId(user.role === "Dentist" ? user.dentistId : null);
      navigate(`/${user.role}`);
    } else {
      console.error("User data is invalid: no role found");
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUserRole(null);
    setDentistId(null);
    navigate("/login");
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (isValidJSON(storedUser)) {
      const parsedUser = JSON.parse(storedUser);
      setUserRole(parsedUser?.role || null);
      // Set dentistId only if the stored role is "Dentist"
      setDentistId(parsedUser?.role === "Dentist" ? parsedUser?.dentistId : null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ userRole, dentistId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);