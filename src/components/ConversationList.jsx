import React from 'react';
import { format, isToday, isYesterday } from 'date-fns';

export const ConversationList = ({
  conversations,
  selectedConversation,
  onConversationSelect,
  searchQuery
}) => {
  const formatMessageTime = (timestamp) => {
    if (isToday(timestamp)) {
      return format(timestamp, 'HH:mm');
    } else if (isYesterday(timestamp)) {
      return 'Yesterday';
    } else {
      return format(timestamp, 'dd/MM/yyyy');
    }
  };

  const filteredConversations = conversations.filter(conversation =>
    conversation.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const truncateMessage = (message, maxLength = 50) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  // Sort conversations by last message timestamp
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    const aTime = a.lastMessage?.timestamp || new Date(0);
    const bTime = b.lastMessage?.timestamp || new Date(0);
    return bTime.getTime() - aTime.getTime();
  });

  return (
    <div>
      {sortedConversations.map((conversation) => (
        <button
          key={conversation.id}
          onClick={() => onConversationSelect(conversation.id)}
          className={`conversation-item ${selectedConversation === conversation.id ? 'selected' : ''}`}
        >
          {/* Avatar */}
          <div className="avatar">
            {conversation.contact.name[0]}
            {conversation.contact.status === 'online' && (
              <div className="online-indicator"></div>
            )}
            {conversation.contact.status === 'away' && (
              <div className="online-indicator away-indicator"></div>
            )}
          </div>

          {/* Content */}
          <div className="content">
            <div className="flex items-center justify-between">
              <h3 className="name">
                {conversation.contact.name}
              </h3>
              {conversation.lastMessage && (
                <span className="time">
                  {formatMessageTime(conversation.lastMessage.timestamp)}
                </span>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <p className="message">
                {conversation.lastMessage ? (
                  <span>
                    {conversation.lastMessage.fromMe && (
                      <span style={{ color: '#3b82f6', marginRight: '4px' }}>You: </span>
                    )}
                    {truncateMessage(conversation.lastMessage.content)}
                  </span>
                ) : (
                  <span style={{ fontStyle: 'italic' }}>No messages yet</span>
                )}
              </p>
              
              {conversation.unreadCount > 0 && (
                <div className="badge">
                  {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                </div>
              )}
            </div>
          </div>
        </button>
      ))}

      {sortedConversations.length === 0 && (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
          <p>No conversations found</p>
          {searchQuery && (
            <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Try searching for something else</p>
          )}
        </div>
      )}
    </div>
  );
};
