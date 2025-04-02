import type { Tab } from '../store/workspaceStore'

export const getCurrentTab = async (): Promise<Tab | null> => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!tab?.id || !tab.url) return null

    return {
      id: tab.id.toString(),
      url: tab.url,
      title: tab.title || '',
      favicon: tab.favIconUrl,
    }
  } catch (error) {
    console.error('Error getting current tab:', error)
    return null
  }
}

export const getAllTabs = async (): Promise<Tab[]> => {
  try {
    const tabs = await chrome.tabs.query({})
    return tabs
      .filter((tab): tab is chrome.tabs.Tab & { id: number; url: string } => 
        !!tab.id && !!tab.url
      )
      .map((tab) => ({
        id: tab.id.toString(),
        url: tab.url,
        title: tab.title || '',
        favicon: tab.favIconUrl,
      }))
  } catch (error) {
    console.error('Error getting all tabs:', error)
    return []
  }
}

export const createTabGroup = async (tabs: Tab[]): Promise<void> => {
  try {
    const group = await chrome.tabs.group({
      tabIds: tabs.map((tab) => parseInt(tab.id)),
    })
    await chrome.tabGroups.update(group, {
      title: 'FlowForge Workspace',
    })
  } catch (error) {
    console.error('Error creating tab group:', error)
  }
}

export const openTabs = async (urls: string[]): Promise<void> => {
  try {
    await Promise.all(
      urls.map((url) => chrome.tabs.create({ url }))
    )
  } catch (error) {
    console.error('Error opening tabs:', error)
  }
}

export const closeTabs = async (tabIds: string[]): Promise<void> => {
  try {
    await Promise.all(
      tabIds.map((tabId) => chrome.tabs.remove(parseInt(tabId)))
    )
  } catch (error) {
    console.error('Error closing tabs:', error)
  }
} 