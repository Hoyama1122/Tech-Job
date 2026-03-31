import { useState, useCallback } from 'react';
import { upsertMessage } from '@/lib/chat-utils';

export const useChatMessages = (initialMessages: any[] = []) => {
  const [messages, setMessages] = useState<any[]>(initialMessages);

  const addOrUpdateMessage = useCallback((msg: any) => {
    setMessages((prev) => upsertMessage(prev, msg));
  }, []);

  const setInitialMessages = useCallback((msgs: any[]) => {
    setMessages(msgs);
  }, []);

  const markMessagesAsRead = useCallback(() => {
    setMessages((prev) => prev.map(m => ({ ...m, isRead: true })));
  }, []);

  return { messages, addOrUpdateMessage, setInitialMessages, markMessagesAsRead };
};
