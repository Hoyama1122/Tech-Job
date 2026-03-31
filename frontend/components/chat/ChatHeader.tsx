'use client';

// ─────────────────────────────────────────────────────────────────────────────
// ChatHeader
// Props:
//   participantName  – ชื่อจริงของคู่สนทนา (เช่น "สมหญิง รักษ์ดี")
//   avatarInitial    – ตัวอักษรแรกสำหรับ avatar (optional, ใช้ participantName แทนได้)
//   isOnline         – true = แสดงจุดเขียว + "Online now"
//   onBack           – ปุ่มกลับ (→ conversation list)
//   onClose          – ปุ่มปิด widget
// ─────────────────────────────────────────────────────────────────────────────

interface ChatHeaderProps {
  participantName: string;
  avatarInitial?: string;
  isOnline?: boolean;
  onBack: () => void;
  onClose: () => void;
}

export default function ChatHeader({
  participantName,
  avatarInitial,
  isOnline = false,
  onBack,
  onClose,
}: ChatHeaderProps) {
  const initial =
    avatarInitial?.toUpperCase() ||
    participantName?.charAt(0)?.toUpperCase() ||
    'U';

  return (
    <div className="bg-[#29335c] px-3 py-2.5 flex items-center gap-2.5 shrink-0 select-none">
      {/* ── Back Button ── */}
      <button
        onClick={onBack}
        className="text-white/50 hover:text-white transition-colors p-1.5 -ml-1 rounded-lg hover:bg-white/10 shrink-0"
        aria-label="Go back"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
      </button>

      {/* ── Avatar ── */}
      <div className="relative shrink-0">
        <div className="w-10 h-10 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-white font-semibold text-[14px]">
          {initial}
        </div>
        {/* Online dot on avatar */}
        {isOnline && (
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#29335c] rounded-full block" />
        )}
      </div>

      {/* ── Name & Status ── */}
      <div className="flex-1 min-w-0">
        <h3 className="text-white text-[15px] font-semibold leading-none truncate tracking-tight">
          {participantName}
        </h3>
        <p className="text-[11px] mt-[4px] font-medium tracking-wide leading-none">
          {isOnline ? (
            <span className="text-emerald-400/90 italic">กำลังออนไลน์</span>
          ) : (
            <span className="text-white/35">ออฟไลน์</span>
          )}
        </p>
      </div>

      {/* ── Close Button ── */}
      <button
        onClick={onClose}
        className="text-white/40 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10 shrink-0"
        aria-label="Close chat"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
