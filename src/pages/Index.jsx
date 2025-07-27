import React from 'react';
import { ChatLayout } from '../components/ChatLayout';
import { ChatProvider } from '../contexts/ChatContext';

const Index = () => {
  return (
    <ChatProvider>
      <ChatLayout />
    </ChatProvider>
  );
};

export default Index;
