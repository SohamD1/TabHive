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
  // Cache for performance - memoize results
  const memo = new Map<string, string | null>();
  const key = text.trim();
  
  if (memo.has(key)) {
    return memo.get(key) ?? null;
  }
  
  // First, check if any of our known course codes are in the text
  for (const courseCode of knownCourseCodes) {
    // Create standardized versions of the course code for matching
    const withSpace = courseCode.replace(/([A-Z]+)(\d)/, '$1 $2');
    const withoutSpace = courseCode.replace(/([A-Z]+) (\d)/, '$1$2');
    
    // Check for exact matches (case insensitive)
    if (text.toUpperCase().includes(withSpace) || 
        text.toUpperCase().includes(withoutSpace)) {
      memo.set(key, withSpace);
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
    const result = `${match1[1].toUpperCase()} ${match1[2]}`;
    memo.set(key, result);
    return result;
  } else if (match2) {
    // Return standardized format: "SUBJ 123"
    const result = `${match2[1].toUpperCase()} ${match2[2]}`;
    memo.set(key, result);
    return result;
  }
  
  memo.set(key, null);
  return null;
}

// Extract unique words from text with enhanced filtering
function extractWords(text: string): string[] {
  // Define a list of common stopwords to filter out
  const stopwords = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 
    'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 
    'to', 'was', 'were', 'will', 'with', 'page', 'site', 'home', 'login',
    'welcome', 'website', 'official', 'online', 'free', 'new'
  ]);
  
  return text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')  // Replace non-alphanumeric with spaces
    .split(/\s+/)              // Split by whitespace
    .filter(word => word.length > 2) // Filter out very short words
    .filter(word => !/^\d+$/.test(word)) // Filter out pure numbers
    .filter(word => !stopwords.has(word)); // Filter out stopwords
}

// Improved text embedding function using TF-IDF style weighting
export function generateImprovedEmbeddings(texts: string[]): number[][] {
  // First, extract all unique words from all texts
  const allWords = new Set<string>();
  const documentWords: string[][] = texts.map(text => {
    const words = extractWords(text);
    words.forEach(word => allWords.add(word));
    return words;
  });
  
  // Create a vocabulary map
  const vocabulary = new Map<string, number>();
  Array.from(allWords).forEach((word, index) => {
    vocabulary.set(word, index);
  });
  
  // Count document frequency (number of documents containing each word)
  const documentFrequency = new Map<string, number>();
  documentWords.forEach(words => {
    // Count each word only once per document
    const uniqueWords = new Set(words);
    uniqueWords.forEach(word => {
      documentFrequency.set(word, (documentFrequency.get(word) || 0) + 1);
    });
  });
  
  // Calculate IDF for each word
  const idf = new Map<string, number>();
  const totalDocuments = texts.length;
  documentFrequency.forEach((count, word) => {
    // IDF formula: log(totalDocuments / documentFrequency)
    idf.set(word, Math.log(totalDocuments / count));
  });
  
  // Create embeddings using TF-IDF weighting
  const embeddings: number[][] = [];
  
  documentWords.forEach(words => {
    // Initialize vector with zeros
    const vector = new Array(vocabulary.size).fill(0);
    
    // Count word frequency in this document
    const wordFrequency = new Map<string, number>();
    words.forEach(word => {
      wordFrequency.set(word, (wordFrequency.get(word) || 0) + 1);
    });
    
    // Calculate TF-IDF for each word in the document
    wordFrequency.forEach((frequency, word) => {
      const index = vocabulary.get(word);
      if (index !== undefined) {
        // TF: term frequency in the document
        const tf = frequency / words.length;
        // IDF: inverse document frequency
        const wordIdf = idf.get(word) || 0;
        // TF-IDF score
        vector[index] = tf * wordIdf;
      }
    });
    
    // Add additional URL-domain specific features
    // These will be the last 5 dimensions of our vector
    if (words.length > 0) {
      // Check for specific domains and add binary flags
      const text = texts[embeddings.length]; // Original text
      const hasGithub = text.includes('github.com') ? 1 : 0;
      const hasGoogle = text.includes('google.com') ? 1 : 0;
      const hasYouTube = text.includes('youtube.com') ? 1 : 0;
      const hasSchool = /edu|university|college|school|course|lecture|assignment/.test(text) ? 1 : 0;
      const hasShopping = /amazon|ebay|shop|store|product|buy|cart|price/.test(text) ? 1 : 0;
      
      vector.push(hasGithub, hasGoogle, hasYouTube, hasSchool, hasShopping);
    }
    
    embeddings.push(vector);
  });
  
  return embeddings;
}

// Simple fallback embedding function (original implementation)
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

// Find optimal number of clusters using improved elbow method
export function findOptimalClusters(embeddings: number[][], minClusters: number = 2, maxClusters: number = 8): number {
  // Early exit for small number of tabs
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
    
    // Calculate inertia (sum of squared distances to nearest centroid)
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

  // Find the elbow point using the second derivative method
  let optimalK = minClusters;
  if (inertias.length >= 3) {
    const derivatives: number[] = [];
    for (let i = 1; i < inertias.length; i++) {
      derivatives.push(inertias[i-1] - inertias[i]);
    }
    
    const secondDerivatives: number[] = [];
    for (let i = 1; i < derivatives.length; i++) {
      secondDerivatives.push(derivatives[i-1] - derivatives[i]);
    }
    
    // Find maximum second derivative
    let maxIndex = 0;
    for (let i = 1; i < secondDerivatives.length; i++) {
      if (secondDerivatives[i] > secondDerivatives[maxIndex]) {
        maxIndex = i;
      }
    }
    
    // Add 2 because we started from minClusters and we need to account for two derivative calculations
    optimalK = maxIndex + minClusters + 2;
  } else {
    // Fallback to original method if we don't have enough data points
    let maxChange = 0;
    for (let i = 1; i < inertias.length; i++) {
      const change = inertias[i - 1] - inertias[i];
      if (change > maxChange) {
        maxChange = change;
        optimalK = i + minClusters;
      }
    }
  }

  return optimalK;
}

// Improved clustering function with multiple attempts for better stability
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

  // Run k-means multiple times and pick best result (to avoid local minima)
  let bestResult: {clusters: number[], centroids: number[][], inertia: number} | null = null;
  
  for (let attempt = 0; attempt < 3; attempt++) {
    // Run k-means with different seeds
    const result = kmeans(embeddings, finalNumClusters, {
      initialization: 'kmeans++',
      seed: 42 + attempt, // Different seed each time
      maxIterations: 100
    });
    
    // Calculate inertia to determine which result is best
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
      
      if (!bestResult || inertia < bestResult.inertia) {
        bestResult = {
          clusters: result.clusters,
          centroids: result.centroids,
          inertia
        };
      }
    }
  }
  
  return {
    clusters: bestResult ? bestResult.clusters : [],
    centroids: bestResult ? bestResult.centroids : []
  };
}

// Convert tab data to a format suitable for embedding with enhanced preprocessing
export function prepareTabTextsForEmbedding(tabs: chrome.tabs.Tab[]): string[] {
  return tabs.map(tab => {
    // Extract meaningful parts from the URL
    const url = tab.url || '';
    const urlWithoutParams = url.split('?')[0] || '';
    
    // Extract domain and path
    let domain = '';
    let path = '';
    
    try {
      const urlObj = new URL(urlWithoutParams);
      domain = urlObj.hostname.replace(/^www\./, ''); // Remove www prefix
      path = urlObj.pathname.split('/').filter(Boolean).join(' '); // Convert path to space-separated terms
    } catch (e) {
      // If URL parsing fails, fallback to simple extraction
      const domainParts = urlWithoutParams.replace(/^https?:\/\//, '').split('/');
      domain = domainParts[0].replace(/^www\./, '');
      path = domainParts.slice(1).join(' ');
    }
    
    // Combine title and URL components with proper weighting (title is more important)
    const title = tab.title || '';
    return `${title} ${title} ${domain} ${path}`; // Duplicate title to give it more weight
  });
}

// Group tabs by course codes first, then use improved clustering for the rest
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

// Improved group name generation with better topic extraction
export function generateGroupNames(groupedTabs: Map<string, chrome.tabs.Tab[]>): Map<string, string> {
  const groupNames = new Map<string, string>();
  
  groupedTabs.forEach((tabs, groupId) => {
    // If the groupId already looks like a course code, keep it
    if (/^[A-Z]+ \d+/.test(groupId)) {
      groupNames.set(groupId, groupId);
      return;
    }
    
    // Extract all text from tab titles and URLs for better context
    const titlesText = tabs.map(tab => tab.title || '').join(' ');
    const urlsText = tabs.map(tab => {
      try {
        const url = new URL(tab.url || '');
        return url.hostname.replace(/^www\./, '') + ' ' + 
               url.pathname.split('/').filter(Boolean).join(' ');
      } catch (e) {
        return '';
      }
    }).join(' ');
    
    const combinedText = `${titlesText} ${urlsText}`;
    
    // Extract words and filter out common words
    const words = extractWords(combinedText);
    
    // Count word frequency
    const wordCounts = new Map<string, number>();
    words.forEach(word => {
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
    });
    
    // Try to identify domain-specific patterns
    let domainName = '';
    let isGithub = false;
    let isYouTube = false;
    let isGoogle = false;
    let isShoppingRelated = false;
    
    // Check if all tabs are from the same domain
    const domains = new Set(tabs.map(tab => {
      try {
        const url = new URL(tab.url || '');
        return url.hostname.replace(/^www\./, '');
      } catch (e) {
        return '';
      }
    }).filter(Boolean));
    
    if (domains.size === 1) {
      domainName = Array.from(domains)[0];
      isGithub = domainName === 'github.com';
      isYouTube = domainName === 'youtube.com' || domainName === 'youtu.be';
      isGoogle = domainName === 'google.com';
    }
    
    // Check for shopping related content
    isShoppingRelated = /amazon|ebay|shop|store|product|buy|price/i.test(combinedText);
    
    // Generate name based on common domain or content type
    let groupName = '';
    
    if (isGithub) {
      groupName = 'GitHub';
      // Try to extract repository name or organization
      const repoNames = tabs.map(tab => {
        const url = tab.url || '';
        const match = url.match(/github\.com\/([^\/]+)(?:\/([^\/]+))?/);
        return match ? (match[2] || match[1]) : '';
      }).filter(Boolean);
      
      if (repoNames.length > 0) {
        const mostCommon = findMostCommonString(repoNames);
        if (mostCommon) {
          groupName = `GitHub: ${mostCommon}`;
        }
      }
    } else if (isYouTube) {
      groupName = 'YouTube';
      // Try to find common words in YouTube titles
      if (words.length > 0) {
        // Get top words specific to these YouTube tabs
        const topWords = [...wordCounts.entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, 2)
          .map(entry => entry[0]);
        
        if (topWords.length > 0) {
          const formatted = topWords.map(w => w.charAt(0).toUpperCase() + w.slice(1));
          groupName = `YouTube: ${formatted.join(' ')}`;
        }
      }
    } else if (isGoogle) {
      groupName = 'Google';
      // Try to identify search patterns
      if (/search|query|q=/i.test(combinedText)) {
        groupName = 'Google Search';
      }
    } else if (isShoppingRelated) {
      groupName = 'Shopping';
      // Try to find product type
      const productWords = [...wordCounts.entries()]
        .filter(([word, _]) => !/amazon|ebay|price|buy|cart|shop/i.test(word))
        .sort((a, b) => b[1] - a[1])
        .slice(0, 1)
        .map(entry => entry[0]);
      
      if (productWords.length > 0) {
        const productType = productWords[0].charAt(0).toUpperCase() + productWords[0].slice(1);
        groupName = `Shopping: ${productType}`;
      }
    } else if (domains.size === 1 && domainName) {
      // Use the domain name if all tabs are from the same site
      groupName = domainName.split('.')[0].charAt(0).toUpperCase() + domainName.split('.')[0].slice(1);
    } else {
      // Default: use the most common words
      const sortedWords = [...wordCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(entry => entry[0]);
      
      if (sortedWords.length > 0) {
        // Take top 1-2 words depending on frequency
        const topWords = sortedWords.slice(0, Math.min(2, sortedWords.length));
        const formatted = topWords.map(w => w.charAt(0).toUpperCase() + w.slice(1));
        groupName = formatted.join(' ');
      } else {
        // Fallback
        groupName = `Group ${groupId}`;
      }
    }
    
    groupNames.set(groupId, groupName);
  });
  
  return groupNames;
}

// Helper function to find the most common string in an array
function findMostCommonString(strings: string[]): string | null {
  if (strings.length === 0) return null;
  
  const counts = new Map<string, number>();
  strings.forEach(str => {
    counts.set(str, (counts.get(str) || 0) + 1);
  });
  
  let mostCommon: string | null = null;
  let highestCount = 0;
  
  counts.forEach((count, str) => {
    if (count > highestCount) {
      mostCommon = str;
      highestCount = count;
    }
  });
  
  return mostCommon;
}

// Main function to organize tabs by course codes and improved clustering
export async function organizeTabsByClustering(
  tabs: chrome.tabs.Tab[],
  preferredGroupCount?: number,
  forceExactGroupCount: boolean = false
): Promise<{
  groupedTabs: Map<string, chrome.tabs.Tab[]>,
  groupNames: Map<string, string>
}> {
  console.log(`Starting tab organization with ${tabs.length} tabs. Preferred group count: ${preferredGroupCount}, Force exact: ${forceExactGroupCount}`);
  
  // Filter out "New Tab" pages and empty tabs first
  const filteredTabs = tabs.filter(tab => {
    return tab.title && 
           tab.title !== 'New Tab' && 
           tab.title !== 'new tab' && 
           !tab.url?.startsWith('chrome://newtab') &&
           !tab.url?.startsWith('edge://newtab') &&
           !tab.url?.startsWith('about:blank');
  });
  
  console.log(`Filtered out ${tabs.length - filteredTabs.length} New Tab or empty pages`);
  
  // If we have very few tabs, just put them all in one group
  if (filteredTabs.length <= 1) {
    const groupedTabs = new Map<string, chrome.tabs.Tab[]>();
    groupedTabs.set('Tabs', filteredTabs);
    const groupNames = new Map<string, string>();
    groupNames.set('Tabs', 'Tabs');
    return { groupedTabs, groupNames };
  }
  
  // First, group tabs by course codes
  const { groupedTabs, remainingTabs } = groupTabsByCourseAndClusters(filteredTabs);
  
  // Handle remaining tabs with improved clustering if we have any
  if (remainingTabs.length > 0) {
    // Calculate how many more groups we need for clustering
    const courseCodeGroupCount = groupedTabs.size;
    let remainingGroupsNeeded = preferredGroupCount 
      ? Math.max(1, preferredGroupCount - courseCodeGroupCount) 
      : 0; // 0 means auto-determine
    
    // Prepare texts with improved preprocessing
    const tabTexts = prepareTabTextsForEmbedding(remainingTabs);
    
    // Generate improved embeddings
    const embeddings = generateImprovedEmbeddings(tabTexts);
    
    if (embeddings.length > 0) {
      // Cluster embeddings with our improved method
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
    } else if (remainingTabs.length === 1) {
      // Just one remaining tab, create a misc group
      groupedTabs.set('misc', remainingTabs);
    }
  }
  
  // Generate improved group names
  const groupNames = generateGroupNames(groupedTabs);
  
  console.log(`Created ${groupedTabs.size} groups in total`);
  
  return { groupedTabs, groupNames };
} 