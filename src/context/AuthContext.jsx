import { useContext, useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvier = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  function loginUser(data, navigateToDashBoard = true) {
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
    if (navigateToDashBoard) {
      navigate("/", { replace: true });
    }
  }

  function logoutUser() {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/auth");
  }

  useEffect(() => {
    function checkUser() {
      if (!user) {
        const userData = localStorage.getItem("user");
        if (userData !== null) {
          setUser(JSON.parse(userData));
          navigate(location.pathname, { replace: true });
        } else {
          setUser(null);
          navigate("/auth");
        }
      }
    }
    checkUser();
  }, [user, navigate]);

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useUserData() {
  const user = JSON.parse(localStorage.getItem("user"));
  return user;
}
