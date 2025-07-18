import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, getCurrentUser } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // 统一用户认证状态
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 初始化认证状态
  useEffect(() => {
    const initializeAuth = async () => {
      const userToken = localStorage.getItem('userToken');
      const savedUser = localStorage.getItem('currentUser');
      
      if (userToken && savedUser) {
        try {
          // 验证token是否仍然有效
          const userData = JSON.parse(savedUser);
          const currentUserData = await getCurrentUser();
          
          setIsAuthenticated(true);
          setUser(currentUserData.user);
          
          // 更新localStorage中的用户数据
          localStorage.setItem('currentUser', JSON.stringify(currentUserData.user));
        } catch (error) {
          console.error('Token验证失败:', error);
          // 清除无效数据
          localStorage.removeItem('userToken');
          localStorage.removeItem('userAuthenticated');
          localStorage.removeItem('currentUser');
        }
      }
      setLoading(false);
    };

    initializeAuth();

    // 监听注销事件
    const handleAuthLogout = () => {
      setIsAuthenticated(false);
      setUser(null);
    };

    window.addEventListener('auth-logout', handleAuthLogout);
    return () => window.removeEventListener('auth-logout', handleAuthLogout);
  }, []);

  // 统一登录函数
  const login = async (identifier, password) => {
    try {
      const response = await apiLogin(identifier, password);
      
      // 存储token和用户信息
      localStorage.setItem('userToken', response.token);
      localStorage.setItem('userAuthenticated', 'true');
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      
      setIsAuthenticated(true);
      setUser(response.user);
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  // 注销函数
  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userAuthenticated');
    localStorage.removeItem('currentUser');
    setIsAuthenticated(false);
    setUser(null);
  };

  // 更新用户数据
  const updateUser = (newUserData) => {
    const updatedUser = { ...user, ...newUserData };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  // 检查权限
  const hasPermission = (permission) => {
    if (!user) return false;
    
    // 超级管理员拥有所有权限
    if (user.role === 'admin') return true;
    
    // 检查特定权限
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

  const value = {
    // 主要状态
    isAuthenticated,
    user,
    loading,
    
    // 认证函数
    login,
    logout,
    updateUser,
    
    // 权限检查
    hasPermission,
    
    // 用户类型
    userType: user?.role || null
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 