import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, Phone, Video, ArrowLeft, Send } from 'lucide-react';
import { ConversationList } from './ConversationList';
import { MessageArea } from './MessageArea';
import { IconSidebar } from './IconSidebar';
import { CallsTab } from './CallsTab';
import { ArchiveTab } from './ArchiveTab';
import SettingsTab from './SettingsTab';
import { useChatContext } from '../contexts/ChatContext';
import '../styles/main.css';

export const ChatLayout = () => {
  const { 
    conversations, 
    messages, 
    selectedConversation, 
    selectConversation, 
    sendMessage 
  } = useChatContext();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileView, setIsMobileView] = useState(false);
  const [showConversationList, setShowConversationList] = useState(true);
  const [activeTab, setActiveTab] = useState('messages');

  // Check for mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
      if (window.innerWidth < 768 && selectedConversation && activeTab === 'messages') {
        setShowConversationList(false);
      } else {
        setShowConversationList(true);
      }
    }
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [selectedConversation, activeTab]);

  const selectedConversationData = conversations.find(c => c.id === selectedConversation);
  const conversationMessages = messages.filter(m => m.conversationId === selectedConversation);

  const handleConversationSelect = (conversationId) => {
    selectConversation(conversationId);
    if (isMobileView) {
      setShowConversationList(false);
    }
  };

  const handleBackToList = () => {
    if (isMobileView) {
      setShowConversationList(true);
    }
  };

  const handleSendMessage = (content) => {
    if (selectedConversation) {
      sendMessage(selectedConversation, content);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (isMobileView) {
      setShowConversationList(true);
    }
  };

  const renderLeftPanel = () => {
    const panelClass = `left-panel ${
      isMobileView 
        ? showConversationList 
          ? 'mobile-full' 
          : 'hidden' 
        : ''
    }`;

    switch (activeTab) {
      case 'messages':
        return (
          <div className={panelClass}>
            {/* Header */}
            <div className="chat-header">
              <div className="flex items-center justify-between">
                <h1>Chats</h1>
                <button className="btn btn-ghost btn-sm">
                  <MoreVertical size={20} />
                </button>
              </div>
              
              {/* Search */}
              <div className="search-container">
                <Search className="search-icon" size={16} />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="conversation-list">
              <ConversationList
                conversations={conversations}
                selectedConversation={selectedConversation}
                onConversationSelect={handleConversationSelect}
                searchQuery={searchQuery}
              />
            </div>
          </div>
        );
      
      case 'calls':
        return (
          <div className={panelClass}>
            <CallsTab />
          </div>
        );
      
      case 'archive':
        return (
          <div className={panelClass}>
            <ArchiveTab />
          </div>
        );
      
      case 'settings':
        return (
          <div className={panelClass}>
            <SettingsTab />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="chat-layout">
      {/* Icon Sidebar */}
      <IconSidebar 
        onTabChange={handleTabChange} 
        activeTab={activeTab}
      />

      {/* Left Panel (Messages/Calls/Settings/Archive) */}
      {renderLeftPanel()}

      {/* Chat Area */}
      <div className={`chat-area ${isMobileView && showConversationList ? 'hidden' : ''}`}>
        {selectedConversationData && activeTab === 'messages' ? (
          <>
            {/* Chat Header */}
            <div className="chat-area-header">
              {isMobileView && (
                <button className="btn btn-ghost btn-sm" onClick={handleBackToList}>
                  <ArrowLeft size={20} />
                </button>
              )}
              
              <div className="avatar">
                {selectedConversationData.contact.name[0]}
              </div>
              
              <div className="info">
                <div className="name">
                  {selectedConversationData.contact.name}
                </div>
                <div className="status">
                  {selectedConversationData.contact.status === 'online' 
                    ? 'Online' 
                    : selectedConversationData.contact.status === 'away'
                    ? 'Away'
                    : `Last seen ${selectedConversationData.contact.lastSeen?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'recently'}`
                  }
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="btn btn-ghost btn-sm">
                  <Phone size={20} />
                </button>
                <button className="btn btn-ghost btn-sm">
                  <Video size={20} />
                </button>
                <button className="btn btn-ghost btn-sm">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <MessageArea
              messages={conversationMessages}
              onSendMessage={handleSendMessage}
            />
          </>
        ) : (
          /* Welcome Screen */
          <div className="welcome-screen">
            <div className="welcome-content">
              <div className="welcome-icon">
                <Send size={40} />
              </div>
              <div>
                <h2 className="welcome-title">
                  {activeTab === 'messages' ? 'Welcome to ChatApp' : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
                </h2>
                <p className="welcome-description">
                  {activeTab === 'messages' 
                    ? 'Select a conversation to start messaging with your contacts.'
                    : `Manage your ${activeTab} from the sidebar.`
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
