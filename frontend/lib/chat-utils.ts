export const upsertMessage = (prevMessages: any[], newMessage: any) => {
  // 1. Check for clientTempId (optimistic) or real ID
  const existingIndex = prevMessages.findIndex(m => 
    (newMessage.clientTempId && m.clientTempId === newMessage.clientTempId) || 
    (newMessage.id && m.id === newMessage.id)
  );

  if (existingIndex > -1) {
    // 2. Replace and explicitly mark as sent to clear 'sending' status
    const updatedMessages = [...prevMessages];
    updatedMessages[existingIndex] = { 
      ...newMessage, 
      status: 'sent' 
    };
    return updatedMessages;
  }

  // 3. Append new message
  return [...prevMessages, newMessage];
};
