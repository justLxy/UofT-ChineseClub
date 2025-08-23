import React, { useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUser, FiLock, FiEye, FiEyeOff, FiMail, FiClock } from 'react-icons/fi';
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
  max-width: 480px;
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

const TabContainer = styled.div`
  display: flex;
  margin: 0 2rem 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 4px;
  position: relative;
`;

const Tab = styled.button`
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  background: ${props => props.active ? 'white' : 'transparent'};
  color: ${props => props.active ? 'var(--primary)' : 'var(--text-light)'};
  font-weight: ${props => props.active ? '600' : '500'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  position: relative;
  z-index: 1;
  
  ${props => props.active && `
    box-shadow: 0 2px 8px rgba(224, 43, 32, 0.15);
  `}
  
  &:hover {
    ${props => props.active ? `
      background: white;
      color: var(--primary);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(224, 43, 32, 0.2);
    ` : `
      color: var(--primary);
      background: rgba(224, 43, 32, 0.05);
    `}
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
      font-size: 0.95rem;
      
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
        z-index: 2;
        
        &:hover {
          color: var(--primary);
          background: rgba(224, 43, 32, 0.1);
        }
      }
      
      .verification-code-btn {
        position: absolute;
        right: 0.5rem;
        top: 50%;
        transform: translateY(-50%);
        background: var(--primary);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        font-size: 0.85rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        z-index: 2;
        min-width: 80px;
        
        &:hover:not(:disabled) {
          transform: translateY(-50%) scale(1.02);
          box-shadow: 
            0 4px 12px rgba(224, 43, 32, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          filter: brightness(1.05);
        }
        
        &:disabled {
          background: #ccc;
          cursor: not-allowed;
          transform: translateY(-50%);
        }
      }
    }
    
    .composite-email-input {
      position: relative;
      display: flex;
      align-items: center;
      background: #f9fafb;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      overflow: hidden;
      
      /* 移除hover效果，只保留focus-within */
      &:focus-within {
        border-color: var(--primary);
        background: white;
        box-shadow: 0 0 0 3px rgba(224, 43, 32, 0.1);
        
        .email-suffix {
          color: var(--text);
        }
      }
      
      .email-prefix-wrapper {
        position: relative;
        flex: 2; /* 增加前缀区域的占用比例 */
        min-width: 120px; /* 提高最小宽度 */
        display: flex;
        align-items: center;
        height: 3.5rem;
        
        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-light);
          z-index: 1;
          pointer-events: none;
          transition: color 0.2s ease;
        }
        
        .email-prefix-input {
          flex: 1;
          min-width: 80px; /* 增加最小宽度 */
          padding: 1rem 0.5rem 1rem 3rem;
          border: none;
          background: transparent;
          font-size: 1rem;
          color: var(--text);
          box-sizing: border-box;
          
          /* 确保没有任何hover或focus边框效果 */
          &:focus {
            outline: none;
            border: none;
            box-shadow: none;
          }
          
          &:hover {
            border: none;
            box-shadow: none;
          }
          
          &::placeholder {
            color: #9ca3af;
            font-size: 0.95rem;
          }
        }
        
        .email-suffix {
          color: #9ca3af;
          font-size: 1rem;
          padding-right: 1rem;
          white-space: nowrap;
          pointer-events: none;
          user-select: none;
          font-weight: 400;
          transition: color 0.2s ease;
          line-height: 1;
          flex-shrink: 0; /* 防止后缀被压缩 */
        }
      }
      
      .verification-code-btn {
        background: var(--primary);
        color: white;
        border: none;
        border-left: 1px solid rgba(229, 231, 235, 0.5);
        padding: 0.875rem 1rem;
        font-size: 0.85rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        min-width: 90px;
        height: 3.5rem;
        flex-shrink: 0; /* 防止按钮被压缩 */
        
        &:hover:not(:disabled) {
          transform: scale(1.02);
          box-shadow: 
            0 4px 12px rgba(224, 43, 32, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          filter: brightness(1.05);
        }
        
        &:disabled {
          background: #d1d5db;
          cursor: not-allowed;
          opacity: 0.6;
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
      }
      
      &.has-toggle {
        padding-right: 3rem;
      }
      
      &.has-button {
        padding-right: 100px;
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
    
    .success-message {
      margin-top: 0.5rem;
      color: #10b981;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    
    .email-domain-hint {
      margin-top: 0.5rem;
      padding: 0.75rem;
      background: linear-gradient(135deg, #fef3c7, #fde68a);
      border: 1px solid #f59e0b;
      border-radius: 8px;
      font-size: 0.8rem;
      color: #92400e;
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      line-height: 1.4;
      
      .hint-icon {
        color: #f59e0b;
        margin-top: 0.1rem;
        font-size: 0.9rem;
        flex-shrink: 0;
      }
      
      span {
        font-weight: 500;
      }
    }
    
    .username-display {
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1rem 1rem 3rem;
      background: #f0f9ff;
      border: 2px solid #bfdbfe;
      border-radius: 12px;
      
      .input-icon {
        position: absolute;
        left: 1rem;
        color: #3b82f6;
      }
      
      .auto-username {
        font-weight: 600;
        color: #1e40af;
        font-size: 1rem;
      }
      
      .auto-text {
        color: #6b7280;
        font-size: 0.8rem;
        margin-left: auto;
      }
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
  
  .toggle-mode {
    text-align: center;
    margin-top: 1.5rem;
    
    button {
      background: none;
      border: none;
      color: var(--primary);
      cursor: pointer;
      font-size: 0.9rem;
      text-decoration: underline;
      transition: color 0.2s ease;
      
      &:hover {
        color: var(--accent);
      }
    }
  }
`;

const UnifiedLoginModal = ({ isOpen, onClose, onSuccess }) => {
  const { login, loginWithEmail, register, sendVerificationCode } = useAuth();
  const { t } = useTranslation();
  
  const [activeTab, setActiveTab] = useState('password'); // 'password', 'email', 'register'
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    email: '',
    emailPrefix: '', // 邮箱前缀（仅用于注册）
    username: '',
    verificationCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);

  // 重置表单数据
  const resetForm = useCallback(() => {
    setFormData({
      identifier: '',
      password: '',
      email: '',
      emailPrefix: '',
      username: '',
      verificationCode: ''
    });
    setError('');
    setSuccess('');
    setCountdown(0);
  }, []);

  // 切换标签页时重置表单
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    resetForm();
  }, [resetForm]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      
      if (name === 'email' && activeTab === 'register' && value) {
        const emailParts = value.split('@');
        if (emailParts.length > 0 && emailParts[0]) {
          newData.username = emailParts[0];
        }
      }
      
      return newData;
    });
    // Clear messages when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  }, [error, success, activeTab]);

  // 验证邮箱域名
  // const validateEmailDomain = (email) => {
  //   const allowedDomain = '@mail.utoronto.ca';
  //   return email.toLowerCase().endsWith(allowedDomain);
  // };

  // 发送验证码
  const handleSendCode = useCallback(async () => {
    const email = formData.email;
    if (!email) {
      setError(t('email.error.required'));
      return;
    }

    // 对于注册，检查邮箱域名限制
    // if (activeTab === 'register' && !validateEmailDomain(email)) {
    //   setError(t('email.error.domainNotAllowed'));
    //   return;
    // }

    setIsSendingCode(true);
    setError('');

    try {
      const purpose = activeTab === 'register' ? 'register' : 'login';
      await sendVerificationCode(email, purpose);
      setSuccess(t('email.verification.sent'));
      
      // 开始倒计时
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Send code error:', error);
      setError(error.response?.data?.error || t('email.error.sendFailed'));
    } finally {
      setIsSendingCode(false);
    }
  }, [formData.email, activeTab, sendVerificationCode, t]);

  // 密码登录
  const handlePasswordLogin = useCallback(async (e) => {
    e.preventDefault();
    
    if (!formData.identifier || !formData.password) {
      setError(t('login.error.required'));
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await login(formData.identifier, formData.password);
      onSuccess && onSuccess(response);
      onClose();
      resetForm();
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.error || t('login.error.failed'));
    } finally {
      setIsLoading(false);
    }
  }, [formData.identifier, formData.password, login, onSuccess, onClose, resetForm, t]);

  // 邮箱验证码登录
  const handleEmailLogin = useCallback(async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.verificationCode) {
      setError(t('email.error.required'));
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await loginWithEmail(formData.email, formData.verificationCode);
      onSuccess && onSuccess(response);
      onClose();
      resetForm();
    } catch (error) {
      console.error('Email login error:', error);
      setError(error.response?.data?.error || t('email.error.loginFailed'));
    } finally {
      setIsLoading(false);
    }
  }, [formData.email, formData.verificationCode, loginWithEmail, onSuccess, onClose, resetForm, t]);

  // 注册
  const handleRegister = useCallback(async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.verificationCode || !formData.username || !formData.password) {
      setError(t('register.error.required'));
      return;
    }

    if (formData.password.length < 6) {
      setError(t('register.error.passwordTooShort'));
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await register(formData.email, formData.username, formData.password, formData.verificationCode);
      setSuccess(t('register.success'));
      
      // 注册成功后自动登录
      setTimeout(async () => {
        try {
          const loginResponse = await login(formData.email, formData.password);
          onSuccess && onSuccess(loginResponse);
          onClose();
          resetForm();
        } catch (loginError) {
          console.error('Auto login error:', loginError);
          // 注册成功但自动登录失败，切换到登录标签
          setActiveTab('password');
          setSuccess(t('register.successPleaseLogin'));
        }
      }, 1000);
      
    } catch (error) {
      console.error('Register error:', error);
      setError(error.response?.data?.error || t('register.error.failed'));
    } finally {
      setIsLoading(false);
    }
  }, [formData, register, login, onSuccess, onClose, resetForm, t]);

  const handleSubmit = useCallback((e) => {
    switch (activeTab) {
      case 'password':
        return handlePasswordLogin(e);
      case 'email':
        return handleEmailLogin(e);
      case 'register':
        return handleRegister(e);
      default:
        return handlePasswordLogin(e);
    }
  }, [activeTab, handlePasswordLogin, handleEmailLogin, handleRegister]);

  const handleClose = useCallback(() => {
    resetForm();
    setShowPassword(false);
    onClose();
  }, [onClose, resetForm]);

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

  const getSubmitButtonText = () => {
    if (isLoading) {
      switch (activeTab) {
        case 'password': return t('login.signingIn');
        case 'email': return t('email.signingIn');
        case 'register': return t('register.registering');
        default: return t('login.signingIn');
      }
    }
    
    switch (activeTab) {
      case 'password': return t('login.signIn');
      case 'email': return t('email.signIn');
      case 'register': return t('register.signUp');
      default: return t('login.signIn');
    }
  };

  const isFormValid = () => {
    switch (activeTab) {
      case 'password':
        return formData.identifier && formData.password;
      case 'email':
        return formData.email && formData.verificationCode;
      case 'register':
        return formData.email && formData.verificationCode && formData.password && formData.username;
      default:
        return false;
    }
  };

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
                <h2>
                  {activeTab === 'register' ? t('register.title') : t('login.title')}
                </h2>
                <p>
                  {activeTab === 'register' ? t('register.subtitle') : t('login.subtitle')}
                </p>
              </div>

              <TabContainer>
                <Tab 
                  active={activeTab === 'password'} 
                  onClick={() => handleTabChange('password')}
                  type="button"
                  aria-selected={activeTab === 'password'}
                >
                  {t('login.tabs.password')}
                </Tab>
                <Tab 
                  active={activeTab === 'email'} 
                  onClick={() => handleTabChange('email')}
                  type="button"
                  aria-selected={activeTab === 'email'}
                >
                  {t('login.tabs.email')}
                </Tab>
                <Tab 
                  active={activeTab === 'register'} 
                  onClick={() => handleTabChange('register')}
                  type="button"
                  aria-selected={activeTab === 'register'}
                >
                  {t('login.tabs.register')}
                </Tab>
              </TabContainer>

              <Form onSubmit={handleSubmit}>
                {activeTab === 'password' && (
                  <>
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
                          {showPassword ? <FiEye /> : <FiEyeOff />}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'email' && (
                  <>
                    <div className="form-group">
                      <label htmlFor="email">
                        {t('email.label')}
                        <span className="required">*</span>
                      </label>
                      <div className="input-wrapper">
                        <FiMail className="input-icon" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder={t('email.placeholder')}
                          disabled={isLoading}
                          className="has-button"
                        />
                        <button
                          type="button"
                          className="verification-code-btn"
                          onClick={handleSendCode}
                          disabled={isSendingCode || countdown > 0 || !formData.email}
                        >
                          {countdown > 0 ? `${countdown}s` : 
                           isSendingCode ? t('email.sending') : 
                           t('email.sendCode')}
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="verificationCode">
                        {t('email.verificationCode')}
                        <span className="required">*</span>
                      </label>
                      <div className="input-wrapper">
                        <FiClock className="input-icon" />
                        <input
                          type="text"
                          id="verificationCode"
                          name="verificationCode"
                          value={formData.verificationCode}
                          onChange={handleInputChange}
                          placeholder={t('email.verificationCodePlaceholder')}
                          disabled={isLoading}
                          maxLength={6}
                        />
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'register' && (
                  <>
                    <div className="form-group">
                      <label htmlFor="email">
                        {t('email.label')}
                        <span className="required">*</span>
                      </label>
                      <div className="input-wrapper">
                        <FiMail className="input-icon" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder={t('email.placeholder')}
                          disabled={isLoading}
                          className="has-button"
                        />
                        <button
                          type="button"
                          className="verification-code-btn"
                          onClick={handleSendCode}
                          disabled={isSendingCode || countdown > 0 || !formData.email}
                        >
                          {countdown > 0 ? `${countdown}s` : 
                           isSendingCode ? t('email.sending') : 
                           t('email.sendCode')}
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="verificationCode">
                        {t('email.verificationCode')}
                        <span className="required">*</span>
                      </label>
                      <div className="input-wrapper">
                        <FiClock className="input-icon" />
                        <input
                          type="text"
                          id="verificationCode"
                          name="verificationCode"
                          value={formData.verificationCode}
                          onChange={handleInputChange}
                          placeholder={t('email.verificationCodePlaceholder')}
                          disabled={isLoading}
                          maxLength={6}
                        />
                      </div>
                    </div>

                    {formData.username && (
                      <div className="form-group">
                        <label>
                          {t('register.username')}
                        </label>
                        <div className="username-display">
                          <FiUser className="input-icon" />
                          <span className="auto-username">{formData.username}</span>
                          <small className="auto-text">{t('register.autoGenerated')}</small>
                        </div>
                      </div>
                    )}

                    <div className="form-group">
                      <label htmlFor="password">
                        {t('register.password')}
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
                          placeholder={t('register.passwordPlaceholder')}
                          disabled={isLoading}
                          className="has-toggle"
                        />
                        <button
                          type="button"
                          className="toggle-password"
                          onClick={togglePassword}
                          disabled={isLoading}
                        >
                          {showPassword ? <FiEye /> : <FiEyeOff />}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {error && (
                  <div className="form-group">
                    <div className="error-message">
                      {error}
                    </div>
                  </div>
                )}

                {success && (
                  <div className="form-group">
                    <div className="success-message">
                      {success}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="submit-button"
                  disabled={isLoading || !isFormValid()}
                >
                  {getSubmitButtonText()}
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