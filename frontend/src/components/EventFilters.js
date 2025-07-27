import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const FilterButton = styled(motion.button)`
  position: relative;
  padding: 10px 24px;
  background: transparent;
  border: 2px solid transparent;
  border-radius: 30px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  overflow: hidden;
  transition: color 0.3s ease;
  color: ${props => props.isActive ? '#fff' : '#606060'};
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${props => props.isActive ? 'linear-gradient(135deg, #FF4B2B, #FF416C)' : '#f0f0f0'};
    z-index: -1;
    transition: box-shadow 0.3s ease;
    will-change: transform;
  }
  
  &:hover {
    box-shadow: ${props => props.isActive ? '0 8px 20px rgba(255, 75, 43, 0.25)' : '0 8px 20px rgba(0, 0, 0, 0.1)'};
    
    &::before {
      background: ${props => props.isActive ? 'linear-gradient(135deg, #FF416C, #FF4B2B)' : '#e8e8e8'};
    }
  }
`;

const countVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15
    }
  }
};

const Count = styled(motion.span)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  min-width: 24px;
  height: 24px;
  border-radius: 12px;
  background: ${props => props.isActive ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.1)'};
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0 6px;
`;

const EventFilters = ({ activeFilter, setActiveFilter, counts }) => {
  const { t } = useTranslation();
  
  const filters = [
    { id: '', label: 'all', count: counts.all || 0 },
    { id: 'upcoming', label: 'upcoming', count: counts.upcoming || 0 },
    { id: 'ongoing', label: 'ongoing', count: counts.ongoing || 0 },
    { id: 'past', label: 'past', count: counts.past || 0 },
  ];

  return (
    <FiltersContainer>
      {filters.map((filter) => (
        <FilterButton
          key={filter.id}
          isActive={activeFilter === filter.id}
          onClick={() => setActiveFilter(filter.id)}
          whileHover={{ 
            scale: 1.03,
            y: -3,
            transition: { duration: 0.2, ease: "easeOut" }
          }}
          whileTap={{ scale: 0.98 }}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          {t(`events.filters.${filter.label}`)}
          <Count 
            isActive={activeFilter === filter.id}
            variants={countVariants}
            initial="initial"
            animate="animate"
            key={`${filter.id}-${filter.count}`}
          >
            {filter.count}
          </Count>
        </FilterButton>
      ))}
    </FiltersContainer>
  );
};

export default EventFilters; 