import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getConversations, 
  getConversationMessages, 
  sendMessage, 
  markMessagesAsRead,
  deleteMessage,
  getUnreadCount,
  setCurrentConversation,
  clearMessages
} from '../../redux/APIs/slices/messageSlice';
import socketService from '../../utils/socket';
import { FaPaperPlane, FaSearch, FaTrash, FaUser, FaUserMd, FaLock, FaUnlock, FaCheckCircle, FaClock } from 'react-icons/fa';
import { CustomToast } from '../../components/Toast/CustomToast';

const DoctorChatPage = () => {
  const dispatch = useDispatch();
  const { doctor } = useSelector(state => state.authSlice);
  const { 
    conversations, 
    messages, 
    currentConversation, 
    unreadCount,
    isLoading, 
    isSending,
    pagination 
  } = useSelector(state => state.messageSlice);

  const [messageText, setMessageText] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    if (doctor?._id) {
      socketService.connect(doctor._id, 'Doctor');
    }

    return () => {
      socketService.disconnect();
    };
  }, [doctor]);

  // Load conversations on mount
  useEffect(() => {
    if (doctor?._id) {
      dispatch(getConversations());
      dispatch(getUnreadCount());
    }
  }, [dispatch, doctor]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle conversation selection
  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    dispatch(setCurrentConversation(conversation.conversationId));
    dispatch(getConversationMessages({ 
      conversationId: conversation.conversationId, 
      page: 1, 
      limit: 50 
    }));
    
    // Mark messages as read
    if (conversation.unreadCount > 0) {
      dispatch(markMessagesAsRead(conversation.conversationId));
    }
  };

  // Handle send message
  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return;

    const messageData = {
      receiverId: selectedConversation.otherUser.id,
      receiverType: selectedConversation.otherUser.type,
      content: messageText.trim(),
      messageType: 'text'
    };

    try {
      await dispatch(sendMessage(messageData)).unwrap();
      setMessageText('');
      inputRef.current?.focus();
    } catch (error) {
      CustomToast.error(error || 'Lỗi gửi tin nhắn');
    }
  };

  // Handle typing events
  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      socketService.emitTypingStart(
        selectedConversation?.conversationId, 
        selectedConversation?.otherUser.id
      );
    }

    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set new timeout
    const timeout = setTimeout(() => {
      setIsTyping(false);
      socketService.emitTypingStop(
        selectedConversation?.conversationId, 
        selectedConversation?.otherUser.id
      );
    }, 1000);

    setTypingTimeout(timeout);
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Hôm qua';
    } else if (diffDays > 1) {
      return date.toLocaleDateString('vi-VN');
    } else {
      return date.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  // Check if conversation is unlocked (doctor approved schedule)
  const isConversationUnlocked = (conversation) => {
    // This should check if the doctor has approved a schedule for this user
    // For now, we'll assume it's unlocked if there's a conversation
    return conversation && conversation.lastMessage;
  };

  // Get schedule status for user
  const getScheduleStatus = (conversation) => {
    // This should check the actual schedule status from the database
    // For now, we'll return a mock status
    return {
      hasApprovedSchedule: true, // This should be fetched from schedule data
      scheduleDate: '2024-01-15',
      scheduleTime: '09:00'
    };
  };

  // Filter conversations by search
  const filteredConversations = conversations.filter(conv => {
    const searchLower = searchQuery.toLowerCase();
    return (
      conv.otherUser.name.toLowerCase().includes(searchLower) ||
      conv.lastMessage?.content.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Conversation List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Tin nhắn bệnh nhân</h1>
          <div className="mt-3 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm bệnh nhân..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Đang tải...</p>
            </div>
          ) : filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => {
              const scheduleStatus = getScheduleStatus(conversation);
              const isUnlocked = isConversationUnlocked(conversation);
              
              return (
                <div
                  key={conversation.conversationId}
                  onClick={() => handleConversationSelect(conversation)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversation?.conversationId === conversation.conversationId
                      ? 'bg-blue-50 border-blue-200'
                      : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <FaUser className="text-gray-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {conversation.otherUser.name}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {formatDate(conversation.lastMessage?.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.lastMessage?.content || 'Chưa có tin nhắn'}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center mt-1 space-x-2">
                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                          Bệnh nhân
                        </span>
                        {scheduleStatus.hasApprovedSchedule ? (
                          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                            <FaCheckCircle className="inline mr-1" />
                            Đã duyệt lịch
                          </span>
                        ) : (
                          <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                            <FaClock className="inline mr-1" />
                            Chờ duyệt
                          </span>
                        )}
                        {!isUnlocked && (
                          <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                            <FaLock className="inline mr-1" />
                            Khóa chat
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center text-gray-500">
              <FaUserMd className="text-4xl text-gray-300 mx-auto mb-4" />
              <p>Chưa có cuộc trò chuyện nào</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <FaUser className="text-gray-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {selectedConversation.otherUser.name}
                    </h2>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        Bệnh nhân
                      </span>
                      {getScheduleStatus(selectedConversation).hasApprovedSchedule ? (
                        <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
                          <FaCheckCircle className="inline mr-1" />
                          Đã duyệt lịch hẹn
                        </span>
                      ) : (
                        <span className="text-sm text-orange-600 bg-orange-100 px-2 py-1 rounded">
                          <FaClock className="inline mr-1" />
                          Chờ duyệt lịch hẹn
                        </span>
                      )}
                      {isConversationUnlocked(selectedConversation) ? (
                        <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
                          <FaUnlock className="inline mr-1" />
                          Chat đã mở
                        </span>
                      ) : (
                        <span className="text-sm text-orange-600 bg-orange-100 px-2 py-1 rounded">
                          <FaLock className="inline mr-1" />
                          Chat bị khóa
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    Lịch hẹn: {getScheduleStatus(selectedConversation).scheduleDate}
                  </p>
                  <p className="text-sm text-gray-600">
                    Giờ: {getScheduleStatus(selectedConversation).scheduleTime}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {isLoading ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Đang tải tin nhắn...</p>
                </div>
              ) : !isConversationUnlocked(selectedConversation) ? (
                <div className="text-center py-8">
                  <FaLock className="text-6xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Chat chưa được mở khóa
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Bạn cần duyệt lịch hẹn của bệnh nhân trước khi có thể nhắn tin
                  </p>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    Duyệt lịch hẹn
                  </button>
                </div>
              ) : messages.length > 0 ? (
                messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${message.senderId._id === doctor._id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderId._id === doctor._id
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs opacity-75">
                          {message.senderName}
                        </span>
                        <span className="text-xs opacity-75">
                          {formatDate(message.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                      {message.isRead && message.senderId._id === doctor._id && (
                        <div className="text-xs opacity-75 mt-1 text-right">
                          ✓ Đã đọc
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Chưa có tin nhắn nào</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            {isConversationUnlocked(selectedConversation) && (
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <textarea
                      ref={inputRef}
                      value={messageText}
                      onChange={(e) => {
                        setMessageText(e.target.value);
                        handleTyping();
                      }}
                      onKeyPress={handleKeyPress}
                      placeholder="Nhập tin nhắn..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="1"
                      disabled={isSending}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || isSending}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSending ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <FaPaperPlane />
                    )}
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <FaUserMd className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chọn bệnh nhân
              </h3>
              <p className="text-gray-600">
                Chọn một bệnh nhân để bắt đầu nhắn tin
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorChatPage; 