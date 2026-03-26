'use client';

import { useUserStore } from '@/store/userStore';
import { Button } from '@/components/atoms/Button';
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
    <header className="h-14 flex items-center justify-between px-6 bg-primary text-white shrink-0 border-b border-white/[6%]">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center shrink-0" aria-hidden>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 3h10M2 7h7M2 11h5" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        {/* Compact brand for mobile: small logo + short name */}
        <div className="flex items-center gap-2 md:hidden">
          <span className="font-semibold text-sm tracking-tight text-white">PSL</span>
        </div>

        {/* Full brand for md+ */}
        <div className="hidden md:flex items-baseline gap-2">
          <span className="font-semibold text-[13px] tracking-tight text-white">Pearson Specter Litt</span>
          <span className="text-white/20 text-xs">|</span>
          <span className="text-white/40 text-[11px] tracking-wide">Command Center</span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        <Button
          type="button"
          onClick={toggleRole}
          title="Toggle role for demo"
          variant="primary"
          className="flex items-center gap-2"
        >
          <span className="hidden md:inline text-white/40">Viewing as</span>
          <span className={`font-semibold capitalize px-1.5 py-0.5 rounded text-[11px] ${
            activeRole === 'attorney'
              ? 'bg-amber-500/20 text-amber-300'
              : 'bg-sky-500/20 text-sky-300'
          }`}>
            {activeRole}
          </span>
        </Button>

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
