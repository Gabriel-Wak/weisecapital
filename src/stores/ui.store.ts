import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  sidebarOpen: boolean;
  searchFilters: Record<string, string>;
  setSidebarOpen: (open: boolean) => void;
  setSearchFilter: (key: string, value: string) => void;
  clearSearchFilters: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      searchFilters: {},
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setSearchFilter: (key, value) =>
        set((state) => ({
          searchFilters: { ...state.searchFilters, [key]: value },
        })),
      clearSearchFilters: () => set({ searchFilters: {} }),
    }),
    { name: "weise-ui" }
  )
);
