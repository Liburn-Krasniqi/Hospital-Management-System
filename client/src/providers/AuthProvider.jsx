import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom"; // Why ?
import { url } from "../features"; // Instead of this i might have to make the URL a passable argument as well? Also dont call it URL but something more specific like PatientUrl idk...

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || ""); // Understand what local storage is?
  const navigate = useNavigate();

  const loginAction = async (data) => {
    try {
      const response = await fetch(`${url}login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data), // Email and password
      });

      const jsonData = await response.json(); // This converts the ReadableStream to JSON
      if (jsonData) {
        setUser(jsonData.refreshToken);
        setToken(jsonData.accessToken);
        localStorage.setItem("token", jsonData.accessToken);
        navigate("/");
        return;
      }
      throw new Error(response.message);
    } catch (e) {
      console.error(e);
    }
  };

  const logOut = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <AuthContext.Provider value={{ token, user, loginAction, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
