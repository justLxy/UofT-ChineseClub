import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiLock } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import Portal from './Portal';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  padding: 20px;
  pointer-events: auto;
  box-sizing: border-box;
  margin: 0;
  overflow: hidden;
`;

const ModalContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 450px;
  min-width: 320px;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
  padding: 2rem;
  margin: auto;
  box-sizing: border-box;
  transform: none;
  
  @media (max-width: 480px) {
    margin: 1rem;
    padding: 1.5rem;
    max-width: calc(100vw - 2rem);
  }
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  color: #212121;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  position: relative;
  
  svg {
    position: absolute;
    top: 50%;
    left: 1rem;
    transform: translateY(-50%);
    color: #757575;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.75rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #FF4B2B;
    box-shadow: 0 0 0 3px rgba(255, 75, 43, 0.2);
  }
`;

const Button = styled(motion.button)`
  padding: 0.875rem;
  background: linear-gradient(135deg, #FF4B2B 0%, #FF416C 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled(motion.div)`
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: 1rem;
  text-align: center;
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  
  svg {
    color: #757575;
    font-size: 16px;
  }
`;

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const modalVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  exit: { 
    opacity: 0,
    y: 20,
    transition: { duration: 0.2 }
  }
};

const AdminLoginModal = ({ isOpen, onClose, onSuccess }) => {
  const { login } = useAuth();
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) return;
    
    try {
      setLoading(true);
      setError('');
      
      // 使用AuthContext的login函数
      await login('admin', password);
      
      // 调用登录回调
      onSuccess && onSuccess();
      onClose();
      
      // 清空表单
      setPassword('');
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = t('admin.login.error.failed');
      
      if (error.response) {
        // 服务器响应了错误状态码
        errorMessage = error.response.data?.error || errorMessage;
      } else if (error.request) {
        // 请求发送但没有收到响应
        errorMessage = t('admin.login.error.serverError');
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Portal>
      <AnimatePresence>
        {isOpen && (
                    <Overlay
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          >
                      <ModalContainer
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
            <CloseButton 
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiX />
            </CloseButton>
            
            <Title>{t('admin.login.title')}</Title>
            
            <Form onSubmit={handleSubmit}>
              <InputGroup>
                <FiLock />
                <Input
                  type="password"
                  placeholder={t('admin.login.passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </InputGroup>
              
              <Button
                type="submit"
                disabled={loading || !password}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? t('admin.login.authenticating') : t('admin.login.loginButton')}
              </Button>
              
              {error && (
                <ErrorMessage
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </ErrorMessage>
              )}
            </Form>
          </ModalContainer>
        </Overlay>
      )}
    </AnimatePresence>
    </Portal>
  );
};

export default AdminLoginModal; 