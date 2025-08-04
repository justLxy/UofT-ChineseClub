import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

// 照片数据
const galleryImages = [
  "/images/NYCPHotos/_DSC3416.jpg",
  "/images/NYCPHotos/_DSC3545.jpg",
  "/images/NYCPHotos/_DSC3796.jpg",
  "/images/NYCPHotos/UTChinese合照.jpg",
  "/images/NYCPHotos/100-export-多大中文-DSC08842.jpg",
  "/images/NYCPHotos/114-export-多大中文-DSC08876.jpg",
  "/images/NYCPHotos/161-export-多大中文-DSC08993.jpg",
  "/images/NYCPHotos/203-export-多大中文-DSC09121.jpg",
  "/images/NYCPHotos/209-export-多大中文-DSC09138.jpg",
  "/images/NYCPHotos/212-export-多大中文-DSC09153.jpg",
  "/images/NYCPHotos/294-export-多大中文-DSC09368.jpg",
  "/images/NYCPHotos/302-export-多大中文-DSC09390.jpg",
  // ...可继续添加
];

const GallerySection = styled.section`
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  background: #fff;
  border-radius: 0;
  box-shadow: 0 2px 16px rgba(0,0,0,0.05);
  padding: 2.5rem 0;
`;

const GalleryTitle = styled.h2`
  font-size: 1.6rem;
  color: #3b2e1a;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const GalleryWrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  touch-action: pan-y;
`;

const GallerySlider = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 40vw;
  min-height: 220px;
  max-height: 480px;
  width: 90vw;
  max-width: 1100px;
  margin: 0 auto;
  overflow: visible;

  @media (max-width: 900px) {
    height: 55vw;
    max-width: 98vw;
    width: 98vw;
  }
  @media (max-width: 600px) {
    height: 60vw;
    min-height: 140px;
    max-height: 260px;
    width: 100vw;
  }
`;

const GalleryImageWrapper = styled.div`
  position: absolute;
  left: 50%;
  top: 0;
  width: 60%;
  height: 100%;
  transform: translateX(-50%) 
    scale(${props => props.active ? 1 : 0.7})
    translateX(${props => props.offset * 60}%);
  z-index: ${props => 10 - Math.abs(props.offset)};
  opacity: ${props => Math.abs(props.offset) > 2 ? 0 : 1};
  transition: 
    transform 0.4s cubic-bezier(.4,2,.6,1),
    opacity 0.3s;
  pointer-events: ${props => props.active ? 'auto' : 'none'};

  @media (max-width: 900px) {
    width: 80%;
    transform: translateX(-50%)
      scale(${props => props.active ? 1 : 0.7})
      translateX(${props => props.offset * 85}%);
  }
  @media (max-width: 600px) {
    width: 95%;
    transform: translateX(-50%)
      scale(${props => props.active ? 1 : 0.7})
      translateX(${props => props.offset * 100}%);
  }
`;

const GalleryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 14px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.08);
  user-select: none;
  background: #eee;
`;

const GalleryNav = styled.button`
  position: absolute;
  top: 50%;
//   transform: translateY(-50%);
  background: rgba(40,40,40,0.55);
  border: none;
  outline: none;           // 保证无outline
  border-radius: 50%;
  width: 52px;
  height: 52px;
  font-size: 2.2rem;
  color: #fff;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  left: ${props => props.left ? '18px' : 'unset'};
  right: ${props => props.right ? '18px' : 'unset'};
  opacity: 0.92;
  overflow: visible;
  transition: background 0.18s, box-shadow 0.18s;

  &:hover {
    background: rgba(231, 76, 60, 0.85);
    box-shadow: 0 4px 16px rgba(0,0,0,0.18);
    opacity: 1;
  }

  @media (max-width: 900px) {
    width: 44px;
    height: 44px;
    font-size: 1.7rem;
    left: ${props => props.left ? '6px' : 'unset'};
    right: ${props => props.right ? '6px' : 'unset'};
  }
  @media (max-width: 600px) {
    width: 36px;
    height: 36px;
    font-size: 1.2rem;
    left: ${props => props.left ? '2px' : 'unset'};
    right: ${props => props.right ? '2px' : 'unset'};
  }
`;

const GalleryBar = styled.div`
  width: 70%;
  height: 4px;
  background: #e0d6c6;
  border-radius: 2px;
  margin: 1.5rem auto 0 auto;
  position: relative;
  overflow: hidden;
  display: flex;
  cursor: pointer;
`;

const GalleryBarSegment = styled.button`
  flex: 1 1 0;
  height: 100%;
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  outline: none;
  position: relative;
  z-index: 2;

  &:hover,
  &:active,
  &:focus {
    background: transparent;
    box-shadow: none;
  }
`;

const GalleryBarActive = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: ${props => 100 / props.total}%;
  background: #e74c3c;
  border-radius: 2px;
  transition: transform 0.4s cubic-bezier(.4,2,.6,1);
  transform: translateX(${props => props.current * 100}%);
  z-index: 1;
`;

function PhotoGallery() {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);
  const total = galleryImages.length;
  const startX = useRef(null);
  const isDragging = useRef(false);

  const goPrev = () => setCurrent(current === 0 ? total - 1 : current - 1);
  const goNext = () => setCurrent(current === total - 1 ? 0 : current + 1);

  // 移动端滑动
  const onTouchStart = e => {
    if (e.touches && e.touches.length === 1) {
      startX.current = e.touches[0].clientX;
    }
  };
  const onTouchMove = e => {
    if (startX.current !== null) e.preventDefault();
  };
  const onTouchEnd = e => {
    if (startX.current === null) return;
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX.current;
    if (diff > 50) goPrev();
    if (diff < -50) goNext();
    startX.current = null;
  };

//   // 桌面端鼠标拖动
//   const onMouseDown = e => {
//     isDragging.current = true;
//     startX.current = e.clientX;
//   };
//   const onMouseMove = e => {
//     if (!isDragging.current || startX.current === null) return;
//     e.preventDefault();
//   };
//   const onMouseUp = e => {
//     if (!isDragging.current || startX.current === null) return;
//     const diff = e.clientX - startX.current;
//     if (diff > 50) goPrev();
//     if (diff < -50) goNext();
//     isDragging.current = false;
//     startX.current = null;
//   };
//   const onMouseLeave = () => {
//     isDragging.current = false;
//     startX.current = null;
//   };


  return (
    <GallerySection>
      <GalleryTitle>{t('NYConcert.photoGallery')}</GalleryTitle>
      <GalleryWrapper
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        // onMouseDown={onMouseDown}
        // onMouseMove={onMouseMove}
        // onMouseUp={onMouseUp}
        // onMouseLeave={onMouseLeave}
        // style={{ userSelect: isDragging.current ? 'none' : 'auto', cursor: isDragging.current ? 'grabbing' : 'grab' }}
      >
        <GalleryNav left onClick={goPrev} aria-label="上一张">&lt;</GalleryNav>
        <GallerySlider>
          {galleryImages.map((src, idx) => {
            let offset = idx - current;
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;
            return (
              <GalleryImageWrapper
                key={idx}
                active={offset === 0}
                offset={offset}
                style={{ pointerEvents: offset === 0 ? 'auto' : 'none' }}
              >
                <GalleryImage src={src} alt={`Concert Photo ${idx+1}`} draggable={false} />
              </GalleryImageWrapper>
            );
          })}
        </GallerySlider>
        <GalleryNav right onClick={goNext} aria-label="下一张">&gt;</GalleryNav>
      </GalleryWrapper>
      <GalleryBar>
        {/* 红色活动条 */}
        <GalleryBarActive current={current} total={total} />
        {/* 可点击分段 */}
        {galleryImages.map((_, idx) => (
          <GalleryBarSegment
            key={idx}
            aria-label={`跳转到第${idx + 1}张`}
            onClick={() => setCurrent(idx)}
            tabIndex={0}
          />
        ))}
      </GalleryBar>
    </GallerySection>
  );
}

export default PhotoGallery;