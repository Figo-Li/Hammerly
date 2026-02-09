import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type User = {
  id?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  avatarImage?: string
  password? :string
};

type AuthState = {
  isLoggedIn: boolean;
  user: User | null;
  watchedCount: number;

  loginSuccess: (payload: { user: User; token?: string }) => void;
  logout: () => void;
  setWatchedCount: (count: number) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      token: null,
      watchedCount: 0,

      loginSuccess: ({ user}) =>
        set({
          isLoggedIn: true,
          user,
        }),

      logout: () =>
        set({
          isLoggedIn: false,
          user: null,
          watchedCount: 0,
        }),

      setWatchedCount: (count) => set({ watchedCount: count }),
    }),
    {
      name: 'auth-store',
    }
  )
);
