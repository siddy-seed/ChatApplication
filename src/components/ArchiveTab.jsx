import React from 'react';
import { Archive, ArchiveRestore } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';

export const ArchiveTab = () => {
  const archivedChats = [
    {
      id: '1',
      contactName: 'Old Project Team',
      lastMessage: 'Thanks for all the hard work everyone!',
      timestamp: new Date(Date.now() - 2592000000), // 30 days ago
      unreadCount: 0
    },
    {
      id: '2',
      contactName: 'Marketing Group',
      lastMessage: 'The campaign was a success! 🎉',
      timestamp: new Date(Date.now() - 1209600000), // 14 days ago
      unreadCount: 3
    },
    {
      id: '3',
      contactName: 'Family Chat',
      lastMessage: 'Looking forward to the reunion!',
      timestamp: new Date(Date.now() - 604800000), // 7 days ago
      unreadCount: 0
    }
  ];

  const formatTime = (timestamp) => {
    if (isToday(timestamp)) {
      return format(timestamp, 'HH:mm');
    } else if (isYesterday(timestamp)) {
      return 'Yesterday';
    } else {
      return format(timestamp, 'dd/MM/yyyy');
    }
  };

  const truncateMessage = (message, maxLength = 40) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  return (
    <div className="flex flex-col" style={{ flex: 1 }}>
      {/* Header */}
      <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
        <div className="flex items-center justify-between">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Archived</h2>
          <Archive size={20} style={{ color: '#6b7280' }} />
        </div>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
          {archivedChats.length} archived conversations
        </p>
      </div>

      {/* Archived Chats */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {archivedChats.length > 0 ? (
          <div>
            {archivedChats.map((chat) => (
              <div
                key={chat.id}
                className="group"
                style={{
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
                  transition: 'background-color 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(243, 244, 246, 0.5)';
                  const button = e.currentTarget.querySelector('.unarchive-button');
                  if (button) button.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  const button = e.currentTarget.querySelector('.unarchive-button');
                  if (button) button.style.opacity = '0';
                }}
              >
                <div className="avatar" style={{ backgroundColor: '#f3f4f6', color: '#6b7280' }}>
                  {chat.contactName[0]}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: '0.25rem' }}>
                    <h3 style={{ 
                      fontWeight: 500, 
                      color: '#111827',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {chat.contactName}
                    </h3>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      color: '#6b7280', 
                      marginLeft: '0.5rem',
                      flexShrink: 0
                    }}>
                      {formatTime(chat.timestamp)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p style={{ 
                      fontSize: '0.875rem', 
                      color: '#6b7280',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      flex: 1
                    }}>
                      {truncateMessage(chat.lastMessage)}
                    </p>
                    
                    {chat.unreadCount > 0 && (
                      <div className="badge" style={{ 
                        backgroundColor: '#6b7280',
                        marginLeft: '0.5rem'
                      }}>
                        {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  className="btn btn-ghost unarchive-button"
                  style={{ 
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                    width: '32px',
                    height: '32px',
                    padding: 0
                  }}
                  title="Unarchive"
                >
                  <ArchiveRestore size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center" style={{ flex: 1 }}>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#f3f4f6',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                color: '#6b7280'
              }}>
                <Archive size={32} />
              </div>
              <div>
                <h3 style={{ fontWeight: 500, color: '#111827', marginBottom: '0.25rem' }}>
                  No archived chats
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Archived conversations will appear here
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
