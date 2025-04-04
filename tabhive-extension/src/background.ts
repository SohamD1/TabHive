// Basic background script for the TabHive extension without complex dependencies

// Keep track of user's API key
let OPENAI_API_KEY = '';

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('TabHive Tab Organizer has been installed');
});

// Function to determine group color based on name
function getGroupColor(groupName: string): chrome.tabGroups.ColorEnum {
  // Available colors in Chrome
  const colors: chrome.tabGroups.ColorEnum[] = [
    'blue', 'green', 'red', 'yellow', 'purple', 'cyan', 'pink', 'orange', 'grey'
  ];
  
  // Return a random color
  return colors[Math.floor(Math.random() * colors.length)];
}

// Organize tabs with optional custom groups
async function organizeTabs(useCustomGroups = false, customGroups: string[] = []) {
  try {
    // Send message that we're starting
    chrome.runtime.sendMessage({ type: 'ORGANIZATION_STARTED' });
    
    // Get all tabs in current window
    const tabs = await chrome.tabs.query({ currentWindow: true });
    
    if (tabs.length < 2) {
      chrome.runtime.sendMessage({
        type: 'ORGANIZATION_ERROR',
        error: 'Need at least 2 tabs to organize'
      });
      return;
    }
    
    let groups: Record<string, chrome.tabs.Tab[]> = {};
    
    if (useCustomGroups && customGroups.length > 0) {
      console.log("Using custom groups:", customGroups);
      
      // Initialize groups
      customGroups.forEach(name => {
        groups[name] = [];
      });
      
      // More intelligent distribution of tabs to custom groups
      // We'll use the tab URL and title to try to match with group names
      tabs.forEach((tab) => {
        const tabTitle = tab.title?.toLowerCase() || '';
        const tabUrl = tab.url?.toLowerCase() || '';
        
        // Try to find the best matching group based on title or URL
        let bestMatch = '';
        let bestMatchScore = 0;
        
        for (const groupName of customGroups) {
          const groupNameLower = groupName.toLowerCase();
          let score = 0;
          
          // Check if tab title contains the group name
          if (tabTitle.includes(groupNameLower)) {
            score += 3;
          }
          
          // Check if URL contains the group name
          if (tabUrl.includes(groupNameLower)) {
            score += 2;
          }
          
          // Additional scoring based on domain types
          if (groupNameLower.includes('work') || groupNameLower.includes('business')) {
            // Work-related domains
            if (
              tabUrl.includes('docs.google.com') || 
              tabUrl.includes('github.com') || 
              tabUrl.includes('linkedin.com') ||
              tabUrl.includes('slack.com') ||
              tabUrl.includes('trello.com') ||
              tabUrl.includes('asana.com')
            ) {
              score += 1;
            }
          } else if (groupNameLower.includes('shop') || groupNameLower.includes('store')) {
            // Shopping-related domains
            if (
              tabUrl.includes('amazon.com') || 
              tabUrl.includes('ebay.com') || 
              tabUrl.includes('etsy.com') ||
              tabUrl.includes('walmart.com') ||
              tabUrl.includes('shop') ||
              tabUrl.includes('store')
            ) {
              score += 1;
            }
          } else if (groupNameLower.includes('social') || groupNameLower.includes('media')) {
            // Social media domains
            if (
              tabUrl.includes('facebook.com') || 
              tabUrl.includes('twitter.com') || 
              tabUrl.includes('instagram.com') ||
              tabUrl.includes('reddit.com') ||
              tabUrl.includes('tiktok.com') ||
              tabUrl.includes('youtube.com')
            ) {
              score += 1;
            }
          } else if (groupNameLower.includes('news') || groupNameLower.includes('media')) {
            // News-related domains
            if (
              tabUrl.includes('news') || 
              tabUrl.includes('bbc.com') || 
              tabUrl.includes('cnn.com') ||
              tabUrl.includes('nytimes.com') ||
              tabUrl.includes('reuters.com')
            ) {
              score += 1;
            }
          } else if (groupNameLower.includes('research') || groupNameLower.includes('academic')) {
            // Research-related domains
            if (
              tabUrl.includes('scholar.google.com') || 
              tabUrl.includes('researchgate.net') || 
              tabUrl.includes('academia.edu') ||
              tabUrl.includes('.edu') ||
              tabUrl.includes('wikipedia.org')
            ) {
              score += 1;
            }
          }
          
          if (score > bestMatchScore) {
            bestMatchScore = score;
            bestMatch = groupName;
          }
        }
        
        // If we found a good match, use it
        if (bestMatch && bestMatchScore > 0) {
          groups[bestMatch].push(tab);
        } else {
          // Otherwise, assign to the group with the fewest tabs
          const groupWithFewestTabs = customGroups
            .reduce((prev, curr) => groups[prev].length <= groups[curr].length ? prev : curr);
          groups[groupWithFewestTabs].push(tab);
        }
      });
      
      // Check if any group has no tabs
      const emptyGroups = customGroups.filter(name => groups[name].length === 0);
      
      // If some groups are empty, redistribute tabs from largest group
      if (emptyGroups.length > 0 && customGroups.length > emptyGroups.length) {
        const largestGroup = customGroups
          .reduce((prev, curr) => groups[prev].length >= groups[curr].length ? prev : curr);
        
        if (groups[largestGroup].length > 1) {
          emptyGroups.forEach(emptyGroup => {
            if (groups[largestGroup].length > 1) {
              // Move one tab from largest group to empty group
              const tabToMove = groups[largestGroup].pop();
              if (tabToMove) {
                groups[emptyGroup].push(tabToMove);
              }
            }
          });
        }
      }
    } else {
      // If not using custom groups, perform simple detection
      const workGroup = 'Work';
      const personalGroup = 'Personal';
      const researchGroup = 'Research';
      
      groups = {
        [workGroup]: [],
        [personalGroup]: [],
        [researchGroup]: []
      };
      
      // Simple heuristic distribution
      tabs.forEach((tab) => {
        const tabTitle = tab.title?.toLowerCase() || '';
        const tabUrl = tab.url?.toLowerCase() || '';
        
        // Work-related tabs
        if (
          tabUrl.includes('github.com') || 
          tabUrl.includes('gitlab.com') ||
          tabUrl.includes('stackoverflow.com') ||
          tabUrl.includes('jira.com') ||
          tabUrl.includes('slack.com') ||
          tabUrl.includes('asana.com') ||
          tabUrl.includes('trello.com') ||
          tabUrl.includes('docs.google.com') ||
          tabUrl.includes('sheets.google.com') ||
          tabUrl.includes('drive.google.com') ||
          tabUrl.includes('linkedin.com') ||
          tabUrl.includes('zoom.us')
        ) {
          groups[workGroup].push(tab);
        } 
        // Research-related tabs
        else if (
          tabUrl.includes('scholar.google.com') ||
          tabUrl.includes('research') ||
          tabUrl.includes('academic') ||
          tabUrl.includes('.edu') ||
          tabUrl.includes('sciencedirect.com') ||
          tabUrl.includes('wikipedia.org') ||
          tabUrl.includes('researchgate.net') ||
          tabUrl.includes('jstor.org') ||
          tabUrl.includes('springer.com') ||
          tabUrl.includes('academia.edu')
        ) {
          groups[researchGroup].push(tab);
        } 
        // Default to personal
        else {
          groups[personalGroup].push(tab);
        }
      });
      
      // Remove empty groups
      for (const [groupName, groupTabs] of Object.entries(groups)) {
        if (groupTabs.length === 0) {
          delete groups[groupName];
        }
      }
    }
    
    // Create tab groups
    let groupsCreated = 0;
    
    for (const [groupName, groupTabs] of Object.entries(groups)) {
      if (groupTabs.length === 0) continue;
      
      try {
        // Get tab IDs
        const tabIds = groupTabs.map(tab => tab.id).filter(id => id !== undefined) as number[];
        
        if (tabIds.length === 0) continue;
        
        // Create group
        const groupId = await chrome.tabs.group({ tabIds });
        
        // Set title and color
        await chrome.tabGroups.update(groupId, {
          title: groupName,
          color: getGroupColor(groupName)
        });
        
        groupsCreated++;
      } catch (error) {
        console.error(`Error creating group ${groupName}:`, error);
      }
    }
    
    // Send completion message
    chrome.runtime.sendMessage({
      type: 'ORGANIZATION_COMPLETED',
      numGroups: groupsCreated
    });
    
  } catch (error) {
    console.error('Error organizing tabs:', error);
    chrome.runtime.sendMessage({
      type: 'ORGANIZATION_ERROR',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Listen for messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Received message:", message);
  
  if (message.action === 'organizeTabs') {
    const useCustomGroups = message.useCustomGroups || false;
    const customGroups = message.customGroups || [];
    
    organizeTabs(useCustomGroups, customGroups);
    sendResponse({ success: true });
  }
  
  if (message.action === 'setApiKey') {
    OPENAI_API_KEY = message.apiKey || "";
    
    // Store the API key
    chrome.storage.local.set({ 'openaiApiKey': message.apiKey }, () => {
      if (chrome.runtime.lastError) {
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
      } else {
        sendResponse({ success: true });
      }
    });
    
    return true; // Will respond asynchronously
  }
  
  if (message.action === 'getApiKey') {
    sendResponse({ apiKey: OPENAI_API_KEY });
  }
  
  return true; // Keep message channel open for async response
}); 