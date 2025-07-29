import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

const BannerContainer = styled.div`
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: white;
  padding: 12px 20px;
  position: sticky;
  top: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-bottom: 3px solid #d97706;
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  
  svg {
    font-size: 16px;
  }
`;

const TextWrapper = styled.div`
  flex: 1;
  
  h4 {
    margin: 0 0 4px;
    font-size: 16px;
    font-weight: 600;
  }
  
  p {
    margin: 0;
    font-size: 14px;
    opacity: 0.9;
    line-height: 1.4;
  }
`;

const DismissButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.1);
  }
  
  svg {
    font-size: 18px;
  }
`;

const AccountStatusBanner = ({ user, onDismiss }) => {
  const { t } = useTranslation();

  // 只有未激活用户才显示横幅
  if (!user || user.isActive) {
    return null;
  }

  return (
    <BannerContainer>
      <ContentWrapper>
        <IconWrapper>
          <FiAlertTriangle />
        </IconWrapper>
        <TextWrapper>
          <h4>{t('accountStatus.notActivated.title')}</h4>
          <p>{t('accountStatus.notActivated.description')}</p>
        </TextWrapper>
      </ContentWrapper>
      {onDismiss && (
        <DismissButton onClick={onDismiss} title={t('common.dismiss')}>
          <FiX />
        </DismissButton>
      )}
    </BannerContainer>
  );
};

export default AccountStatusBanner; 