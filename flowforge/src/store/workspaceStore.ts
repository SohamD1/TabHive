import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Tab {
  id: string
  url: string
  title: string
}

export interface Workspace {
  id: string
  name: string
  tabs: Tab[]
  createdAt: Date
  updatedAt: Date
  deadline?: Date
  tags: string[]
}

interface WorkspaceState {
  workspaces: Workspace[]
  activeWorkspace: Workspace | null
  addWorkspace: (workspace: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateWorkspace: (id: string, workspace: Partial<Workspace>) => void
  deleteWorkspace: (id: string) => void
  setActiveWorkspace: (id: string | null) => void
  addTabToWorkspace: (workspaceId: string, tab: Tab) => void
  removeTabFromWorkspace: (workspaceId: string, tabId: string) => void
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      workspaces: [],
      activeWorkspace: null,
      addWorkspace: (workspace) =>
        set((state) => ({
          workspaces: [
            ...state.workspaces,
            {
              ...workspace,
              id: crypto.randomUUID(),
              createdAt: new Date(),
              updatedAt: new Date(),
              tags: workspace.tags || [],
            },
          ],
        })),
      updateWorkspace: (id, workspace) =>
        set((state) => ({
          workspaces: state.workspaces.map((w) =>
            w.id === id
              ? { ...w, ...workspace, updatedAt: new Date() }
              : w
          ),
          activeWorkspace:
            state.activeWorkspace?.id === id
              ? { ...state.activeWorkspace, ...workspace, updatedAt: new Date() }
              : state.activeWorkspace,
        })),
      deleteWorkspace: (id) =>
        set((state) => ({
          workspaces: state.workspaces.filter((w) => w.id !== id),
          activeWorkspace:
            state.activeWorkspace?.id === id ? null : state.activeWorkspace,
        })),
      setActiveWorkspace: (id) =>
        set((state) => ({
          activeWorkspace:
            id === null
              ? null
              : state.workspaces.find((w) => w.id === id) || null,
        })),
      addTabToWorkspace: (workspaceId, tab) =>
        set((state) => ({
          workspaces: state.workspaces.map((w) =>
            w.id === workspaceId
              ? {
                  ...w,
                  tabs: [...w.tabs, tab],
                  updatedAt: new Date(),
                }
              : w
          ),
          activeWorkspace:
            state.activeWorkspace?.id === workspaceId
              ? {
                  ...state.activeWorkspace,
                  tabs: [...state.activeWorkspace.tabs, tab],
                  updatedAt: new Date(),
                }
              : state.activeWorkspace,
        })),
      removeTabFromWorkspace: (workspaceId, tabId) =>
        set((state) => ({
          workspaces: state.workspaces.map((w) =>
            w.id === workspaceId
              ? {
                  ...w,
                  tabs: w.tabs.filter((t) => t.id !== tabId),
                  updatedAt: new Date(),
                }
              : w
          ),
          activeWorkspace:
            state.activeWorkspace?.id === workspaceId
              ? {
                  ...state.activeWorkspace,
                  tabs: state.activeWorkspace.tabs.filter(
                    (t) => t.id !== tabId
                  ),
                  updatedAt: new Date(),
                }
              : state.activeWorkspace,
        })),
    }),
    {
      name: 'tabhive-workspaces',
    }
  )
) 