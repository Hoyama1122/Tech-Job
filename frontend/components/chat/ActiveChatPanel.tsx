'use client';

import { useState, useEffect, useRef } from "react";
import { chatService } from "@/services/chat.service";
import { getSocket } from "../../services/socket";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useChatSocket } from "@/hooks/useChatSocket";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";

// ─────────────────────────────────────────────────────────────────────────────
// ActiveChatPanel
// Composes: ChatHeader + MessageList (inline) + ChatInput
// All chat logic is preserved; only UI layer is updated.
// ─────────────────────────────────────────────────────────────────────────────

export default function ActiveChatPanel({
  chat,
  currentUser,
}: {
  chat: any;
  currentUser: any;
}) {
  const { messages, addOrUpdateMessage, setInitialMessages, markMessagesAsRead } =
    useChatMessages();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ── Scroll helpers ──────────────────────────────────────────────────────────
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ── Initial fetch ───────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await chatService.getMessages(chat.partnerData?.id);
        setInitialMessages(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (chat.partnerData?.id) fetchMessages();

    if (chat.id && chat.id !== 'temp-id') {
      const socket = getSocket();
      socket.emit("mark_as_read", { conversationId: chat.id });
    }
  }, [chat.id, chat.partnerData?.id, setInitialMessages]);

  // ── Socket listeners ────────────────────────────────────────────────────────
  useChatSocket({
    activeConversationId: chat.id,
    partnerId: chat.partnerData?.id,
    onMessageReceived: (msg) => {
      addOrUpdateMessage(msg);

      if (Number(msg.senderId) !== Number(currentUser?.id)) {
        const socket = getSocket();
        socket.emit("mark_as_read", { conversationId: chat.id });
      }
    },
  });

  useEffect(() => {
    const socket = getSocket();
    const handleRead = ({ conversationId }: { conversationId: number }) => {
      if (Number(conversationId) === Number(chat.id)) {
        markMessagesAsRead();
      }
    };

    socket.on("messages_read", handleRead);
    return () => {
      socket.off("messages_read", handleRead);
    };
  }, [chat.id, currentUser?.id, markMessagesAsRead]);

  // ── Send message ────────────────────────────────────────────────────────────
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const clientTempId = `temp-${Date.now()}`;
    const socket = getSocket();

    const optimisticMsg = {
      id: clientTempId,
      clientTempId,
      senderId: currentUser?.id,
      content: input,
      createdAt: new Date().toISOString(),
      status: "sending",
    };

    addOrUpdateMessage(optimisticMsg);
    setInput("");

    socket.emit(
      "send_message",
      {
        receiverId: chat.partnerData?.id,
        conversationId: chat.id,
        content: input,
        clientTempId,
      },
      (ack: any) => {
        if (ack.status === "sent") {
          addOrUpdateMessage(ack.message);
        }
      }
    );
  };

  // ── Derive participant display name ─────────────────────────────────────────
  const partner = chat.partnerData;
  const participantName = partner?.profile?.firstname
    ? `${partner.profile.firstname} ${partner.profile.lastname || ""}`.trim()
    : partner?.name || partner?.email || "Unknown";

  // For now isOnline is always true (socket presence not implemented);
  // swap with real presence signal when available.
  const isOnline = true;

  // ── Handlers passed to header ───────────────────────────────────────────────
  const handleBack = () => window.dispatchEvent(new CustomEvent("chat:back"));
  const handleClose = () => window.dispatchEvent(new CustomEvent("chat:close"));

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full bg-[#e1e5ee] animate-fadeIn">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <ChatHeader
        participantName={participantName}
        isOnline={isOnline}
        onBack={handleBack}
        onClose={handleClose}
      />

      {/* ── Message list ───────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 scroll-smooth chat-scroll">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full opacity-30 text-center">
            <p className="text-[12px] text-[#29335c] font-medium">
              ยังไม่มีข้อความส่งถึงกัน
            </p>
            <p className="text-[11px] text-[#4a4a4a] mt-1">
              ทักทาย {participantName} ได้เลย
            </p>
          </div>
        )}

        {messages.map((msg) => {
          const isMine = Number(msg.senderId) === Number(currentUser?.id);
          const isTemp = msg.id.toString().startsWith("temp-");

          return (
            <div
              key={msg.id}
              className={`flex ${isMine ? "justify-end" : "justify-start"} items-end gap-1.5 animate-slideUp`}
            >
              {/* ── Bubble ── */}
              <div
                className={[
                  "max-w-[85%] px-4 py-2.5 transition-all duration-200",
                  isMine
                    ? "bg-[#29335c] text-white rounded-2xl rounded-br-sm shadow-sm"
                    : "bg-[#f1f1f1] text-[#1a1a1a] rounded-2xl rounded-bl-sm shadow-sm",
                ].join(" ")}
              >
                {/* Message text */}
                <p className="text-[14px] md:text-[15px] leading-[1.6] break-words">
                  {msg.content}
                </p>

                {/* Time + read status */}
                <div className="flex items-center gap-1.5 mt-[4px] justify-end">
                  <span
                    className={`text-[10px] leading-none font-medium ${
                      isMine ? "text-white/40" : "text-[#4a4a4a]/40"
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>

                  {/* Read receipt (only for my messages) */}
                  {isMine && (
                    <span className="ml-0.5 flex items-center">
                      {isTemp ? (
                        /* Sending spinner */
                        <svg
                          className="animate-spin h-2.5 w-2.5 text-white/30"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      ) : msg.isRead ? (
                        /* Double tick – read (accent) */
                        <span className="flex -space-x-[5px]">
                          <TickIcon className="w-2.5 h-2.5 text-[#e99f0c]" />
                          <TickIcon className="w-2.5 h-2.5 text-[#e99f0c]" />
                        </span>
                      ) : (
                        /* Single tick – sent (grey) */
                        <TickIcon className="w-2.5 h-2.5 text-white/30" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input ──────────────────────────────────────────────────────────── */}
      <ChatInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
        disabled={false}
        placeholder={`ส่งข้อความถึง ${participantName}…`}
      />
    </div>
  );
}

// ── Shared mini icon ──────────────────────────────────────────────────────────
function TickIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
