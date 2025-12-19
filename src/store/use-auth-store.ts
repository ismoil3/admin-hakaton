import axiosRequest from "@/lib/api/axios-request";
import { create } from "zustand";

interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (phone: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  // Инициализируем токен сразу из localStorage
  token: localStorage.getItem("access_token"),
  loading: false,
  error: null,

  login: async (phone, password) => {
    set({ loading: true, error: null });
    try {
      // Используем axiosRequest вместо fetch
      const response = await axiosRequest.post("/auth/login", {
        phone,
        password,
      });

      const result = response.data;

      if (result.isSuccess) {
        const accessToken = result.data.accessToken;

        set({ token: accessToken, loading: false });
        localStorage.setItem("access_token", accessToken);
        return true;
      } else {
        set({ error: result.message || "Login failed", loading: false });
        return false;
      }
    } catch (err: any) {
      set({
        error:
          err.response?.data?.message || "Connection failed. Please try again.",
        loading: false,
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("access_token");
    set({ token: null, error: null });
  },
}));
