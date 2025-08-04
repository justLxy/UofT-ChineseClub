import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  margin: 1rem;
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  overflow: hidden;
  transition: box-shadow 0.3s;
  &:hover {
    box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  }
`;

const AvatarWrapper = styled.div`
  width: 100%;
  height: 220px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background: #f5f5f5;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
`;

const Avatar = styled.img`
  width: 100%;
  max-width: 400px;
  height: 220px;
  object-fit: cover;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  transition: transform 0.4s cubic-bezier(.23,1.01,.32,1);
  ${Card}:hover & {
    transform: scale(1.08) translateY(-8px);
  }
`;

const Content = styled.div`
  padding: 1.5rem 1.2rem 1.2rem 1.2rem;
  width: 100%;
  min-height: 80px;
`;

const Name = styled.h3`
  margin: 0.5rem 0 0.2rem 0;
  min-height: 1.5rem;
`;

const Performance = styled.p`
  color: #888;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-size: 1rem;
`;

const QinSocietyMemberCard = ({ avatar, name, description, performance }) => (
  <Card>
    <AvatarWrapper>
      <Avatar src={avatar} alt={name} />
    </AvatarWrapper>
    <Content>
    <Name>{name}</Name>
    <Description>{description}</Description>
    <Performance>{performance}</Performance>
    </Content>
  </Card>
);

export default QinSocietyMemberCard;