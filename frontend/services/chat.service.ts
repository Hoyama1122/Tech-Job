 import api from "@/lib/axiosClient";

export const chatService = {
  getConversations: async () => {
    const res = await api.get('/chat/conversations', {
      withCredentials: true,
    });
    return res;
  },

  getContacts: async () => {
    const res = await api.get('/chat/contacts', {
      withCredentials: true,
    });
    return res;
  },

  getMessages: async (receiverId: number | string) => {
    const res = await api.get(`/chat/messages/${receiverId}`, {
      withCredentials: true,
    });
    return res;
  },

  searchMessages: async (conversationId: number, query: string, page = 1) => {
    const res = await api.get(`/chat/messages/${conversationId}/search?q=${query}&page=${page}`, {
      withCredentials: true,
    });
    return res;
  }
};
