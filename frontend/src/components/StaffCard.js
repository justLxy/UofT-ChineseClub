import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiMail, FiPhone, FiLinkedin, FiUsers, FiGithub, FiUser } from 'react-icons/fi';
import { MdVerified } from 'react-icons/md';
import { FaWeixin } from 'react-icons/fa';
import { getFullAvatarUrl } from '../utils/api';
import QRCode from 'react-qr-code';

const DigitalBusinessCard = styled(motion.div)`
  border-radius: 24px;
  background: var(--card-bg);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border);
  position: relative;
  overflow: hidden;
  padding: 2.5rem;
  width: 100%;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 20px;
  }
  
  .card-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('/logo.png');
    background-repeat: no-repeat;
    background-position: 80% 5%;
    background-size: 200px;
    opacity: 0.05;
    transition: all 0.5s ease;
    
    @media (max-width: 768px) {
      background-position: 105% 95%;
      background-size: 150px;
      transform: rotate(15deg);
    }
  }
  
  &:hover .card-bg {
    opacity: 0.1;
    transform: scale(1.1) rotate(-5deg);
  }
  
  [data-theme="dark"] & {
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
    
    .card-bg {
      opacity: 0.08;
    }
    
    &:hover .card-bg {
      opacity: 0.15;
    }
  }
`;

const CardContent = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.2rem;
    text-align: center;
  }
  
  .avatar-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4rem;
    flex-shrink: 0;
    
    @media (max-width: 768px) {
      flex-direction: row;
      gap: 1.5rem;
      justify-content: center;
    }
  }
  
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid var(--primary);
    box-shadow: 0 8px 25px rgba(224, 43, 32, 0.2);
    flex-shrink: 0;
  }

  .placeholder {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary), var(--accent));
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 2.5rem;
    font-weight: bold;
    border: 4px solid rgba(255,255,255,0.3);
    box-shadow: 0 8px 25px rgba(224, 43, 32, 0.2);
    flex-shrink: 0;
  }

  .qr-code {
    background: white;
    padding: 8px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
  }

  .identity {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: -0.5rem;
    align-items: flex-start;
    text-align: left;
    
    @media (max-width: 768px) {
      align-items: center;
      text-align: center;
    }
    
    .name-section {
      h2 {
        margin: 0 0 0.25rem 0;
        color: var(--text);
        font-size: 2rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        
        @media (max-width: 768px) {
          font-size: 1.7rem;
          justify-content: center;
        }
        
        .verification-icon {
          font-size: 1.3rem;
          position: relative;
          top: 2px;
          transition: all 0.3s ease;
          margin-left: 0.3rem;
          
          &.verified {
            color: #1DA1F2; /* Twitter blue */
            filter: drop-shadow(0 1px 3px rgba(29, 161, 242, 0.4));
          }
          
          &.unverified {
            color: #9CA3AF; /* Gray */
            opacity: 0.5;
          }
          
          &:hover {
            transform: scale(1.05);
            filter: brightness(1.1);
          }
        }
      }
      
      .alt-name {
        color: var(--text-light);
        font-size: 1.1rem;
        font-weight: 500;
        opacity: 0.8;
      }
    }
    
    .position-section {
      .position {
        margin: 0 0 0.5rem 0;
        color: var(--primary);
        font-size: 1.1rem;
        font-weight: 600;
      }
      
      .department-tag {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: linear-gradient(135deg, rgba(224, 43, 32, 0.1), rgba(252, 185, 0, 0.1));
        color: var(--primary);
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 500;
        border: 1px solid rgba(224, 43, 32, 0.2);
        
        .dept-icon {
          font-size: 1rem;
        }
      }
    }
  }
`;

const PersonalInfo = styled.div`
  margin-top: 1rem;
  
  .bio {
    color: var(--text);
    font-size: 0.95rem;
    line-height: 1.5;
    margin: 0;
    max-width: 100%;
    white-space: pre-wrap;
    
    &.no-bio {
      color: var(--text-light);
      font-style: italic;
    }
  }
`;

const CardFooter = styled.div`
  border-top: 2px solid var(--border);
  padding-top: 1.5rem;
  
  .contact-info {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 1.5rem;
    
    .contact-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-light);
      font-size: 0.9rem;
      
      .icon {
        color: var(--primary);
        font-size: 1rem;
        flex-shrink: 0;
      }
      
      span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  
  @media (max-width: 768px) {
    .contact-info {
      flex-direction: column;
      gap: 1rem;
    }
  }
`;

const StaffCard = ({ staff }) => {
  const { t, i18n } = useTranslation();
  
  const { 
    name_en,
    name_zh, 
    position_en,
    position_zh,
    department,
    bio_en,
    bio_zh,
    avatarUrl, 
    email,
    linkedin,
    github,
    wechat,
    phone,
    mbti,
    status,
    username
  } = staff;

  const displayName = i18n.language === 'zh' ? name_zh : name_en;
  const displayPosition = i18n.language === 'zh' ? position_zh : position_en;
  const displayBio = i18n.language === 'zh' ? bio_zh : bio_en;
  const alternativeName = i18n.language === 'zh' ? name_en : name_zh;

  // Process avatar URL to get full path
  const processedAvatarUrl = getFullAvatarUrl(avatarUrl);

  // Generate link for QR code (shareable business card link)
  const cardLink = username 
    ? `${window.location.origin}/team/${username}?lang=${i18n.language}` 
    : window.location.href;

  return (
    <DigitalBusinessCard
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="card-bg"></div>
      <CardContent>
        <CardHeader>
          <div className="avatar-section">
            {processedAvatarUrl ? (
              <img src={processedAvatarUrl} alt="Avatar" className="avatar" />
            ) : (
              <div className="placeholder">
                {displayName?.charAt(0).toUpperCase()}
              </div>
            )}
            {/* QR Code below avatar */}
            {username && (
              <div className="qr-code" title="Scan to view profile">
                <QRCode value={cardLink} size={84} fgColor="#e02b20" bgColor="transparent" level="H" />
              </div>
            )}
          </div>
          <div className="identity">
            <div className="name-section">
              <h2>
                {displayName}
                <MdVerified 
                  className={`verification-icon ${status === 'approved' ? 'verified' : 'unverified'}`}
                  title={status === 'approved' ? t('staff.profile.verified') : t('staff.profile.unverified')}
                />
              </h2>
              {alternativeName && alternativeName !== displayName && (
                <span className="alt-name">{alternativeName}</span>
              )}
            </div>
            
            <div className="position-section">
              <p className="position">{displayPosition}</p>
              
              {department && (
                <div className="department-tag">
                  <FiUsers className="dept-icon" />
                  <span>{department}</span>
                </div>
              )}
            </div>
            
            <PersonalInfo>
              {displayBio ? (
                <p className="bio">{displayBio}</p>
              ) : (
                <p className="bio no-bio">No bio available</p>
              )}
            </PersonalInfo>
          </div>
        </CardHeader>
        
        <CardFooter>
          <div className="contact-info">
            {email && (
              <div className="contact-item">
                <FiMail className="icon" />
                <span>{email}</span>
              </div>
            )}
            {phone && (
              <div className="contact-item">
                <FiPhone className="icon" />
                <span>{phone}</span>
              </div>
            )}
            {linkedin && (
              <div className="contact-item">
                <FiLinkedin className="icon" />
                <span>LinkedIn</span>
              </div>
            )}
            {github && (
              <div className="contact-item">
                <FiGithub className="icon" />
                <span>GitHub</span>
              </div>
            )}
            {wechat && (
              <div className="contact-item">
                <FaWeixin className="icon" />
                <span>WeChat: {wechat}</span>
              </div>
            )}
            {mbti && (
              <div className="contact-item">
                <FiUser className="icon" />
                <span>MBTI: {mbti}</span>
              </div>
            )}
          </div>
        </CardFooter>
      </CardContent>
    </DigitalBusinessCard>
  );
};

export default StaffCard; 