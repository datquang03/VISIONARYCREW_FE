import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { FaRobot, FaTimes, FaComments, FaLightbulb, FaCog, FaTrash } from 'react-icons/fa';
import { toggleChat, updateCurrentPage, addMessage, chatWithAI, getQuickHelp, getDatabaseStats, clearNavigation } from '../../redux/APIs/slices/aiSlice';
import { useNavigate } from 'react-router-dom';
import { CustomToast } from '../Toast/CustomToast';
import { motion } from 'framer-motion';
import './AIChatBubble.css';

const AIChatBubble = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [showQuickHelp, setShowQuickHelp] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const bubbleRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 90, y: window.innerHeight - 90 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const { user, doctor } = useSelector(state => state.authSlice);
  const currentUser = user || doctor; // Get either user or doctor

  const {
    isChatOpen,
    messages,
    isLoading,
    quickHelpSuggestions,
    quickHelpLoading,
    isAIActive,
    navigation,
    databaseStats
  } = useSelector(state => state.ai);

  // Load database stats when component mounts
  useEffect(() => {
    if (currentUser && !databaseStats) {
      dispatch(getDatabaseStats());
    }
  }, [currentUser, databaseStats, dispatch]);

  // Debug messages


  // Update current page when location changes
  useEffect(() => {
    dispatch(updateCurrentPage(location.pathname));
    
    // Keep modal open when navigating (don't close on page change)
    if (isChatOpen && currentUser) { // Only call if user is logged in
      // Fetch quick help for new page
      dispatch(getQuickHelp({ currentPage: location.pathname }));
    }
  }, [location.pathname, dispatch, isChatOpen, currentUser]);

  // Get quick help when page changes
  useEffect(() => {
    if (isAIActive && location.pathname && currentUser) { // Only call if user is logged in
      dispatch(getQuickHelp({ currentPage: location.pathname }));
    }
  }, [location.pathname, dispatch, isAIActive, currentUser]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isChatOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isChatOpen]);

  // Handle navigation when AI suggests it
  useEffect(() => {
    if (navigation) {
      // Navigate after a longer delay to let user read the detailed response
      setTimeout(() => {
        // Navigate to the page (keep modal open)
        navigate(navigation);
        // Clear navigation after use to prevent re-navigation
        dispatch(clearNavigation());
      }, 5000); // 5 seconds to read the detailed response
    }
  }, [navigation, navigate, dispatch]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    // Check if user is logged in
    if (!currentUser) {
      CustomToast({
        message: 'Vui lòng đăng nhập để sử dụng AI Assistant',
        type: 'warning'
      });
      return;
    }

    const userMessage = message.trim();
    setMessage('');

    // Add user message to chat
    dispatch(addMessage({
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    }));

    try {
      // Send to AI
      await dispatch(chatWithAI({
        message: userMessage,
        currentPage: location.pathname,
        userAction: 'chat'
      })).unwrap();
    } catch (error) {
      CustomToast({
        message: error.message || 'Có lỗi xảy ra khi chat với AI',
        type: 'error'
      });
    }
  };

  const handleQuickHelpClick = async (suggestion) => {
    setShowQuickHelp(false);
    setMessage(suggestion);
    
    // Tự động gửi message khi click vào gợi ý
    try {
      await dispatch(chatWithAI({ message: suggestion })).unwrap();
      setMessage(''); // Clear input after sending
    } catch (error) {
      CustomToast({
        message: error.message || 'Có lỗi xảy ra khi chat với AI',
        type: 'error'
      });
    }
  };

  const formatMessage = (content) => {
    // Convert markdown-like formatting to HTML
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>')
      .replace(/🎯|❌|📝|📋|💳|👋|👨‍⚕️|👨‍💼|🎯|💡|⚠️|✅|🔒|📊/g, (match) => `<span class="emoji">${match}</span>`);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Drag & Drop handlers
  const handleMouseDown = (e) => {
    if (isChatOpen) return; // Don't drag when chat is open
    e.preventDefault();
    setIsDragging(true);
    const rect = bubbleRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    console.log('🖱️ Mouse down - starting drag');
  };

  const handleTouchStart = (e) => {
    if (isChatOpen) return; // Don't drag when chat is open
    e.preventDefault();
    setIsDragging(true);
    const rect = bubbleRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    // Use requestAnimationFrame for smoother performance
    requestAnimationFrame(() => {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Keep bubble within screen bounds
      const maxX = window.innerWidth - 70; // 70px is bubble width
      const maxY = window.innerHeight - 70; // 70px is bubble height
      
      const clampedX = Math.max(0, Math.min(newX, maxX));
      const clampedY = Math.max(0, Math.min(newY, maxY));
      
      setPosition(() => {
        const newPosition = {
          x: clampedX,
          y: clampedY
        };
        console.log('🔄 Moving to:', newPosition);
        return newPosition;
      });
    });
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    // Use requestAnimationFrame for smoother performance
    requestAnimationFrame(() => {
      const touch = e.touches[0];
      const newX = touch.clientX - dragOffset.x;
      const newY = touch.clientY - dragOffset.y;
      
      // Keep bubble within screen bounds
      const maxX = window.innerWidth - 70; // 70px is bubble width
      const maxY = window.innerHeight - 70; // 70px is bubble height
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add/remove event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  return (
    <>
      {/* AI Chat Bubble */}
      <AnimatePresence>
        {isAIActive && currentUser && (
          <motion.div
            ref={bubbleRef}
            className="ai-chat-bubble"
            style={{
              position: 'fixed',
              left: `${position.x}px`,
              top: `${position.y}px`,
              cursor: isDragging ? 'grabbing' : 'grab',
              zIndex: 1000,
              userSelect: 'none',
              touchAction: 'none'
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: isDragging ? 1 : 1.1 }}
            whileTap={{ scale: 0.95 }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onClick={() => !isDragging && dispatch(toggleChat())}
          >
            <FaRobot className="ai-icon" />
            <div className="ai-pulse"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Modal */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            className="ai-chat-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(toggleChat())}
          >
            <motion.div
              className="ai-chat-modal"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="ai-chat-header">
                <div className="ai-chat-title">
                  <FaRobot className="ai-header-icon" />
                  <span>AI Assistant</span>
                </div>
                <div className="ai-chat-actions">
                  <button
                    className="ai-action-btn"
                    onClick={() => setShowQuickHelp(!showQuickHelp)}
                    title="Gợi ý nhanh"
                  >
                    <FaLightbulb />
                  </button>
                  <button
                    className="ai-action-btn"
                    onClick={() => dispatch(toggleChat())}
                    title="Đóng"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              {/* Quick Help Panel */}
              <AnimatePresence>
                {showQuickHelp && (
                  <motion.div
                    className="ai-quick-help"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <h4>💡 Gợi ý nhanh</h4>
                    {quickHelpLoading ? (
                      <div className="ai-loading">Đang tải gợi ý...</div>
                    ) : (
                      <div className="ai-suggestions">
                        {Array.isArray(quickHelpSuggestions) && quickHelpSuggestions.length > 0 ? (
                          quickHelpSuggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              className="ai-suggestion-btn"
                              onClick={() => handleQuickHelpClick(suggestion)}
                            >
                              {suggestion}
                            </button>
                          ))
                        ) : (
                          <div className="ai-loading">Không có gợi ý cho trang này</div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Messages */}
              <div className="ai-messages">
                {messages.length === 0 ? (
                  <div className="ai-welcome">
                    <FaRobot className="ai-welcome-icon" />
                    <h3>Xin chào! 👋</h3>
                    <p>Tôi là trợ lý AI của VISIONARY CREW</p>
                    <p>Hãy hỏi tôi bất cứ điều gì về website này!</p>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <motion.div
                      key={index}
                      className={`ai-message ${msg.role === 'user' ? 'ai-user-message' : 'ai-assistant-message'}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="ai-message-content">
                        <div
                          className="ai-message-text"
                          dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                        />
                        <div className="ai-message-time">
                          {formatTime(msg.timestamp)}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
                {isLoading && (
                  <motion.div
                    className="ai-message ai-assistant-message"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="ai-message-content">
                      <div className="ai-typing">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>



              {/* Input */}
              <form className="ai-input-container" onSubmit={handleSendMessage}>
                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  className="ai-input"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="ai-send-btn"
                  disabled={!message.trim() || isLoading}
                >
                  <FaComments />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatBubble; 