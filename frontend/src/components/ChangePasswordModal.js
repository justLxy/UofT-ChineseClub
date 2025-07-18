import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiLock, FiEye, FiEyeOff, FiKey } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { changePassword } from '../utils/api';
import Portal from './Portal';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
  box-sizing: border-box;
  pointer-events: auto;
  margin: 0;
  overflow: hidden;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  position: relative;
  max-height: 90vh;
  overflow-y: auto;

  .close-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #6b7280;
    transition: color 0.3s ease;
    padding: 0.5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    
    &:hover {
      color: #374151;
      background: #f3f4f6;
    }
  }

  .modal-header {
    margin-bottom: 2rem;
    text-align: center;
    
    h2 {
      color: #1f2937;
      margin-bottom: 0.5rem;
      font-size: 1.8rem;
      font-weight: 700;
    }
    
    p {
      color: #6b7280;
      margin: 0;
      font-size: 1rem;
    }
  }

  @media (max-width: 480px) {
    margin: 1rem;
    padding: 1.5rem;
    
    .modal-header h2 {
      font-size: 1.5rem;
    }
  }
`;

const Form = styled.form`
  .form-group {
    margin-bottom: 1.5rem;
    
    label {
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
        z-index: 1;
      }
      
      .toggle-password {
        position: absolute;
        right: 1rem;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: var(--text-light);
        cursor: pointer;
        font-size: 1.1rem;
        transition: color 0.3s ease;
        
        &:hover {
          color: var(--primary);
        }
      }
    }
    
    input {
      width: 100%;
      padding: 1rem 1rem 1rem 3rem;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      font-size: 1rem;
      transition: all 0.3s ease;
      background: #f9fafb;
      
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
    
    .error-message {
      margin-top: 0.5rem;
      color: #ef4444;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
  }
  
  .password-requirements {
    margin-top: 0.5rem;
    color: #6b7280;
    font-size: 0.85rem;
    line-height: 1.4;
  }
  
  .submit-button {
    width: 100%;
    background: linear-gradient(135deg, var(--primary), var(--accent));
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    
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
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  }
  
  .success-message {
    margin-bottom: 1rem;
    color: #10b981;
    font-size: 0.9rem;
    text-align: center;
    background: #ecfdf5;
    padding: 0.75rem;
    border-radius: 8px;
    border: 1px solid #a7f3d0;
  }
`;

const ChangePasswordModal = ({ isOpen, onClose, onSuccess }) => {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    if (!formData.currentPassword) {
      setError(t('changePassword.error.currentPasswordRequired'));
      return false;
    }
    
    if (!formData.newPassword) {
      setError(t('changePassword.error.newPasswordRequired'));
      return false;
    }
    
    if (formData.newPassword.length < 6) {
      setError(t('changePassword.error.passwordTooShort'));
      return false;
    }
    
    if (!formData.confirmPassword) {
      setError(t('changePassword.error.confirmPasswordRequired'));
      return false;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError(t('changePassword.error.passwordsDoNotMatch'));
      return false;
    }
    
    if (formData.currentPassword === formData.newPassword) {
      setError(t('changePassword.error.samePassword'));
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await changePassword(formData.currentPassword, formData.newPassword);
      
      setSuccess(t('changePassword.success'));
      
      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onSuccess && onSuccess(response);
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Change password error:', error);
      setError(error.response?.data?.error || t('changePassword.error.failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isLoading) return; // Prevent closing while loading
    
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setError('');
    setSuccess('');
    setShowPasswords({
      current: false,
      new: false,
      confirm: false
    });
    onClose();
  };

  return (
    <Portal>
      <AnimatePresence>
        {isOpen && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            <ModalContent
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="close-button" 
                onClick={handleClose}
                type="button"
                disabled={isLoading}
              >
                <FiX />
              </button>

              <div className="modal-header">
                <h2>{t('changePassword.title')}</h2>
                <p>{t('changePassword.subtitle')}</p>
              </div>

              <Form onSubmit={handleSubmit}>
                {success && (
                  <div className="success-message">
                    {success}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="currentPassword">
                    {t('changePassword.currentPassword')}
                  </label>
                  <div className="input-wrapper">
                    <FiLock className="input-icon" />
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      id="currentPassword"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      placeholder={t('changePassword.currentPasswordPlaceholder')}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => togglePasswordVisibility('current')}
                      disabled={isLoading}
                    >
                      {showPasswords.current ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">
                    {t('changePassword.newPassword')}
                  </label>
                  <div className="input-wrapper">
                    <FiKey className="input-icon" />
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      placeholder={t('changePassword.newPasswordPlaceholder')}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => togglePasswordVisibility('new')}
                      disabled={isLoading}
                    >
                      {showPasswords.new ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  <div className="password-requirements">
                    {t('changePassword.passwordRequirements')}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">
                    {t('changePassword.confirmPassword')}
                  </label>
                  <div className="input-wrapper">
                    <FiLock className="input-icon" />
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder={t('changePassword.confirmPasswordPlaceholder')}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => togglePasswordVisibility('confirm')}
                      disabled={isLoading}
                    >
                      {showPasswords.confirm ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {error && (
                    <div className="error-message">
                      {error}
                    </div>
                  )}
                </div>

                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="loading-spinner" />
                      {t('changePassword.changing')}
                    </>
                  ) : (
                    <>
                      <FiKey />
                      {t('changePassword.changeButton')}
                    </>
                  )}
                </button>
              </Form>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </Portal>
  );
};

export default ChangePasswordModal; 