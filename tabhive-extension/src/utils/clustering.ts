/**
 * Simplified clustering utility for TabHive
 * This version doesn't rely on external libraries that cause build issues
 */

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
  
  // If using user-defined groups, distribute tabs among them with multiple attempts
  if (userDefinedGroups && userDefinedGroups.length > 0) {
    return assignTabsToUserGroupsWithMultipleAttempts(tabs, userDefinedGroups);
  }
  
  // Simple automatic grouping by domain with multiple attempts
  return groupTabsByDomainWithMultipleAttempts(tabs);
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
  
  // If there's only one group, assign all tabs to it
  if (groupNames.length === 1) {
    groups.set(groupNames[0], [...tabs]);
    return groups;
  }
  
  // Create a similarity matrix between tabs and groups
  const similarityScores: Record<number, Record<string, number>> = {};
  
  // Calculate similarity scores for each tab and group
  tabs.forEach((tab, tabIndex) => {
    similarityScores[tabIndex] = {};
    const tabTitle = tab.title?.toLowerCase() || '';
    const tabUrl = tab.url?.toLowerCase() || '';
    
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
      
      // Add some controlled randomness based on the attempt index
      // This helps explore different grouping possibilities
      // The randomness decreases with each attempt to converge to a stable solution
      const randomFactor = 1.0 - (attemptIndex / 5); // from 1.0 to 0.2
      score += (Math.random() * 0.5 - 0.25) * randomFactor;
      
      similarityScores[tabIndex][groupName] = score;
    }
  });
  
  // Assign tabs to groups based on similarity scores
  tabs.forEach((tab, tabIndex) => {
    const scores = similarityScores[tabIndex];
    
    // Find group with highest score for this tab
    let bestGroup = groupNames[0];
    let bestScore = scores[bestGroup];
    
    for (const groupName of groupNames) {
      if (scores[groupName] > bestScore) {
        bestScore = scores[groupName];
        bestGroup = groupName;
      }
    }
    
    // If all scores are equal or very low, assign to the group with fewest tabs
    if (bestScore < 0.1) {
      bestGroup = [...groups.entries()]
        .sort((a, b) => a[1].length - b[1].length)[0][0];
    }
    
    // Add tab to selected group
    const currentTabs = groups.get(bestGroup) || [];
    groups.set(bestGroup, [...currentTabs, tab]);
  });
  
  // Balance groups - move tabs from large groups to empty ones
  const emptyGroups = [...groups.entries()]
    .filter(([_, tabs]) => tabs.length === 0)
    .map(([name, _]) => name);
  
  if (emptyGroups.length > 0) {
    const largeGroups = [...groups.entries()]
      .filter(([_, tabs]) => tabs.length > 1)
      .sort((a, b) => b[1].length - a[1].length);
    
    emptyGroups.forEach(emptyGroup => {
      if (largeGroups.length > 0 && largeGroups[0][1].length > 1) {
        const [largeGroupName, largeGroupTabs] = largeGroups[0];
        const tabToMove = largeGroupTabs.pop()!;
        
        groups.get(emptyGroup)!.push(tabToMove);
        
        // Re-sort large groups
        largeGroups.sort((a, b) => b[1].length - a[1].length);
      }
    });
  }
  
  return groups;
}

/**
 * Evaluate how good a grouping is based on coherence and balance
 */
function evaluateGroupingQuality(
  grouping: Map<string, chrome.tabs.Tab[]>, 
  allTabs: chrome.tabs.Tab[]
): number {
  // No empty groups is good
  const hasEmptyGroups = [...grouping.values()].some(tabs => tabs.length === 0);
  
  // Balanced groups are good (less variance in group sizes)
  const groupSizes = [...grouping.values()].map(tabs => tabs.length);
  const avgSize = groupSizes.reduce((sum, size) => sum + size, 0) / groupSizes.length;
  const sizeVariance = groupSizes.reduce((sum, size) => sum + Math.pow(size - avgSize, 2), 0) / groupSizes.length;
  
  // Coherence within groups is good (similar tabs in same groups)
  let coherenceScore = 0;
  
  grouping.forEach((tabs, groupName) => {
    if (tabs.length <= 1) return;
    
    // Calculate pairwise similarity within the group
    let pairwiseSimilarities = 0;
    let pairCount = 0;
    
    for (let i = 0; i < tabs.length; i++) {
      for (let j = i + 1; j < tabs.length; j++) {
        pairwiseSimilarities += calculateTabSimilarity(tabs[i], tabs[j]);
        pairCount++;
      }
    }
    
    const groupCoherence = pairCount > 0 ? pairwiseSimilarities / pairCount : 0;
    coherenceScore += groupCoherence * tabs.length; // Weight by group size
  });
  
  // Normalize coherence score
  coherenceScore = coherenceScore / allTabs.length;
  
  // Overall score combines multiple factors
  const emptyGroupPenalty = hasEmptyGroups ? -10 : 0;
  const balanceScore = 10 / (1 + sizeVariance); // Higher variance = lower score
  
  const totalScore = coherenceScore + balanceScore + emptyGroupPenalty;
  
  return totalScore;
}

/**
 * Calculate similarity between two tabs
 */
function calculateTabSimilarity(tab1: chrome.tabs.Tab, tab2: chrome.tabs.Tab): number {
  const url1 = tab1.url || '';
  const url2 = tab2.url || '';
  const title1 = tab1.title || '';
  const title2 = tab2.title || '';
  
  let similarity = 0;
  
  // Same domain is a strong signal
  try {
    const domain1 = new URL(url1).hostname;
    const domain2 = new URL(url2).hostname;
    
    if (domain1 === domain2) {
      similarity += 0.5;
    }
    
    // Subdomain match
    const baseDomain1 = domain1.split('.').slice(-2).join('.');
    const baseDomain2 = domain2.split('.').slice(-2).join('.');
    
    if (baseDomain1 === baseDomain2) {
      similarity += 0.3;
    }
  } catch (e) {
    // Invalid URL, do nothing
  }
  
  // Path similarity
  try {
    const path1 = new URL(url1).pathname.split('/').filter(Boolean);
    const path2 = new URL(url2).pathname.split('/').filter(Boolean);
    
    if (path1.length > 0 && path2.length > 0) {
      const commonPathElements = path1.filter(p => path2.includes(p)).length;
      const pathSimilarity = commonPathElements / Math.max(path1.length, path2.length);
      similarity += pathSimilarity * 0.2;
    }
  } catch (e) {
    // Invalid URL, do nothing
  }
  
  // Title similarity (basic)
  const words1 = title1.toLowerCase().split(/\s+/);
  const words2 = title2.toLowerCase().split(/\s+/);
  
  if (words1.length > 0 && words2.length > 0) {
    const commonWords = words1.filter(w => words2.includes(w)).length;
    const titleSimilarity = commonWords / Math.max(words1.length, words2.length);
    similarity += titleSimilarity * 0.3;
  }
  
  return similarity;
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
  
  // Process each tab
  tabs.forEach(tab => {
    if (!tab.url) {
      // Skip tabs without URLs
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
        groupName = 'Other';
      }
      
      // Add tab to the domain group
      if (!domainGroups.has(groupName)) {
        domainGroups.set(groupName, []);
      }
      domainGroups.get(groupName)!.push(tab);
    } catch (e) {
      // Handle invalid URLs - add to Other group
      if (!domainGroups.has('Other')) {
        domainGroups.set('Other', []);
      }
      domainGroups.get('Other')!.push(tab);
    }
  });
  
  return domainGroups;
}

/**
 * Assign tabs to user-defined groups
 * Original implementation for backward compatibility
 */
function assignTabsToUserGroups(
  tabs: chrome.tabs.Tab[], 
  groupNames: string[]
): Map<string, chrome.tabs.Tab[]> {
  // Handle edge cases
  if (tabs.length === 0 || groupNames.length === 0) {
    return new Map<string, chrome.tabs.Tab[]>();
  }
  
  // Create a map to store tabs for each group
  const groups = new Map<string, chrome.tabs.Tab[]>();
  groupNames.forEach(name => groups.set(name, []));
  
  // If there's only one group, assign all tabs to it
  if (groupNames.length === 1) {
    groups.set(groupNames[0], [...tabs]);
    return groups;
  }
  
  // Distribute tabs evenly among groups
  tabs.forEach((tab, index) => {
    const groupIndex = index % groupNames.length;
    const groupName = groupNames[groupIndex];
    const currentTabs = groups.get(groupName) || [];
    groups.set(groupName, [...currentTabs, tab]);
  });
  
  return groups;
}

export { assignTabsToUserGroups, assignTabsToUserGroupsWithMultipleAttempts }; 