import React, { useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUser, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import Portal from './Portal';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
  box-sizing: border-box;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 450px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  will-change: transform, opacity;
  
  .close-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.05);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 1;
    
    &:hover {
      background: rgba(0, 0, 0, 0.1);
      transform: scale(1.05);
    }
    
    svg {
      color: #666;
      font-size: 18px;
    }
  }
  
  .modal-header {
    text-align: center;
    padding: 2rem 2rem 1rem;
    
    h2 {
      font-size: 1.75rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    p {
      color: var(--text-light);
      font-size: 0.95rem;
      line-height: 1.5;
    }
  }
`;

const Form = styled.form`
  padding: 0 2rem 2rem;
  will-change: auto;
  
  .form-group {
    margin-bottom: 1.5rem;
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: var(--text);
      
      .required {
        color: var(--primary);
        margin-left: 2px;
      }
    }
    
    .input-wrapper {
      position: relative;
      
      .input-icon {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        color: var(--text-light);
        z-index: 1;
        pointer-events: none;
        transition: color 0.2s ease;
        
        &:hover {
          color: var(--primary);
        }
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
        padding: 0.25rem;
        border-radius: 4px;
        transition: all 0.2s ease;
        
        &:hover {
          color: var(--primary);
          background: rgba(224, 43, 32, 0.1);
        }
      }
    }
    
    input {
      width: 100%;
      padding: 1rem 1rem 1rem 3rem;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      font-size: 1rem;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      background: #f9fafb;
      box-sizing: border-box;
      
      &:focus {
        outline: none;
        border-color: var(--primary);
        background: white;
        box-shadow: 0 0 0 3px rgba(224, 43, 32, 0.1);
      }
      
      &::placeholder {
        color: #9ca3af;
        font-size: 0.95rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      &.has-toggle {
        padding-right: 3rem;
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
  }
  

`;

const UnifiedLoginModal = ({ isOpen, onClose, onSuccess }) => {
  const { login } = useAuth();
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  }, [error]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!formData.identifier || !formData.password) {
      setError(t('login.error.required'));
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await login(formData.identifier, formData.password);
      
      // Success - call the success callback
      onSuccess && onSuccess(response);
      onClose();
      
      // Reset form
      setFormData({ identifier: '', password: '' });
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.error || t('login.error.failed'));
    } finally {
      setIsLoading(false);
    }
  }, [formData.identifier, formData.password, login, onSuccess, onClose, t, error]);

  const handleClose = useCallback(() => {
    setFormData({ identifier: '', password: '' });
    setError('');
    setShowPassword(false);
    onClose();
  }, [onClose]);

  const togglePassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  // Memoize animation variants
  const overlayVariants = useMemo(() => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  }), []);

  const contentVariants = useMemo(() => ({
    initial: { opacity: 0, scale: 0.95, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 10 }
  }), []);

  return (
    <Portal>
      <AnimatePresence mode="wait">
        {isOpen && (
          <ModalOverlay
            variants={overlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={handleClose}
          >
            <ModalContent
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ 
                duration: 0.25, 
                ease: "easeOut",
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
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
                <h2>{t('login.title')}</h2>
                <p>{t('login.subtitle')}</p>
              </div>

              <Form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="identifier">
                    {t('login.identifier')}
                    <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <FiUser className="input-icon" />
                    <input
                      type="text"
                      id="identifier"
                      name="identifier"
                      value={formData.identifier}
                      onChange={handleInputChange}
                      placeholder={t('login.identifierPlaceholder')}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="password">
                    {t('login.password')}
                    <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <FiLock className="input-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder={t('login.passwordPlaceholder')}
                      disabled={isLoading}
                      className="has-toggle"
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={togglePassword}
                      disabled={isLoading}
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
                  disabled={isLoading || !formData.identifier || !formData.password}
                >
                  {isLoading ? (
                    <>
                      {t('login.signingIn')}
                    </>
                  ) : (
                    t('login.signIn')
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

export default UnifiedLoginModal; 