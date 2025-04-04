/**
 * Simplified clustering utility for TabHive
 * This version doesn't rely on external libraries that cause build issues
 */

import { 
  calculateTabSemanticSimilarity, 
  findMostSimilarSubject,
  initializeEmbeddingSystem
} from './embeddings';

/**
 * Organize tabs by grouping
 * @param tabs - Array of Chrome tabs
 * @param userDefinedGroups - Optional array of user-defined group names
 * @returns Object with grouped tabs and their names
 */
export async function organizeTabs(
  tabs: chrome.tabs.Tab[],
  userDefinedGroups: string[] = []
): Promise<Map<string, chrome.tabs.Tab[]>> {
  if (tabs.length === 0) {
    return new Map<string, chrome.tabs.Tab[]>();
  }
  
  // Check for numeric patterns (3-digit codes) first
  const numericGroups = findNumericPatternGroups(tabs);
  if (numericGroups.size > 0 && numericGroups.size < tabs.length) {
    return numericGroups;
  }
  
  // If using user-defined groups, distribute tabs among them 
  if (userDefinedGroups && userDefinedGroups.length > 0) {
    return assignTabsToUserGroups(tabs, userDefinedGroups);
  }
  
  // Simple automatic grouping by domain
  return groupTabsByDomain(tabs);
}

/**
 * Find groups based on common 3-digit patterns in tab titles
 * @param tabs - Array of tabs to analyze
 * @returns Map of numeric patterns to tabs that match them
 */
function findNumericPatternGroups(tabs: chrome.tabs.Tab[]): Map<string, chrome.tabs.Tab[]> {
  const patternGroups = new Map<string, chrome.tabs.Tab[]>();
  const processedTabs = new Set<chrome.tabs.Tab>();
  
  // Find all 3-digit patterns in all tabs
  const tabPatterns = new Map<chrome.tabs.Tab, string[]>();
  
  tabs.forEach(tab => {
    const title = tab.title || '';
    const patterns = extractThreeDigitPatterns(title);
    if (patterns.length > 0) {
      tabPatterns.set(tab, patterns);
    }
  });
  
  // Group by most common patterns
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
  
  // Create groups for each significant pattern
  sortedPatterns.forEach(([pattern, count]) => {
    const groupName = `${pattern}`;
    patternGroups.set(groupName, []);
    
    // Add all tabs with this pattern
    tabPatterns.forEach((patterns, tab) => {
      if (patterns.includes(pattern) && !processedTabs.has(tab)) {
        patternGroups.get(groupName)!.push(tab);
        processedTabs.add(tab);
      }
    });
  });
  
  // If there are ungrouped tabs, don't use pattern grouping at all
  if (processedTabs.size < tabs.length && processedTabs.size > 0) {
    patternGroups.set('Other', []);
    tabs.forEach(tab => {
      if (!processedTabs.has(tab)) {
        patternGroups.get('Other')!.push(tab);
      }
    });
  }
  
  return patternGroups;
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
 * Run clustering multiple times and select the best result
 * @param tabs - Array of tabs
 * @param groupNames - Array of user-defined group names
 * @returns Map of group names to tab arrays
 */
function assignTabsToUserGroupsWithMultipleAttempts(
  tabs: chrome.tabs.Tab[], 
  groupNames: string[]
): Map<string, chrome.tabs.Tab[]> {
  const NUM_ATTEMPTS = 5;
  let bestGrouping: Map<string, chrome.tabs.Tab[]> | null = null;
  let bestScore = -Infinity;
  
  console.log(`Running clustering ${NUM_ATTEMPTS} times to find optimal grouping...`);
  
  for (let i = 0; i < NUM_ATTEMPTS; i++) {
    console.log(`Clustering attempt ${i + 1}/${NUM_ATTEMPTS}`);
    
    // Generate a grouping with slight randomness in assignment
    const grouping = generateGroupingAttempt(tabs, groupNames, i);
    
    // Evaluate the quality of this grouping
    const score = evaluateGroupingQuality(grouping, tabs);
    
    console.log(`Attempt ${i + 1} score: ${score.toFixed(2)}`);
    
    // Keep track of the best grouping
    if (score > bestScore) {
      bestScore = score;
      bestGrouping = grouping;
      console.log(`New best grouping found at attempt ${i + 1}`);
    }
  }
  
  console.log(`Selected best grouping with score: ${bestScore.toFixed(2)}`);
  
  // Return the best grouping or a fallback if something went wrong
  return bestGrouping || assignTabsToUserGroups(tabs, groupNames);
}

/**
 * Generate one clustering attempt with some variation
 */
function generateGroupingAttempt(
  tabs: chrome.tabs.Tab[],
  groupNames: string[],
  attemptIndex: number
): Map<string, chrome.tabs.Tab[]> {
  // Create a map to store tabs for each group
  const groups = new Map<string, chrome.tabs.Tab[]>();
  groupNames.forEach(name => groups.set(name, []));
  
  // Create collection for tabs without clear matches
  const uncategorizedTabs: chrome.tabs.Tab[] = [];
  
  // If there's only one group, assign all tabs to it
  if (groupNames.length === 1) {
    groups.set(groupNames[0], [...tabs]);
    return groups;
  }
  
  // Calculate similarity scores for each tab and group
  tabs.forEach((tab, tabIndex) => {
    const tabTitle = tab.title?.toLowerCase() || '';
    const tabUrl = tab.url?.toLowerCase() || '';
    let bestGroup = '';
    let bestScore = 0;
    
    for (const groupName of groupNames) {
      const groupNameLower = groupName.toLowerCase();
      let score = 0;
      
      // Basic similarity scoring
      if (tabTitle.includes(groupNameLower)) {
        score += 3;
      }
      if (tabUrl.includes(groupNameLower)) {
        score += 2;
      }
      
      // Domain-based scoring
      score += getDomainTypeScore(tabUrl, groupNameLower);
      
      // Add subject-based semantic scoring
      const subjectMatch = findMostSimilarSubject(tab);
      if (groupNameLower.includes(subjectMatch.categoryName.toLowerCase())) {
        // Boost score if the group name contains the detected subject
        score += 2 * subjectMatch.similarity;
      }
      
      // Add some controlled randomness based on the attempt index
      // This helps explore different grouping possibilities
      // The randomness decreases with each attempt to converge to a stable solution
      const randomFactor = 1.0 - (attemptIndex / 5); // from 1.0 to 0.2
      score += (Math.random() * 0.5 - 0.25) * randomFactor;
      
      if (score > bestScore) {
        bestScore = score;
        bestGroup = groupName;
      }
    }
    
    // Use a threshold for assignment - add to uncategorized if low confidence
    if (bestScore < 0.5) {
      uncategorizedTabs.push(tab);
    } else {
      groups.get(bestGroup)!.push(tab);
    }
  });
  
  // Process uncategorized tabs if we have any
  if (uncategorizedTabs.length > 0) {
    const autoGroups = generateAutoGroups(uncategorizedTabs);
    autoGroups.forEach((tabs, groupName) => {
      groups.set(groupName, tabs);
    });
  }
  
  return groups;
}

/**
 * Direct assignment of tabs to user groups without multiple attempts
 */
function assignTabsToUserGroups(
  tabs: chrome.tabs.Tab[],
  groupNames: string[]
): Map<string, chrome.tabs.Tab[]> {
  // Create a map to store tabs for each group
  const groups = new Map<string, chrome.tabs.Tab[]>();
  groupNames.forEach(name => groups.set(name, []));
  
  // Create collection for tabs without clear matches
  const uncategorizedTabs: chrome.tabs.Tab[] = [];
  
  // If there's only one group, assign all tabs to it
  if (groupNames.length === 1) {
    groups.set(groupNames[0], [...tabs]);
    return groups;
  }
  
  // Assign each tab to the best matching group
  tabs.forEach(tab => {
    const tabTitle = tab.title?.toLowerCase() || '';
    const tabUrl = tab.url?.toLowerCase() || '';
    let bestGroup = '';
    let bestScore = 0;
    
    for (const groupName of groupNames) {
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
      
      // Subject match
      const subjectMatch = findMostSimilarSubject(tab);
      if (groupNameLower.includes(subjectMatch.categoryName.toLowerCase())) {
        score += 2 * subjectMatch.similarity;
      }
      
      // Additional scoring based on domain types
      score += getDomainTypeScore(tabUrl, groupNameLower);
      
      if (score > bestScore) {
        bestScore = score;
        bestGroup = groupName;
      }
    }
    
    // Use a threshold for assignment
    if (bestScore < 0.5) {
      uncategorizedTabs.push(tab);
    } else {
      // Add tab to the best matching group
      groups.get(bestGroup)!.push(tab);
    }
  });
  
  // Process uncategorized tabs if we have any
  if (uncategorizedTabs.length > 0) {
    const autoGroups = generateAutoGroups(uncategorizedTabs);
    autoGroups.forEach((tabs, groupName) => {
      groups.set(groupName, tabs);
    });
  }
  
  return groups;
}

/**
 * Automatically generate group names for uncategorized tabs
 * @param tabs - Array of tabs without a clear category
 * @returns Map of auto-generated group names to tab arrays
 */
function generateAutoGroups(tabs: chrome.tabs.Tab[]): Map<string, chrome.tabs.Tab[]> {
  const groups = new Map<string, chrome.tabs.Tab[]>();
  
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
    groups.set('Social Media', tabs);
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
    groups.set('Entertainment', tabs);
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
    groups.set('Shopping', tabs);
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
    groups.set('News & Updates', tabs);
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
      groups.set(`${topWords[0]} Pages`, tabs);
    } else {
      groups.set(`${topWords[0]} & ${topWords[1]}`, tabs);
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
      groups.set(`${topDomains[0]} Pages`, tabs);
    } else {
      groups.set(`${topDomains[0]} & ${topDomains[1]}`, tabs);
    }
    return groups;
  }
  
  // Last resort
  groups.set('Quick Access', tabs);
  return groups;
}

/**
 * Evaluate how good a grouping is based on coherence and balance
 */
function evaluateGroupingQuality(
  grouping: Map<string, chrome.tabs.Tab[]>, 
  allTabs: chrome.tabs.Tab[]
): number {
  // Coherence within groups is good (similar tabs in same groups)
  let coherenceScore = 0;
  
  grouping.forEach((tabs, groupName) => {
    if (tabs.length <= 1) return;
    
    // Calculate pairwise similarity within the group
    let pairwiseSimilarities = 0;
    let pairCount = 0;
    
    for (let i = 0; i < tabs.length; i++) {
      for (let j = i + 1; j < tabs.length; j++) {
        // Use semantic similarity
        pairwiseSimilarities += calculateTabSemanticSimilarity(tabs[i], tabs[j]);
        pairCount++;
      }
    }
    
    const groupCoherence = pairCount > 0 ? pairwiseSimilarities / pairCount : 0;
    coherenceScore += groupCoherence * tabs.length; // Weight by group size
  });
  
  // Normalize coherence score
  coherenceScore = coherenceScore / allTabs.length;
  
  // Overall score is just coherence (we removed balance considerations)
  const totalScore = coherenceScore;
  
  return totalScore;
}

/**
 * Calculate similarity between two tabs
 * This is kept for backward compatibility but uses the new semantic similarity
 */
function calculateTabSimilarity(tab1: chrome.tabs.Tab, tab2: chrome.tabs.Tab): number {
  // Using the new semantic similarity function
  return calculateTabSemanticSimilarity(tab1, tab2);
}

/**
 * Score tabs based on domain type
 */
function getDomainTypeScore(url: string, groupName: string): number {
  let score = 0;
  
  // Work-related domains
  if (groupName.includes('work') || groupName.includes('business')) {
    if (
      url.includes('docs.google.com') || 
      url.includes('github.com') || 
      url.includes('linkedin.com') ||
      url.includes('slack.com') ||
      url.includes('trello.com') ||
      url.includes('asana.com') ||
      url.includes('jira.com') ||
      url.includes('notion.so') ||
      url.includes('miro.com') ||
      url.includes('figma.com') ||
      url.includes('atlassian.com')
    ) {
      score += 1;
    }
  } 
  // Shopping-related domains
  else if (groupName.includes('shop') || groupName.includes('store')) {
    if (
      url.includes('amazon.com') || 
      url.includes('ebay.com') || 
      url.includes('etsy.com') ||
      url.includes('walmart.com') ||
      url.includes('shop') ||
      url.includes('store') ||
      url.includes('bestbuy.com') ||
      url.includes('target.com') ||
      url.includes('ecommerce')
    ) {
      score += 1;
    }
  } 
  // Social media domains
  else if (groupName.includes('social') || groupName.includes('media')) {
    if (
      url.includes('facebook.com') || 
      url.includes('twitter.com') || 
      url.includes('instagram.com') ||
      url.includes('reddit.com') ||
      url.includes('tiktok.com') ||
      url.includes('youtube.com') ||
      url.includes('linkedin.com') ||
      url.includes('pinterest.com') ||
      url.includes('tumblr.com') ||
      url.includes('discord.com')
    ) {
      score += 1;
    }
  } 
  // News-related domains
  else if (groupName.includes('news') || groupName.includes('media')) {
    if (
      url.includes('news') || 
      url.includes('bbc.com') || 
      url.includes('cnn.com') ||
      url.includes('nytimes.com') ||
      url.includes('reuters.com') ||
      url.includes('washingtonpost.com') ||
      url.includes('theguardian.com') ||
      url.includes('huffpost.com') ||
      url.includes('bloomberg.com')
    ) {
      score += 1;
    }
  } 
  // Research-related domains
  else if (groupName.includes('research') || groupName.includes('academic')) {
    if (
      url.includes('scholar.google.com') || 
      url.includes('researchgate.net') || 
      url.includes('academia.edu') ||
      url.includes('.edu') ||
      url.includes('wikipedia.org') ||
      url.includes('sciencedirect.com') ||
      url.includes('springer.com') ||
      url.includes('arxiv.org') ||
      url.includes('ieee.org') ||
      url.includes('jstor.org')
    ) {
      score += 1;
    }
  }
  
  return score;
}

/**
 * Group tabs by domain with multiple attempts
 */
function groupTabsByDomainWithMultipleAttempts(tabs: chrome.tabs.Tab[]): Map<string, chrome.tabs.Tab[]> {
  // For domain-based grouping, we don't need multiple attempts
  // as the grouping is deterministic, but we keep the function for consistency
  return groupTabsByDomain(tabs);
}

/**
 * Group tabs by domain
 * @param tabs - Array of tabs
 * @returns Map of domain names to tab arrays
 */
function groupTabsByDomain(tabs: chrome.tabs.Tab[]): Map<string, chrome.tabs.Tab[]> {
  const domainGroups = new Map<string, chrome.tabs.Tab[]>();
  const uncategorizedTabs: chrome.tabs.Tab[] = [];
  
  // Process each tab
  tabs.forEach(tab => {
    if (!tab.url) {
      // Skip tabs without URLs
      uncategorizedTabs.push(tab);
      return;
    }
    
    try {
      // Extract domain from URL
      const url = new URL(tab.url);
      let domain = url.hostname.replace(/^www\./, '');
      
      // Map common domains to better names
      const domainNameMap: Record<string, string> = {
        'github.com': 'GitHub',
        'mail.google.com': 'Gmail',
        'drive.google.com': 'Google Drive',
        'docs.google.com': 'Google Docs',
        'youtube.com': 'YouTube',
        'netflix.com': 'Netflix',
        'amazon.com': 'Amazon',
        'reddit.com': 'Reddit',
        'twitter.com': 'Twitter',
        'facebook.com': 'Facebook',
        'linkedin.com': 'LinkedIn',
        'instagram.com': 'Instagram',
      };
      
      let groupName = domainNameMap[domain] || domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1);
      
      // Handle empty domains or errors
      if (!groupName || groupName === '') {
        uncategorizedTabs.push(tab);
      } else {
        // Add tab to the domain group
        if (!domainGroups.has(groupName)) {
          domainGroups.set(groupName, []);
        }
        domainGroups.get(groupName)!.push(tab);
      }
    } catch (e) {
      // Handle invalid URLs - add to uncategorized
      uncategorizedTabs.push(tab);
    }
  });
  
  // Process uncategorized tabs if we have any
  if (uncategorizedTabs.length > 0) {
    const autoGroups = generateAutoGroups(uncategorizedTabs);
    autoGroups.forEach((tabs, groupName) => {
      domainGroups.set(groupName, tabs);
    });
  }
  
  return domainGroups;
}

export { assignTabsToUserGroups, assignTabsToUserGroupsWithMultipleAttempts }; 