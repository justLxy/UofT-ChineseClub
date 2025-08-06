import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  login as apiLogin,
  loginWithEmail as apiLoginWithEmail,
  logout as apiLogout,
  register as apiRegister,
  sendVerificationCode as apiSendVerificationCode,
  getCurrentUser,
} from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const verifyAuth = useCallback(async () => {
    try {
      const { user: currentUser } = await getCurrentUser();
      if (currentUser) {
        setIsAuthenticated(true);
        setUser(currentUser);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        // 如果验证失败，清除可能无效的token
        localStorage.removeItem('authToken');
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      // 如果验证失败，清除可能无效的token
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    verifyAuth();

    const handleAuthLogout = () => {
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
      setUser(null);
    };

    window.addEventListener('auth-logout', handleAuthLogout);
    return () => window.removeEventListener('auth-logout', handleAuthLogout);
  }, [verifyAuth]);

  const handleLoginSuccess = (response) => {
    const { user: loggedInUser, token } = response;
    setIsAuthenticated(true);
    setUser(loggedInUser);
    
    // 为了兼容Safari，将token存储到localStorage
    if (token) {
      localStorage.setItem('authToken', token);
    }
    
    return response;
  };

  const login = async (identifier, password) => {
    try {
      const response = await apiLogin(identifier, password);
      return handleLoginSuccess(response);
    } catch (error) {
      throw error;
    }
  };

  const loginWithEmail = async (email, verificationCode) => {
    try {
      const response = await apiLoginWithEmail(email, verificationCode);
      return handleLoginSuccess(response);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // 清除localStorage中的token
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
      setUser(null);
    }
  };
  
  const updateUser = (newUserData) => {
    const updatedUser = { ...user, ...newUserData };
    setUser(updatedUser);
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    switch (permission) {
      case 'manageEvents':
        return user.permissions?.canManageEvents || false;
      case 'reviewProfiles':
        return user.permissions?.canReviewProfiles || false;
      case 'manageStaff':
        return user.permissions?.canManageStaff || false;
      default:
        return false;
    }
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    loginWithEmail,
    register: apiRegister,
    sendVerificationCode: apiSendVerificationCode,
    logout,
    updateUser,
    hasPermission,
    isAdmin,
    userType: user?.role || null,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
