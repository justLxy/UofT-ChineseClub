import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUser, FiLock, FiEye, FiEyeOff, FiLogIn } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
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
  
  /* Ensure it's above everything and properly positioned */
  pointer-events: auto;
  margin: 0;
  overflow: hidden;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  width: 100%;
  max-width: 450px;
  min-width: 320px;
  position: relative;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(224, 43, 32, 0.1);
  margin: auto;
  box-sizing: border-box;
  
  /* Ensure proper centering */
  transform: none;
  
  @media (max-width: 480px) {
    margin: 1rem;
    padding: 2rem;
    max-width: calc(100vw - 2rem);
  }
  
  .modal-header {
    text-align: center;
    margin-bottom: 2rem;
    
    h2 {
      color: var(--text);
      margin-bottom: 0.5rem;
      font-size: 1.8rem;
      font-weight: 700;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    p {
      color: var(--text-light);
      font-size: 0.95rem;
    }
  }
  
  .close-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(224, 43, 32, 0.1);
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    color: var(--primary);
    z-index: 1;
    
    &:hover {
      background: var(--primary);
      color: white;
      transform: rotate(90deg);
    }
    
    svg {
      font-size: 1.2rem;
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
`;

const StaffLoginModal = ({ isOpen, onClose, onSuccess }) => {
  const { login } = useAuth();
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError(t('staff.login.error.required'));
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await login(formData.username, formData.password);
      
      // Success
      onSuccess && onSuccess(response);
      onClose();
      
      // Reset form
      setFormData({ username: '', password: '' });
    } catch (error) {
      console.error('Staff login error:', error);
      setError(error.response?.data?.error || t('staff.login.error.failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ username: '', password: '' });
    setError('');
    setShowPassword(false);
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
            >
              <FiX />
            </button>

            <div className="modal-header">
              <h2>{t('staff.login.title')}</h2>
              <p>{t('staff.login.subtitle')}</p>
            </div>

            <Form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">
                  {t('staff.login.username')}
                </label>
                <div className="input-wrapper">
                  <FiUser className="input-icon" />
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder={t('staff.login.usernamePlaceholder')}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  {t('staff.login.password')}
                </label>
                <div className="input-wrapper">
                  <FiLock className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={t('staff.login.passwordPlaceholder')}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
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
                    {t('staff.login.loggingIn')}
                  </>
                ) : (
                  <>
                    <FiLogIn />
                    {t('staff.login.loginButton')}
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

export default StaffLoginModal; 