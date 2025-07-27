import React, { useState, useRef, useEffect } from 'react';
import { format, isToday, isYesterday } from 'date-fns';
import { Send, Smile, Paperclip, Check, CheckCheck, Clock } from 'lucide-react';

export const MessageArea = ({ messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate typing indicator
  useEffect(() => {
    if (Math.random() > 0.7 && messages.length > 0) {
      const timer = setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2000 + Math.random() * 3000);
      }, 1000 + Math.random() * 2000);
      
      return () => clearTimeout(timer);
    }
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`;
    }
  };

  const formatMessageTime = (timestamp) => {
    if (isToday(timestamp)) {
      return format(timestamp, 'HH:mm');
    } else if (isYesterday(timestamp)) {
      return `Yesterday ${format(timestamp, 'HH:mm')}`;
    } else {
      return format(timestamp, 'dd/MM/yyyy HH:mm');
    }
  };

  const groupMessagesByDate = (messages) => {
    const groups = [];
    let currentDate = '';
    let currentGroup = [];

    messages.forEach(message => {
      const messageDate = format(message.timestamp, 'yyyy-MM-dd');
      
      if (messageDate !== currentDate) {
        if (currentGroup.length > 0) {
          groups.push({ date: currentDate, messages: currentGroup });
        }
        currentDate = messageDate;
        currentGroup = [message];
      } else {
        currentGroup.push(message);
      }
    });

    if (currentGroup.length > 0) {
      groups.push({ date: currentDate, messages: currentGroup });
    }

    return groups;
  };

  const formatDateHeader = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return 'Today';
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'dd MMMM yyyy');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sending':
        return <Clock size={16} />;
      case 'sent':
        return <Check size={16} />;
      case 'delivered':
        return <CheckCheck size={16} />;
      case 'read':
        return <CheckCheck size={16} style={{ color: '#3b82f6' }} />;
      default:
        return null;
    }
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col" style={{ flex: 1 }}>
      {/* Messages */}
      <div className="messages-container">
        <div style={{ gap: '1rem' }}>
          {messageGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              {/* Date divider */}
              <div className="date-divider">
                <span>{formatDateHeader(group.date)}</span>
              </div>

              {/* Messages for this date */}
              <div className="message-group">
                {group.messages.map((message) => (
                  <div key={message.id} className={`message-row ${message.fromMe ? 'own' : ''}`}>
                    <div className={`message-bubble ${message.fromMe ? 'own' : 'other'} ${message.status === 'sending' ? 'sending' : ''}`}>
                      <div className="message-content">
                        {message.content}
                      </div>
                      <div className={`message-info ${message.fromMe ? 'own' : 'other'}`}>
                        <span className="message-time">
                          {formatMessageTime(message.timestamp)}
                        </span>
                        {message.fromMe && (
                          <div style={{
                            color: message.status === 'sending' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.7)',
                            transition: 'color 0.2s ease'
                          }}>
                            {getStatusIcon(message.status)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="typing-indicator">
              <div className="typing-bubble">
                <div className="typing-dots">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="message-input-container">
        <div className="message-input-wrapper">
          <button className="btn btn-ghost btn-sm" style={{ padding: '0.5rem' }}>
            <Paperclip size={20} />
          </button>

          <div className="message-input-field">
            <textarea
              ref={textareaRef}
              value={newMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="message-textarea"
              rows={1}
            />
            <button className="emoji-button">
              <Smile size={20} />
            </button>
          </div>

          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className={`send-button ${newMessage.trim() ? 'enabled' : 'disabled'}`}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
