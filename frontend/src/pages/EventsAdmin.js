import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiStar, FiUpload } from 'react-icons/fi';
import { getEvents, createEvent, updateEvent, deleteEvent, getFullEventImageUrl, uploadEventImage } from '../utils/api';
import { formatEventDateTime } from '../utils/dateUtils';

const AdminContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 120px 20px 20px;
  
  @media (max-width: 768px) {
    padding: 130px 20px 20px;
  }
`;

const Header = styled.div`
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  
  /* NEW: prevent horizontal overflow on very narrow screens */
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0;
  background: linear-gradient(135deg, #FF4B2B 0%, #FF416C 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
`;

const AddButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  background: linear-gradient(135deg, #FF4B2B, #FF416C);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(255, 75, 43, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(255, 75, 43, 0.3);
  }
  
  svg {
    margin-right: 8px;
    font-size: 1.1rem;
  }
`;

const EventsTable = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  margin-top: 20px;
  border: 1px solid #f0f0f0;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 50px minmax(200px, 3fr) 2fr 100px 80px 150px;
  padding: 16px 20px;
  background: linear-gradient(to right, #f9f9f9, #f5f5f5);
  font-weight: 700;
  color: #444;
  text-align: center;
  align-items: center;
  border-bottom: 2px solid #f0f0f0;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const EventRow = styled(motion.div)`
  display: grid;
  grid-template-columns: 50px minmax(200px, 3fr) 2fr 100px 80px 150px;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
  text-align: center;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 8px;
    padding: 20px;
  }
`;

const EventId = styled.div`
  font-weight: 600;
  color: #757575;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const EventTitle = styled.div`
  font-weight: 600;
  color: #212121;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const EventStatus = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: white;
  text-align: center;
  width: fit-content; /* 根据内容自适应宽度 */
  min-width: 80px; /* 最小宽度 */
  margin: 0 auto; /* 居中显示 */
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
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
`;

const EventDate = styled.div`
  color: #606060;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FeaturedIndicator = styled.div`
  color: ${props => props.featured ? '#FFD700' : '#d0d0d0'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease, color 0.3s ease;
  position: relative;
  
  &:hover {
    transform: scale(1.2);
  }
  
  &:active {
    transform: scale(0.9);
  }
  
  svg {
    font-size: 1.2rem;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
`;

const ActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  height: 36px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: white;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
  
  svg {
    margin-right: ${props => props.text ? '6px' : '0'};
  }
  
  background: ${({ variant }) => {
    switch (variant) {
      case 'delete':
        return '#FF4B2B';
      case 'edit':
      default:
        return '#4776E6';
    }
  }};

  &:hover {
    background: ${({ variant }) => {
      switch (variant) {
        case 'delete':
          return '#ff3615';
        case 'edit':
        default:
          return '#3366cc';
      }
    }};
    box-shadow: ${({ variant }) => {
      switch (variant) {
        case 'delete':
          return '0 4px 10px rgba(255, 75, 43, 0.3)';
        case 'edit':
        default:
          return '0 4px 10px rgba(71, 118, 230, 0.3)';
      }
    }};
  }
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 30px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: #212121;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LanguageLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  span {
    font-size: 0.8rem;
    padding: 2px 6px;
    background: #f0f0f0;
    border-radius: 4px;
    color: #505050;
  }
`;

const Label = styled.label`
  font-weight: 600;
  color: #505050;

  ${props => props.required && `
    &::after {
      content: ' *';
      color: var(--primary);
      margin-left: 4px;
    }
  `}
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #FF4B2B;
  }
`;

const Textarea = styled.textarea`
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 200px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #FF4B2B;
  }
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  input {
    width: 18px;
    height: 18px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
`;

const Button = styled(motion.button)`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  
  background: ${({ variant }) => {
    switch (variant) {
      case 'cancel':
        return '#f0f0f0';
      case 'submit':
        return 'linear-gradient(135deg, #FF4B2B, #FF416C)';
      default:
        return '#f0f0f0';
    }
  }};

  color: ${({ variant }) => (variant === 'cancel' ? '#505050' : 'white')};
`;

const NoEventsMessage = styled.div`
  text-align: center;
  padding: 60px 0;
  font-size: 1.2rem;
  color: #757575;
`;

const ImageUploadContainer = styled.div`
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #FF4B2B;
  }
  
  input {
    display: none;
  }
`;

const UploadIcon = styled.div`
  font-size: 2rem;
  color: #aaa;
  margin-bottom: 10px;
`;

const ImagePreview = styled.div`
  margin-top: 10px;
  
  img {
    max-width: 100%;
    max-height: 200px;
    border-radius: 8px;
  }
`;

const modalVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", damping: 25, stiffness: 300 }
  },
  exit: { 
    opacity: 0,
    y: 50,
    transition: { duration: 0.2 }
  }
};

// 添加一个消息提示组件
const Toast = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  z-index: 1000;
`;

const EventsAdmin = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title_en: '',
    title_zh: '',
    description_en: '',
    description_zh: '',
    imageUrl: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location_en: '',
    location_zh: '',
    link: '',
    featured: false
  });
  const [toast, setToast] = useState({ visible: false, message: '' });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getEvents();
      setEvents(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  const handleOpenModal = (event = null) => {
    if (event) {
      // Edit mode
      setCurrentEvent(event);
      setFormData({
        title_en: event.title_en || '',
        title_zh: event.title_zh || '',
        description_en: event.description_en || '',
        description_zh: event.description_zh || '',
        imageUrl: event.imageUrl || '',
        startDate: new Date(event.startDate).toISOString().split('T')[0],
        startTime: new Date(event.startDate).toTimeString().split(' ')[0].substring(0, 5),
        endDate: event.endDate ? new Date(event.endDate).toISOString().split('T')[0] : '',
        endTime: event.endDate ? new Date(event.endDate).toTimeString().split(' ')[0].substring(0, 5) : '',
        location_en: event.location_en || '',
        location_zh: event.location_zh || '',
        link: event.link || '',
        featured: event.featured
      });
      
      // 使用 getFullEventImageUrl 辅助函数来获取正确的预览 URL
      const imagePreviewUrl = getFullEventImageUrl(event.imageUrl);
      setPreviewUrl(imagePreviewUrl || '');
    } else {
      // Create mode
      setCurrentEvent(null);
      setFormData({
        title_en: '',
        title_zh: '',
        description_en: '',
        description_zh: '',
        imageUrl: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        location_en: '',
        location_zh: '',
        link: '',
        featured: false
      });
      setPreviewUrl('');
    }
    setImageFile(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let eventData = { ...formData };
      
      // Combine date and time for startDate
      if (eventData.startDate) {
        eventData.startDate = eventData.startTime 
          ? `${eventData.startDate}T${eventData.startTime}:00`
          : `${eventData.startDate}T00:00:00`;
      }
      
      // Combine date and time for endDate
      if (eventData.endDate) {
        eventData.endDate = eventData.endTime 
          ? `${eventData.endDate}T${eventData.endTime}:00`
          : `${eventData.endDate}T23:59:59`;
      }
      
      // Remove separate time fields before sending to API
      delete eventData.startTime;
      delete eventData.endTime;
      
      // If there's a new image file, upload it first
      if (imageFile) {
        const uploadedImage = await uploadEventImage(imageFile);
        eventData.imageUrl = uploadedImage.imageUrl; // Correctly extract the URL
      }
      
      if (currentEvent) {
        // Update existing event
        await updateEvent(currentEvent.id, eventData);
      } else {
        // Create new event
        await createEvent(eventData);
      }
      
      // Refresh events list
      fetchEvents();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('确定要删除这个活动吗？此操作无法撤销。')) {
      try {
        await deleteEvent(id);
        fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const handleToggleFeatured = async (event) => {
    try {
      // 创建更新的事件数据，切换精选状态
      const updatedData = {
        title_en: event.title_en,
        title_zh: event.title_zh,
        description_en: event.description_en,
        description_zh: event.description_zh,
        imageUrl: event.imageUrl,
        startDate: event.startDate, // 保持完整的日期时间
        endDate: event.endDate || '', // 保持完整的日期时间
        location_en: event.location_en,
        location_zh: event.location_zh,
        link: event.link,
        featured: !event.featured
      };
      
      // 更新数据库中的事件
      await updateEvent(event.id, updatedData);
      
      // 显示成功消息
      setToast({
        visible: true,
        message: !event.featured ? '已设为精选活动' : '已取消精选'
      });
      
      // 3秒后隐藏消息
      setTimeout(() => {
        setToast({ visible: false, message: '' });
      }, 3000);
      
      // 刷新事件列表以反映更改
      fetchEvents();
    } catch (error) {
      console.error('Error toggling featured status:', error);
      setToast({
        visible: true,
        message: '操作失败，请重试'
      });
      setTimeout(() => {
        setToast({ visible: false, message: '' });
      }, 3000);
    }
  };

  // Translation for status
  const statusText = {
    past: '已结束',
    ongoing: '进行中',
    upcoming: '即将开始'
  };

  return (
    <AdminContainer>
      <Header>
        <Title>活动管理</Title>
        <AddButton 
          onClick={() => handleOpenModal()}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <FiPlus /> 添加新活动
        </AddButton>
      </Header>

      {loading ? (
        <NoEventsMessage>加载中...</NoEventsMessage>
      ) : events.length > 0 ? (
        <EventsTable>
          <TableHeader>
            <div>ID</div>
            <div>标题</div>
            <div>日期</div>
            <div>状态</div>
            <div>精选</div>
            <div>操作</div>
          </TableHeader>
          
          {events.map((event, index) => (
            <EventRow 
              key={event.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EventId>{index + 1}</EventId>
              <EventTitle>{event.title}</EventTitle>
              <EventDate>
                {formatEventDateTime(event.startDate, event.endDate)}
              </EventDate>
              <EventStatus status={event.status}>
                {statusText[event.status]}
              </EventStatus>
              <FeaturedIndicator 
                featured={event.featured}
                onClick={() => handleToggleFeatured(event)}
                title={event.featured ? "取消精选" : "设为精选"}
              >
                <FiStar />
              </FeaturedIndicator>
              <ActionsContainer>
                <ActionButton 
                  variant="edit"
                  onClick={() => handleOpenModal(event)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  text="true"
                >
                  <FiEdit2 /> 编辑
                </ActionButton>
                <ActionButton 
                  variant="delete"
                  onClick={() => handleDeleteEvent(event.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  text="true"
                >
                  <FiTrash2 /> 删除
                </ActionButton>
              </ActionsContainer>
            </EventRow>
          ))}
        </EventsTable>
      ) : (
        <NoEventsMessage>当前没有活动，请添加</NoEventsMessage>
      )}

      {/* Modal for Create/Edit */}
      {modalOpen && (
        <Modal
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleCloseModal}
        >
          <ModalContent 
            variants={modalVariants} 
            onClick={(e) => e.stopPropagation()}
          >
            <ModalTitle>{currentEvent ? '编辑活动' : '创建新活动'}</ModalTitle>
            <Form onSubmit={handleSubmit}>
              <FormRow>
                <FormGroup>
                  <LanguageLabel>
                    <Label htmlFor="title_en" required>标题</Label>
                    <span>英文</span>
                  </LanguageLabel>
                  <Input 
                    type="text" 
                    id="title_en" 
                    name="title_en" 
                    value={formData.title_en} 
                    onChange={handleInputChange}
                    required
                    placeholder="English Title"
                  />
                </FormGroup>
                
                <FormGroup>
                  <LanguageLabel>
                    <Label htmlFor="title_zh" required>标题</Label>
                    <span>中文</span>
                  </LanguageLabel>
                  <Input 
                    type="text" 
                    id="title_zh" 
                    name="title_zh" 
                    value={formData.title_zh} 
                    onChange={handleInputChange}
                    required
                    placeholder="中文标题"
                  />
                </FormGroup>
              </FormRow>
              
              <FormRow>
                <FormGroup>
                  <LanguageLabel>
                    <Label htmlFor="description_en" required>描述</Label>
                    <span>英文</span>
                  </LanguageLabel>
                  <Textarea 
                    id="description_en" 
                    name="description_en" 
                    value={formData.description_en} 
                    onChange={handleInputChange}
                    required
                    placeholder="English Description"
                  />
                </FormGroup>
                
                <FormGroup>
                  <LanguageLabel>
                    <Label htmlFor="description_zh" required>描述</Label>
                    <span>中文</span>
                  </LanguageLabel>
                  <Textarea 
                    id="description_zh" 
                    name="description_zh" 
                    value={formData.description_zh} 
                    onChange={handleInputChange}
                    required
                    placeholder="中文描述"
                  />
                </FormGroup>
              </FormRow>
              
              <FormGroup>
                <Label>图片上传</Label>
                <ImageUploadContainer onClick={handleImageClick}>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                  {!previewUrl ? (
                    <>
                      <UploadIcon>
                        <FiUpload />
                      </UploadIcon>
                      <div>点击上传图片</div>
                    </>
                  ) : (
                    <ImagePreview>
                      <img src={previewUrl} alt="Preview" />
                    </ImagePreview>
                  )}
                </ImageUploadContainer>
              </FormGroup>
              
              <FormRow>
                <FormGroup>
                  <Label htmlFor="startDate" required>开始日期</Label>
                  <Input 
                    type="date" 
                    id="startDate" 
                    name="startDate" 
                    value={formData.startDate} 
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="startTime">开始时间 (可选)</Label>
                  <Input 
                    type="time" 
                    id="startTime" 
                    name="startTime" 
                    value={formData.startTime} 
                    onChange={handleInputChange}
                    placeholder="HH:mm"
                  />
                </FormGroup>
              </FormRow>
              
              <FormRow>
                <FormGroup>
                  <Label htmlFor="endDate">结束日期 (可选)</Label>
                  <Input 
                    type="date" 
                    id="endDate" 
                    name="endDate" 
                    value={formData.endDate} 
                    onChange={handleInputChange}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="endTime">结束时间 (可选)</Label>
                  <Input 
                    type="time" 
                    id="endTime" 
                    name="endTime" 
                    value={formData.endTime} 
                    onChange={handleInputChange}
                    placeholder="HH:mm"
                  />
                </FormGroup>
              </FormRow>
              
              <FormRow>
                <FormGroup>
                  <LanguageLabel>
                    <Label htmlFor="location_en">地点</Label>
                    <span>英文</span>
                  </LanguageLabel>
                  <Input 
                    type="text" 
                    id="location_en" 
                    name="location_en" 
                    value={formData.location_en} 
                    onChange={handleInputChange}
                    placeholder="English Location"
                  />
                </FormGroup>
                
                <FormGroup>
                  <LanguageLabel>
                    <Label htmlFor="location_zh">地点</Label>
                    <span>中文</span>
                  </LanguageLabel>
                  <Input 
                    type="text" 
                    id="location_zh" 
                    name="location_zh" 
                    value={formData.location_zh} 
                    onChange={handleInputChange}
                    placeholder="中文地点"
                  />
                </FormGroup>
              </FormRow>
              
              <FormGroup>
                <Label htmlFor="link">外部链接</Label>
                <Input 
                  type="text" 
                  id="link" 
                  name="link" 
                  value={formData.link} 
                  onChange={handleInputChange}
                />
              </FormGroup>
              
              <FormGroup>
                <Checkbox>
                  <input 
                    type="checkbox" 
                    id="featured" 
                    name="featured" 
                    checked={formData.featured} 
                    onChange={handleInputChange}
                  />
                  <Label htmlFor="featured">设为精选活动</Label>
                </Checkbox>
              </FormGroup>
              
              <ButtonGroup>
                <Button 
                  variant="cancel" 
                  type="button" 
                  onClick={handleCloseModal}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  取消
                </Button>
                <Button 
                  variant="submit" 
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  保存
                </Button>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}

      {/* 添加提示消息 */}
      <AnimatePresence>
        {toast.visible && (
          <Toast
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {toast.message}
          </Toast>
        )}
      </AnimatePresence>
    </AdminContainer>
  );
};

export default EventsAdmin; 