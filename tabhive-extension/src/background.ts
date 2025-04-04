// Basic background script for the TabHive extension without complex dependencies
import { findMostSimilarSubject, initializeEmbeddingSystem } from './utils/embeddings';

// Keep track of user's API key
let OPENAI_API_KEY = '';

// Initialize embeddings system on load
initializeEmbeddingSystem();

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
  
  // Check if the group name is a numeric pattern (3 digits)
  if (/^\d{3}$/.test(groupName)) {
    return 'purple'; // Use purple for course number groups
  }
  
  // Use consistent colors for common categories
  if (groupName === 'Social Media') return 'blue';
  if (groupName === 'Entertainment') return 'red';
  if (groupName === 'Shopping') return 'green';
  if (groupName === 'News & Updates') return 'yellow';
  if (groupName === 'Work') return 'cyan';
  if (groupName === 'Research') return 'orange';
  if (groupName === 'Personal') return 'pink';
  if (groupName === 'Quick Access') return 'grey';
  
  // Return a random color for others
  return colors[Math.floor(Math.random() * colors.length)];
}

// Organize tabs with custom groups
async function organizeTabs(customGroups: string[] = []) {
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
    
    // First check for numeric patterns (3-digit codes) in tab titles
    const numericalGroups = extractThreeDigitGroups(tabs);
    
    if (Object.keys(numericalGroups).length > 0) {
      // Use the numerical grouping
      groups = numericalGroups;
    } else if (customGroups.length > 0) {
      console.log("Using custom groups:", customGroups);
      
      // Initialize groups
      customGroups.forEach(name => {
        groups[name] = [];
      });
      
      // Track uncategorized tabs
      const uncategorizedTabs: chrome.tabs.Tab[] = [];
      
      // More intelligent distribution of tabs to custom groups
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
          
          // Use embeddings to find subject match
          const subjectMatch = findMostSimilarSubject(tab);
          // If group name contains or resembles the subject, increase score
          if (groupNameLower.includes(subjectMatch.categoryName.toLowerCase()) || 
              subjectMatch.categoryName.toLowerCase().includes(groupNameLower)) {
            score += 3 * subjectMatch.similarity;
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
        
        // Flag to track if we've placed the tab
        let tabPlaced = false;

        // If we found a good match, use it
        if (bestMatch && bestMatchScore > 0.5) {
          groups[bestMatch].push(tab);
          tabPlaced = true;
        } 
        
        // If tab hasn't been placed yet, check if there's any subject match  
        if (!tabPlaced) {
          // Try to use subject classification if no direct match
          const subjectMatch = findMostSimilarSubject(tab);
          if (subjectMatch.similarity > 0.3) { // Reasonable threshold
            // Find most related group name to subject
            let bestSubjectGroup = '';
            let bestSubjectScore = 0;
            
            for (const groupName of customGroups) {
              const groupNameLower = groupName.toLowerCase();
              const subjectNameLower = subjectMatch.categoryName.toLowerCase();
              let score = 0;
              
              // Simple similarity check
              if (groupNameLower.includes(subjectNameLower) || 
                  subjectNameLower.includes(groupNameLower)) {
                score = 1;
              }
              
              if (score > bestSubjectScore) {
                bestSubjectScore = score;
                bestSubjectGroup = groupName;
              }
            }
            
            if (bestSubjectGroup) {
              groups[bestSubjectGroup].push(tab);
              tabPlaced = true;
            }
          }
        }
        
        // If still not placed, add to uncategorized
        if (!tabPlaced) {
          uncategorizedTabs.push(tab);
        }
      });
      
      // Process uncategorized tabs if we have any
      if (uncategorizedTabs.length > 0) {
        // Add them to auto-detected groups
        const autoGrouped = generateAutoGroups(uncategorizedTabs);
        
        // Copy auto-generated groups to our groups object
        for (const [groupName, groupTabs] of Object.entries(autoGrouped)) {
          groups[groupName] = groupTabs;
        }
      }
    } else {
      // If no custom groups are provided, use auto-grouping
      const autoGrouped = generateAutoGroups(tabs);
      
      // Copy auto-generated groups to our groups object
      for (const [groupName, groupTabs] of Object.entries(autoGrouped)) {
        groups[groupName] = groupTabs;
      }
    }
    
    // Remove empty groups
    for (const [groupName, groupTabs] of Object.entries(groups)) {
      if (groupTabs.length === 0) {
        delete groups[groupName];
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
    
    // Notify that organization is complete
    chrome.runtime.sendMessage({
      type: 'ORGANIZATION_COMPLETED',
      numGroups: groupsCreated
    });
    
  } catch (error) {
    console.error('Error in organization:', error);
    chrome.runtime.sendMessage({
      type: 'ORGANIZATION_ERROR',
      error: String(error)
    });
  }
}

/**
 * Extract groups based on 3-digit codes in tab titles
 * @param tabs - Array of tabs to organize
 * @returns Object with tabs grouped by numeric patterns
 */
function extractThreeDigitGroups(tabs: chrome.tabs.Tab[]): Record<string, chrome.tabs.Tab[]> {
  const groups: Record<string, chrome.tabs.Tab[]> = {};
  const processedTabs = new Set<chrome.tabs.Tab>();
  
  // Find numeric patterns in tab titles
  const tabPatterns = new Map<chrome.tabs.Tab, string[]>();
  
  tabs.forEach(tab => {
    const title = tab.title || '';
    const patterns = extractThreeDigitPatterns(title);
    if (patterns.length > 0) {
      tabPatterns.set(tab, patterns);
    }
  });
  
  // Only proceed if we found at least one pattern
  if (tabPatterns.size === 0) {
    return {};
  }
  
  // Count frequency of each pattern
  const patternCounts = new Map<string, number>();
  
  tabPatterns.forEach((patterns, tab) => {
    patterns.forEach(pattern => {
      patternCounts.set(pattern, (patternCounts.get(pattern) || 0) + 1);
    });
  });
  
  // Sort patterns by frequency
  const sortedPatterns = [...patternCounts.entries()]
    .filter(([_, count]) => count > 1) // Only use patterns that appear in multiple tabs
    .sort((a, b) => b[1] - a[1]);
  
  // If no patterns appear multiple times, return empty grouping
  if (sortedPatterns.length === 0) {
    return {};
  }
  
  // Create groups for each significant pattern
  sortedPatterns.forEach(([pattern, count]) => {
    groups[pattern] = [];
    
    // Add all tabs with this pattern
    tabPatterns.forEach((patterns, tab) => {
      if (patterns.includes(pattern) && !processedTabs.has(tab)) {
        groups[pattern].push(tab);
        processedTabs.add(tab);
      }
    });
  });
  
  // If there are ungrouped tabs, add them to "Other" group
  if (processedTabs.size < tabs.length) {
    groups['Other'] = [];
    tabs.forEach(tab => {
      if (!processedTabs.has(tab)) {
        groups['Other'].push(tab);
      }
    });
  }
  
  return groups;
}

/**
 * Extract all three-digit patterns from a string
 * @param text - Text to analyze
 * @returns Array of 3-digit patterns found
 */
function extractThreeDigitPatterns(text: string): string[] {
  if (!text) return [];
  
  // Find all 3-digit patterns
  const digitPattern = /\b\d{3}\b/g;
  const matches = text.match(digitPattern);
  
  return matches || [];
}

/**
 * Automatically generate group names for uncategorized tabs
 * @param tabs - Array of tabs without a clear category
 * @returns Object with auto-generated group names mapping to tabs
 */
function generateAutoGroups(tabs: chrome.tabs.Tab[]): Record<string, chrome.tabs.Tab[]> {
  const groups: Record<string, chrome.tabs.Tab[]> = {};
  
  // If there are no tabs, return empty result
  if (tabs.length === 0) {
    return groups;
  }
  
  // Check if these are mostly social network tabs
  let socialCount = 0;
  tabs.forEach(tab => {
    const url = tab.url?.toLowerCase() || '';
    if (
      url.includes('facebook.com') || 
      url.includes('twitter.com') || 
      url.includes('instagram.com') ||
      url.includes('reddit.com') ||
      url.includes('tiktok.com') ||
      url.includes('youtube.com') ||
      url.includes('pinterest.com') ||
      url.includes('tumblr.com') ||
      url.includes('discord.com') ||
      url.includes('linkedin.com') ||
      url.includes('snapchat.com') ||
      url.includes('tinder.com') ||
      url.includes('bumble.com')
    ) {
      socialCount++;
    }
  });
  
  if (socialCount / tabs.length > 0.4) {
    groups['Social Media'] = tabs;
    return groups;
  }
  
  // Check if these are mostly entertainment tabs
  let entertainmentCount = 0;
  tabs.forEach(tab => {
    const url = tab.url?.toLowerCase() || '';
    const title = tab.title?.toLowerCase() || '';
    if (
      url.includes('netflix.com') || 
      url.includes('hulu.com') || 
      url.includes('youtube.com') ||
      url.includes('spotify.com') ||
      url.includes('twitch.tv') ||
      url.includes('disneyplus.com') ||
      url.includes('hbomax.com') ||
      url.includes('primevideo.com') ||
      url.includes('music') ||
      url.includes('podcast') ||
      url.includes('video') ||
      url.includes('movie') ||
      url.includes('film') ||
      url.includes('tv') ||
      title.includes('video') ||
      title.includes('movie') ||
      title.includes('watch') ||
      title.includes('stream') ||
      title.includes('episode')
    ) {
      entertainmentCount++;
    }
  });
  
  if (entertainmentCount / tabs.length > 0.4) {
    groups['Entertainment'] = tabs;
    return groups;
  }
  
  // Check if these are mostly shopping tabs
  let shoppingCount = 0;
  tabs.forEach(tab => {
    const url = tab.url?.toLowerCase() || '';
    const title = tab.title?.toLowerCase() || '';
    if (
      url.includes('amazon.com') || 
      url.includes('ebay.com') || 
      url.includes('etsy.com') ||
      url.includes('walmart.com') ||
      url.includes('shop') ||
      url.includes('store') ||
      url.includes('bestbuy.com') ||
      url.includes('target.com') ||
      url.includes('ecommerce') ||
      url.includes('cart') ||
      url.includes('checkout') ||
      url.includes('order') ||
      title.includes('buy') ||
      title.includes('shop') ||
      title.includes('order') ||
      title.includes('cart') ||
      title.includes('purchase')
    ) {
      shoppingCount++;
    }
  });
  
  if (shoppingCount / tabs.length > 0.4) {
    groups['Shopping'] = tabs;
    return groups;
  }
  
  // Check if these are mostly news tabs
  let newsCount = 0;
  tabs.forEach(tab => {
    const url = tab.url?.toLowerCase() || '';
    const title = tab.title?.toLowerCase() || '';
    if (
      url.includes('news') || 
      url.includes('bbc.com') || 
      url.includes('cnn.com') ||
      url.includes('nytimes.com') ||
      url.includes('reuters.com') ||
      url.includes('washingtonpost.com') ||
      url.includes('theguardian.com') ||
      url.includes('huffpost.com') ||
      url.includes('bloomberg.com') ||
      title.includes('news') ||
      title.includes('latest') ||
      title.includes('breaking')
    ) {
      newsCount++;
    }
  });
  
  if (newsCount / tabs.length > 0.4) {
    groups['News & Updates'] = tabs;
    return groups;
  }
  
  // Try clustering based on most frequent words in titles
  const wordFrequencies = new Map<string, number>();
  const excludedWords = new Set([
    'a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by',
    'with', 'in', 'out', 'over', 'of', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'this', 'that', 'these', 'those', 'my', 'your', 'his', 'her', 'its', 'our', 'their',
    'has', 'have', 'had', 'do', 'does', 'did', 'will', 'would', 'shall', 'should', 'can',
    'could', 'may', 'might', 'must', 'com', 'org', 'net', 'html', 'htm', 'php'
  ]);
  
  tabs.forEach(tab => {
    const title = tab.title || '';
    // Extract words, remove special chars, filter short words and excluded words
    const words = title.toLowerCase()
                       .replace(/[^\w\s]/g, ' ')
                       .split(/\s+/)
                       .filter(word => word.length > 3 && !excludedWords.has(word));
                       
    words.forEach(word => {
      wordFrequencies.set(word, (wordFrequencies.get(word) || 0) + 1);
    });
  });
  
  // Find most common words
  const topWords = [...wordFrequencies.entries()]
    .filter(([_, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([word, _]) => word.charAt(0).toUpperCase() + word.slice(1));
  
  if (topWords.length > 0) {
    if (topWords.length === 1) {
      groups[`${topWords[0]} Pages`] = tabs;
    } else {
      groups[`${topWords[0]} & ${topWords[1]}`] = tabs;
    }
    return groups;
  }
  
  // Default to domain-based grouping
  const domainCounts = new Map<string, number>();
  tabs.forEach(tab => {
    if (!tab.url) return;
    
    try {
      const domain = new URL(tab.url).hostname.replace(/^www\./, '');
      const simpleDomain = domain.split('.')[0];
      domainCounts.set(simpleDomain, (domainCounts.get(simpleDomain) || 0) + 1);
    } catch (e) {
      // Ignore invalid URLs
    }
  });
  
  const topDomains = [...domainCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([domain, _]) => domain.charAt(0).toUpperCase() + domain.slice(1));
  
  if (topDomains.length > 0) {
    if (topDomains.length === 1) {
      groups[`${topDomains[0]} Pages`] = tabs;
    } else {
      groups[`${topDomains[0]} & ${topDomains[1]}`] = tabs;
    }
    return groups;
  }
  
  // Last resort
  groups['Quick Access'] = tabs;
  return groups;
}

// Listen for messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Received message:", message);
  
  if (message.action === 'organizeTabs') {
    const customGroups = message.customGroups || [];
    
    organizeTabs(customGroups);
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