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
  currentTeam: Team | null; // New state

  // Actions
  fetchTeams: () => Promise<void>;
  fetchTeamById: (id: string) => Promise<void>; // New action
  setPage: (page: number) => void;
  setQuery: (query: string) => void;
}

const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOiI5NjhjNjRiZi01OTdkLTQ4YWQtODU1OS02OTE4NmI0OWY1N2YiLCJGdWxsTmFtZSI6IkFkbWluIiwiUGhvbmUiOiI5MDcwNzA3NDUiLCJuYmYiOjE3NjYxMzQzMjEsImV4cCI6MTc2NjIxNzEyMSwiaWF0IjoxNzY2MTM0MzIxLCJpc3MiOiJoYWNrYXRvbi5zb2Z0Y2x1Yi50aiIsImF1ZCI6ImhhY2thdG9uLnNvZnRjbHViLnRqIn0.mVfo2Ke29EDluc-tycwKIu5Hg3d6PCCaYPBxjJHX7gA";

export const useTeemStore = create<TeamState>((set, get) => ({
  teams: [],
  loading: false,
  error: null,
  page: 1,
  perPage: 10,
  totalPages: 1,
  query: "",

  setPage: (page) => {
    set({ page });
    get().fetchTeams();
  },

  setQuery: (query) => {
    set({ query, page: 1 }); // Reset to page 1 on search
    get().fetchTeams();
  },
  currentTeam: null,

  fetchTeamById: async (id: string) => {
    set({ loading: true, error: null, currentTeam: null });
    try {
      const response = await fetch(`http://37.27.29.18:8087/api/teems/${id}`, {
        headers: {
          accept: "text/plain",
          Authorization: `Bearer ${TOKEN}`,
        },
      });
      const result = await response.json();
      if (result.isSuccess) {
        set({ currentTeam: result.data, loading: false });
      } else {
        set({ error: result.message, loading: false });
      }
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchTeams: async () => {
    const { page, perPage, query } = get();
    set({ loading: true, error: null });

    try {
      const url = `http://37.27.29.18:8087/api/teems?Page=${page}&PerPage=${perPage}&Query=${encodeURIComponent(
        query
      )}`;
      const response = await fetch(url, {
        headers: {
          accept: "text/plain",
          Authorization: `Bearer ${TOKEN}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch teams");

      const result = await response.json();
      if (result.isSuccess) {
        set({
          teams: result.data.items,
          totalPages: result.data.totalPages,
          loading: false,
        });
      }
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
}));
