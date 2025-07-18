import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiLinkedin, 
  FiGithub,
  FiSave, 
  FiCamera,
  FiCheck,
  FiClock,
  FiX,
  FiEye,
  FiLogOut,
  FiSettings,
  FiFileText,
  FiUsers,
  FiLock
} from 'react-icons/fi';
import { FaWeixin } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { getStaffProfile, saveStaffProfile, uploadStaffAvatar, getFullAvatarUrl } from '../utils/api';
import StaffCard from '../components/StaffCard';
import ChangePasswordModal from '../components/ChangePasswordModal';

const StyledStaffProfile = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(224, 43, 32, 0.03) 0%, rgba(252, 185, 0, 0.05) 100%);
  padding-top: 5rem;
  
  @media (max-width: 768px) {
    padding-top: 8rem;
  }
  
  @media (max-width: 768px) {
    padding-top: 8rem;
  }
  
  @media (max-width: 768px) {
    padding-top: 8rem;
  }
  
  [data-theme="dark"] & {
    background: linear-gradient(135deg, rgba(224, 43, 32, 0.08) 0%, rgba(252, 185, 0, 0.08) 100%);
  }
  
  .container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem;
    
    @media (max-width: 768px) {
      padding: 1rem;
    }
  }
  
  .page-header {
    text-align: center;
    margin-bottom: 3rem;
    
    h1 {
      font-size: clamp(2.5rem, 5vw, 3.5rem);
      margin-bottom: 1rem;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    p {
      color: var(--text-light);
      font-size: 1.1rem;
      max-width: 600px;
      margin: 0 auto;
    }
  }
  
  .profile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
    
    @media (max-width: 768px) {
      flex-direction: column;
      align-items: stretch;
      text-align: center;
    }
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      
      @media (max-width: 768px) {
        flex-direction: column;
        gap: 0.75rem;
      }
      
      .avatar {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--primary), var(--accent));
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.5rem;
        font-weight: bold;
      }
      
      .details {
        h3 {
          color: var(--text);
          margin-bottom: 0.25rem;
        }
        
        p {
          color: var(--text-light);
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }
        
        .permissions-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          
          .permission-tag {
            padding: 0.25rem 0.75rem;
            border-radius: 16px;
            font-size: 0.8rem;
            font-weight: 500;
            
            &.events {
              background: #dbeafe;
              color: #1e40af;
            }
            &.reviews {
              background: #d1fae5;
              color: #065f46;
            }
            &.staff {
              background: #fef3c7;
              color: #92400e;
            }
          }
        }
      }
    }
    
    .actions {
      display: flex;
      gap: 1rem;
      
      @media (max-width: 768px) {
        justify-content: center;
        flex-wrap: nowrap;
        gap: 0.5rem;
      }
      
      .permission-dropdown {
        position: relative;
        
        .permission-menu {
          position: absolute;
          top: 100%;
          left: 0;
          background: white;
          border-radius: 12px;
          padding: 0.5rem 0;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(224, 43, 32, 0.1);
          min-width: 200px;
          z-index: 10;
          margin-top: 0.5rem;
          
          [data-theme="dark"] & {
            background: var(--card-bg);
            border: 1px solid rgba(224, 43, 32, 0.2);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          }
          
          .permission-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem 1rem;
            color: var(--text);
            font-size: 0.9rem;
            transition: background-color 0.2s ease;
            
            &:hover {
              background: rgba(224, 43, 32, 0.05);
            }
            
            &.events svg {
              color: #1e40af;
            }
            
            &.reviews svg {
              color: #065f46;
            }
            
            &.staff svg {
              color: #92400e;
            }
            
            &.no-permissions {
              color: var(--text-light);
              font-style: italic;
              justify-content: center;
            }
          }
        }
      }
      
      .action-button {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
        white-space: nowrap;
        
        @media (max-width: 768px) {
          padding: 0.5rem 0.75rem;
          font-size: 0.85rem;
          gap: 0.25rem;
        }
        
        &.primary {
          background: linear-gradient(135deg, var(--primary), var(--accent));
          color: white;
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(224, 43, 32, 0.3);
          }
        }
        
        &.secondary {
          background: rgba(224, 43, 32, 0.1);
          color: var(--primary);
          
          &:hover {
            background: rgba(224, 43, 32, 0.2);
          }
        }
        
        &.danger {
          background: #ef4444;
          color: white;
          
          &:hover {
            background: #dc2626;
          }
        }
      }
    }
  }
`;

const StatusBanner = styled(motion.div)`
  background: ${props => {
    switch (props.status) {
      case 'approved':
        return 'linear-gradient(135deg, #10b981, #059669)';
      case 'pending':
        return 'linear-gradient(135deg, #f59e0b, #d97706)';
      case 'rejected':
        return 'linear-gradient(135deg, #ef4444, #dc2626)';
      default:
        return 'linear-gradient(135deg, #6b7280, #4b5563)';
    }
  }};
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  text-align: center;
  
  .status-icon {
    font-size: 1.2rem;
    flex-shrink: 0;
  }
  
  .status-content {
    flex: 1;
    
    h4 {
      font-weight: 600;
      margin: 0 0 0.25rem 0;
    }
    
    p {
      opacity: 0.9;
      font-size: 0.9rem;
      margin: 0;
    }
  }
`;

const ProfileCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(224, 43, 32, 0.1);
  margin-top: 3rem;
  margin-bottom: 2rem;
  
  [data-theme="dark"] & {
    background: var(--card-bg);
    border: 1px solid rgba(224, 43, 32, 0.2);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
`;

const AvatarSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  .avatar-container {
    position: relative;
    display: inline-block;
    margin-bottom: 1rem;
    
    .avatar {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid white;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      
      [data-theme="dark"] & {
        border-color: var(--card-bg);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
      }
    }
    
    .avatar-placeholder {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 3rem;
      font-weight: bold;
      border: 4px solid white;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      
      [data-theme="dark"] & {
        border-color: var(--card-bg);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
      }
    }
    
    .upload-overlay {
      position: absolute;
      bottom: 5px;
      right: 5px;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      color: white;
      border: none;
      border-radius: 12px;
      padding: 0.5rem 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(224, 43, 32, 0.3);
      font-size: 0.8rem;
      font-weight: 500;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(224, 43, 32, 0.4);
      }
      
      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none;
      }
      
      .loading-spinner {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top: 2px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    }
  }
  
  .hidden-input {
    display: none;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .form-group {
    .label {
      display: block;
      margin-bottom: 0.5rem;
      color: var(--text);
      font-weight: 500;
      font-size: 0.9rem;
    }
    
    .input-wrapper {
      position: relative;
      
      .input-icon {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        color: var(--text-light);
        font-size: 1.1rem;
      }
    }
    
    input, textarea, select {
      width: 100%;
      padding: 1rem 1rem 1rem 3rem;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      font-size: 1rem;
      transition: all 0.3s ease;
      background: #f9fafb;
      color: var(--text);
      
      @media (max-width: 768px) {
        font-size: 16px; /* Prevent zoom on iOS */
        padding: 0.875rem 0.875rem 0.875rem 2.75rem;
      }
      
      [data-theme="dark"] & {
        background: var(--input-bg);
        border-color: var(--border);
        color: var(--text);
        
        &:focus {
          background: var(--card-bg);
          border-color: var(--primary);
        }
        
        &::placeholder {
          color: var(--text-light);
        }
      }
      
      &:focus {
        outline: none;
        border-color: var(--primary);
        background: white;
        box-shadow: 0 0 0 3px rgba(224, 43, 32, 0.1);
      }
      
      &::placeholder {
        color: #9ca3af;
      }
    }
    
    textarea {
      min-height: 120px;
      resize: vertical;
      padding: 1rem;
    }
    
    .required {
      color: #ef4444;
    }
  }
  
  .full-width {
    grid-column: 1 / -1;
  }
`;

const SubmitSection = styled.div`
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  
  @media (max-width: 768px) {
    padding-top: 1.5rem;
  }
  
  [data-theme="dark"] & {
    border-top-color: var(--border);
  }
  
  .submit-button {
    background: linear-gradient(135deg, var(--primary), var(--accent));
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    min-width: 200px;
    height: 56px; /* 固定高度 */
    position: relative;
    
    @media (max-width: 768px) {
      width: 100%;
      max-width: 300px;
      padding: 1rem 1.5rem;
      font-size: 1rem;
    }
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(224, 43, 32, 0.3);
    }
    
    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }
    
    .loading-spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      flex-shrink: 0; /* 防止压缩 */
    }
    
    /* 确保文本不换行 */
    white-space: nowrap;
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  }
`;

// eslint-disable-next-line no-unused-vars
const PermissionsSection = styled.div`
  .title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--primary);
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 1rem;
    border-bottom: 2px solid var(--border);
    padding-bottom: 0.75rem;
  }
  
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }
  
  .permission-item {
    background: var(--background);
    border-radius: 12px;
    padding: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    border: 1px solid var(--border);
    
    .icon {
      font-size: 1.5rem;
      color: ${props => props.hasPermission ? 'var(--primary)' : 'var(--text-light)'};
    }
    
    .text {
      h4 {
        margin: 0 0 0.25rem 0;
        color: var(--text);
        font-size: 1rem;
      }
      p {
        margin: 0;
        font-size: 0.85rem;
        color: var(--text-light);
      }
    }
  }
  
  .admin-note {
    margin-top: 1rem;
    padding: 0.75rem 1rem;
    background: rgba(245, 158, 11, 0.1);
    border-radius: 8px;
    text-align: center;
    color: #d97706;
    font-size: 0.9rem;
    font-weight: 500;

    [data-theme="dark"] & {
      color: #f59e0b;
    }
  }
`;

const StaffProfile = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const fileInputRef = useRef(null);
  
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name_en: '',
    name_zh: '',
    position_en: '',
    position_zh: '',
    department: '',
    bio_en: '',
    bio_zh: '',
    avatarUrl: '',
    email: '',
    linkedin: '',
    github: '',
    wechat: '',
    phone: '',
    mbti: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPermissionMenu, setShowPermissionMenu] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Close permission menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showPermissionMenu && !event.target.closest('.permission-dropdown')) {
        setShowPermissionMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPermissionMenu]);

  // Load profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await getStaffProfile();
        setProfile(profileData);
        
        if (profileData) {
          setFormData({
            name_en: profileData.name_en || '',
            name_zh: profileData.name_zh || '',
            position_en: profileData.position_en || '',
            position_zh: profileData.position_zh || '',
            department: profileData.department || '',
            bio_en: profileData.bio_en || '',
            bio_zh: profileData.bio_zh || '',
            avatarUrl: profileData.avatarUrl || '',
            email: profileData.email || '',
            linkedin: profileData.linkedin || '',
            github: profileData.github || '',
            wechat: profileData.wechat || '',
            phone: profileData.phone || '',
            mbti: profileData.mbti || ''
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      loadProfile();
    }
  }, [isAuthenticated]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage(t('staff.profile.error.invalidFile'));
      setTimeout(() => setMessage(''), 5000);
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage(t('staff.profile.error.fileTooLarge'));
      setTimeout(() => setMessage(''), 5000);
      return;
    }

    setIsUploading(true);
    try {
      const response = await uploadStaffAvatar(file);
      
      // Update form data with new avatar URL
      setFormData(prev => ({
        ...prev,
        avatarUrl: response.avatarUrl
      }));
      
      // Reload profile to get the latest data from database
      const updatedProfile = await getStaffProfile();
      setProfile(updatedProfile);
      
      setMessage(t('staff.profile.avatarUploaded'));
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setMessage(error.response?.data?.error || t('staff.profile.error.uploadFailed'));
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name_en || !formData.name_zh || !formData.position_en || 
        !formData.position_zh || !formData.department) {
      setMessage(t('staff.profile.error.required'));
      // Clear message after 5 seconds
      setTimeout(() => setMessage(''), 5000);
      return;
    }

    setIsSaving(true);
    try {
      await saveStaffProfile(formData);
      setMessage(t('staff.profile.saved'));
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
      
      // Reload profile to get updated status
      const updatedProfile = await getStaffProfile();
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage(error.response?.data?.error || t('staff.profile.error.saveFailed'));
      // Clear error message after 5 seconds
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'approved':
        return {
          icon: <FiCheck className="status-icon" />,
          title: t('staff.profile.status.approved.title'),
          message: t('staff.profile.status.approved.message')
        };
      case 'pending':
        return {
          icon: <FiClock className="status-icon" />,
          title: t('staff.profile.status.pending.title'),
          message: t('staff.profile.status.pending.message')
        };
      case 'rejected':
        return {
          icon: <FiX className="status-icon" />,
          title: t('staff.profile.status.rejected.title'),
          message: t('staff.profile.status.rejected.message')
        };
      default:
        return {
          icon: <FiUser className="status-icon" />,
          title: t('staff.profile.status.new.title'),
          message: t('staff.profile.status.new.message')
        };
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <StyledStaffProfile>
        <div className="container">
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div className="loading-spinner" />
            <p>{t('common.loading')}</p>
          </div>
        </div>
      </StyledStaffProfile>
    );
  }

  const hasAnyPermission = user?.role === 'admin' || user?.permissions?.canManageEvents || user?.permissions?.canReviewProfiles || user?.permissions?.canManageStaff;

  const statusInfo = getStatusInfo(profile?.status);

  return (
    <StyledStaffProfile>
      <div className="container">
        <div className="page-header">
          <h1>{t('staff.profile.title')}</h1>
          <p>{t('staff.profile.subtitle')}</p>
        </div>

        <div className="profile-header">
          <div className="user-info">
            <div className="avatar">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="details">
              <h3>{user?.username}</h3>
              <p>{user?.email}</p>
            </div>
          </div>
          
          <div className="actions">
            <div className="permission-dropdown">
              <button 
                className="action-button secondary"
                onClick={() => setShowPermissionMenu(!showPermissionMenu)}
              >
                <FiEye />
                {t('staff.profile.viewPermission')}
              </button>
              
              <AnimatePresence>
                {showPermissionMenu && (
                  <motion.div
                    className="permission-menu"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {user?.permissions?.canManageEvents && (
                      <div className="permission-item events">
                        <FiSettings />
                        <span>{t('staff.profile.permissions.manageEvents')}</span>
                      </div>
                    )}
                    {user?.permissions?.canReviewProfiles && (
                      <div className="permission-item reviews">
                        <FiFileText />
                        <span>{t('staff.profile.permissions.reviewProfiles')}</span>
                      </div>
                    )}
                    {user?.permissions?.canManageStaff && (
                      <div className="permission-item staff">
                        <FiUsers />
                        <span>{t('staff.profile.permissions.manageStaff')}</span>
                      </div>
                    )}
                    {!hasAnyPermission && (
                      <div className="permission-item no-permissions">
                        <span>{t('admin.staff.noPermissions')}</span>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <button 
              className="action-button primary"
              onClick={() => setShowChangePasswordModal(true)}
            >
              <FiLock />
              {t('changePassword.title')}
            </button>
            
            <button 
              className="action-button danger"
              onClick={logout}
            >
              <FiLogOut />
              {t('staff.profile.logout')}
            </button>
          </div>
        </div>

        {profile && (
          <StatusBanner
            status={profile.status}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {statusInfo.icon}
            <div className="status-content">
              <h4>{statusInfo.title}</h4>
              <p>{statusInfo.message}</p>
            </div>
          </StatusBanner>
        )}

        {/* 数字名片 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <StaffCard 
            staff={{
              name_en: profile?.name_en || user?.username,
              name_zh: profile?.name_zh || user?.username,
              position_en: profile?.position_en || t('staff.profile.permissions.defaultPosition'),
              position_zh: profile?.position_zh || t('staff.profile.permissions.defaultPosition'),
              department: profile?.department,
              bio_en: profile?.bio_en,
              bio_zh: profile?.bio_zh,
              avatarUrl: profile?.avatarUrl,
              email: user?.email,
              phone: profile?.phone,
              linkedin: profile?.linkedin,
              github: profile?.github,
              wechat: profile?.wechat,
              mbti: profile?.mbti,
              status: profile?.status,
              username: user?.username
            }}
          />
        </motion.div>


        <ProfileCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <form onSubmit={handleSubmit}>
            <AvatarSection>
              <div className="avatar-container">
                {formData.avatarUrl ? (
                  <img 
                    src={getFullAvatarUrl(formData.avatarUrl)} 
                    alt="Avatar" 
                    className="avatar"
                  />
                ) : (
                  <div className="avatar-placeholder">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                )}
                <button
                  type="button"
                  className="upload-overlay"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <div className="loading-spinner" />
                  ) : (
                    <FiCamera />
                  )}
                </button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden-input"
              />
            </AvatarSection>

            <FormGrid>
              <div className="form-group">
                <label className="label">
                  {t('staff.profile.nameEn')} <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <FiUser className="input-icon" />
                  <input
                    type="text"
                    name="name_en"
                    value={formData.name_en}
                    onChange={handleInputChange}
                    placeholder={t('staff.profile.nameEnPlaceholder')}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="label">
                  {t('staff.profile.nameZh')} <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <FiUser className="input-icon" />
                  <input
                    type="text"
                    name="name_zh"
                    value={formData.name_zh}
                    onChange={handleInputChange}
                    placeholder={t('staff.profile.nameZhPlaceholder')}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="label">
                  {t('staff.profile.positionEn')} <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <FiUser className="input-icon" />
                  <input
                    type="text"
                    name="position_en"
                    value={formData.position_en}
                    onChange={handleInputChange}
                    placeholder={t('staff.profile.positionEnPlaceholder')}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="label">
                  {t('staff.profile.positionZh')} <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <FiUser className="input-icon" />
                  <input
                    type="text"
                    name="position_zh"
                    value={formData.position_zh}
                    onChange={handleInputChange}
                    placeholder={t('staff.profile.positionZhPlaceholder')}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="label">
                  {t('staff.profile.department')} <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <FiUser className="input-icon" />
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">{t('staff.profile.selectDepartment')}</option>
                    <option value="ARTS & CULTURE GROUP">{t('staff.profile.departments.arts')}</option>
                    <option value="CAREER & ACADEMIC GROUP">{t('staff.profile.departments.career')}</option>
                    <option value="OPERATION GROUP">{t('staff.profile.departments.operation')}</option>
                    <option value="SUPPORT GROUP">{t('staff.profile.departments.support')}</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="label">
                  {t('staff.profile.email')}
                </label>
                <div className="input-wrapper">
                  <FiMail className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={t('staff.profile.emailPlaceholder')}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="label">
                  {t('staff.profile.phone')}
                </label>
                <div className="input-wrapper">
                  <FiPhone className="input-icon" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={t('staff.profile.phonePlaceholder')}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="label">
                  {t('staff.profile.linkedin')}
                </label>
                <div className="input-wrapper">
                  <FiLinkedin className="input-icon" />
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    placeholder={t('staff.profile.linkedinPlaceholder')}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="label">
                  {t('staff.profile.github')}
                </label>
                <div className="input-wrapper">
                  <FiGithub className="input-icon" />
                  <input
                    type="url"
                    name="github"
                    value={formData.github}
                    onChange={handleInputChange}
                    placeholder={t('staff.profile.githubPlaceholder')}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="label">
                  {t('staff.profile.wechat')}
                </label>
                <div className="input-wrapper">
                  <FaWeixin className="input-icon" />
                  <input
                    type="text"
                    name="wechat"
                    value={formData.wechat}
                    onChange={handleInputChange}
                    placeholder={t('staff.profile.wechatPlaceholder')}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="label">
                  {t('staff.profile.mbti')}
                </label>
                <div className="input-wrapper">
                  <FiUser className="input-icon" />
                  <select
                    name="mbti"
                    value={formData.mbti}
                    onChange={handleInputChange}
                  >
                    <option value="">{t('staff.profile.mbtiPlaceholder')}</option>
                    <option value="INTJ">INTJ - The Architect</option>
                    <option value="INTP">INTP - The Thinker</option>
                    <option value="ENTJ">ENTJ - The Commander</option>
                    <option value="ENTP">ENTP - The Debater</option>
                    <option value="INFJ">INFJ - The Advocate</option>
                    <option value="INFP">INFP - The Mediator</option>
                    <option value="ENFJ">ENFJ - The Protagonist</option>
                    <option value="ENFP">ENFP - The Campaigner</option>
                    <option value="ISTJ">ISTJ - The Logistician</option>
                    <option value="ISFJ">ISFJ - The Protector</option>
                    <option value="ESTJ">ESTJ - The Executive</option>
                    <option value="ESFJ">ESFJ - The Consul</option>
                    <option value="ISTP">ISTP - The Virtuoso</option>
                    <option value="ISFP">ISFP - The Adventurer</option>
                    <option value="ESTP">ESTP - The Entrepreneur</option>
                    <option value="ESFP">ESFP - The Entertainer</option>
                    <option value="INFJ-T">INFJ-T - The Advocate (Turbulent)</option>
                    <option value="INFJ-A">INFJ-A - The Advocate (Assertive)</option>
                    <option value="INTJ-T">INTJ-T - The Architect (Turbulent)</option>
                    <option value="INTJ-A">INTJ-A - The Architect (Assertive)</option>
                    <option value="INTP-T">INTP-T - The Thinker (Turbulent)</option>
                    <option value="INTP-A">INTP-A - The Thinker (Assertive)</option>
                    <option value="ENTJ-T">ENTJ-T - The Commander (Turbulent)</option>
                    <option value="ENTJ-A">ENTJ-A - The Commander (Assertive)</option>
                    <option value="ENTP-T">ENTP-T - The Debater (Turbulent)</option>
                    <option value="ENTP-A">ENTP-A - The Debater (Assertive)</option>
                    <option value="INFP-T">INFP-T - The Mediator (Turbulent)</option>
                    <option value="INFP-A">INFP-A - The Mediator (Assertive)</option>
                    <option value="ENFJ-T">ENFJ-T - The Protagonist (Turbulent)</option>
                    <option value="ENFJ-A">ENFJ-A - The Protagonist (Assertive)</option>
                    <option value="ENFP-T">ENFP-T - The Campaigner (Turbulent)</option>
                    <option value="ENFP-A">ENFP-A - The Campaigner (Assertive)</option>
                    <option value="ISTJ-T">ISTJ-T - The Logistician (Turbulent)</option>
                    <option value="ISTJ-A">ISTJ-A - The Logistician (Assertive)</option>
                    <option value="ISFJ-T">ISFJ-T - The Protector (Turbulent)</option>
                    <option value="ISFJ-A">ISFJ-A - The Protector (Assertive)</option>
                    <option value="ESTJ-T">ESTJ-T - The Executive (Turbulent)</option>
                    <option value="ESTJ-A">ESTJ-A - The Executive (Assertive)</option>
                    <option value="ESFJ-T">ESFJ-T - The Consul (Turbulent)</option>
                    <option value="ESFJ-A">ESFJ-A - The Consul (Assertive)</option>
                    <option value="ISTP-T">ISTP-T - The Virtuoso (Turbulent)</option>
                    <option value="ISTP-A">ISTP-A - The Virtuoso (Assertive)</option>
                    <option value="ISFP-T">ISFP-T - The Adventurer (Turbulent)</option>
                    <option value="ISFP-A">ISFP-A - The Adventurer (Assertive)</option>
                    <option value="ESTP-T">ESTP-T - The Entrepreneur (Turbulent)</option>
                    <option value="ESTP-A">ESTP-A - The Entrepreneur (Assertive)</option>
                    <option value="ESFP-T">ESFP-T - The Entertainer (Turbulent)</option>
                    <option value="ESFP-A">ESFP-A - The Entertainer (Assertive)</option>
                  </select>
                </div>
              </div>

              <div className="form-group full-width">
                <label className="label">
                  {t('staff.profile.bioEn')}
                </label>
                <textarea
                  name="bio_en"
                  value={formData.bio_en}
                  onChange={handleInputChange}
                  placeholder={t('staff.profile.bioEnPlaceholder')}
                />
              </div>

              <div className="form-group full-width">
                <label className="label">
                  {t('staff.profile.bioZh')}
                </label>
                <textarea
                  name="bio_zh"
                  value={formData.bio_zh}
                  onChange={handleInputChange}
                  placeholder={t('staff.profile.bioZhPlaceholder')}
                />
              </div>
            </FormGrid>

            <SubmitSection>
              {/* Local message display near the button */}
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: message.includes('error') || message.includes('Error') || message.includes('failed') || message.includes('Failed') ? '#fee2e2' : '#dcfce7',
                    color: message.includes('error') || message.includes('Error') || message.includes('failed') || message.includes('Failed') ? '#dc2626' : '#166534',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    marginBottom: '1rem',
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}
                >
                  {message}
                </motion.div>
              )}
              
              <button 
                type="submit" 
                className="submit-button"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="loading-spinner" />
                    {t('staff.profile.saving')}
                  </>
                ) : (
                  <>
                    <FiSave />
                    {t('staff.profile.save')}
                  </>
                )}
              </button>
            </SubmitSection>
          </form>
        </ProfileCard>
      </div>
      
      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        onSuccess={() => {
          setShowChangePasswordModal(false);
          // You could show a success message here if needed
        }}
      />
    </StyledStaffProfile>
  );
};

export default StaffProfile; 