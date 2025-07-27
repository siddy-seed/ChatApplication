import React from 'react';
import { 
  MessageCircle, 
  Phone, 
  Settings, 
  Archive
} from 'lucide-react';
import { useChatContext } from '../contexts/ChatContext';

export const IconSidebar = ({ onTabChange, activeTab }) => {
  const { conversations } = useChatContext();
  
  const unreadCount = conversations.reduce((total, conv) => total + conv.unreadCount, 0);

  const sidebarItems = [
    { 
      id: 'messages', 
      icon: MessageCircle, 
      label: 'Messages',
      hasNotification: unreadCount > 0
    },
    { 
      id: 'calls', 
      icon: Phone, 
      label: 'Calls' 
    },
    { 
      id: 'settings', 
      icon: Settings, 
      label: 'Settings' 
    },
    { 
      id: 'archive', 
      icon: Archive, 
      label: 'Archive' 
    },
  ];

  return (
    <div className="icon-sidebar">
      {sidebarItems.map((item) => (
        <div key={item.id} style={{ position: 'relative' }}>
          <button
            className={`icon-button ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => onTabChange(item.id)}
            title={item.label}
          >
            <item.icon size={24} />
          </button>
          
          {/* Notification dot */}
          {item.hasNotification && (
            <div className="notification-dot"></div>
          )}
        </div>
      ))}
    </div>
  );
};
