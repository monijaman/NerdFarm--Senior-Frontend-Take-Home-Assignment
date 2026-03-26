'use client';

import { useUserStore } from '@/store/userStore';
import type { UserRole } from '@/types/user';

export function Header() {
  const { user, activeRole, setActiveRole } = useUserStore();

  function toggleRole() {
    const next: UserRole = activeRole === 'processor' ? 'attorney' : 'processor';
    setActiveRole(next);
  }

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? 'U';

  return (
    <header className="h-14 flex items-center justify-between px-6 bg-[#071120] text-white shrink-0 border-b border-white/[6%]">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center shrink-0">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 3h10M2 7h7M2 11h5" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-[13px] tracking-tight text-white">Pearson Specter Litt</span>
          <span className="text-white/20 text-xs">|</span>
          <span className="text-white/40 text-[11px] tracking-wide">Command Center</span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleRole}
          title="Toggle role for demo"
          className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] hover:bg-white/10 transition-all"
        >
          <span className="text-white/40">Viewing as</span>
          <span className={`font-semibold capitalize px-1.5 py-0.5 rounded text-[11px] ${
            activeRole === 'attorney'
              ? 'bg-amber-500/20 text-amber-300'
              : 'bg-sky-500/20 text-sky-300'
          }`}>
            {activeRole}
          </span>
        </button>

        {user && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-[11px] font-bold text-white shrink-0">
              {initials}
            </div>
            <span className="text-[11px] text-white/50">{user.name}</span>
          </div>
        )}
      </div>
    </header>
  );
}
