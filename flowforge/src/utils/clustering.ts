import { kmeans } from 'ml-kmeans';

// Extract course codes from our list with proper formatting
function extractCourseComponents(): {prefixes: string[], fullCodes: string[]} {
  // Our full list of course codes
  const courseCodes = [
    'COMMST192',
    'CS 136',
    'CS 136L',
    'CS 449',
    'CS 459',
    'CS 486',
    'CS 492',
    'CS138',
    'CS341',
    'ECE102',
    'ECE106',
    'ECE108',
    'ECE124',
    'ECE140',
    'ECE192',
    'ECE301',
    'ECE318',
    'ECE327',
    'ECE350',
    'ECE380',
    'ENGL192',
    'GENE123',
    'MATH 136',
    'MATH 138',
    'MATH118',
    'MATH119',
    'MATH213',
    'ME100B',
    'ME101',
    'ME115',
    'ME123',
    'ME300A',
    'ME303',
    'ME321',
    'ME340',
    'ME351',
    'ME354',
    'MSE100B',
    'MSE131',
    'MSE211',
    'MSE300A',
    'MSE334',
    'MSE342',
    'MSE431',
    'MSE446',
    'PHYS115',
    'SE102',
    'SE301',
    'SE350',
    'SE464',
    'SE465',
    'UCR192E'
  ];

  // Extract unique subject prefixes
  const prefixes = new Set<string>();
  courseCodes.forEach(code => {
    // Extract prefix (letters before numbers)
    const prefix = code.match(/^[A-Z]+/);
    if (prefix) {
      prefixes.add(prefix[0]);
    }
  });

  return {
    prefixes: Array.from(prefixes),
    fullCodes: courseCodes
  };
}

const { prefixes: subjectPrefixes, fullCodes: knownCourseCodes } = extractCourseComponents();

// Detect course codes in text (e.g., "MATH 118", "CS 101", "PHYS 202")
function detectCourseCode(text: string): string | null {
  // First, check if any of our known course codes are in the text
  for (const courseCode of knownCourseCodes) {
    // Create standardized versions of the course code for matching
    const withSpace = courseCode.replace(/([A-Z]+)(\d)/, '$1 $2');
    const withoutSpace = courseCode.replace(/([A-Z]+) (\d)/, '$1$2');
    
    // Check for exact matches (case insensitive)
    if (text.toUpperCase().includes(withSpace) || 
        text.toUpperCase().includes(withoutSpace)) {
      return withSpace; // Return standardized format
    }
  }
  
  // If no match found, try generic pattern matching with our subject prefixes
  // Pattern 1: [SUBJECT] [NUMBER] - e.g., "MATH 118"
  const pattern1 = new RegExp(`(${subjectPrefixes.join('|')})[\\s-.]+(\\d{2,3}[A-Z]?|\\d{4})\\b`, 'i');
  
  // Pattern 2: [SUBJECT][NUMBER] - e.g., "CS101"
  const pattern2 = new RegExp(`(${subjectPrefixes.join('|')})(\\d{2,3}[A-Z]?|\\d{4})\\b`, 'i');
  
  // Try to match the patterns in the text
  const match1 = text.match(pattern1);
  const match2 = text.match(pattern2);
  
  if (match1) {
    // Return standardized format: "SUBJ 123"
    return `${match1[1].toUpperCase()} ${match1[2]}`;
  } else if (match2) {
    // Return standardized format: "SUBJ 123"
    return `${match2[1].toUpperCase()} ${match2[2]}`;
  }
  
  return null;
}

// Extract unique words from text
function extractWords(text: string): string[] {
  return text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')  // Replace non-alphanumeric with spaces
    .split(/\s+/)              // Split by whitespace
    .filter(word => word.length > 3) // Filter out short words
    .filter(word => !/^\d+$/.test(word)) // Filter out pure numbers
}

// Simple text embedding function using character frequency
export function generateSimpleEmbeddings(texts: string[]): number[][] {
  // We'll create a 26-dimensional vector (a-z frequency)
  return texts.map(text => {
    const normalizedText = text.toLowerCase();
    
    // Initialize vector with zeros
    const vector = new Array(26).fill(0);
    
    // Count letter frequencies
    for (let i = 0; i < normalizedText.length; i++) {
      const charCode = normalizedText.charCodeAt(i) - 97; // 'a' is 97
      if (charCode >= 0 && charCode < 26) {
        vector[charCode]++;
      }
    }
    
    // Normalize by text length
    const textLength = Math.max(1, normalizedText.length);
    return vector.map(count => count / textLength);
  });
}

// Find optimal number of clusters using the elbow method
export function findOptimalClusters(embeddings: number[][], minClusters: number = 2, maxClusters: number = 8): number {
  // If there are very few tabs, just use minClusters
  if (embeddings.length <= minClusters * 2) {
    return Math.min(minClusters, Math.floor(embeddings.length / 2));
  }

  // Calculate inertia for different numbers of clusters
  const inertias: number[] = [];
  for (let k = minClusters; k <= Math.min(maxClusters, embeddings.length - 1); k++) {
    const result = kmeans(embeddings, k, {
      initialization: 'kmeans++',
      seed: 42,
      maxIterations: 100
    });
    // Use result.centroids to calculate inertia manually if needed
    let inertia = 0;
    if (result.centroids && result.clusters) {
      for (let i = 0; i < embeddings.length; i++) {
        const centroidIdx = result.clusters[i];
        const centroid = result.centroids[centroidIdx];
        // Calculate squared distance
        let dist = 0;
        for (let j = 0; j < embeddings[i].length; j++) {
          dist += Math.pow(embeddings[i][j] - centroid[j], 2);
        }
        inertia += dist;
      }
    }
    inertias.push(inertia);
  }

  // Find the elbow point using the rate of change
  let optimalK = minClusters;
  let maxChange = 0;
  for (let i = 1; i < inertias.length; i++) {
    const change = inertias[i - 1] - inertias[i];
    if (change > maxChange) {
      maxChange = change;
      optimalK = i + minClusters;
    }
  }

  return optimalK;
}

// Cluster tabs based on embeddings
export function clusterEmbeddings(embeddings: number[][], preferredGroupCount?: number): { 
  clusters: number[],
  centroids: number[][]
} {
  // Determine number of clusters - use preferred count if provided
  const numClusters = preferredGroupCount || findOptimalClusters(embeddings);
  
  // Ensure we don't have more clusters than embeddings
  const adjustedNumClusters = Math.min(numClusters, embeddings.length - 1);
  // At least 2 clusters if we have enough embeddings
  const finalNumClusters = embeddings.length > 2 ? 
    Math.max(adjustedNumClusters, 2) : 
    1;

  console.log(`Clustering with ${finalNumClusters} clusters (preferred: ${preferredGroupCount || 'auto'})`);

  // Run k-means clustering
  const { clusters, centroids } = kmeans(embeddings, finalNumClusters, {
    initialization: 'kmeans++',
    seed: 42,
    maxIterations: 100
  });

  return { clusters, centroids };
}

// Convert tab data to a format suitable for embedding
export function prepareTabTextsForEmbedding(tabs: chrome.tabs.Tab[]): string[] {
  return tabs.map(tab => {
    // Combine title and URL for more context
    const urlWithoutParams = tab.url?.split('?')[0] || '';
    const domainParts = urlWithoutParams.replace(/^https?:\/\//, '').split('/');
    const domain = domainParts[0];
    
    // Combine domain and title for better context
    return `${tab.title} ${domain}`;
  });
}

// Group tabs by course codes first, then use clustering for the rest
export function groupTabsByCourseAndClusters(tabs: chrome.tabs.Tab[]): {
  groupedTabs: Map<string, chrome.tabs.Tab[]>,
  remainingTabs: chrome.tabs.Tab[],
  remainingTabIndices: number[]
} {
  const groupedTabs = new Map<string, chrome.tabs.Tab[]>();
  const remainingTabs: chrome.tabs.Tab[] = [];
  const remainingTabIndices: number[] = [];
  
  // First pass: Group by course codes
  tabs.forEach((tab, index) => {
    const tabTitle = tab.title || '';
    const courseCode = detectCourseCode(tabTitle);
    
    if (courseCode) {
      // Course code detected, group by it
      if (!groupedTabs.has(courseCode)) {
        groupedTabs.set(courseCode, []);
      }
      groupedTabs.get(courseCode)?.push(tab);
    } else {
      // No course code, save for clustering
      remainingTabs.push(tab);
      remainingTabIndices.push(index);
    }
  });
  
  return { groupedTabs, remainingTabs, remainingTabIndices };
}

// Generate group names based on tab titles in each cluster
export function generateGroupNames(groupedTabs: Map<string, chrome.tabs.Tab[]>): Map<string, string> {
  const groupNames = new Map<string, string>();
  
  groupedTabs.forEach((tabs, groupId) => {
    // If the groupId already looks like a course code, keep it
    if (/^[A-Z]+ \d+/.test(groupId)) {
      groupNames.set(groupId, groupId);
      return;
    }
    
    // Extract words from tab titles
    const allWords: string[] = [];
    tabs.forEach(tab => {
      const title = tab.title || '';
      const words = extractWords(title);
      allWords.push(...words);
    });
    
    // Count word frequency
    const wordCounts = new Map<string, number>();
    allWords.forEach(word => {
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
    });
    
    // Sort words by frequency
    const sortedWords = [...wordCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);
    
    // Use the most common word as the group name, or a default if none found
    const groupName = sortedWords.length > 0 ? 
      sortedWords[0].charAt(0).toUpperCase() + sortedWords[0].slice(1) : 
      `Group ${groupId}`;
    
    groupNames.set(groupId, groupName);
  });
  
  return groupNames;
}

// Main function to organize tabs by course codes and clustering
export async function organizeTabsByClustering(
  tabs: chrome.tabs.Tab[],
  preferredGroupCount?: number,
  forceExactGroupCount: boolean = false
): Promise<{
  groupedTabs: Map<string, chrome.tabs.Tab[]>,
  groupNames: Map<string, string>
}> {
  console.log(`Starting tab organization with ${tabs.length} tabs. Preferred group count: ${preferredGroupCount}, Force exact: ${forceExactGroupCount}`);
  
  // If exact group count is forced and specified, we need a different approach
  if (forceExactGroupCount && preferredGroupCount) {
    console.log(`Forcing exactly ${preferredGroupCount} groups as requested`);
    
    // Create a map to store our final groups
    const finalGroups = new Map<string, chrome.tabs.Tab[]>();
    
    // First, identify all course codes
    const tabsWithCodes: {tab: chrome.tabs.Tab, code: string}[] = [];
    const tabsWithoutCodes: chrome.tabs.Tab[] = [];
    
    tabs.forEach(tab => {
      const tabTitle = tab.title || '';
      const courseCode = detectCourseCode(tabTitle);
      
      if (courseCode) {
        tabsWithCodes.push({tab, code: courseCode});
      } else {
        tabsWithoutCodes.push(tab);
      }
    });
    
    // Count unique course codes
    const courseCodes = new Map<string, number>();
    tabsWithCodes.forEach(({code}) => {
      courseCodes.set(code, (courseCodes.get(code) || 0) + 1);
    });
    
    // Sort course codes by frequency (most frequent first)
    const sortedCodes = [...courseCodes.entries()]
      .sort((a, b) => b[1] - a[1]);
    
    // Decide how to distribute our groups
    if (sortedCodes.length >= preferredGroupCount) {
      // Too many course codes, keep only the most frequent ones
      for (let i = 0; i < preferredGroupCount; i++) {
        const code = sortedCodes[i][0];
        const matchingTabs = tabsWithCodes
          .filter(({code: tabCode}) => tabCode === code)
          .map(({tab}) => tab);
        
        finalGroups.set(code, matchingTabs);
      }
      
      // Add any remaining tabs with course codes to the "Other" group
      if (tabsWithCodes.length > 0) {
        const otherTabs = tabsWithCodes
          .filter(({code}) => !finalGroups.has(code))
          .map(({tab}) => tab)
          .concat(tabsWithoutCodes);
        
        if (otherTabs.length > 0 && finalGroups.size < preferredGroupCount) {
          finalGroups.set("Other", otherTabs);
        } else if (otherTabs.length > 0) {
          // Distribute remaining tabs among existing groups evenly
          let groupIndex = 0;
          const groupKeys = [...finalGroups.keys()];
          
          otherTabs.forEach(tab => {
            const key = groupKeys[groupIndex % groupKeys.length];
            finalGroups.get(key)!.push(tab);
            groupIndex++;
          });
        }
      }
    } else {
      // Not enough course codes to fill all groups
      
      // First, create groups for all course codes
      sortedCodes.forEach(([code, _]) => {
        const matchingTabs = tabsWithCodes
          .filter(({code: tabCode}) => tabCode === code)
          .map(({tab}) => tab);
        
        finalGroups.set(code, matchingTabs);
      });
      
      // Calculate remaining groups needed
      const remainingGroupsNeeded = preferredGroupCount - finalGroups.size;
      
      if (remainingGroupsNeeded > 0 && tabsWithoutCodes.length > 0) {
        // Use clustering to create exactly the remaining number of groups
        const tabTexts = prepareTabTextsForEmbedding(tabsWithoutCodes);
        const embeddings = generateSimpleEmbeddings(tabTexts);
        
        if (embeddings.length > 0) {
          // Force exactly the required number of remaining groups
          const { clusters } = clusterEmbeddings(embeddings, remainingGroupsNeeded);
          
          // Create exactly the right number of groups
          for (let i = 0; i < remainingGroupsNeeded; i++) {
            finalGroups.set(`Group ${i+1}`, []);
          }
          
          // Assign tabs to groups
          clusters.forEach((clusterId, idx) => {
            // Map the cluster ID to our group index (0 to remainingGroupsNeeded-1)
            const adjustedId = clusterId % remainingGroupsNeeded;
            const groupKey = `Group ${adjustedId+1}`;
            finalGroups.get(groupKey)!.push(tabsWithoutCodes[idx]);
          });
          
          // Check if any groups are empty and redistribute if necessary
          const emptyGroups = [...finalGroups.entries()]
            .filter(([_, tabs]) => tabs.length === 0)
            .map(([key, _]) => key);
          
          if (emptyGroups.length > 0) {
            console.log(`Found ${emptyGroups.length} empty groups, redistributing tabs`);
            
            // Find groups with the most tabs
            const groupsBySize = [...finalGroups.entries()]
              .filter(([key, _]) => !emptyGroups.includes(key))
              .sort((a, b) => b[1].length - a[1].length);
            
            // Redistribute from largest groups to empty ones
            emptyGroups.forEach((emptyKey, idx) => {
              if (idx < groupsBySize.length) {
                const sourceKey = groupsBySize[idx][0];
                const sourceTabs = finalGroups.get(sourceKey)!;
                
                if (sourceTabs.length >= 2) {
                  // Take half the tabs from the source group
                  const tabsToMove = sourceTabs.splice(0, Math.ceil(sourceTabs.length / 2));
                  finalGroups.set(emptyKey, tabsToMove);
                }
              }
            });
            
            // Clean up any remaining empty groups
            emptyGroups.forEach(key => {
              if (finalGroups.get(key)?.length === 0) {
                finalGroups.delete(key);
              }
            });
          }
        }
      }
    }
    
    // Final check - add an "Other" group if we still don't have enough groups
    if (finalGroups.size < preferredGroupCount && tabsWithoutCodes.length > 0) {
      finalGroups.set("Other", tabsWithoutCodes);
    }
    
    // Generate names for groups that don't have meaningful names
    const groupNames = new Map<string, string>();
    finalGroups.forEach((tabs, key) => {
      if (key.startsWith('Group ')) {
        // Generate a name based on content
        const wordFreq = new Map<string, number>();
        tabs.forEach(tab => {
          const words = extractWords(tab.title || '');
          words.forEach(word => {
            wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
          });
        });
        
        // Sort by frequency
        const mostFrequent = [...wordFreq.entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([word, _]) => word.charAt(0).toUpperCase() + word.slice(1));
        
        if (mostFrequent.length > 0) {
          groupNames.set(key, mostFrequent.join(' / '));
        }
      } else {
        // Use the existing key (likely a course code)
        groupNames.set(key, key);
      }
    });
    
    console.log(`Created exactly ${finalGroups.size} groups as requested`);
    return { groupedTabs: finalGroups, groupNames };
  }
  
  // Original implementation for non-forced group count
  // Filter out "New Tab" pages
  const filteredTabs = tabs.filter(tab => {
    return tab.title !== 'New Tab' && tab.title !== 'new tab' && 
           !tab.url?.startsWith('chrome://newtab');
  });
  
  console.log(`Filtered out ${tabs.length - filteredTabs.length} New Tab pages`);
  
  // If we have an exact user preference for group count, we need to plan accordingly
  const exactGroupCountRequested = preferredGroupCount !== undefined;
  
  // First, group tabs by course codes
  const { groupedTabs, remainingTabs, remainingTabIndices } = groupTabsByCourseAndClusters(filteredTabs);
  
  // Count course code groups
  const courseCodeGroupCount = groupedTabs.size;
  
  // If user requested exact count, we need to adjust our approach
  if (exactGroupCountRequested && preferredGroupCount) {
    console.log(`User requested exactly ${preferredGroupCount} groups. Currently have ${courseCodeGroupCount} course code groups.`);
    
    // If we already have too many course code groups, we need to merge some
    if (courseCodeGroupCount > preferredGroupCount) {
      // Sort groups by size (smallest first) for potential merging
      const groupEntries = [...groupedTabs.entries()].sort((a, b) => a[1].length - b[1].length);
      
      // Create a new map with only the requested number of groups
      const mergedGroups = new Map<string, chrome.tabs.Tab[]>();
      
      // Keep the largest groups as they are
      for (let i = groupEntries.length - preferredGroupCount; i < groupEntries.length; i++) {
        mergedGroups.set(groupEntries[i][0], groupEntries[i][1]);
      }
      
      // Merge the smaller groups into an "Other Courses" group
      if (groupEntries.length > preferredGroupCount) {
        const mergedTabs: chrome.tabs.Tab[] = [];
        for (let i = 0; i < groupEntries.length - preferredGroupCount; i++) {
          mergedTabs.push(...groupEntries[i][1]);
        }
        if (mergedTabs.length > 0) {
          mergedGroups.set('Other Courses', mergedTabs);
        }
      }
      
      // Use the merged groups
      return { 
        groupedTabs: mergedGroups,
        groupNames: generateGroupNames(mergedGroups)
      };
    }
    
    // Calculate how many more groups we need for clustering
    const remainingGroupsNeeded = preferredGroupCount - courseCodeGroupCount;
    
    // Only cluster remaining tabs if there are any and we need more groups
    if (remainingTabs.length > 0 && remainingGroupsNeeded > 0) {
      // Prepare texts for embedding
      const tabTexts = prepareTabTextsForEmbedding(remainingTabs);
      
      // Generate simple embeddings
      const embeddings = generateSimpleEmbeddings(tabTexts);
      
      if (embeddings.length > 1) {
        // Cluster embeddings with exactly the number of groups needed
        const { clusters } = clusterEmbeddings(embeddings, remainingGroupsNeeded);
        
        // Group remaining tabs by clusters
        const uniqueClusters = [...new Set(clusters)];
        uniqueClusters.forEach(clusterId => {
          const clusterName = `cluster_${clusterId}`;
          if (!groupedTabs.has(clusterName)) {
            groupedTabs.set(clusterName, []);
          }
          
          // Assign tabs to this cluster
          clusters.forEach((cluster, idx) => {
            if (cluster === clusterId) {
              groupedTabs.get(clusterName)?.push(remainingTabs[idx]);
            }
          });
        });
      } else if (remainingTabs.length === 1 && remainingGroupsNeeded > 0) {
        // Just one remaining tab, create a misc group
        groupedTabs.set('misc', remainingTabs);
      }
    } else if (remainingTabs.length > 0 && remainingGroupsNeeded <= 0) {
      // No more groups allowed, put all remaining tabs in an "Other" group
      groupedTabs.set('Other', remainingTabs);
    }
  } else {
    // Original behavior when no exact count is specified
    if (remainingTabs.length > 0) {
      // Prepare texts for embedding
      const tabTexts = prepareTabTextsForEmbedding(remainingTabs);
      
      // Generate simple embeddings
      const embeddings = generateSimpleEmbeddings(tabTexts);
      
      if (embeddings.length > 1) {
        // Cluster embeddings
        const { clusters } = clusterEmbeddings(embeddings, preferredGroupCount);
        
        // Group remaining tabs by clusters
        const uniqueClusters = [...new Set(clusters)];
        uniqueClusters.forEach(clusterId => {
          const clusterName = `cluster_${clusterId}`;
          if (!groupedTabs.has(clusterName)) {
            groupedTabs.set(clusterName, []);
          }
          
          // Assign tabs to this cluster
          clusters.forEach((cluster, idx) => {
            if (cluster === clusterId) {
              groupedTabs.get(clusterName)?.push(remainingTabs[idx]);
            }
          });
        });
      } else if (remainingTabs.length === 1) {
        // Just one remaining tab, create a misc group
        groupedTabs.set('misc', remainingTabs);
      }
    }
  }
  
  // Generate group names
  const groupNames = generateGroupNames(groupedTabs);
  
  console.log(`Created ${groupedTabs.size} groups in total`);
  
  return { groupedTabs, groupNames };
} 