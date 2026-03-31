'use client';

import { useRef, useEffect } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// ChatInput  – pill-style input footer
// Props:
//   value      – controlled input value
//   onChange   – setter callback
//   onSend     – form submit handler
//   disabled   – disable when not ready (e.g. socket not connected)
//   placeholder – optional custom placeholder text
// ─────────────────────────────────────────────────────────────────────────────

interface ChatInputProps {
  value: string;
  onChange: (val: string) => void;
  onSend: (e: React.FormEvent) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({
  value,
  onChange,
  onSend,
  disabled = false,
  placeholder = 'พิมพ์ข้อความ…',
}: ChatInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    if (!disabled) inputRef.current?.focus();
  }, [disabled]);

  const canSend = value.trim().length > 0 && !disabled;

  return (
    /* ── Footer wrapper ── same bg as message area so it blends seamlessly */
    <div className="px-3 py-2.5 bg-[#e1e5ee] border-t border-[#29335c]/6 shrink-0">
      <form
        onSubmit={onSend}
        className="flex items-center gap-2"
        aria-label="Send a message"
      >
        {/* ── Pill Input ── */}
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            id="chat-message-input"
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete="off"
            className={[
              'w-full bg-white text-[#1a1a1a] text-sm md:text-base',
              'pl-5 pr-5 py-3',
              'rounded-full',
              'border border-transparent',
              'outline-none',
              'transition-all duration-200',
              'placeholder-[#4a4a4a]/35',
              'shadow-[0_1px_3px_rgba(0,0,0,0.06)]',
              'focus:border-[#e99f0c]/30 focus:shadow-[0_0_0_4px_rgba(233,159,12,0.08)]',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              'autofill-light',
            ].join(' ')}
            onKeyDown={(e) => {
              // Allow Shift+Enter for newline in textarea variant, but here Enter sends
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (canSend) onSend(e as unknown as React.FormEvent);
              }
            }}
          />
        </div>

        {/* ── Send Button (circle, accent color) ── */}
        <button
          type="submit"
          disabled={!canSend}
          aria-label="Send message"
          className={[
            'w-9 h-9 rounded-full shrink-0',
            'flex items-center justify-center',
            'transition-all duration-200',
            'shadow-sm',
            canSend
              ? 'bg-[#e99f0c] text-white hover:bg-[#d48d00] active:scale-95 hover:shadow-[0_4px_12px_rgba(233,159,12,0.35)]'
              : 'bg-[#e99f0c]/30 text-white/50 cursor-not-allowed',
          ].join(' ')}
        >
          {/* Paper-plane / send icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4 translate-x-px"
          >
            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
          </svg>
        </button>
      </form>
    </div>
  );
}
