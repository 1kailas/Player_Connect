import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const loadUser = useCallback(async () => {
    try {
      const response = await authAPI.getCurrentUser();
      const userData = response.data.data;
      
      // Convert roles Set to Array if needed
      if (userData.roles) {
        userData.roles = Array.isArray(userData.roles) ? userData.roles : Array.from(userData.roles);
      }
      
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token, loadUser]);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { token, userId, username, email, roles } = response.data.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      
      // Convert roles Set to Array if needed
      const rolesArray = Array.isArray(roles) ? roles : Array.from(roles || []);
      setUser({ id: userId, username, email, roles: rolesArray });
      
      toast.success('Login successful!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { token, userId, username, email, roles } = response.data.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      
      // Convert roles Set to Array if needed
      const rolesArray = Array.isArray(roles) ? roles : Array.from(roles || []);
      setUser({ id: userId, username, email, roles: rolesArray });
      
      toast.success('Registration successful!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const hasRole = (role) => {
    return user?.roles?.includes(role);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
