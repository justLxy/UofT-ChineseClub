import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import i18n from '../utils/i18n';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUsers, 
  FiEdit, 
  FiTrash2, 
  FiCheck, 
  FiX, 
  FiClock,
  FiEye,
  FiSearch,
  FiUserPlus,
  FiMail,
  FiKey,
  FiToggleLeft,
  FiToggleRight
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import {
  getAllStaff,
  createStaffAccount,
  updateStaffAccount,
  deleteStaffAccount,
  batchDeleteStaffAccounts,
  getAllProfiles,
  reviewProfile,
  getFullAvatarUrl
} from '../utils/api';
import LoadingAnimation from '../components/LoadingAnimation';

const StyledStaffAdmin = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(224, 43, 32, 0.03) 0%, rgba(252, 185, 0, 0.05) 100%);
  padding-top: 5rem;
  
  @media (max-width: 768px) {
    padding-top: 8rem;
  }
  
  [data-theme="dark"] & {
    background: linear-gradient(135deg, rgba(224, 43, 32, 0.08) 0%, rgba(252, 185, 0, 0.08) 100%);
  }
  
  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
    
    @media (max-width: 768px) {
      padding: 1rem;
    }
  }
  
  .page-header {
    text-align: center;
    margin-bottom: 3rem;
    
    @media (max-width: 768px) {
      margin-bottom: 2rem;
    }
    
    h1 {
      font-size: clamp(2.5rem, 5vw, 3.5rem);
      margin-bottom: 1rem;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      
      @media (max-width: 768px) {
        font-size: clamp(2rem, 6vw, 2.5rem);
      }
    }
    
    p {
      color: var(--text-light);
      font-size: 1.1rem;
      max-width: 600px;
      margin: 0 auto;
      
      @media (max-width: 768px) {
        font-size: 1rem;
        padding: 0 1rem;
      }
    }
  }
  
  .tabs {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    border-bottom: 1px solid #e5e7eb;
    flex-wrap: wrap;
    justify-content: center;
    
    [data-theme="dark"] & {
      border-bottom-color: var(--border);
    }
    
    @media (max-width: 768px) {
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }
    
    .tab {
      padding: 1rem 2rem;
      border: none;
      background: none;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      font-weight: 500;
      color: var(--text-light);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      
      @media (max-width: 768px) {
        padding: 0.75rem 1rem;
        font-size: 0.9rem;
        flex: 1;
        justify-content: center;
      }
      
      &.active {
        color: var(--primary);
        
        &:after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--primary);
        }
      }
      
      &:hover {
        color: var(--primary);
      }
    }
  }
  
  .controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
    
    @media (max-width: 768px) {
      flex-direction: column;
      align-items: stretch;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    
    .search-filter {
      display: flex;
      gap: 1rem;
      align-items: center;
      flex: 1;
      
      @media (max-width: 768px) {
        flex-direction: column;
        gap: 0.75rem;
        align-items: stretch;
      }
      
      .search-box {
        position: relative;
        max-width: 300px;
        
        @media (max-width: 768px) {
          max-width: none;
        }
        
        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-light);
        }
        
        input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 3rem;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          background: white;
          color: var(--text);
          transition: all 0.3s ease;
          
          [data-theme="dark"] & {
            background: var(--input-bg);
            border-color: var(--border);
            color: var(--text);
            
            &:focus {
              background: var(--card-bg);
              border-color: var(--primary);
            }
          }
          
          &:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(224, 43, 32, 0.1);
          }
        }
      }
      
      .filter-select {
        padding: 0.75rem 1rem;
        border: 2px solid #e5e7eb;
        border-radius: 10px;
        background: white;
        color: var(--text);
        cursor: pointer;
        transition: all 0.3s ease;
        
        [data-theme="dark"] & {
          background: var(--input-bg);
          border-color: var(--border);
          color: var(--text);
          
          &:focus {
            background: var(--card-bg);
            border-color: var(--primary);
          }
        }
        
        @media (max-width: 768px) {
          width: 100%;
        }
        
        &:focus {
          outline: none;
          border-color: var(--primary);
        }
      }
    }
    
    .action-button {
      background: linear-gradient(135deg, var(--primary), var(--accent));
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 500;
      
      @media (max-width: 768px) {
        justify-content: center;
        padding: 1rem 1.5rem;
      }
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(224, 43, 32, 0.3);
      }
    }
  }
`;

const Card = styled(motion.div)`
  position: relative;
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(224, 43, 32, 0.1);
  transition: all 0.3s ease;
  
  [data-theme="dark"] & {
    background: var(--card-bg);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    border-color: var(--border);
    
    &:hover {
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
    }
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 12px;
  }
  
  &:hover {
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    
    @media (max-width: 768px) {
      flex-direction: column;
      gap: 1rem;
    }
    
    .info {
      flex: 1;
      
      h3 {
        color: var(--text);
        margin-bottom: 0.5rem;
        font-size: 1.2rem;
        
        @media (max-width: 768px) {
          font-size: 1.1rem;
        }
      }
      
      .meta {
        display: flex;
        gap: 1rem;
        color: var(--text-light);
        font-size: 0.9rem;
        flex-wrap: wrap;
        
        @media (max-width: 768px) {
          gap: 0.75rem;
          font-size: 0.85rem;
        }
        
        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
      }
    }
    
    .actions {
      display: flex;
      gap: 0.5rem;
      
      @media (max-width: 768px) {
        flex-wrap: wrap;
        gap: 0.4rem;
        width: 100%;
        justify-content: center;
      }
      
      .action-btn {
        width: auto;
        min-width: 35px;
        height: 35px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.25rem;
        padding: 0.5rem 0.75rem;
        font-size: 0.8rem;
        font-weight: 500;
        transition: all 0.3s ease;
        white-space: nowrap;
        
        @media (max-width: 768px) {
          font-size: 0.75rem;
          padding: 0.4rem 0.6rem;
          min-width: 32px;
          height: 32px;
        }
        
        &.view {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
          
          &:hover {
            background: #3b82f6;
            color: white;
          }
        }
        
        &.edit {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
          
          &:hover {
            background: #f59e0b;
            color: white;
          }
        }
        
        &.approve {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          
          &:hover {
            background: #10b981;
            color: white;
          }
        }
        
        &.reject {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          
          &:hover {
            background: #ef4444;
            color: white;
          }
        }
        
        &.secondary {
          background: rgba(107, 114, 128, 0.1);
          color: #6b7280;
          
          &:hover {
            background: #6b7280;
            color: white;
          }
        }
        
        &.toggle {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
          
          &:hover {
            background: #d97706;
            color: white;
          }
        }
      }
    }
  }
  
  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
    
    &.approved {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
    }
    
    &.pending {
      background: rgba(245, 158, 11, 0.1);
      color: #f59e0b;
    }
    
    &.rejected {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
    }
    
    &.active {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
    }
    
    &.inactive {
      background: rgba(156, 163, 175, 0.1);
      color: #9ca3af;
    }
  }
  
  &.selectable {
    cursor: pointer;
  }
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
  
  .modal-content {
    background: white;
    border-radius: 20px;
    padding: 2rem;
    width: 100%;
    max-width: ${props => props.isReviewModal ? '900px' : '500px'};
    max-height: 90vh;
    overflow-y: auto;
    
    [data-theme="dark"] & {
      background: var(--card-bg);
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      
      h3 {
        color: var(--text);
        margin: 0;
      }
      
      .close-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--text-light);
        
        &:hover {
          color: var(--primary);
        }
      }
    }
    
    .form-group {
      margin-bottom: 1.5rem;
      
      label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--text);
        font-weight: 500;
      }
      
      input, select, textarea {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid #e5e7eb;
        border-radius: 10px;
        font-size: 1rem;
        background: white;
        color: var(--text);
        transition: all 0.3s ease;
        
        [data-theme="dark"] & {
          background: var(--input-bg);
          border-color: var(--border);
          color: var(--text);
          
          &:focus {
            background: var(--card-bg);
            border-color: var(--primary);
          }
        }
        
        &:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(224, 43, 32, 0.1);
        }
      }
      
      // 复选框特殊样式
      &.checkbox-group {
        label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0;
          cursor: pointer;
          
          input[type="checkbox"] {
            width: auto;
            margin: 0;
            cursor: pointer;
          }
        }
      }
      
      textarea {
        min-height: 100px;
        resize: vertical;
      }
    }
    
    /* Review modal specific styles */
    .profile-review-section {
      .info-item {
        margin-bottom: 0.75rem;
        
        strong {
          color: var(--text);
          font-size: 0.9rem;
        }
        
        div {
          font-size: 0.95rem;
          line-height: 1.4;
        }
      }
    }
    
    .review-controls-section {
      h4 {
        font-size: 1.1rem;
        font-weight: 600;
      }
    }
    
    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      
      .btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.3s ease;
        
        &.primary {
          background: linear-gradient(135deg, var(--primary), var(--accent));
          color: white;
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(224, 43, 32, 0.3);
          }
        }
        
        &.secondary {
          background: #f3f4f6;
          color: var(--text);
          
          [data-theme="dark"] & {
            background: var(--input-bg);
            color: var(--text);
            
            &:hover {
              background: var(--border);
            }
          }
          
          &:hover {
            background: #e5e7eb;
          }
        }
      }
    }
  }
`;

const StaffAdmin = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hasPermission, user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('accounts');
  const [staffAccounts, setStaffAccounts] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create'); // create, edit, review
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    isActive: true,
    role: 'staff'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [imageLoadErrors, setImageLoadErrors] = useState({});

  // Redirect if no staff management permissions
  useEffect(() => {
    if (!hasPermission('manageStaff') && !hasPermission('reviewProfiles')) {
      navigate('/');
    }
  }, [hasPermission, navigate]);

  // Set default tab based on permissions
  useEffect(() => {
    if (!hasPermission('manageStaff') && hasPermission('reviewProfiles')) {
      setActiveTab('profiles');
    }
  }, [hasPermission]);

  // Define loadData function at component level so it can be accessed by handlers
  const loadData = useCallback(async () => {
    if (!hasPermission('manageStaff') && !hasPermission('reviewProfiles')) {
      return;
    }

    setIsLoading(true);
    try {
      if (activeTab === 'accounts') {
        const data = await getAllStaff();
        setStaffAccounts(data);
        setProfiles([]); // Clear the other data source
      } else { // activeTab === 'profiles'
        const data = await getAllProfiles(statusFilter === 'all' ? '' : statusFilter);
        setProfiles(data);
        setStaffAccounts([]); // Clear the other data source
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, statusFilter, hasPermission]);

  // This is the single source of truth for loading data.
  // It reacts to changes in tab, filter, or permissions.
  useEffect(() => {
    loadData();
  }, [loadData]);


  // This effect handles the side-effects of tab switching that are NOT data loading.
  // It's responsible for resetting UI state.
  useEffect(() => {
    // Clear dynamic UI states
    setSearchTerm('');
    setSelectedItems(new Set());
    setSelectAll(false);
    setFilteredData([]); // Clear old data immediately to prevent flicker

    // Set the default filter for the new tab.
    // This will trigger the data-loading useEffect above.
    if (activeTab === 'profiles') {
      setStatusFilter(currentStatus => currentStatus === 'pending' ? currentStatus : 'pending');
    } else { // activeTab === 'accounts'
      setStatusFilter(currentStatus => currentStatus === 'all' ? currentStatus : 'all');
    }
  }, [activeTab]);


  // Filter data whenever the source data, search term, or filter changes.
  useEffect(() => {
    let data = activeTab === 'accounts' ? staffAccounts : profiles;
    
    let filtered = data.filter(item => {
      const searchMatch = activeTab === 'accounts' 
        ? (item.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           item.email?.toLowerCase().includes(searchTerm.toLowerCase()))
        : (item.name_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           item.name_zh?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           item.staff?.username?.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // For profile reviews, the API already filters by status,
      // but we might want to retain this for client-side filtering if 'all' is ever used.
      // For now, the main filtering by status is done at the API level via the `statusFilter` state.
      const statusMatch = statusFilter === 'all' || 
        (activeTab === 'accounts' 
          ? (statusFilter === 'active' ? item.isActive : !item.isActive)
          : item.status === statusFilter);
      
      return searchMatch && statusMatch;
    });
    
    // For profile reviews, after initial load, we only want to show pending or rejected.
    // The API call uses the filter, but this ensures the UI is consistent.
    if (activeTab === 'profiles') {
      if (statusFilter === 'pending' || statusFilter === 'rejected') {
        filtered = filtered.filter(item => item.status === statusFilter);
      } else if (statusFilter === 'all') {
        // If for some reason we are showing all, filter out approved ones on the client side.
        filtered = filtered.filter(item => item.status === 'pending' || item.status === 'rejected');
      }
    }

    setFilteredData(filtered);
  }, [staffAccounts, profiles, searchTerm, statusFilter, activeTab]);

  const handleCreateStaff = () => {
    setModalType('create');
    setSelectedItem(null);
    setFormData({
      username: '',
      email: '',
      password: '123',
      isActive: true,
      role: 'staff',
      canManageEvents: false,
      canManageStaff: false,
      canReviewProfiles: false
    });
    setShowModal(true);
  };

  const handleEditStaff = (staff) => {
    setModalType('edit');
    setSelectedItem(staff);
    setFormData({
      username: staff.username,
      email: staff.email,
      password: '',
      isActive: staff.isActive,
      role: staff.role,
      canManageEvents: staff.canManageEvents || false,
      canManageStaff: staff.canManageStaff || false,
      canReviewProfiles: staff.canReviewProfiles || false,
      name_en: staff.profile?.name_en || '',
      name_zh: staff.profile?.name_zh || '',
      position_en: staff.profile?.position_en || '',
      position_zh: staff.profile?.position_zh || '',
      department: staff.profile?.department || '',
      bio_en: staff.profile?.bio_en || '',
      bio_zh: staff.profile?.bio_zh || '',
      profileEmail: staff.profile?.email || '',
      linkedin: staff.profile?.linkedin || '',
      github: staff.profile?.github || '',
      wechat: staff.profile?.wechat || '',
      phone: staff.profile?.phone || '',
      displayOrder: staff.profile?.displayOrder || 0
    });
    setShowModal(true);
  };

  const handleReviewProfile = (profile) => {
    setModalType('review');
    setSelectedItem(profile);
    setFormData({
      status: profile.status,
      reviewNote: profile.reviewNote || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (modalType === 'create') {
        // 如果用户名为空，从邮箱中自动生成
        let finalFormData = { ...formData };
        if (!finalFormData.username.trim() && finalFormData.email) {
          const emailUsername = finalFormData.email.split('@')[0];
          finalFormData.username = emailUsername;
        }
        
        // Structure permissions data for creation
        const createData = {
          ...finalFormData,
          permissions: {
            canManageEvents: finalFormData.canManageEvents,
            canManageStaff: finalFormData.canManageStaff,
            canReviewProfiles: finalFormData.canReviewProfiles
          }
        };
        delete createData.canManageEvents;
        delete createData.canManageStaff;
        delete createData.canReviewProfiles;
        
        await createStaffAccount(createData);
      } else if (modalType === 'edit') {
        const { password, ...updateData } = formData;
        const profileUpdate = {
          name_en: updateData.name_en,
          name_zh: updateData.name_zh,
          position_en: updateData.position_en,
          position_zh: updateData.position_zh,
          department: updateData.department,
          bio_en: updateData.bio_en,
          bio_zh: updateData.bio_zh,
          email: updateData.profileEmail,
          linkedin: updateData.linkedin,
          github: updateData.github,
          wechat: updateData.wechat,
          phone: updateData.phone,
          displayOrder: updateData.displayOrder
        };

        const permissionsData = {
          ...updateData,
          permissions: {
            canManageEvents: updateData.canManageEvents,
            canManageStaff: updateData.canManageStaff,
            canReviewProfiles: updateData.canReviewProfiles
          },
          profileUpdate
        };

        // Remove non-account fields from top level
        delete permissionsData.canManageEvents;
        delete permissionsData.canManageStaff;
        delete permissionsData.canReviewProfiles;
        delete permissionsData.name_en;
        delete permissionsData.name_zh;
        delete permissionsData.position_en;
        delete permissionsData.position_zh;
        delete permissionsData.department;
        delete permissionsData.bio_en;
        delete permissionsData.bio_zh;
        delete permissionsData.profileEmail;
        delete permissionsData.linkedin;
        delete permissionsData.github;
        delete permissionsData.wechat;
        delete permissionsData.phone;
        delete permissionsData.displayOrder;

        await updateStaffAccount(selectedItem.id, permissionsData);
      } else if (modalType === 'review') {
        await reviewProfile(selectedItem.id, formData);
      }
      
      setShowModal(false);
      loadData();
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error
    }
  };

  const handleDeleteStaff = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff account?')) {
      try {
        await deleteStaffAccount(id);
        loadData();
      } catch (error) {
        console.error('Error deleting staff:', error);
      }
    }
  };

  const handleQuickReview = async (profileId, status) => {
    try {
      await reviewProfile(profileId, { status });
      loadData();
    } catch (error) {
      console.error('Error reviewing profile:', error);
    }
  };

  const handleResetPassword = async (staff) => {
    const newPassword = prompt(`Generate new password for ${staff.username}?\n\nEnter new password or leave blank to auto-generate:`);
    if (newPassword !== null) {
      try {
        const passwordToUse = newPassword.trim() || Math.random().toString(36).slice(-8);
        await updateStaffAccount(staff.id, { 
          password: passwordToUse,
          permissions: {} // Keep existing permissions
        });
        alert(`Password reset successfully!\nNew password: ${passwordToUse}\n\nPlease share this with the user securely.`);
        loadData();
      } catch (error) {
        console.error('Error resetting password:', error);
        alert('Failed to reset password');
      }
    }
  };

  const handleToggleAccount = async (staff) => {
    const action = staff.isActive ? 'deactivate' : 'activate';
    if (window.confirm(`Are you sure you want to ${action} ${staff.username}'s account?`)) {
      try {
        const response = await updateStaffAccount(staff.id, { 
          isActive: !staff.isActive,
          permissions: {} // Keep existing permissions
        });
        console.log('Toggle account response:', response);
        alert(`Successfully ${action}d account`);
        loadData();
      } catch (error) {
        console.error(`Error ${action}ing account:`, error);
        console.error('Error details:', error.response?.data || error.message);
        alert(`Failed to ${action} account: ${error.response?.data?.error || error.message}`);
      }
    }
  };

  // 批量选择相关函数
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems(new Set());
    } else {
      const allIds = new Set(filteredData.map(item => item.id));
      setSelectedItems(allIds);
    }
    setSelectAll(!selectAll);
  };

  const handleSelectItem = (id) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
    setSelectAll(newSelected.size === filteredData.length);
  };

  const handleBatchDelete = async () => {
    if (selectedItems.size === 0) {
      alert(t('admin.staff.batchDelete.noSelection'));
      return;
    }

    const confirmMessage = t('admin.staff.batchDelete.confirm', { count: selectedItems.size });
    if (window.confirm(confirmMessage)) {
      try {
        const idsArray = Array.from(selectedItems);
        await batchDeleteStaffAccounts(idsArray);
        setSelectedItems(new Set());
        setSelectAll(false);
        loadData();
        alert(t('admin.staff.batchDelete.success', { count: selectedItems.size }));
      } catch (error) {
        console.error('Error batch deleting staff:', error);
        alert(t('admin.staff.batchDelete.error'));
      }
    }
  };

  // Reset selection states when filtered data changes (but not when switching tabs)
  useEffect(() => {
    if (filteredData.length > 0) {
      setSelectedItems(new Set());
      setSelectAll(false);
    }
  }, [filteredData]);

  const handleImageError = (itemId) => {
    setImageLoadErrors(prev => ({
      ...prev,
      [itemId]: true
    }));
  };

  // Reset image load errors when data changes
  useEffect(() => {
    setImageLoadErrors({});
  }, [filteredData]);

  if (!hasPermission('manageStaff') && !hasPermission('reviewProfiles')) {
    return null;
  }

  return (
    <StyledStaffAdmin>
      <div className="container">
        <div className="page-header">
          <h1>{t('admin.staff.managementTitle')}</h1>
          <p>{t('admin.staff.managementSubtitle')}</p>
        </div>

        <div className="tabs">
          {hasPermission('manageStaff') && (
            <button 
              className={`tab ${activeTab === 'accounts' ? 'active' : ''}`}
              onClick={() => setActiveTab('accounts')}
            >
              <FiUsers />
              {t('admin.staff.tabs.accounts')}
            </button>
          )}
          {hasPermission('reviewProfiles') && (
            <button
              className={`tab ${activeTab === 'profiles' ? 'active' : ''}`}
              onClick={() => setActiveTab('profiles')}
            >
              <FiClock />
              {t('admin.staff.tabs.profiles')}
            </button>
          )}
        </div>

        <div className="controls">
          <div className="search-filter">
            <div className="search-box">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder={t('admin.staff.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select 
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">{t('admin.staff.filters.all')}</option>
              {activeTab === 'accounts' ? (
                <>
                  <option value="active">{t('admin.staff.filters.active')}</option>
                  <option value="inactive">{t('admin.staff.filters.inactive')}</option>
                </>
              ) : (
                <>
                  <option value="pending">{t('admin.staff.filters.pending')}</option>
                  <option value="rejected">{t('admin.staff.filters.rejected')}</option>
                </>
              )}
            </select>
          </div>
          
          {activeTab === 'accounts' && hasPermission('manageStaff') && (
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              {selectedItems.size > 0 && (
                <button 
                  className="action-button danger"
                  onClick={handleBatchDelete}
                  style={{ 
                    background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                    color: 'white',
                    minWidth: 'fit-content'
                  }}
                >
                  <FiTrash2 />
                  <span style={{ whiteSpace: 'nowrap' }}>
                    {t('admin.staff.batchDelete.button')} ({selectedItems.size})
                  </span>
                </button>
              )}
              <button className="action-button" onClick={handleCreateStaff}>
                <FiUserPlus />
                {t('admin.staff.createAccount')}
              </button>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="data-list">
            {[...Array(5)].map((_, index) => (
              <div key={index} style={{ 
                background: 'white',
                borderRadius: '15px',
                padding: '1.5rem',
                marginBottom: '1rem',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(224, 43, 32, 0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                  {/* Avatar skeleton */}
                  <div style={{ 
                    width: '50px', 
                    height: '50px', 
                    borderRadius: '50%',
                    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                    backgroundSize: '400% 100%',
                    animation: 'shimmer 1.2s ease-in-out infinite',
                    flexShrink: 0
                  }} />
                  
                  {/* Name and info skeleton */}
                  <div style={{ flex: 1 }}>
                    <LoadingAnimation type="skeleton" width="200px" height="24px" />
                    <div style={{ marginTop: '0.5rem' }}>
                      <LoadingAnimation type="skeleton" width="300px" height="16px" />
                    </div>
                  </div>
                  
                  {/* Action buttons skeleton */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {[...Array(3)].map((_, btnIndex) => (
                      <div key={btnIndex} style={{
                        width: '35px',
                        height: '35px',
                        borderRadius: '8px',
                        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                        backgroundSize: '400% 100%',
                        animation: 'shimmer 1.2s ease-in-out infinite'
                      }} />
                    ))}
                  </div>
                </div>
                
                {/* Meta info skeleton */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <LoadingAnimation type="skeleton" width="120px" height="14px" />
                  <LoadingAnimation type="skeleton" width="150px" height="14px" />
                  <LoadingAnimation type="skeleton" width="80px" height="20px" />
                </div>
                
                {/* Additional content skeleton */}
                <div style={{ marginTop: '1rem' }}>
                  <LoadingAnimation type="skeleton" width="100%" height="16px" />
                  <div style={{ marginTop: '0.5rem' }}>
                    <LoadingAnimation type="skeleton" width="80%" height="16px" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredData.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ 
              textAlign: 'center', 
              padding: '4rem 2rem',
              background: 'var(--card-bg)',
              borderRadius: '15px',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
              border: '1px solid var(--border)'
            }}>
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: '1rem',
              opacity: 0.5
            }}>
              {activeTab === 'accounts' ? '👥' : '📋'}
            </div>
            <h3 style={{ 
              margin: '0 0 0.5rem 0',
              color: 'var(--text)',
              fontSize: '1.5rem'
            }}>
              {activeTab === 'accounts' 
                ? t('admin.staff.emptyStates.noAccounts')
                : t('admin.staff.emptyStates.noProfiles')
              }
            </h3>
            <p style={{ 
              color: 'var(--text-light)',
              fontSize: '1rem',
              margin: '0',
              maxWidth: '400px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              {activeTab === 'accounts' 
                ? t('admin.staff.emptyStates.noAccountsDesc')
                : t('admin.staff.emptyStates.noProfilesDesc')
              }
            </p>
            {activeTab === 'accounts' && hasPermission('manageStaff') && (
              <button 
                className="action-button" 
                onClick={handleCreateStaff}
                style={{ 
                  marginTop: '2rem',
                  background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: '500'
                }}
              >
                <FiUserPlus />
                {t('admin.staff.createAccount')}
              </button>
            )}
          </motion.div>
        ) : (
          <div className="data-list">
            {activeTab === 'accounts' && hasPermission('manageStaff') && filteredData.length > 0 && (
              <div style={{ 
                padding: '1rem', 
                background: 'var(--card-bg)', 
                borderRadius: '10px', 
                marginBottom: '1rem',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{ fontWeight: '500' }}>
                    {selectAll ? t('admin.staff.selectAll.deselectAll') : t('admin.staff.selectAll.selectAll')}
                  </span>
                </label>
                {selectedItems.size > 0 && (
                  <span style={{ color: 'var(--primary)', fontWeight: '500' }}>
                    {t('admin.staff.selectAll.selected', { count: selectedItems.size })}
                  </span>
                )}
              </div>
            )}
            <AnimatePresence>
              {filteredData.map((item, index) => (
                <Card
                  key={item.id}
                  className={activeTab === 'accounts' && hasPermission('manageStaff') ? 'selectable' : ''}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  style={{ 
                    border: selectedItems.has(item.id) ? '2px solid var(--primary)' : undefined,
                    background: selectedItems.has(item.id) ? 'rgba(224, 43, 32, 0.05)' : undefined
                  }}
                  onClick={(e) => {
                    // Ignore clicks on action buttons or inputs
                    if (e.target.closest('.action-btn') || e.target.tagName === 'INPUT') return;
                    if (activeTab === 'accounts' && hasPermission('manageStaff')) {
                      handleSelectItem(item.id);
                    }
                  }}
                >
                  <div className="card-header">
                    <div className="info">
                      {activeTab === 'accounts' ? (
                        <>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                            {/* User Avatar or Initial */}
                            <div style={{ flexShrink: 0 }}>
                              {item.profile?.avatarUrl && !imageLoadErrors[item.id] ? (
                                <img 
                                  src={getFullAvatarUrl(item.profile.avatarUrl)} 
                                  alt={`${item.username || 'User'} avatar`}
                                  style={{ 
                                    width: '45px', 
                                    height: '45px', 
                                    borderRadius: '50%', 
                                    objectFit: 'cover',
                                    border: '2px solid var(--primary)'
                                  }}
                                  onError={() => handleImageError(item.id)}
                                />
                              ) : (
                                <div style={{ 
                                  width: '45px', 
                                  height: '45px', 
                                  borderRadius: '50%', 
                                  background: item.isActive ? 'linear-gradient(135deg, var(--primary), var(--accent))' : '#9ca3af',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  fontWeight: 'bold',
                                  fontSize: '1.1rem'
                                }}>
                                  {(item.username || 'U').charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            
                            {/* Account Info */}
                            <div style={{ flex: 1 }}>
                              <h3 style={{ margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {item.username || 'Unknown User'}
                                {item.role === 'admin' && (
                                  <span style={{ 
                                    background: 'linear-gradient(135deg, #f59e0b, #d97706)', 
                                    color: 'white', 
                                    padding: '0.125rem 0.5rem', 
                                    borderRadius: '12px', 
                                    fontSize: '0.7rem',
                                    fontWeight: 'bold'
                                  }}>
                                    ADMIN
                                  </span>
                                )}
                              </h3>
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                                {item.profile ? (
                                  i18n.language === 'zh' 
                                    ? `${item.profile.name_zh || item.profile.name_en || '无姓名'} • ${item.profile.department || '无部门'}`
                                    : `${item.profile.name_en || item.profile.name_zh || 'No Name'} • ${item.profile.department || 'No Department'}`
                                ) : (i18n.language === 'zh' ? '无档案' : 'No profile')}
                              </div>
                            </div>
                          </div>
                          
                          <div className="meta">
                            <div className="meta-item">
                              <FiMail />
                              {item.email || 'No email'}
                            </div>
                            <div className="meta-item">
                              <FiKey />
                              Last login: {item.lastLogin ? new Date(item.lastLogin).toLocaleDateString() : 'Never'}
                            </div>
                            <div className={`status-badge ${item.isActive ? 'active' : 'inactive'}`}>
                              {item.isActive ? (
                                <>
                                  <FiToggleRight />
                                  Active
                                </>
                              ) : (
                                <>
                                  <FiToggleLeft />
                                  Inactive
                                </>
                              )}
                            </div>
                          </div>
                          
                          {/* Permissions Summary */}
                          <div style={{ marginTop: '0.75rem', fontSize: '0.85rem' }}>
                            <strong style={{ color: 'var(--text)' }}>Permissions:</strong>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.25rem' }}>
                              {item.role === 'admin' ? (
                                <span style={{ 
                                  background: 'rgba(245, 158, 11, 0.1)', 
                                  color: 'rgb(245, 158, 11)', 
                                  padding: '0.125rem 0.5rem', 
                                  borderRadius: '8px', 
                                  fontSize: '0.75rem',
                                  border: '1px solid rgba(245, 158, 11, 0.2)'
                                }}>
                                  管理员 (拥有所有权限)
                                </span>
                              ) : (
                                <>
                              {item.canManageEvents && (
                                <span style={{ 
                                  background: 'rgba(59, 130, 246, 0.1)', 
                                  color: 'rgb(59, 130, 246)', 
                                  padding: '0.125rem 0.5rem', 
                                  borderRadius: '8px', 
                                  fontSize: '0.75rem',
                                  border: '1px solid rgba(59, 130, 246, 0.2)'
                                }}>
                                  {t('staff.profile.permissions.manageEvents')}
                                </span>
                              )}
                              {item.canReviewProfiles && (
                                <span style={{ 
                                  background: 'rgba(16, 185, 129, 0.1)', 
                                  color: 'rgb(16, 185, 129)', 
                                  padding: '0.125rem 0.5rem', 
                                  borderRadius: '8px', 
                                  fontSize: '0.75rem',
                                  border: '1px solid rgba(16, 185, 129, 0.2)'
                                }}>
                                  {t('staff.profile.permissions.reviewProfiles')}
                                </span>
                              )}
                              {item.canManageStaff && (
                                <span style={{ 
                                  background: 'rgba(245, 158, 11, 0.1)', 
                                  color: 'rgb(245, 158, 11)', 
                                  padding: '0.125rem 0.5rem', 
                                  borderRadius: '8px', 
                                  fontSize: '0.75rem',
                                  border: '1px solid rgba(245, 158, 11, 0.2)'
                                }}>
                                  {t('staff.profile.permissions.manageStaff')}
                                </span>
                              )}
                              {!item.canManageEvents && !item.canManageStaff && !item.canReviewProfiles && (
                                <span style={{ 
                                  background: 'var(--background-alt)', 
                                  color: 'var(--text-light)', 
                                  padding: '0.125rem 0.5rem', 
                                  borderRadius: '8px', 
                                  fontSize: '0.75rem',
                                  border: '1px solid var(--border)'
                                }}>
                                  {t('admin.staff.noPermissions')}
                                </span>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                          
                          {/* Account Stats */}
                          <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-light)', display: 'flex', gap: '1rem' }}>
                            <span><strong>Created:</strong> {new Date(item.createdAt).toLocaleDateString()}</span>
                            <span><strong>Profile Status:</strong> {item.profile?.status || 'No profile'}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                            {/* Avatar */}
                            <div style={{ flexShrink: 0 }}>
                              {item.avatarUrl && !imageLoadErrors[item.id] ? (
                                <img 
                                  src={getFullAvatarUrl(item.avatarUrl)} 
                                  alt={`${item.name_en || t('staff.profile.permissions.noName')} avatar`}
                                  style={{ 
                                    width: '50px', 
                                    height: '50px', 
                                    borderRadius: '50%', 
                                    objectFit: 'cover',
                                    border: '2px solid var(--primary)',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                                  }}
                                  onError={() => handleImageError(item.id)}
                                />
                              ) : (
                                <div style={{ 
                                  width: '50px', 
                                  height: '50px', 
                                  borderRadius: '50%', 
                                  background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  fontWeight: 'bold',
                                  fontSize: '1.2rem'
                                }}>
                                  {((item.name_en || item.staff?.username || t('staff.profile.permissions.noName')) + '').charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            {/* Name and basic info */}
                            <div style={{ flex: 1 }}>
                              <h3 style={{ margin: '0 0 0.25rem 0' }}>
                                {i18n.language === 'zh' 
                                  ? `${item.name_zh || t('staff.profile.permissions.noName')} / ${item.name_en || t('staff.profile.permissions.noAltName')}`
                                  : `${item.name_en || t('staff.profile.permissions.noName')} / ${item.name_zh || t('staff.profile.permissions.noAltName')}`
                                }
                              </h3>
                            </div>
                          </div>
                          <div className="meta">
                            <div className="meta-item">
                              <FiUsers />
                              {item.staff?.username}
                            </div>
                            <div className="meta-item">
                              <FiMail />
                              {item.department}
                            </div>
                            <div className={`status-badge ${item.status || 'unknown'}`}>
                              {item.status === 'approved' && <FiCheck />}
                              {item.status === 'pending' && <FiClock />}
                              {item.status === 'rejected' && <FiX />}
                              {item.status ? (item.status + '').charAt(0).toUpperCase() + (item.status + '').slice(1) : 'Unknown'}
                            </div>
                          </div>
                          {/* Additional profile info preview */}
                          <div className="profile-preview" style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>
                            <div style={{ marginBottom: '0.25rem' }}>
                              <strong>{i18n.language === 'zh' ? '职位：' : 'Positions:'}</strong> {i18n.language === 'zh' 
                                ? `${item.position_zh || '无职位'} / ${item.position_en || 'No Position'}`
                                : `${item.position_en || 'No Position'} / ${item.position_zh || '无职位'}`
                              }
                            </div>
                            {(item.email || item.phone || item.linkedin || item.github || item.wechat || item.mbti) && (
                              <div style={{ marginBottom: '0.25rem' }}>
                                <strong>{i18n.language === 'zh' ? '联系方式：' : 'Contact:'}</strong> 
                                {item.email && <span> {item.email}</span>}
                                {item.phone && <span>{item.email ? ' | ' : ''}{item.phone}</span>}
                                {item.linkedin && <span> | <a href={item.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>{item.linkedin}</a></span>}
                                {item.github && <span> | <a href={item.github} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>{item.github}</a></span>}
                                {item.wechat && <span> | {i18n.language === 'zh' ? '微信：' : 'WeChat:'} {item.wechat}</span>}
                                {item.mbti && <span> | MBTI: {item.mbti}</span>}
                              </div>
                            )}
                            {(item.bio_en || item.bio_zh) && (
                              <div style={{ marginBottom: '0.25rem' }}>
                                <strong>{i18n.language === 'zh' ? '个人简介：' : 'Bio:'}</strong> {
                                  (() => {
                                    const bioText = item.bio_en && item.bio_zh 
                                      ? (i18n.language === 'zh' 
                                          ? `${item.bio_zh} / ${item.bio_en}`
                                          : `${item.bio_en} / ${item.bio_zh}`)
                                      : (i18n.language === 'zh' 
                                          ? (item.bio_zh || item.bio_en || t('staff.profile.permissions.noBio'))
                                          : (item.bio_en || item.bio_zh || t('staff.profile.permissions.noBio')));
                                    // 显示逻辑：超过1000字符才省略
                                    if (bioText.length > 1000) {
                                      return bioText.substring(0, 1000) + '...'; // 超长bio截断到1000字符+省略号
                                    } else {
                                      return bioText; // 其他情况显示完整bio
                                    }
                                  })()
                                }
                              </div>
                            )}
                            {item.reviewNote && (
                              <div style={{ marginBottom: '0.25rem' }}>
                                <strong style={{ color: '#8b5cf6' }}>{i18n.language === 'zh' ? '审核备注：' : 'Review Note:'} </strong> 
                                <span style={{ color: '#8b5cf6', fontStyle: 'italic' }}>
                                  {item.reviewNote.length > 80 ? `${item.reviewNote.substring(0, 80)}...` : item.reviewNote}
                                </span>
                              </div>
                            )}
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
                              <strong>{i18n.language === 'zh' ? '最后更新：' : 'Last Updated:'}</strong> {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : (i18n.language === 'zh' ? '不可用' : 'Not available')}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="actions">
                      {activeTab === 'accounts' ? (
                        <>
                          <button 
                            className="action-btn edit"
                            onClick={() => handleEditStaff(item)}
                            title="Edit Account & Permissions"
                          >
                            <FiEdit />
                          </button>
                          <button 
                            className="action-btn secondary"
                            onClick={() => handleResetPassword(item)}
                            title="Reset Password"
                          >
                            <FiKey />
                          </button>
                          <button 
                            className="action-btn toggle"
                            onClick={() => handleToggleAccount(item)}
                            title={item.isActive ? "Deactivate Account" : "Activate Account"}
                          >
                            {item.isActive ? <FiToggleLeft /> : <FiToggleRight />}
                          </button>
                          <button 
                            className="action-btn delete"
                            onClick={() => handleDeleteStaff(item.id)}
                            title="Delete Staff"
                          >
                            <FiTrash2 />
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            className="action-btn view"
                            onClick={() => handleReviewProfile(item)}
                            title="Review Profile"
                          >
                            <FiEye />
                          </button>
                          {item.status === 'pending' && (
                            <>
                              <button 
                                className="action-btn approve"
                                onClick={() => handleQuickReview(item.id, 'approved')}
                                title="Approve"
                              >
                                <FiCheck />
                              </button>
                              <button 
                                className="action-btn reject"
                                onClick={() => handleQuickReview(item.id, 'rejected')}
                                title="Reject"
                              >
                                <FiX />
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </AnimatePresence>
          </div>
        )}

        <AnimatePresence>
          {showModal && (
            <Modal
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              isReviewModal={modalType === 'review'}
            >
              <motion.div
                className="modal-content"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h3>
                    {modalType === 'create' && t('admin.staff.modal.create')}
                    {modalType === 'edit' && t('admin.staff.modal.edit')}
                    {modalType === 'review' && t('admin.staff.modal.review')}
                  </h3>
                  <button className="close-btn" onClick={() => setShowModal(false)}>
                    <FiX />
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  {(modalType === 'create' || modalType === 'edit') && (
                    <>
                      <div className="form-group">
                        <label>{t('admin.staff.form.username')}</label>
                        <input
                          type="text"
                          value={formData.username}
                          onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                          placeholder="留空则自动从邮箱生成"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>{t('admin.staff.form.email')}<span style={{ color: 'var(--primary)' }}>*</span></label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                      
                      {modalType === 'create' && (
                        <div className="form-group">
                          <label>{t('admin.staff.form.password')}</label>
                          <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                          />
                        </div>
                      )}
                      
                      <div className="form-group">
                        <label>{t('admin.staff.form.role')}</label>
                        <select
                          value={formData.role}
                          onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                        >
                          <option value="staff">{t('admin.staff.form.roles.staff')}</option>
                          <option value="admin">{t('admin.staff.form.roles.admin')}</option>
                        </select>
                      </div>
                      
                      <div className="form-group checkbox-group">
                        <label>
                          <input
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                          />
                          {t('admin.staff.form.active')}
                        </label>
                      </div>
                      
                      {/* Permissions Section */}
                      <div className="permissions-section" style={{ 
                        marginTop: '1.5rem', 
                        padding: '1rem', 
                        background: 'var(--background-alt)', 
                        borderRadius: '10px',
                        border: '1px solid var(--border)'
                      }}>
                        <h4 style={{ margin: '0 0 1rem 0', color: 'var(--primary)' }}>Permissions</h4>
                        
                        <div className="form-group checkbox-group">
                          <label>
                            <input
                              type="checkbox"
                              checked={formData.canManageEvents || false}
                              onChange={(e) => setFormData(prev => ({ ...prev, canManageEvents: e.target.checked }))}
                            />
                            <strong>{t('staff.profile.permissions.manageEvents')}</strong> - {t('staff.profile.permissions.manageEventsDesc')}
                          </label>
                        </div>
                        
                        <div className="form-group checkbox-group">
                          <label>
                            <input
                              type="checkbox"
                              checked={formData.canReviewProfiles || false}
                              onChange={(e) => setFormData(prev => ({ ...prev, canReviewProfiles: e.target.checked }))}
                            />
                            <strong>{t('staff.profile.permissions.reviewProfiles')}</strong> - {t('staff.profile.permissions.reviewProfilesDesc')}
                          </label>
                        </div>
                        
                        <div className="form-group checkbox-group">
                          <label>
                            <input
                              type="checkbox"
                              checked={formData.canManageStaff || false}
                              onChange={(e) => setFormData(prev => ({ ...prev, canManageStaff: e.target.checked }))}
                            />
                            <strong>{t('staff.profile.permissions.manageStaff')}</strong> - {t('staff.profile.permissions.manageStaffDesc')}
                          </label>
                        </div>
                      </div>
                      
                      {/* Team Display Order - Only for admin */}
                      {modalType === 'edit' && (user?.role === 'admin' || hasPermission('manageStaff')) && (
                        <div className="display-order-section" style={{ 
                          marginTop: '1.5rem', 
                          padding: '1rem', 
                          background: 'var(--background-alt)', 
                          borderRadius: '10px',
                          border: '1px solid var(--border)'
                        }}>
                          <h4 style={{ margin: '0 0 1rem 0', color: 'var(--primary)' }}>
                            {t('admin.staff.form.displayOrder')}
                          </h4>
                          
                          <div className="form-group">
                            <label>
                              <small style={{ color: 'var(--text-light)', display: 'block', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                                {t('admin.staff.form.displayOrderDesc')}
                              </small>
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="999"
                              value={formData.displayOrder}
                              onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
                              placeholder="0"
                              style={{
                                padding: '0.75rem',
                                border: '2px solid #e5e7eb',
                                borderRadius: '10px',
                                background: 'white',
                                color: 'var(--text)',
                                fontSize: '1rem',
                                transition: 'all 0.3s ease',
                                width: '150px'
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {modalType === 'edit' && (
                    <>
                      <h4 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--primary)' }}>Profile Details</h4>
                      <div className="form-group">
                        <label>English Name</label>
                        <input type="text" value={formData.name_en || ''} onChange={(e)=>setFormData(prev=>({...prev,name_en:e.target.value}))} />
                      </div>
                      <div className="form-group">
                        <label>Chinese Name</label>
                        <input type="text" value={formData.name_zh || ''} onChange={(e)=>setFormData(prev=>({...prev,name_zh:e.target.value}))} />
                      </div>
                      <div className="form-group">
                        <label>English Position</label>
                        <input type="text" value={formData.position_en || ''} onChange={(e)=>setFormData(prev=>({...prev,position_en:e.target.value}))} />
                      </div>
                      <div className="form-group">
                        <label>Chinese Position</label>
                        <input type="text" value={formData.position_zh || ''} onChange={(e)=>setFormData(prev=>({...prev,position_zh:e.target.value}))} />
                      </div>
                      <div className="form-group">
                        <label>Department</label>
                        <select value={formData.department || ''} onChange={(e)=>setFormData(prev=>({...prev,department:e.target.value}))}>
                          <option value="">Select Department</option>
                          <option value="ARTS & CULTURE GROUP">Arts & Culture Group</option>
                          <option value="CAREER & ACADEMIC GROUP">Career & Academic Group</option>
                          <option value="OPERATION GROUP">Operation Group</option>
                          <option value="SUPPORT GROUP">Support Group</option>
                          <option value="ENGAGEMENT">Engagement</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>English Bio</label>
                        <textarea value={formData.bio_en || ''} onChange={(e)=>setFormData(prev=>({...prev,bio_en:e.target.value}))} />
                      </div>
                      <div className="form-group">
                        <label>Chinese Bio</label>
                        <textarea value={formData.bio_zh || ''} onChange={(e)=>setFormData(prev=>({...prev,bio_zh:e.target.value}))} />
                      </div>
                      <div className="form-group">
                        <label>Contact Email</label>
                        <input type="email" value={formData.profileEmail || ''} onChange={(e)=>setFormData(prev=>({...prev,profileEmail:e.target.value}))} />
                      </div>
                      <div className="form-group">
                        <label>Phone</label>
                        <input type="text" value={formData.phone || ''} onChange={(e)=>setFormData(prev=>({...prev,phone:e.target.value}))} />
                      </div>
                      <div className="form-group">
                        <label>LinkedIn</label>
                        <input type="text" value={formData.linkedin || ''} onChange={(e)=>setFormData(prev=>({...prev,linkedin:e.target.value}))} />
                      </div>
                      <div className="form-group">
                        <label>GitHub</label>
                        <input type="text" value={formData.github || ''} onChange={(e)=>setFormData(prev=>({...prev,github:e.target.value}))} />
                      </div>
                      <div className="form-group">
                        <label>WeChat</label>
                        <input type="text" value={formData.wechat || ''} onChange={(e)=>setFormData(prev=>({...prev,wechat:e.target.value}))} />
                      </div>
                      <div className="form-group">
                        <label>Display Order</label>
                        <input type="number" value={formData.displayOrder || 0} onChange={(e)=>setFormData(prev=>({...prev,displayOrder:parseInt(e.target.value)}))} />
                      </div>
                    </>
                  )}

                  {modalType === 'review' && selectedItem && (
                    <>
                      {/* Profile Information Display */}
                      <div className="profile-review-section">
                        <h4 style={{ marginBottom: '1rem', color: 'var(--primary)', borderBottom: '2px solid var(--primary)', paddingBottom: '0.5rem' }}>
                          {i18n.language === 'zh' ? '资料预览' : 'Profile Information'}
                        </h4>
                        {/* Avatar */}
                        {selectedItem.avatarUrl && !imageLoadErrors[selectedItem.id] && (
                          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <img
                              src={getFullAvatarUrl(selectedItem.avatarUrl)}
                              alt="Profile Avatar"
                              style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '3px solid var(--primary)'
                              }}
                              onError={() => handleImageError(selectedItem.id)}
                            />
                          </div>
                        )}

                        {/* Basic Information Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                          <div className="info-item">
                            <strong>{i18n.language === 'zh' ? '英文姓名：' : 'English Name:'}</strong>
                            <div style={{ padding: '0.5rem', background: 'var(--background-alt)', borderRadius: '5px', marginTop: '0.25rem' }}>
                              {selectedItem.name_en || t('staff.profile.permissions.notProvided')}
                            </div>
                          </div>
                          <div className="info-item">
                            <strong>{i18n.language === 'zh' ? '中文姓名：' : 'Chinese Name:'}</strong>
                            <div style={{ padding: '0.5rem', background: 'var(--background-alt)', borderRadius: '5px', marginTop: '0.25rem' }}>
                              {selectedItem.name_zh || t('staff.profile.permissions.notProvided')}
                            </div>
                          </div>
                          <div className="info-item">
                            <strong>{i18n.language === 'zh' ? '英文职位：' : 'English Position:'}</strong>
                            <div style={{ padding: '0.5rem', background: 'var(--background-alt)', borderRadius: '5px', marginTop: '0.25rem' }}>
                              {selectedItem.position_en || t('staff.profile.permissions.notProvided')}
                            </div>
                          </div>
                          <div className="info-item">
                            <strong>{i18n.language === 'zh' ? '中文职位：' : 'Chinese Position:'}</strong>
                            <div style={{ padding: '0.5rem', background: 'var(--background-alt)', borderRadius: '5px', marginTop: '0.25rem' }}>
                              {selectedItem.position_zh || t('staff.profile.permissions.notProvided')}
                            </div>
                          </div>
                          <div className="info-item">
                            <strong>{i18n.language === 'zh' ? '部门：' : 'Department:'}</strong>
                            <div style={{ padding: '0.5rem', background: 'var(--background-alt)', borderRadius: '5px', marginTop: '0.25rem' }}>
                              {selectedItem.department || t('staff.profile.permissions.notProvided')}
                            </div>
                          </div>
                          <div className="info-item">
                            <strong>{i18n.language === 'zh' ? '用户名：' : 'Username:'}</strong>
                            <div style={{ padding: '0.5rem', background: 'var(--background-alt)', borderRadius: '5px', marginTop: '0.25rem' }}>
                              {selectedItem.staff?.username || (i18n.language === 'zh' ? '未知' : 'Not available')}
                            </div>
                          </div>
                        </div>

                        {/* Contact Information Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                          <div className="info-item">
                            <strong>Email:</strong>
                            <div style={{ padding: '0.5rem', background: 'var(--background-alt)', borderRadius: '5px', marginTop: '0.25rem' }}>
                              {selectedItem.email || t('staff.profile.permissions.notProvided')}
                            </div>
                          </div>
                          <div className="info-item">
                            <strong>{i18n.language === 'zh' ? '电话：' : 'Phone:'}</strong>
                            <div style={{ padding: '0.5rem', background: 'var(--background-alt)', borderRadius: '5px', marginTop: '0.25rem' }}>
                              {selectedItem.phone || t('staff.profile.permissions.notProvided')}
                            </div>
                          </div>
                          <div className="info-item" style={{ gridColumn: '1 / -1' }}>
                            <strong>LinkedIn:</strong>
                            <div style={{ padding: '0.5rem', background: 'var(--background-alt)', borderRadius: '5px', marginTop: '0.25rem' }}>
                              {selectedItem.linkedin ? (
                                <a href={selectedItem.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>
                                  {selectedItem.linkedin}
                                </a>
                              ) : t('staff.profile.permissions.notProvided')}
                            </div>
                          </div>
                          <div className="info-item">
                            <strong>GitHub:</strong>
                            <div style={{ padding: '0.5rem', background: 'var(--background-alt)', borderRadius: '5px', marginTop: '0.25rem' }}>
                              {selectedItem.github ? (
                                <a href={selectedItem.github} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>
                                  {selectedItem.github}
                                </a>
                              ) : t('staff.profile.permissions.notProvided')}
                            </div>
                          </div>
                          <div className="info-item">
                            <strong>{i18n.language === 'zh' ? '微信：' : 'WeChat:'}</strong>
                            <div style={{ padding: '0.5rem', background: 'var(--background-alt)', borderRadius: '5px', marginTop: '0.25rem' }}>
                              {selectedItem.wechat || t('staff.profile.permissions.notProvided')}
                            </div>
                          </div>
                        </div>

                        {/* Bio Information */}
                        <div style={{ marginBottom: '1.5rem' }}>
                          <div className="info-item" style={{ marginBottom: '1rem' }}>
                            <strong>{i18n.language === 'zh' ? '英文简介：' : 'English Bio:'}</strong>
                            <div style={{ padding: '0.75rem', background: 'var(--background-alt)', borderRadius: '5px', marginTop: '0.25rem', minHeight: '60px', whiteSpace: 'pre-wrap' }}>
                              {selectedItem.bio_en || t('staff.profile.permissions.noBio')}
                            </div>
                          </div>
                          <div className="info-item">
                            <strong>{i18n.language === 'zh' ? '中文简介：' : 'Chinese Bio:'}</strong>
                            <div style={{ padding: '0.75rem', background: 'var(--background-alt)', borderRadius: '5px', marginTop: '0.25rem', minHeight: '60px', whiteSpace: 'pre-wrap' }}>
                              {selectedItem.bio_zh || t('staff.profile.permissions.noBio')}
                            </div>
                          </div>
                        </div>

                        {/* Timestamps */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>
                          <div>
                            <strong>{i18n.language === 'zh' ? '创建时间：' : 'Created:'}</strong> {selectedItem.createdAt ? new Date(selectedItem.createdAt).toLocaleString() : (i18n.language === 'zh' ? '不可用' : 'Not available')}
                          </div>
                          <div>
                            <strong>{i18n.language === 'zh' ? '更新时间：' : 'Updated:'}</strong> {selectedItem.updatedAt ? new Date(selectedItem.updatedAt).toLocaleString() : (i18n.language === 'zh' ? '不可用' : 'Not available')}
                          </div>
                        </div>
                      </div>

                      {/* Review Controls */}
                      <div className="review-controls-section" style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                        <h4 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>
                          {i18n.language === 'zh' ? '审核操作' : 'Review Actions'}
                        </h4>

                        <div className="form-group">
                          <label>{t('admin.staff.form.status')}</label>
                          <select
                            value={formData.status}
                            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                          >
                            <option value="pending">{t('admin.staff.form.statuses.pending')}</option>
                            <option value="rejected">{t('admin.staff.form.statuses.rejected')}</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label>{t('admin.staff.form.reviewNote')}</label>
                          <textarea
                            value={formData.reviewNote}
                            onChange={(e) => setFormData(prev => ({ ...prev, reviewNote: e.target.value }))}
                            placeholder={t('admin.staff.form.reviewNotePlaceholder')}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="form-actions">
                    <button type="button" className="btn secondary" onClick={() => setShowModal(false)}>
                      {t('admin.staff.form.buttons.cancel')}
                    </button>
                    <button type="submit" className="btn primary">
                      {modalType === 'create' && t('admin.staff.form.buttons.create')}
                      {modalType === 'edit' && t('admin.staff.form.buttons.update')}
                      {modalType === 'review' && t('admin.staff.form.buttons.save')}
                    </button>
                  </div>
                </form>
              </motion.div>
            </Modal>
          )}
        </AnimatePresence>
      </div>
    </StyledStaffAdmin>
  );
};

export default StaffAdmin; 