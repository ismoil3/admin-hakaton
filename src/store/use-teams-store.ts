import axiosRequest from "@/lib/api/axios-request";
import { create } from "zustand";

interface Member {
  id: string;
  fullName: string;
  phone: string;
  githubLink: string;
  linkedinLink: string;
  fullTimeParticipationNote: string;
  isCapitan: boolean;
}

interface Team {
  id: string;
  name: string;
  count: number;
  members: Member[];
  stages: { id: string; content: string }[];
}

interface TeamState {
  teams: Team[];
  loading: boolean;
  error: string | null;
  page: number;
  perPage: number;
  totalPages: number;
  query: string;
  currentTeam: Team | null;

  sendSmsToMembers: (memberIds: string[], message: string) => Promise<boolean>;

  fetchTeams: () => Promise<void>;
  fetchTeamById: (id: string) => Promise<void>;
  setPage: (page: number) => void;
  setQuery: (query: string) => void;
}

export const useTeemStore = create<TeamState>((set, get) => ({
  teams: [],
  loading: false,
  error: null,
  page: 1,
  perPage: 10,
  totalPages: 1,
  query: "",
  currentTeam: null,

  setPage: (page) => {
    set({ page });
    get().fetchTeams();
  },

  setQuery: (query) => {
    set({ query, page: 1 });
    get().fetchTeams();
  },

  fetchTeamById: async (id: string) => {
    set({ loading: true, error: null, currentTeam: null });
    try {
      const response = await axiosRequest.get(`/teems/${id}`);
      const result = response.data;

      if (result.isSuccess) {
        set({ currentTeam: result.data, loading: false });
      } else {
        set({
          error: result.message || "Ошибка загрузки команды",
          loading: false,
        });
      }
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message || "Network Error",
        loading: false,
      });
    }
  },

  sendSmsToMembers: async (memberIds: string[], message: string) => {
    try {
      const response = await axiosRequest.post("/sms-mailings/members", {
        memberIds,
        message,
      });
      return response.data.isSuccess;
    } catch (error) {
      console.error("SMS Sending error:", error);
      return false;
    }
  },

  fetchTeams: async () => {
    const { page, perPage, query } = get();
    set({ loading: true, error: null });

    try {
      const response = await axiosRequest.get("/teems", {
        params: {
          Page: page,
          PerPage: perPage,
          Query: query,
        },
      });

      const result = response.data;

      if (result.isSuccess) {
        set({
          teams: result.data.items,
          totalPages: result.data.totalPages,
          loading: false,
        });
      } else {
        set({
          error: result.message || "Ошибка получения списка",
          loading: false,
        });
      }
    } catch (err: any) {
      set({
        error:
          err.response?.data?.message || err.message || "Failed to fetch teams",
        loading: false,
      });
    }
  },
}));
