import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom"; // Why ?

const AuthContext = createContext();

// Should return:
// - Users Name
// - PFP (if applicable) (probably not as of now)
// - Access token
// - Refresh token (both jtw)
//

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refreshToken") || ""
  );
  const navigate = useNavigate();

  const loginAction = async (data, url) => {
    // url should also be diff for patients or for doctors etc
    try {
      const response = await fetch(`${url}login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data), // Email and password
      });

      const jsonData = await response.json(); // This converts the ReadableStream to JSON
      if (jsonData) {
        const userData = {
          id: jsonData.id,
          name: jsonData.name,
          role: jsonData.role || "patient",
        };
        setUser(userData);
        setToken(jsonData.accessToken);
        setRefreshToken(jsonData.refreshToken);

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", jsonData.accessToken);
        localStorage.setItem("refreshToken", jsonData.refreshToken);
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
    setRefreshToken("");
    setToken("");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };
  return (
    <AuthContext.Provider
      value={{ user, token, refreshToken, loginAction, logOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext); // use this thing to access context from other components i guess?
};
