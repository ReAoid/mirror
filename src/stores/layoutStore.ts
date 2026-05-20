import { create } from "zustand";

type LayoutState = {
  sidebarOpen: boolean;
  previewOpen: boolean;
  workspaceOpen: boolean;
  toggleSidebar: () => void;
  togglePreview: () => void;
  toggleWorkspace: () => void;
};

export const useLayoutStore = create<LayoutState>((set) => ({
  sidebarOpen: true,
  previewOpen: false,
  workspaceOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  togglePreview: () => set((state) => ({ previewOpen: !state.previewOpen })),
  toggleWorkspace: () => set((state) => ({ workspaceOpen: !state.workspaceOpen })),
}));
