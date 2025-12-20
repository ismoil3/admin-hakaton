import axiosRequest from "@/lib/api/axios-request";
import { create } from "zustand";

interface SmsLog {
  sender: string;
  recipient: string;
  message: string;
  sendTime: string;
  isSuccess: boolean;
  additionalMessage: string;
}

interface SmsState {
  logs: SmsLog[];
  loading: boolean;
  page: number;
  totalPages: number;
  query: string;
  fetchLogs: () => Promise<void>;
  setPage: (page: number) => void;
  setQuery: (query: string) => void;
}

export const useSmsStore = create<SmsState>((set, get) => ({
  logs: [],
  loading: false,
  page: 1,
  totalPages: 1,
  query: "",

  setPage: (page) => {
    set({ page });
    get().fetchLogs();
  },

  setQuery: (query) => {
    set({ query, page: 1 });
    get().fetchLogs();
  },

  fetchLogs: async () => {
    set({ loading: true });
    try {
      const { page, query } = get();
      const response = await axiosRequest.get("/sms-logs", {
        params: {
          Page: page,
          PerPage: 10,
          Query: query,
        },
      });

      if (response.data.isSuccess) {
        set({
          logs: response.data.data.items,
          totalPages: response.data.data.totalPages,
        });
      }
    } catch (error) {
      console.error("SMS Fetch error:", error);
    } finally {
      set({ loading: false });
    }
  },
}));
