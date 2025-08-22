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
  return `${BASE_URL}${avatarUrl.startsWith('/') ? '' : '/uploads/staff/'}${avatarUrl}`;
};

// 工具函数：处理活动图片URL
export const getFullEventImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl; // 已经是完整 URL

  // 从 /uploads/events/some-image.jpg 转换为 /static/events/some-image.jpg
  const imagePath = imageUrl.replace(/^\/uploads\//, '/static/');
  
  return `${BASE_URL}${imagePath}`;
};

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // 允许跨域请求携带Cookie
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加语言和认证token
api.interceptors.request.use(config => {
  // 添加当前语言到请求中
  const currentLanguage = i18n.language || 'en';
  config.params = { 
    ...config.params,
    language: currentLanguage 
  };

  // 为了兼容Safari，从localStorage获取token并添加到请求头
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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
      // Token无效或过期
      // 清除localStorage中的token
      localStorage.removeItem('authToken');
      // 通知应用用户已注销
      window.dispatchEvent(new Event('auth-logout'));
    }
    return Promise.reject(error);
  }
);

// ===============================
// 认证 API
// ===============================

// 统一登录API（用户名/邮箱 + 密码）
export const login = async (identifier, password) => {
  try {
    const response = await api.post('/auth/login', { identifier, password });
    return response.data;
  } catch (error) {
    console.error('登录错误:', error);
    throw error;
  }
};

// 邮箱验证码登录
export const loginWithEmail = async (email, verificationCode) => {
  try {
    const response = await api.post('/auth/login-email', { 
      email, 
      verificationCode 
    });
    return response.data;
  } catch (error) {
    console.error('邮箱验证码登录错误:', error);
    throw error;
  }
};

// 注销
export const logout = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error) {
    console.error('注销错误:', error);
    throw error;
  }
};

// 注册新用户
export const register = async (email, username, password, verificationCode) => {
  try {
    const response = await api.post('/auth/register', { 
      email, 
      username, 
      password, 
      verificationCode 
    });
    return response.data;
  } catch (error) {
    console.error('注册错误:', error);
    throw error;
  }
};

// 发送验证码
export const sendVerificationCode = async (email, purpose = 'login') => {
  try {
    const response = await api.post('/auth/send-verification-code', { 
      email, 
      purpose 
    });
    return response.data;
  } catch (error) {
    console.error('发送验证码错误:', error);
    throw error;
  }
};

// 验证验证码（不登录，只验证）
export const verifyCode = async (email, verificationCode) => {
  try {
    const response = await api.post('/auth/verify-code', { 
      email, 
      verificationCode 
    });
    return response.data;
  } catch (error) {
    console.error('验证验证码错误:', error);
    throw error;
  }
};



// 获取当前用户信息
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    // 只在非401错误时打印错误信息，401是正常的未登录状态
    if (error.response?.status !== 401) {
      console.error('获取用户信息错误:', error);
    }
    throw error;
  }
};

// 修改密码
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.post('/auth/change-password', { 
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

export const batchToggleStaffAccounts = async (ids, isActive) => {
  try {
    const response = await api.patch('/admin/staff/batch-toggle', {
      ids,
      isActive
    });
    return response.data;
  } catch (error) {
    console.error('Error batch toggling staff accounts:', error);
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
