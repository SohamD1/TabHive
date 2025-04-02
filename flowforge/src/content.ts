import type { PlasmoContentScript } from "plasmo"

export const config: PlasmoContentScript = {
  matches: ["<all_urls>"],
  all_frames: true
}

// Regular expressions for detecting project or deadline-related content
const PROJECT_REGEX = /project|assignment|homework|task/i
const DEADLINE_REGEX = /due|deadline|submit by|due date|due on/i
const DATE_REGEX = /(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})|(\w+)\s+(\d{1,2})(st|nd|rd|th)?,\s+(\d{4})/i

export interface PageMetadata {
  title: string
  description: string
  url: string
  keywords: string[]
  isProjectRelated: boolean
  detectedKeywords: string[]
}

// Function to extract page metadata
export const extractPageMetadata = (): PageMetadata => {
  const titleElement = document.querySelector('title')
  const metaDescription = document.querySelector('meta[name="description"]')
  const metaKeywords = document.querySelector('meta[name="keywords"]')
  const ogTitle = document.querySelector('meta[property="og:title"]')
  const ogDescription = document.querySelector('meta[property="og:description"]')
  
  // Get the best possible title
  let title = ''
  if (titleElement && titleElement.textContent) {
    title = titleElement.textContent
  } else if (ogTitle && ogTitle.getAttribute('content')) {
    title = ogTitle.getAttribute('content') || ''
  } else {
    title = document.title
  }
  
  // Get the best possible description
  let description = ''
  if (metaDescription && metaDescription.getAttribute('content')) {
    description = metaDescription.getAttribute('content') || ''
  } else if (ogDescription && ogDescription.getAttribute('content')) {
    description = ogDescription.getAttribute('content') || ''
  } else {
    // Try to get first paragraph or meaningful text
    const paragraphs = document.querySelectorAll('p')
    for (let i = 0; i < paragraphs.length; i++) {
      const text = paragraphs[i].textContent?.trim() || ''
      if (text.length > 50) {
        description = text.substring(0, 200)
        break
      }
    }
  }
  
  // Extract keywords
  let keywords: string[] = []
  if (metaKeywords && metaKeywords.getAttribute('content')) {
    keywords = (metaKeywords.getAttribute('content') || '')
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0)
  }
  
  // Add keywords based on content analysis
  const textKeywords = extractKeywords(document.body.textContent || '')
  const allKeywords = [...new Set([...keywords, ...textKeywords])]
  
  // Check if this is project related
  const isProjectRelated = detectProjectPage()
  
  return {
    title,
    description,
    url: window.location.href,
    keywords: allKeywords,
    isProjectRelated,
    detectedKeywords: textKeywords
  }
}

// Function to extract keywords that might indicate the project type
const extractKeywords = (content: string): string[] => {
  const keywords: string[] = []
  
  // Common programming languages and frameworks
  const techKeywords = [
    'javascript', 'typescript', 'react', 'angular', 'vue', 'node', 'python',
    'java', 'c#', 'c++', 'ruby', 'php', 'golang', 'rust', 'swift',
    'flutter', 'react native', 'django', 'flask', 'spring', 'express'
  ]
  
  // Look for tech-related keywords
  for (const keyword of techKeywords) {
    if (content.toLowerCase().includes(keyword)) {
      keywords.push(keyword)
    }
  }
  
  return keywords
}

// Function to check if the current page might be a project page
export const detectProjectPage = (): boolean => {
  const url = window.location.href.toLowerCase()
  
  // Check for common repository or project hosting URLs
  if (
    url.includes('github.com') ||
    url.includes('gitlab.com') ||
    url.includes('bitbucket.org') ||
    url.includes('jira.com') ||
    url.includes('trello.com') ||
    url.includes('notion.so') ||
    url.includes('figma.com') ||
    url.includes('codepen.io') ||
    url.includes('replit.com')
  ) {
    return true
  }
  
  // Check page content for project indicators
  const bodyText = document.body.textContent || ''
  const projectKeywords = [
    'repository', 'project', 'pull request', 'issue', 'commit',
    'branch', 'merge', 'readme', 'documentation', 'changelog',
    'backlog', 'sprint', 'task', 'feature', 'bug', 'release'
  ]
  
  for (const keyword of projectKeywords) {
    if (bodyText.toLowerCase().includes(keyword)) {
      return true
    }
  }
  
  return false
}

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPageMetadata') {
    sendResponse(extractPageMetadata())
    return true
  }
  
  if (request.action === 'detectProjectPage') {
    sendResponse({ isProjectPage: detectProjectPage() })
    return true
  }
  
  return false
})

// Send initial metadata when page is loaded
window.addEventListener('load', () => {
  chrome.runtime.sendMessage({
    action: 'pageMetadata',
    data: extractPageMetadata()
  })
})

// Extract essential content from the current page
export function extractEssentialContent(): string {
  // Get main content, excluding headers, footers, sidebars, etc.
  const contentElements = document.querySelectorAll('main, article, .content, .main, #content, #main')
  
  if (contentElements.length > 0) {
    // Use the first content element found
    return contentElements[0].textContent?.trim() || ''
  }
  
  // If no specific content elements found, extract from body excluding common non-content areas
  const body = document.body
  
  // Create a document fragment to work with
  const clone = body.cloneNode(true) as HTMLElement
  
  // Remove common non-content elements
  const removeSelectors = ['header', 'footer', 'nav', 'aside', '.sidebar', '#sidebar', '.ads', '.advertisement', '.menu', '.navigation']
  removeSelectors.forEach(selector => {
    const elements = clone.querySelectorAll(selector)
    elements.forEach(element => element.parentNode?.removeChild(element))
  })
  
  return clone.textContent?.trim() || ''
}

// Extract deadlines or dates from page content
export function extractDeadlines(): string[] {
  const text = document.body.textContent || ''
  const deadlines: string[] = []
  
  // Simple regex patterns for dates
  const datePatterns = [
    /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? \d{4}\b/g, // January 1, 2023
    /\b\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4}\b/g, // 01/01/2023, 01-01-2023, 01.01.2023
    /\b(due|deadline|by|before)(\s+on|\s+by)?\s+\w+,?\s+\w+\s+\d{1,2}(st|nd|rd|th)?(,?\s+\d{4})?\b/gi, // due on Monday, January 1st, 2023
    /\b(due|deadline|by|before)(\s+on|\s+by)?\s+\d{1,2}(st|nd|rd|th)?\s+\w+,?\s+\d{4}\b/gi // due on 1st January, 2023
  ]
  
  datePatterns.forEach(pattern => {
    const matches = text.match(pattern)
    if (matches) {
      deadlines.push(...matches)
    }
  })
  
  return [...new Set(deadlines)] // Remove duplicates
}

// Analyze the current page and extract metadata
const analyzePage = (): PageMetadata => {
  const url = window.location.href;
  const title = document.title;
  
  // Simple keyword extraction from URL and title
  const keywords = [...new Set([
    ...url.split(/[/\-_]/).filter(Boolean),
    ...title.split(/\s+/).filter(Boolean)
  ])].map(k => k.toLowerCase());

  // Basic project detection based on common patterns
  const isProjectRelated = keywords.some(keyword => 
    ['github', 'gitlab', 'bitbucket', 'jira', 'trello', 'project', 'task'].includes(keyword)
  );

  // Extract description from meta tags or first paragraph
  let description = '';
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription && metaDescription.getAttribute('content')) {
    description = metaDescription.getAttribute('content') || '';
  } else {
    // Try to get first paragraph
    const firstParagraph = document.querySelector('p');
    if (firstParagraph) {
      description = firstParagraph.textContent?.trim().substring(0, 200) || '';
    }
  }

  return {
    url,
    title,
    description,
    keywords,
    isProjectRelated,
    detectedKeywords: keywords
  };
};

// Send analysis results to background script
const metadata = analyzePage();
chrome.runtime.sendMessage({
  type: 'PAGE_ANALYZED',
  data: metadata
});

// Run the analysis when the page loads
window.addEventListener('load', () => {
  // Wait for the page to fully render
  setTimeout(analyzePage, 1500)
})

// Listen for DOM changes that might indicate new content loaded
const observer = new MutationObserver(() => {
  // Debounce the analysis to prevent excessive processing
  clearTimeout(analysisDebounceTimer)
  analysisDebounceTimer = setTimeout(analyzePage, 2000)
})

let analysisDebounceTimer: ReturnType<typeof setTimeout>

// Start observing page changes
observer.observe(document.body, {
  childList: true,
  subtree: true
})

// When requested by background script, analyze page content
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getPageContent') {
    const pageContent = extractEssentialContent();
    sendResponse({ content: pageContent });
  }
  return true; // Keep channel open for async response
}); 