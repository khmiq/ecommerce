// src/store/userStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";

interface User {
  email: string;
  token: string;
  firstname?: string;
  lastname?: string;
  img?: string;
  regionId?: string;
  createdAt?: string;
  phoneNumber?: string;
}

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  fetchUserDetails: () => Promise<void>;
}

const axiosInstance = axios.create({
  baseURL: "https://keldibekov.online",
});

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
      fetchUserDetails: async () => {
        const user = get().user;
        if (!user || !user.token) return;

        try {
          const response = await axiosInstance.get("/auth/me", {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          set({
            user: {
              ...user,
              firstname: response.data.firstname,
              lastname: response.data.lastname,
              img: response.data.img,
              regionId: response.data.regionId,
              createdAt: response.data.createdAt,
              phoneNumber: response.data.phoneNumber,
            },
          });
        } catch (error) {
          console.error("Failed to fetch user details:", error);
          set({ user: null }); // Log out if token is invalid
        }
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);