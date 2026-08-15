import { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi, getMeApi } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('balaspend_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('balaspend_token') || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Verify user profile silently without logging out on network glitches
    if (token && user) {
      getMeApi()
        .then((res) => {
          if (res.data) {
            setUser(res.data);
            localStorage.setItem('balaspend_user', JSON.stringify(res.data));
          }
        })
        .catch((err) => {
          console.warn("Silent background profile check failed, keeping local session active:", err.message);
        });
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await loginApi({ email, password });
      const userData = res.data;
      setUser(userData);
      setToken(userData.token);
      localStorage.setItem('balaspend_user', JSON.stringify(userData));
      localStorage.setItem('balaspend_token', userData.token);
      return userData;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, mongoUri = '') => {
    setLoading(true);
    try {
      const res = await registerApi({ name, email, password, mongoUri });
      const userData = res.data;
      setUser(userData);
      setToken(userData.token);
      localStorage.setItem('balaspend_user', JSON.stringify(userData));
      localStorage.setItem('balaspend_token', userData.token);
      return userData;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('balaspend_user');
    localStorage.removeItem('balaspend_token');
    localStorage.removeItem('balaspend_cached_expenses');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: Boolean(user) }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
