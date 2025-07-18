import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// 导入图片资源
import image1 from '../assets/images/1.jpg';
import image2 from '../assets/images/2.jpg';
import image3 from '../assets/images/3.jpg';
import image4 from '../assets/images/4.jpg';
import image5 from '../assets/images/5.jpg';
import image6 from '../assets/images/6.jpg';

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 30px 50px rgba(0, 0, 0, 0.15);
    
    .controls {
      opacity: 1;
    }
  }
  
  @media (max-width: 992px) {
    height: 350px;
    transform: none; // 禁用移动端的悬浮效果，提高性能
    
    &:hover {
      transform: none;
    }
  }
  
  @media (max-width: 768px) {
    height: 300px;
    border-radius: 8px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 480px) {
    height: 250px;
  }
`;

const ImagesContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  overflow: hidden;
  touch-action: pan-y;
`;

const ImageSlide = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  will-change: transform; // 提高动画性能
  
  @media (max-width: 768px) {
    object-position: center center; // 确保移动端图片居中显示
  }
`;

const Controls = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  box-sizing: border-box;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 2;
  
  @media (max-width: 992px) {
    opacity: 0.8; // 在移动端始终显示控制按钮，但半透明
    padding: 0 0.8rem;
  }
  
  @media (max-width: 768px) {
    opacity: 0.7;
    padding: 0 0.5rem;
  }
`;

const ControlButton = styled.button`
  background: rgba(255, 255, 255, 0.7);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;
  color: var(--primary);
  
  &:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: scale(1.1);
  }
  
  &:focus {
    outline: none;
  }
  
  @media (max-width: 992px) {
    width: 36px;
    height: 36px;
    font-size: 1.1rem;
  }
  
  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    font-size: 1rem;
    background: rgba(255, 255, 255, 0.8);
  }
  
  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
    font-size: 0.9rem;
  }
`;

const Indicators = styled.div`
  position: absolute;
  bottom: 1.2rem;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 0.6rem;
  z-index: 2;
  
  @media (max-width: 768px) {
    bottom: 0.8rem;
    gap: 0.4rem;
  }
  
  @media (max-width: 480px) {
    bottom: 0.6rem;
    gap: 0.3rem;
  }
`;

const Indicator = styled.button`
  width: ${props => props.$active ? '20px' : '6px'};
  height: 6px;
  border-radius: ${props => props.$active ? '8px' : '50%'};
  background: ${props => props.$active ? 'var(--primary)' : 'rgba(255, 255, 255, 0.6)'};
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
  padding: 0;
  margin: 0;
  
  &:hover {
    transform: ${props => props.$active ? 'none' : 'scale(1.2)'};
    background: ${props => props.$active ? 'var(--primary)' : 'rgba(255, 255, 255, 0.8)'};
  }
  
  &:focus {
    outline: none;
  }
  
  @media (max-width: 768px) {
    width: ${props => props.$active ? '12px' : '4px'};
    height: 4px;
    border-radius: ${props => props.$active ? '6px' : '50%'};
    min-width: 24px; // 确保足够的触摸目标大小
    min-height: 24px; // 确保足够的触摸目标大小
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      transform: none; // 禁用移动端的悬浮缩放效果
      background: ${props => props.$active ? 'var(--primary)' : 'rgba(255, 255, 255, 0.6)'};
    }
    
    // 创建一个伪元素来显示实际的指示器
    &:before {
      content: '';
      width: ${props => props.$active ? '12px' : '4px'};
      height: 4px;
      border-radius: ${props => props.$active ? '6px' : '50%'};
      background: ${props => props.$active ? 'var(--primary)' : 'rgba(255, 255, 255, 0.6)'};
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    
    // 隐藏原本的背景，因为我们使用伪元素
    background: transparent !important;
  }
  
  @media (max-width: 480px) {
    width: ${props => props.$active ? '10px' : '3px'};
    height: 3px;
    border-radius: ${props => props.$active ? '5px' : '50%'};
    min-width: 20px; // 小屏设备的最小触摸目标
    min-height: 20px; // 小屏设备的最小触摸目标
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      transform: none; // 禁用小屏移动端的悬浮缩放效果
      background: ${props => props.$active ? 'var(--primary)' : 'rgba(255, 255, 255, 0.6)'};
    }
    
    // 创建一个伪元素来显示实际的指示器
    &:before {
      content: '';
      width: ${props => props.$active ? '10px' : '3px'};
      height: 3px;
      border-radius: ${props => props.$active ? '5px' : '50%'};
      background: ${props => props.$active ? 'var(--primary)' : 'rgba(255, 255, 255, 0.6)'};
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    
    // 隐藏原本的背景，因为我们使用伪元素
    background: transparent !important;
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%);
    transform: translateX(-100%);
    transition: transform 0.6s ease;
    pointer-events: none;
    border-radius: inherit;
    
    @media (max-width: 768px) {
      display: none; // 在移动端禁用光效，简化视觉效果
    }
  }
  
  ${props => props.$active && `
    &:after {
      transform: translateX(100%);
    }
  `}
`;

// 针对移动端优化的滑动变体
const slideVariants = {
  enter: (direction) => {
    return {
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0.8
    };
  },
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction) => {
    return {
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0.8
    };
  }
};

const ImageCarousel = () => {
  const images = [image1, image2, image3, image4, image5, image6];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isLoaded, setIsLoaded] = useState(Array(images.length).fill(false));
  const timeoutRef = useRef(null);
  const touchStartX = useRef(0);
  const containerRef = useRef(null);
  
  // 图片预加载
  useEffect(() => {
    const preloadImages = () => {
      images.forEach((src, index) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          setIsLoaded(prev => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });
        };
      });
    };
    
    preloadImages();
  }, [images]);
  
  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex(prevIndex => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };
  
  const goToSlide = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };
  
  const handleTouchStart = (e) => {
    // 停止自动轮播
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    touchStartX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    
    // 如果滑动距离足够大，则切换幻灯片
    if (Math.abs(diff) > 30) { // 减小触发阈值，提高移动端敏感度
      if (diff > 0) {
        nextSlide(); // 向左滑动，显示下一张
      } else {
        prevSlide(); // 向右滑动，显示上一张
      }
    }
    
    // 恢复自动轮播
    timeoutRef.current = setTimeout(() => {
      nextSlide();
    }, 5000);
  };
  
  useEffect(() => {
    // 自动轮播
    timeoutRef.current = setTimeout(() => {
      nextSlide();
    }, 5000);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex]);
  
  return (
    <CarouselContainer ref={containerRef}>
      <ImagesContainer
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence initial={false} custom={direction}>
          <ImageSlide
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "tween", duration: 0.5, ease: "easeInOut" },
              opacity: { duration: 0.2 }
            }}
          >
            <StyledImage 
              src={images[currentIndex]} 
              alt={`UTChinese Network - Image ${currentIndex + 1}`}
              loading="eager"
              style={{ 
                opacity: isLoaded[currentIndex] ? 1 : 0.5,
                transition: 'opacity 0.3s ease'
              }}
            />
          </ImageSlide>
        </AnimatePresence>
      </ImagesContainer>
      
      <Controls className="controls">
        <ControlButton onClick={prevSlide} aria-label="Previous slide">
          &#10094;
        </ControlButton>
        <ControlButton onClick={nextSlide} aria-label="Next slide">
          &#10095;
        </ControlButton>
      </Controls>
      
      <Indicators>
        {images.map((_, index) => (
          <Indicator 
            key={index} 
            $active={index === currentIndex} 
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </Indicators>
    </CarouselContainer>
  );
};

export default ImageCarousel; 