'use client';

import { create } from 'zustand';
import type { User, UserRole } from '@/types/user';

interface UserStore {
  user: User | null;
  /** Overrideable role — defaults to user.role but can be toggled in UI */
  activeRole: UserRole;
  setUser: (user: User) => void;
  setActiveRole: (role: UserRole) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  activeRole: 'processor',
  setUser: (user) => set({ user, activeRole: user.role }),
  setActiveRole: (activeRole) => set({ activeRole }),
}));
