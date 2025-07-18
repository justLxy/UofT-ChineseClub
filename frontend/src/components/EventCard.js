import React, { memo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiCalendar, FiMapPin, FiExternalLink } from 'react-icons/fi';
import { formatEventDateTime } from '../utils/dateUtils';
import { BASE_URL } from '../utils/api';

const Card = styled(motion.div)`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  background: var(--background);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transform-style: preserve-3d;
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.4s ease, background-color 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
  
  [data-theme="dark"] & {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    
    &:hover {
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }
  }
`;

const FeaturedBadge = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 5px 15px rgba(var(--primary-rgb), 0.3);
  z-index: 10;
`;

const StatusBadge = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  background: ${props => {
    switch (props.status) {
      case 'past':
        return 'linear-gradient(135deg, #434343, #000000)';
      case 'ongoing':
        return 'linear-gradient(135deg, #00B09B, #96C93D)';
      case 'upcoming':
        return 'linear-gradient(135deg, #4776E6, #8E54E9)';
      default:
        return 'linear-gradient(135deg, #4776E6, #8E54E9)';
    }
  }};
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  z-index: 10;
  min-width: 80px;
  text-align: center;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  transition: transform 0.8s cubic-bezier(0.17, 0.67, 0.83, 0.67);
  
  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.6) 100%);
  opacity: 0.6;
  transition: opacity 0.3s ease;
  
  ${Card}:hover & {
    opacity: 0.4;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.33, 1, 0.68, 1);
  
  ${Card}:hover & {
    transform: scale(1.1);
  }
`;

const Content = styled.div`
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 260px; /* 设置固定高度确保所有卡片内容区域一致 */
`;

const Title = styled.h3`
  margin: 0 0 12px 0;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--text);
  transition: color 0.3s ease;
  min-height: 2.6em; /* 确保标题有一致的最小高度 */
  
  ${Card}:hover & {
    color: var(--primary);
  }
`;

const Description = styled.p`
  margin: 0 0 20px 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--text-light);
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 4.8em; /* 3 lines x 1.6 line-height */
  word-break: break-word;
  
  /* 确保在所有浏览器中正确裁剪文本 */
  @supports not (-webkit-line-clamp: 3) {
    position: relative;
    max-height: 4.8em;
    padding-right: 1rem;
    
    &:after {
      content: '...';
      position: absolute;
      right: 0;
      bottom: 0;
      background: var(--background);
      padding-left: 0.2em;
    }
  }
  
  /* 确保深色模式下截断符号背景匹配深色背景 */
  [data-theme="dark"] &:after {
    background: var(--background);
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 0.875rem;
  color: var(--text-light);
  
  svg {
    margin-right: 8px;
    color: var(--primary);
  }
`;

const LinkButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  padding: 10px 20px;
  border-radius: 8px;
  background: var(--primary);
  color: white;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(var(--primary-rgb), 0.2);
  
  &:hover {
    background: var(--primary-dark);
    box-shadow: 0 8px 20px rgba(var(--primary-rgb), 0.3);
    transform: translateY(-2px);
  }
  
  svg {
    margin-left: 8px;
  }
`;

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring",
      stiffness: 100,
      damping: 20
    }
  }
};

const EventCard = ({ event, index, onClick }) => {
  const { t } = useTranslation();
  
  const { 
    id, 
    title, 
    description, 
    imageUrl, 
    startDate, 
    endDate, 
    location, 
    status, 
    link, 
    featured 
  } = event;

  const dateDisplay = formatEventDateTime(startDate, endDate);

  // Default placeholder image from an external source
  const defaultImage = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";
  
  // Process image URL - add backend server prefix if it's a local path
  const processedImageUrl = !imageUrl ? defaultImage : 
                            imageUrl.startsWith('/') ? `${BASE_URL}${imageUrl}` : imageUrl;
  
  // 确保描述文本以纯文本形式显示，移除可能的HTML标签
  const cleanDescription = description ? description.replace(/<[^>]*>/g, '') : '';

  return (
    <Card 
      onClick={() => onClick(id)}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ 
        delay: index * 0.1,
        duration: 0.5
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {featured && <FeaturedBadge>{t('events.featured')}</FeaturedBadge>}
      <StatusBadge status={status}>{t(`events.status.${status}`)}</StatusBadge>
      <ImageContainer>
        <Image src={processedImageUrl} alt={title} />
        <Overlay />
      </ImageContainer>
      <Content>
        <Title>{title}</Title>
        <Description>{cleanDescription}</Description>
        <InfoItem>
          <FiCalendar /> {dateDisplay}
        </InfoItem>
        {location && (
          <InfoItem>
            <FiMapPin /> {location}
          </InfoItem>
        )}
        {link && (
          <LinkButton href={link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
            {t('events.learnMore')} <FiExternalLink />
          </LinkButton>
        )}
      </Content>
    </Card>
  );
};

export default memo(EventCard); 