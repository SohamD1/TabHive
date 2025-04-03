import { useEffect } from 'react'
import { useWorkspaceStore } from '../store/workspaceStore'
import { getCurrentTab, getAllTabs, createTabGroup } from '../utils/chromeUtils'

export const useWorkspace = () => {
  const {
    workspaces,
    activeWorkspace,
    addWorkspace,
    updateWorkspace,
    deleteWorkspace,
    setActiveWorkspace,
    addTabToWorkspace,
    removeTabFromWorkspace,
  } = useWorkspaceStore()

  const createNewWorkspace = async (name: string, description?: string) => {
    const currentTab = await getCurrentTab()
    if (!currentTab) return

    const workspace = {
      name,
      description,
      tabs: [currentTab],
      tags: [],
    }

    addWorkspace(workspace)
  }

  const addCurrentTabToWorkspace = async (workspaceId: string) => {
    const currentTab = await getCurrentTab()
    if (!currentTab) return

    addTabToWorkspace(workspaceId, currentTab)
  }

  const restoreWorkspace = async (workspaceId: string) => {
    const workspace = workspaces.find((w) => w.id === workspaceId)
    if (!workspace) return

    await createTabGroup(workspace.tabs)
    setActiveWorkspace(workspaceId)
  }

  const deleteWorkspaceAndTabs = async (workspaceId: string) => {
    const workspace = workspaces.find((w) => w.id === workspaceId)
    if (!workspace) return

    // Close all tabs in the workspace
    await Promise.all(
      workspace.tabs.map((tab) => chrome.tabs.remove(parseInt(tab.id)))
    )

    deleteWorkspace(workspaceId)
    if (activeWorkspace?.id === workspaceId) {
      setActiveWorkspace(null)
    }
  }

  return {
    workspaces,
    activeWorkspace,
    createNewWorkspace,
    updateWorkspace,
    deleteWorkspaceAndTabs,
    setActiveWorkspace,
    addCurrentTabToWorkspace,
    removeTabFromWorkspace,
    restoreWorkspace,
  }
} 