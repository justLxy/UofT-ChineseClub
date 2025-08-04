import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
// ...原有 import...

const ModalOverlay = styled.div`
  position: fixed;
  z-index: 9999;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 16px;
  max-width: 95vw;
  max-height: 90vh;
  width: 460px;
  padding: 2rem 1.5rem 2rem 1.5rem;
  box-shadow: 0 8px 40px rgba(0,0,0,0.18);
  overflow-y: auto;
  position: relative;
`;

const ModalClose = styled.button`
  position: absolute;
  top: 1rem; right: 1rem;
  background: none;
  border: none;
  font-size: 1.2rem; 
  color: #e74c3c;   
  cursor: pointer;
  padding: 0.15em 0.35em;
  line-height: 1;
  border-radius: 4px;
  transition: background 0.15s;
  &:hover {
    background:rgb(231, 94, 94);
`;

export const ModalPoster = styled.img`
  width: 100%;
  border-radius: 10px;
  margin-bottom: 1.2rem;
`;

export const ModalTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.7rem;
  color: #2d2d2d;
`;

export const ModalDesc = styled.div`
  font-size: 1.05rem;
  color: #555;
  margin-bottom: 1rem;
`;

export const ModalHot = styled.div`
  font-size: 0.98rem;
  color: #8c5b1a;
  background: #f7f3ea;
  border-radius: 8px;
  padding: 0.7rem 1rem;
  margin-bottom: 0.5rem;
`;

export const pastEvents = [
  {
    img: "/images/2024NYConcert/nyc_edited.jpg",
    title: 'NYConcert.pastTitle1',
    desc: 'NYConcert.pastDesc1',
    fullImg: "/images/2024NYConcert/nyc_edited.jpg",
    detail: "NYConcert.pastDetail1",
    hot: "NYConcert.pastHot1"
  },
  {
    img: "/images/2024NYConcert/poster2.jpg",
    title: 'NYConcert.pastTitle2',
    desc: 'NYConcert.pastDesc2',
    fullImg: "/images/2024NYConcert/poster2.jpg",
    detail: "NYConcert.pastDetail2",
    hot: "NYConcert.pastHot2"
  },
  {
    // 视频链接和设置在NYConcertSection.js中
    img: "/images/2024NYConcert/nyc_2016.png",
    title: 'NYConcert.pastTitle3',
    desc: 'NYConcert.pastDesc3',
    fullImg: "/images/2024NYConcert/nyc_2016.png",
    detail: "NYConcert.pastDetail3",
    hot: "NYConcert.pastHot3"
  }
    // 可以继续添加更多过去的活动
];


const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalClose onClick={onClose}>&times;</ModalClose>
        {children}
      </ModalContent>
    </ModalOverlay>
  );
};

export default Modal;
