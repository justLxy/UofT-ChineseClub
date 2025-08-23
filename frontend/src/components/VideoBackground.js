import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

const VideoBackgroundContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -2;

  video {
    position: absolute;
    top: 50%;
    left: 50%;
    min-width: 100%;
    min-height: 100%;
    width: auto;
    height: auto;
    transform: translate(-50%, -50%);
    object-fit: cover;
    z-index: -1;
    
    /* Ensure video is behind content */
    pointer-events: none;
    
    /* Optimize video performance */
    will-change: transform;
  }



  @media (max-width: 768px) {
    video {
      /* Optimize for mobile */
      transform: translate(-50%, -50%) scale(1.1);
    }
  }
`;


const VolumeToggle = styled.button`
  position: fixed;
  bottom: 1.25rem;
  left: 1.25rem;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.35);
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  z-index: 50;
  backdrop-filter: blur(8px);
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.1s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
    border-color: rgba(255, 255, 255, 0.5);
  }

  &:active {
    transform: translateY(1px);
  }

  svg {
    display: block;
  }

  /* Only show on homepage */
  body:not(.homepage) & {
    display: none;
  }
`;



const VideoBackground = ({ videoSrc, className }) => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isInView, setIsInView] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => {
      // Set initial opacity to 0 when loading starts
      video.style.opacity = '0';
    };

    const handleCanPlay = () => {
      // Fade in the video when it's ready to play
      video.style.transition = 'opacity 0.5s ease';
      video.style.opacity = '1';
      video.play().catch(error => {
        console.warn('Video autoplay failed:', error);
      });
    };

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);

    // Set video properties for immediate loading
    video.muted = isMuted;
    video.loop = true;
    video.playsInline = true; // Important for iOS
    video.preload = 'auto'; // Preload entire video for instant display

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [isMuted]);

  // Handle intersection observer for performance and toggle of volume button visibility
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(video);

    return () => {
      observer.unobserve(video);
    };
  }, []);

  // Sync mute state with video element when toggled
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = isMuted;
    }
  }, [isMuted]);

  const toggleMute = () => setIsMuted(prev => !prev);

  return (
    <>
      <VideoBackgroundContainer className={className}>
        <video
          ref={videoRef}
          muted={isMuted}
          loop
          playsInline
          preload="auto"
          style={{ opacity: 0 }}
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </VideoBackgroundContainer>
      {isInView && (
        <VolumeToggle onClick={toggleMute} aria-label={isMuted ? '开启声音' : '静音'}>
          {isMuted ? (
          // Muted icon: speaker with an X
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 5l-6 6H2v2h3l6 6V5z"/>
            <line x1="16" y1="9" x2="22" y2="15"/>
            <line x1="22" y1="9" x2="16" y2="15"/>
          </svg>
          ) : (
          // Volume icon: speaker with waves
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 5l-6 6H2v2h3l6 6V5z"/>
            <path d="M16 9a4 4 0 010 6"/>
            <path d="M19 7a7 7 0 010 10"/>
          </svg>
          )}
        </VolumeToggle>
      )}
    </>
  );
};

export default VideoBackground;
