import { createContext, useContext, useState, useCallback } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '../api/api';

/**
 * Authentication Context to manage the user's logged-in state across the entire React application.
 */
const AuthContext = createContext();

/**
 * Provider component that wraps the app and gives access to auth methods and state.
 * It manages local storage persistence for user sessions.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components that require auth context
 */
export const AuthProvider = ({ children }) => {
  // Initialize user state, attempting to parse from localStorage for persistence
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  // Initialize JWT token state from localStorage
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  /**
   * Submits user credentials to the login API and securely stores the returned JWT.
   * 
   * @param {Object} credentials - The email and password from the login form
   * @returns {Object} User data payload received from the server
   */
  const doLogin = useCallback(async (credentials) => {
    const res = await apiLogin(credentials);
    const { token: jwt, ...userData } = res.data;
    
    // Persist login details
    localStorage.setItem('token', jwt);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(jwt);
    setUser(userData);
    
    return userData;
  }, []);

  /**
   * Registers a brand new user account via the API.
   * Note: This does not automatically log the user in.
   * 
   * @param {Object} data - Profile details (name, email, password, etc.)
   * @returns {Object} Result of the registration API call
   */
  const doRegister = useCallback(async (data) => {
    const res = await apiRegister(data);
    return res.data;
  }, []);

  /**
   * Logs out the user by clearing the backend session (if supported) 
   * and subsequently wiping all local storage tokens.
   */
  const doLogout = useCallback(async () => {
    try { await apiLogout(); } catch { /* Ignore server-side logout errors to force local wipe */ }
    
    // Clear persistent storage and component state
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  // Utility flag to quickly check if the authenticated user has Admin privileges
  const isAdmin = user?.role === 'ADMIN' || user?.roles?.includes('ADMIN');

  return (
    <AuthContext.Provider value={{ user, token, isAdmin, doLogin, doRegister, doLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom React Hook to efficiently pull auth state and methods from the Context.
 * 
 * @returns {Object} Contains { user, token, isAdmin, doLogin, doRegister, doLogout }
 */
export const useAuth = () => useContext(AuthContext);
