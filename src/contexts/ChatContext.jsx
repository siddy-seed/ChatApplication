import React, { createContext, useContext, useState, useCallback } from 'react';

const ChatContext = createContext(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const currentUser = { id: 'current-user', name: 'You' };

  // Mock contacts
  const [contacts] = useState([
    { id: 'contact-1', name: 'Alice Johnson', status: 'online', phoneNumber: '+1 234 567 8901' },
    { id: 'contact-2', name: 'Bob Smith', status: 'away', lastSeen: new Date(Date.now() - 3600000), phoneNumber: '+1 234 567 8902' },
    { id: 'contact-3', name: 'Carol Davis', status: 'online', phoneNumber: '+1 234 567 8903' },
    { id: 'contact-4', name: 'David Wilson', status: 'offline', lastSeen: new Date(Date.now() - 7200000), phoneNumber: '+1 234 567 8904' },
    { id: 'contact-5', name: 'Emma Brown', status: 'online', phoneNumber: '+1 234 567 8905' },
  ]);

  // Initial conversations
  const [conversations, setConversations] = useState([
    {
      id: 'conv-1',
      contact: contacts[0],
      lastMessage: {
        content: "Hey! How's the new project going?",
        timestamp: new Date(Date.now() - 300000),
        fromMe: false
      },
      unreadCount: 2
    },
    {
      id: 'conv-2',
      contact: contacts[1],
      lastMessage: {
        content: "Thanks for the help earlier! 👍",
        timestamp: new Date(Date.now() - 1800000),
        fromMe: true
      },
      unreadCount: 0
    },
    {
      id: 'conv-3',
      contact: contacts[2],
      lastMessage: {
        content: "Can we schedule a call for tomorrow?",
        timestamp: new Date(Date.now() - 3600000),
        fromMe: false
      },
      unreadCount: 1
    },
  ]);

  // Initial messages
  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      conversationId: 'conv-1',
      content: "Hey Alice! The project is going really well. We just finished the main features and are now working on the UI polish.",
      timestamp: new Date(Date.now() - 1800000),
      fromMe: true,
      status: 'read'
    },
    {
      id: 'msg-2',
      conversationId: 'conv-1',
      content: "That's awesome! I'd love to see the progress. Are you available for a quick demo later?",
      timestamp: new Date(Date.now() - 1500000),
      fromMe: false,
      status: 'read'
    },
    {
      id: 'msg-3',
      conversationId: 'conv-1',
      content: "Absolutely! How about 3 PM? I can show you the new features we've added.",
      timestamp: new Date(Date.now() - 900000),
      fromMe: true,
      status: 'read'
    },
    {
      id: 'msg-4',
      conversationId: 'conv-1',
      content: "Perfect! I'm really excited to see what you've built.",
      timestamp: new Date(Date.now() - 600000),
      fromMe: false,
      status: 'read'
    },
    {
      id: 'msg-5',
      conversationId: 'conv-1',
      content: "Hey! How's the new project going?",
      timestamp: new Date(Date.now() - 300000),
      fromMe: false,
      status: 'delivered'
    }
  ]);

  const [selectedConversation, setSelectedConversation] = useState('conv-1');

  const selectConversation = useCallback((id) => {
    setSelectedConversation(id);
    markAsRead(id);
  }, []);

  const sendMessage = useCallback((conversationId, content) => {
    const newMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      conversationId,
      content,
      timestamp: new Date(),
      fromMe: true,
      status: 'sending'
    };

    // Add message immediately
    setMessages(prev => [...prev, newMessage]);

    // Update conversation's last message
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? {
            ...conv,
            lastMessage: {
              content,
              timestamp: new Date(),
              fromMe: true
            }
          }
        : conv
    ));

    // Simulate message delivery progression
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
      ));
    }, 1000);

    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
      ));
    }, 2000);

    // Simulate automatic reply for demo purposes
    if (Math.random() > 0.5) {
      setTimeout(() => {
        const replyMessage = {
          id: `msg-${Date.now()}-${Math.random()}`,
          conversationId,
          content: getRandomReply(),
          timestamp: new Date(),
          fromMe: false,
          status: 'delivered'
        };

        setMessages(prev => [...prev, replyMessage]);
        setConversations(prev => prev.map(conv => 
          conv.id === conversationId 
            ? {
                ...conv,
                lastMessage: {
                  content: replyMessage.content,
                  timestamp: replyMessage.timestamp,
                  fromMe: false
                },
                unreadCount: selectedConversation === conversationId ? 0 : conv.unreadCount + 1
              }
            : conv
        ));
      }, 3000 + Math.random() * 2000);
    }
  }, [selectedConversation]);

  const markAsRead = useCallback((conversationId) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    ));

    // Mark messages as read
    setMessages(prev => prev.map(msg => 
      msg.conversationId === conversationId && !msg.fromMe
        ? { ...msg, status: 'read' }
        : msg
    ));
  }, []);

  const addConversation = useCallback((contact) => {
    const newConversation = {
      id: `conv-${Date.now()}`,
      contact,
      unreadCount: 0
    };
    setConversations(prev => [newConversation, ...prev]);
    setSelectedConversation(newConversation.id);
  }, []);

  const updateMessageStatus = useCallback((messageId, status) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, status } : msg
    ));
  }, []);

  // Auto-reply responses for demo
  const getRandomReply = () => {
    const replies = [
      "That sounds great! 👍",
      "I'm on it!",
      "Sure thing, let me check.",
      "Thanks for letting me know!",
      "Perfect timing!",
      "I was just thinking about that 🤔",
      "Absolutely! When works for you?",
      "Got it, thanks!",
      "That's exactly what I needed to hear.",
      "I'll get back to you soon!"
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  };

  const value = {
    conversations,
    messages,
    selectedConversation,
    currentUser,
    selectConversation,
    sendMessage,
    markAsRead,
    addConversation,
    updateMessageStatus
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
