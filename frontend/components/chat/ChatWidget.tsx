'use client';

import { useState, useEffect } from 'react';
import ConversationList from './ConversationList';
import ActiveChatPanel from './ActiveChatPanel';
import { authService } from '@/services/auth.service';
import { useRouter, usePathname } from 'next/navigation';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<any | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (pathname === '/login') return;
    
    authService.me().then(res => {
      setCurrentUser(res.user);
    }).catch(err => console.error("Could not fetch current user for chat", err));
  }, [mounted, pathname]);

  // Listen for custom events to handle navigation within the widget
  useEffect(() => {
    const handleBack = () => setActiveChat(null);
    const handleClose = () => setIsOpen(false);
    
    window.addEventListener('chat:back', handleBack);
    window.addEventListener('chat:close', handleClose);
    
    return () => {
      window.removeEventListener('chat:back', handleBack);
      window.removeEventListener('chat:close', handleClose);
    };
  }, []);

  if (!mounted) return null;
  if (pathname === '/login') return null;

  const handleOpenChat = () => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setIsOpen(true);
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[9999] font-sans flex flex-col items-end">
      {isOpen && (
        <div className="bg-[#e1e5ee] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] w-[calc(100vw-2rem)] md:w-[380px] h-[calc(100vh-8rem)] min-h-[400px] md:h-[620px] flex flex-col overflow-hidden transition-all duration-300 animate-scaleIn origin-bottom-right mb-4">
          {/* Main Content Area */}
          <div className="flex-1 overflow-hidden flex flex-col relative">
            {activeChat ? (
              <ActiveChatPanel chat={activeChat} currentUser={currentUser} />
            ) : (
              <div className="flex flex-col h-full overflow-hidden">
                 {/* Header for List Tab - Simplified */}
                 <div className="bg-[#29335c] px-5 py-4 shrink-0 flex justify-between items-center">
                    <h3 className="text-white text-[15px] font-semibold tracking-tight">ข้อความ</h3>
                    <button 
                       onClick={() => setIsOpen(false)} 
                       className="text-white/40 hover:text-white transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </button>
                 </div>
                 <ConversationList onSelectChat={setActiveChat} currentUser={currentUser} />
              </div>
            )}
          </div>
        </div>
      )}

      {!isOpen && (
        <button
          onClick={handleOpenChat}
          className="bg-[#29335c] text-white rounded-full shadow-[0_10px_25px_rgba(41,51,92,0.3)] transition-all hover:scale-110 hover:shadow-[0_15px_35px_rgba(41,51,92,0.4)] flex items-center justify-center w-14 h-14 ml-auto group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}
    </div>
  );
}
