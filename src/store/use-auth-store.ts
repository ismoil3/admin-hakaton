import { create } from "zustand";

interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (phone: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  token: null,
  loading: false,
  error: null,

  login: async (phone, password) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("http://37.27.29.18:8087/api/auth/login", {
        method: "POST",
        headers: {
          accept: "text/plain",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, password }),
      });

      const result = await response.json();


      if (result.isSuccess) {
        set({ token: result.data.accessToken, loading: false });
        localStorage.setItem("access_token", result.data.accessToken);
        return true;
      } else {
        set({ error: result.message, loading: false });
        return false;
      }
    } catch {
      set({
        error: "Connection failed. Please try again.",
        loading: false,
      });
      return false;
    }
  },

  logout: () => set({ token: null, error: null }),
}));
