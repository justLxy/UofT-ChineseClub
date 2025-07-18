import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

import { getEvents, BASE_URL } from '../utils/api';
import EventCard from '../components/EventCard';
import EventDetailModal from '../components/EventDetailModal';
import EventFilters from '../components/EventFilters';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 120px 20px 100px;
  background: var(--background-alt);
  transition: background-color 0.3s ease;
  
  @media (max-width: 768px) {
    padding: 130px 16px 80px;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  position: relative;
  margin-bottom: 60px;
  overflow: hidden;
  padding-top: 0;
`;

const DecorativeLine = styled(motion.div)`
  position: absolute;
  height: 3px;
  width: 100px;
  background: linear-gradient(90deg, var(--primary), var(--primary-light));
  top: 0;
  left: 0;
  border-radius: 3px;
`;

const PageTitle = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: 800;
  margin: 10px 0 30px;
  line-height: 1.2;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const SubTitle = styled(motion.p)`
  font-size: 1.2rem;
  line-height: 1.6;
  color: var(--text-light);
  max-width: 800px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }
`;



const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
`;

const LoadingSpinner = styled(motion.div)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 3px solid rgba(var(--primary-rgb), 0.1);
  border-top: 3px solid var(--primary);
`;

const NoEventsMessage = styled.div`
  text-align: center;
  padding: 60px 0;
  font-size: 1.2rem;
  color: var(--text-light);
`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const Events = () => {
  const { t, i18n } = useTranslation();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeFilter, setActiveFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ all: 0, upcoming: 0, ongoing: 0, past: 0 });
  
  
  const headerRef = useRef(null);
  const bubblesRef = useRef([]);
  
  useEffect(() => {
    fetchEvents();
    
    // Create animated bubbles
    const bubbles = [];
    for (let i = 0; i < 6; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'parallax-bubble';
      bubble.style.position = 'absolute';
      bubble.style.borderRadius = '50%';
      bubble.style.background = `linear-gradient(135deg, rgba(var(--primary-rgb), ${Math.random() * 0.1 + 0.05}), rgba(var(--primary-light-rgb), ${Math.random() * 0.1 + 0.05}))`;
      bubble.style.filter = 'blur(2px)';
      bubble.style.zIndex = '-1';
      
      const size = Math.random() * 200 + 100;
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      
      const maxX = window.innerWidth - size;
      const maxY = 1000;
      
      bubble.style.left = `${Math.random() * maxX}px`;
      bubble.style.top = `${Math.random() * maxY}px`;
      
      if (headerRef.current) {
        headerRef.current.appendChild(bubble);
        bubbles.push(bubble);
        bubblesRef.current.push(bubble);
      }
    }
    
    // Animate bubbles
    bubbles.forEach(bubble => {
      gsap.to(bubble, {
        x: `random(-100, 100)`,
        y: `random(-100, 100)`,
        duration: Math.random() * 5 + 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });

    // Setup scroll animations
    const cards = document.querySelectorAll('.event-card');
    cards.forEach((card) => {
      ScrollTrigger.create({
        trigger: card,
        start: "top bottom-=100",
        toggleClass: { targets: card, className: "visible" },
        once: true
      });
    });
    
    return () => {
      // Cleanup
      bubblesRef.current.forEach(bubble => {
        if (bubble && bubble.parentNode) {
          bubble.parentNode.removeChild(bubble);
        }
      });
      
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      if (activeFilter) {
        setFilteredEvents(events.filter(event => event.status === activeFilter));
      } else {
        setFilteredEvents(events);
      }
    }
  }, [events, activeFilter]);

  // Reload events when language changes
  useEffect(() => {
    fetchEvents();
  }, [i18n.language]);

  // Update selected event when events data changes (for language switching)
  useEffect(() => {
    if (selectedEvent && events.length > 0) {
      const updatedEvent = events.find(e => e.id === selectedEvent.id);
      if (updatedEvent) {
        setSelectedEvent(updatedEvent);
      }
    }
  }, [events, selectedEvent?.id]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getEvents();
      
      // Update imageUrl to use external images only if no image provided
      const updatedData = data.map(event => {
        if (!event.imageUrl) {
          // Use external image URLs for events without any image URL
          const externalImages = [
            "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
            "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
            "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
            "https://images.unsplash.com/photo-1505236858219-8359eb29e329?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1562&q=80",
            "https://images.unsplash.com/photo-1569930784237-ea65a2129a7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80"
          ];
          return {
            ...event,
            imageUrl: externalImages[Math.floor(Math.random() * externalImages.length)]
          };
        } else if (event.imageUrl.startsWith('/')) {
          // Prepend backend URL to local image paths
          return {
            ...event,
            imageUrl: `${BASE_URL}${event.imageUrl}`
          };
        }
        return event;
      });
      
      setEvents(updatedData);
      setFilteredEvents(updatedData);
      
      // Calculate counts
      const allCount = updatedData.length;
      const upcomingCount = updatedData.filter(e => e.status === 'upcoming').length;
      const ongoingCount = updatedData.filter(e => e.status === 'ongoing').length;
      const pastCount = updatedData.filter(e => e.status === 'past').length;
      
      setCounts({
        all: allCount,
        upcoming: upcomingCount,
        ongoing: ongoingCount,
        past: pastCount
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  const handleEventClick = (id) => {
    // Find the event from existing events data instead of making API call
    const event = events.find(e => e.id === id);
    if (event) {
      setSelectedEvent(event);
    } else {
      console.error('Event not found:', id);
    }
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };



  return (
    <PageContainer>
      <SEO
        title="活动 | UTChinese Network 多大中文"
        description="查看多大中文 (UTChinese Network) 的最新与往期活动：职业招聘会、文化节、音乐会等。"
        url="https://www.utchinese.org/events"
      />
      <ContentWrapper>
        <Header ref={headerRef}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
              <div>
                <DecorativeLine
                  initial={{ width: 0 }}
                  animate={{ width: 100 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
                <PageTitle variants={textVariants}>{t('events.title')}</PageTitle>
              </div>
            
            <SubTitle variants={textVariants}>
              {t('events.subtitle')}
            </SubTitle>
          </motion.div>
        </Header>

        <EventFilters 
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          counts={counts}
        />

        {loading ? (
          <LoadingContainer>
            <LoadingSpinner
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </LoadingContainer>
        ) : filteredEvents.length > 0 ? (
          <EventsGrid>
            {filteredEvents.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                index={index}
                onClick={handleEventClick}
                className="event-card"
              />
            ))}
          </EventsGrid>
        ) : (
          <NoEventsMessage>{t('events.noEvents')}</NoEventsMessage>
        )}
      </ContentWrapper>

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={handleCloseModal}
          isAdmin={false}
        />
      )}
    </PageContainer>
  );
};

export default Events; 