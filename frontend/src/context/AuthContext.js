import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to set token in both localStorage and axios headers
  const setAuthToken = useCallback((token) => {
    if (token) {
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
      console.log('Token set successfully:', token);
    } else {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setIsAuthenticated(false);
      console.log('Token removed');
    }
  }, []);

  // Function to get token from localStorage
  const getAuthToken = useCallback(() => {
    const token = localStorage.getItem('token');
    console.log('Getting token:', token);
    return token;
  }, []);

  // Function to verify token and get user data
  const verifyToken = useCallback(async (token) => {
    try {
      console.log('Verifying token:', token);
      const response = await axios.get("http://localhost:5001/api/auth/user", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Token verification response:', response.data);
      setUser(response.data);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Token verification failed:', error);
      setAuthToken(null);
      setUser(null);
      setIsAuthenticated(false);
      return false;
    }
  }, [setAuthToken]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = getAuthToken();
        console.log('Initial token check:', token);

        if (token) {
          // Set the token in axios headers
          setAuthToken(token);
          
          // Verify token and get user data
          const isValid = await verifyToken(token);
          if (!isValid) {
            console.log('Token validation failed, clearing auth state');
            setAuthToken(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthToken(null);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [getAuthToken, verifyToken, setAuthToken]);

  const login = async (credentials) => {
    try {
      console.log('Attempting login with credentials:', credentials);
      const response = await axios.post("http://localhost:5001/api/auth/login", credentials, {
        withCredentials: true
      });
      
      const { token, user } = response.data;
      console.log('Login successful, token received:', token);
      console.log('User data received:', user);
      
      if (token) {
        // Store token and set headers
        setAuthToken(token);
        setUser(user);
        setIsAuthenticated(true);
        return user;
      } else {
        throw new Error('No token received from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      setAuthToken(null);
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const token = getAuthToken();
      console.log('Attempting logout with token:', token);
      
      if (token) {
        await axios.post("http://localhost:5001/api/auth/logout", {}, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAuthToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        getAuthToken, 
        isAuthenticated,
        setAuthToken,
        verifyToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
