import { useEffect, useRef } from 'react';
import { getSocket } from '@/services/socket';

type SocketConfig = {
  activeConversationId: number | string | null;
  partnerId?: number | string | null;
  onMessageReceived: (msg: any) => void;
};

export const useChatSocket = ({ activeConversationId, partnerId, onMessageReceived }: SocketConfig) => {
  const handlerRef = useRef(onMessageReceived);
  handlerRef.current = onMessageReceived;

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const eventName = "receive_message";

    const internalHandler = (msg: any) => {
      // Check if message belongs to active conversation
      // OR if it's a new conversation (no ID yet), check if sender/receiver matches our partner
      const comesFromCurrentPartner = 
        partnerId && (Number(msg.senderId) === Number(partnerId) || Number(msg.receiverId) === Number(partnerId));
      
      const isCurrentChat = 
        (activeConversationId && Number(msg.conversationId) === Number(activeConversationId)) ||
        (!activeConversationId && comesFromCurrentPartner);

      if (isCurrentChat) {
        handlerRef.current(msg);
      }
    };

    // Clean up and re-bind
    socket.off(eventName);
    socket.on(eventName, internalHandler);

    return () => {
      socket.off(eventName, internalHandler);
    };
  }, [activeConversationId, partnerId]);
};
