// This background script stays minimal, as most functionality is in the popup
// It's mainly needed as a placeholder to satisfy the manifest requirements

import type { PageMetadata } from "./content"
import type { Tab, Workspace } from "./store/workspaceStore"
import { organizeTabsByClustering } from "./utils/clustering"

// OpenAI API key will be provided by the user
let OPENAI_API_KEY = "";

// Initialize workspaces from storage
let workspaces: Workspace[] = [];

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('FlowForge Tab Organizer has been installed');
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background received message:", message);
  
  if (message.action === 'setApiKey') {
    OPENAI_API_KEY = message.key;
    // Store the API key in local storage
    chrome.storage.local.set({ 'openaiApiKey': message.key }, () => {
      // Check for errors
      if (chrome.runtime.lastError) {
        console.error("Error saving API key:", chrome.runtime.lastError);
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
      } else {
        console.log("API key saved successfully");
        sendResponse({ success: true });
      }
    });
    return true; // Keep message channel open for async response
  }
  
  if (message.action === 'getApiKey') {
    sendResponse({ key: OPENAI_API_KEY });
  }
  
  if (message.action === 'organizeTabs') {
    // Organize tabs and respond asynchronously
    organizeTabs().catch(error => {
      console.error('Error in organizeTabs:', error);
    });
    sendResponse({ success: true, message: 'Started organizing tabs' });
  }
  
  return true; // Keep message channel open for async response
});

// Function to organize tabs into groups using clustering
async function organizeTabs() {
  try {
    // Notify popup that we're starting to organize
    chrome.runtime.sendMessage({ type: 'ORGANIZATION_STARTED' });
    
    // Get all tabs in the current window
    const allTabs = await chrome.tabs.query({ currentWindow: true });
    
    // Get all tab groups in the current window
    const tabGroups = await chrome.tabGroups.query({ windowId: chrome.windows.WINDOW_ID_CURRENT });
    
    // Get all tabs that are already in groups
    const groupedTabsInfo = await Promise.all(
      tabGroups.map(async (group) => {
        const tabs = await chrome.tabs.query({ groupId: group.id });
        return tabs.map(tab => tab.id);
      })
    );
    
    // Flatten the array of grouped tab IDs
    const groupedTabIds = groupedTabsInfo.flat();
    
    // Filter out tabs that are already in groups AND "New Tab" pages
    const ungroupedTabs = allTabs.filter(tab => {
      // Skip tabs that are already in groups
      if (groupedTabIds.includes(tab.id!)) return false;
      
      // Skip "New Tab" pages (aggressively match all variations)
      const isNewTab = 
        tab.title === 'New Tab' || 
        tab.title === 'new tab' || 
        tab.title === 'New tab' ||
        tab.title === '' || // Empty title might be a new tab
        tab.url?.startsWith('chrome://newtab') ||
        tab.url?.startsWith('edge://newtab') ||
        tab.url?.startsWith('about:blank');
      
      return !isNewTab;
    });
    
    console.log(`Found ${ungroupedTabs.length} ungrouped tabs out of ${allTabs.length} total tabs (after excluding New Tabs)`);
    
    if (ungroupedTabs.length < 2) {
      chrome.runtime.sendMessage({
        type: 'ORGANIZATION_ERROR',
        error: 'You need at least 2 ungrouped tabs (excluding New Tab pages) to create groups'
      });
      return;
    }
    
    // Use automatic grouping without forcing an exact number
    const { groupedTabs, groupNames } = await organizeTabsByClustering(ungroupedTabs);
    
    if (groupedTabs.size === 0) {
      chrome.runtime.sendMessage({
        type: 'ORGANIZATION_ERROR',
        error: 'No groups were identified in your tabs'
      });
      return;
    }
    
    console.log(`Creating ${groupedTabs.size} tab groups`);
    
    // Create tab groups based on clustering results
    for (const [groupKey, groupTabs] of groupedTabs.entries()) {
      // Skip if no tabs in this group
      if (!groupTabs.length) continue;
      
      // Get valid tab IDs (filter out any undefined)
      const tabIds = groupTabs
        .map(tab => tab.id)
        .filter((id): id is number => id !== undefined);
      
      if (tabIds.length === 0) continue;
      
      try {
        // Create a new tab group with the tabs
        const groupId = await chrome.tabs.group({ tabIds });
        
        // Set the group title
        const groupTitle = groupNames.get(groupKey) || groupKey;
        await chrome.tabGroups.update(groupId, { 
          title: groupTitle,
          collapsed: true 
        });
      } catch (error) {
        console.error(`Error creating group ${groupKey}:`, error);
      }
    }
    
    // Notify popup that we're done
    chrome.runtime.sendMessage({ 
      type: 'ORGANIZATION_COMPLETED',
      numGroups: groupedTabs.size
    });
  } catch (error) {
    console.error('Error organizing tabs:', error);
    chrome.runtime.sendMessage({
      type: 'ORGANIZATION_ERROR',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
}

// Get random color for tab groups
function getRandomColor(): chrome.tabGroups.ColorEnum {
  const colors: chrome.tabGroups.ColorEnum[] = [
    'blue', 'red', 'yellow', 'green', 'pink', 'purple', 'cyan', 'orange'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Load stored API key on startup
chrome.storage.local.get('openaiApiKey', (result) => {
  console.log("Checking for stored API key...");
  if (chrome.runtime.lastError) {
    console.error("Error loading API key:", chrome.runtime.lastError);
  } else if (result.openaiApiKey) {
    console.log("API key found in storage");
    OPENAI_API_KEY = result.openaiApiKey;
  } else {
    console.log("No API key found in storage");
  }
});

// Load workspaces from storage
const loadWorkspaces = async () => {
  try {
    const data = await chrome.storage.local.get('flowforge-workspaces');
    if (data['flowforge-workspaces']) {
      workspaces = JSON.parse(data['flowforge-workspaces']);
    }
  } catch (error) {
    console.error('Error loading workspaces:', error);
  }
};

// Save workspaces to storage
const saveWorkspaces = async () => {
  try {
    await chrome.storage.local.set({
      'flowforge-workspaces': JSON.stringify(workspaces)
    });
  } catch (error) {
    console.error('Error saving workspaces:', error);
  }
};

// Set up initial load
loadWorkspaces(); 