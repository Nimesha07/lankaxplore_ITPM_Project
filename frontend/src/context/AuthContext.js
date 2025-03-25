import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5001/api/auth/user", { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  const login = async (credentials) => {
    const res = await axios.post("http://localhost:5001/api/auth/login", credentials, { withCredentials: true });
    console.log(res.data.user)
    setUser(res.data.user);
  };

  const logout = async () => {
    await axios.post("http://localhost:5001/api/auth/logout", {}, { withCredentials: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
