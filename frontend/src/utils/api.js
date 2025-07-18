import axios from 'axios';
import i18n from 'i18next';

// 使用环境变量或默认值，并确保URL末尾没有斜杠
export const BASE_URL = (process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000').replace(/\/+$/, '');
export const API_BASE_URL = `${BASE_URL}/api`;

// 工具函数：处理头像URL
export const getFullAvatarUrl = (avatarUrl) => {
  if (!avatarUrl) return null;
  // 如果已经是完整URL，直接返回
  if (avatarUrl.startsWith('http')) return avatarUrl;
  // 如果是相对路径，拼接BASE_URL
  if (avatarUrl.startsWith('/')) return `${BASE_URL}${avatarUrl}`;
  // 如果只是文件名，拼接完整路径
  return `${BASE_URL}/uploads/staff/${avatarUrl}`;
};

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加认证token和语言
api.interceptors.request.use(config => {
  // 添加当前语言到请求中
  const currentLanguage = i18n.language || 'en';
  config.params = { 
    ...config.params,
    language: currentLanguage 
  };
  
  // 统一使用userToken
  const userToken = localStorage.getItem('userToken');
  if (userToken) {
    config.headers['Authorization'] = `Bearer ${userToken}`;
  }
  
  return config;
}, error => {
  return Promise.reject(error);
});

// 响应拦截器 - 处理401错误
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Token无效或过期 - 清除存储的凭据
      localStorage.removeItem('userToken');
      localStorage.removeItem('userAuthenticated');
      localStorage.removeItem('currentUser');
      
      // 通知应用用户已注销
      window.dispatchEvent(new Event('auth-logout'));
    }
    return Promise.reject(error);
  }
);

// ===============================
// 认证 API
// ===============================

// 统一登录API
export const login = async (identifier, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { identifier, password });
    return response.data;
  } catch (error) {
    console.error('登录错误:', error);
    throw error;
  }
};

// 获取当前用户信息
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('获取用户信息错误:', error);
    throw error;
  }
};

// 修改密码
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.put('/auth/password', { 
      currentPassword, 
      newPassword 
    });
    return response.data;
  } catch (error) {
    console.error('修改密码错误:', error);
    throw error;
  }
};

// 检查权限
export const checkPermission = async (permission) => {
  try {
    const response = await api.get(`/auth/check-permission/${permission}`);
    return response.data;
  } catch (error) {
    console.error('检查权限错误:', error);
    throw error;
  }
};

// 创建用户（管理员功能）
export const createUser = async (userData) => {
  try {
    const response = await api.post('/auth/users', userData);
    return response.data;
  } catch (error) {
    console.error('创建用户错误:', error);
    throw error;
  }
};

// 更新用户权限（管理员功能）
export const updateUserPermissions = async (userId, permissions) => {
  try {
    const response = await api.put(`/auth/users/${userId}/permissions`, permissions);
    return response.data;
  } catch (error) {
    console.error('更新权限错误:', error);
    throw error;
  }
};

// ===============================
// 活动 API
// ===============================

export const getEvents = async (status = '') => {
  try {
    const params = status ? { status } : {};
    const response = await api.get('/events', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const getEventById = async (id) => {
  try {
    const response = await api.get(`/events/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

export const createEvent = async (eventData) => {
  try {
    const response = await api.post('/events', eventData);
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const updateEvent = async (id, eventData) => {
  try {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

export const deleteEvent = async (id) => {
  try {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

// ===============================
// 员工资料 API
// ===============================

export const getStaffProfile = async () => {
  try {
    const response = await api.get('/staff/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching staff profile:', error);
    throw error;
  }
};

export const saveStaffProfile = async (profileData) => {
  try {
    const response = await api.post('/staff/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Error saving staff profile:', error);
    throw error;
  }
};

export const uploadStaffAvatar = async (avatarFile) => {
  try {
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    
    const response = await api.post('/staff/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }
};

// ===============================
// 管理员 API
// ===============================

export const getAllStaff = async () => {
  try {
    const response = await api.get('/admin/staff');
    return response.data;
  } catch (error) {
    console.error('Error fetching staff:', error);
    throw error;
  }
};

export const createStaffAccount = async (staffData) => {
  try {
    const response = await api.post('/admin/staff', staffData);
    return response.data;
  } catch (error) {
    console.error('Error creating staff account:', error);
    throw error;
  }
};

export const updateStaffAccount = async (id, staffData) => {
  try {
    const response = await api.put(`/admin/staff/${id}`, staffData);
    return response.data;
  } catch (error) {
    console.error('Error updating staff account:', error);
    throw error;
  }
};

export const deleteStaffAccount = async (id) => {
  try {
    const response = await api.delete(`/admin/staff/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting staff account:', error);
    throw error;
  }
};

export const batchDeleteStaffAccounts = async (ids) => {
  try {
    const response = await api.delete('/admin/staff', {
      data: { ids }
    });
    return response.data;
  } catch (error) {
    console.error('Error batch deleting staff accounts:', error);
    throw error;
  }
};

export const getAllProfiles = async (status = '') => {
  try {
    const params = status ? { status } : {};
    const response = await api.get('/admin/profiles', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching profiles:', error);
    throw error;
  }
};

export const reviewProfile = async (id, reviewData) => {
  try {
    const response = await api.put(`/admin/profiles/${id}/review`, reviewData);
    return response.data;
  } catch (error) {
    console.error('Error reviewing profile:', error);
    throw error;
  }
}; 

// 更新资料顺序
export const updateProfileOrder = async (profileId, direction) => {
  try {
    const response = await api.put(`/admin/profiles/${profileId}/order`, { direction });
    return response.data;
  } catch (error) {
    console.error('Error updating profile order:', error);
    throw error;
  }
};

// ===============================
// 团队 API (公开)
// ===============================

export const getTeamMembers = async (department = '') => {
  try {
    const params = department ? { department } : {};
    const response = await api.get('/team', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching team members:', error);
    throw error;
  }
};

export const getTeamDepartments = async () => {
  try {
    const response = await api.get('/team/departments');
    return response.data;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
};

export const getTeamMemberById = async (id) => {
  try {
    const response = await api.get(`/team/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching team member:', error);
    throw error;
  }
}; 

// 上传活动图片 (管理员功能)
export const uploadEventImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await api.post('/admin/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading event image:', error);
    throw error;
  }
};

 