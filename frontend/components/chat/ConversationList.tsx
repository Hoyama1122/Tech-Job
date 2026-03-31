'use client';

import { useState, useEffect } from 'react';
import { chatService } from '@/services/chat.service';
import { getSocket } from '@/services/socket';
import ChatSearchBar from './ChatSearchBar';

export default function ConversationList({ onSelectChat, currentUser }: { onSelectChat: (chat: any) => void, currentUser: any }) {
  const [conversations, setConversations] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'chats' | 'contacts'>('chats');
  const [searchQuery, setSearchQuery] = useState("");

  // Load Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'chats') {
          const res = await chatService.getConversations();
          setConversations(res.data);
        } else {
          const res = await chatService.getContacts();
          setContacts(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [activeTab]);

  // Real-time Update Listeners
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNewMessage = (msg: any) => {
      setConversations((prev) => {
        const existingIdx = prev.findIndex(c => Number(c.id) === Number(msg.conversationId));
        let updatedList = [...prev];
        const isMine = Number(msg.senderId) === Number(currentUser?.id);

        if (existingIdx > -1) {
          const updatedConv = { ...updatedList[existingIdx] };
          updatedConv.lastMessage = msg;
          updatedConv.lastMessageStatus = isMine ? (msg.isRead ? 'read' : 'sent') : 'received';
          if (!isMine) updatedConv.unreadCount = (updatedConv.unreadCount || 0) + 1;
          
          updatedList.splice(existingIdx, 1);
          updatedList.unshift(updatedConv);
        }
        return updatedList;
      });
    };

    const handleReadReceipt = ({ conversationId }: { conversationId: number }) => {
      setConversations((prev) => prev.map(conv => {
        if (Number(conv.id) === Number(conversationId)) {
          return {
            ...conv,
            unreadCount: 0,
            lastMessageStatus: conv.lastMessageStatus === 'sent' ? 'read' : conv.lastMessageStatus,
            lastMessage: conv.lastMessage ? { ...conv.lastMessage, isRead: true } : null
          };
        }
        return conv;
      }));
    };

    socket.on("receive_message", handleNewMessage);
    socket.on("messages_read", handleReadReceipt);

    return () => {
      socket.off("receive_message", handleNewMessage);
      socket.off("messages_read", handleReadReceipt);
    };
  }, [currentUser?.id]);

  return (
    <div className="flex flex-col h-full bg-[#e1e5ee] animate-fadeIn">
      {/* Search Bar - Client Side Only */}
      <div className="px-4 pt-3 pb-1 bg-[#29335c]/5">
        <ChatSearchBar 
          placeholder={activeTab === 'chats' ? "ค้นหาแชท..." : "ค้นหาชื่อพนักงาน..."}
          onSearch={setSearchQuery}
        />
      </div>

      {/* 2. Tabs: Minimal Flat */}
      <div className="flex px-4 py-2 gap-1 bg-[#29335c]/5">
        <button 
          className={`flex-1 py-1.5 text-[11px] font-bold uppercase tracking-widest transition rounded-lg ${activeTab === 'chats' ? 'bg-[#29335c] text-white' : 'text-[#4a4a4a] hover:bg-[#29335c]/10'}`}
          onClick={() => setActiveTab('chats')}
        >
          ประวัติการแชท
        </button>
        <button 
          className={`flex-1 py-1.5 text-[11px] font-bold uppercase tracking-widest transition rounded-lg ${activeTab === 'contacts' ? 'bg-[#29335c] text-white' : 'text-[#4a4a4a] hover:bg-[#29335c]/10'}`}
          onClick={() => setActiveTab('contacts')}
        >
          รายชื่อพนักงาน
        </button>
      </div>

      <div className="flex-1 overflow-y-auto mt-2">
        {loading && <div className="p-6 text-center text-[12px] text-[#4a4a4a]/40 font-medium">กำลังโหลด...</div>}
        
        {/* Filtering Conversations */}
        {!loading && activeTab === 'chats' && conversations
          .filter(c => 
            c.otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
            c.lastMessage?.content?.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .length === 0 && (
          <div className="p-10 text-center flex flex-col items-center opacity-40 grayscale">
             <p className="text-[14px] font-medium text-[#29335c]">
               {searchQuery ? "ไม่พบผลลัพธ์ที่ค้นหา" : "ยังไม่มีประวัติการแชท"}
             </p>
             <p className="text-[11px] mt-1">
               {searchQuery ? "ลองเปลี่ยนคำค้นหาใหม่" : "เลือกรายชื่อพนักงานเพื่อเริ่มการสนทนา"}
             </p>
          </div>
        )}

        {/* 3. Conversation Items */}
        {!loading && activeTab === 'chats' && conversations
          .filter(c => 
            c.otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
            c.lastMessage?.content?.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((conv: any) => {
          const { otherUser, lastMessage, unreadCount, lastMessageStatus } = conv;
          const isUnread = lastMessageStatus === 'received' && unreadCount > 0;
          
          return (
            <div 
              key={conv.id} 
              onClick={() => onSelectChat({ ...conv, partnerData: otherUser })}
              className={`px-5 py-3 hover:bg-[#f1f1f1]/60 cursor-pointer transition-all border-b border-[#29335c]/5 flex items-center gap-4 relative group`}
            >
              {/* Profile Ring */}
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#29335c] font-bold text-base border border-[#29335c]/10 shadow-sm grow-0 shrink-0">
                {otherUser?.name?.charAt(0) || "U"}
              </div>

              {/* Text Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h4 className={`text-base truncate transition-colors ${isUnread ? 'font-bold text-[#29335c]' : 'font-medium text-[#4a4a4a]'}`}>
                    {otherUser?.name}
                  </h4>
                  <span className="text-[10px] text-[#4a4a4a]/40 font-medium uppercase">
                    {lastMessage ? new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 mt-0.5">
                  {/* Status Indicator */}
                  {lastMessageStatus === 'sent' && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-2.5 h-2.5 text-[#4a4a4a]/30">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                    </svg>
                  )}
                  {lastMessageStatus === 'read' && (
                    <div className="flex -space-x-1.5 grow-0">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-2.5 h-2.5 text-[#e99f0c]">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-2.5 h-2.5 text-[#e99f0c]">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  
                  <p className={`text-sm truncate transition-all ${isUnread ? 'font-semibold text-[#29335c]' : 'text-[#4a4a4a]/60'}`}>
                    {lastMessage?.content || "เริ่มการสนทนาแบบส่วนตัว"}
                  </p>
                </div>
              </div>

              {/* 3. Accent Dot (Minimal Unread) */}
              {isUnread && (
                <div className="w-2 h-2 bg-[#e99f0c] rounded-full shadow-[0_0_8px_rgba(233,159,12,0.6)] shrink-0"></div>
              )}
            </div>
          );
        })}

        {/* Directory Tab */}
        {!loading && activeTab === 'contacts' && contacts
          .filter(c => 
            c.profile?.firstname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.profile?.lastname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.email?.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((contact: any) => (
          <div 
            key={contact.id} 
            onClick={() => onSelectChat({ id: null, partnerData: contact })}
            className="px-5 py-3 hover:bg-[#f1f1f1]/60 cursor-pointer transition-all border-b border-[#29335c]/5 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#29335c] font-bold text-[13px] border border-[#29335c]/10">
              {contact?.profile?.firstname?.charAt(0) || contact?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
                <h4 className="text-[14px] font-medium text-[#4a4a4a]">{contact?.profile?.firstname ? `${contact.profile.firstname} ${contact.profile.lastname || ''}` : contact.email}</h4>
                <div className="inline-flex mt-0.5 items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-tighter bg-[#29335c]/5 text-[#29335c]">
                   {contact.role}
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
