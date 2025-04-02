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
  url: string;
  title: string;
  isProjectRelated: boolean;
  detectedKeywords: string[];
}

// Extract essential content from the current page
function extractPageContent(): string {
  // Get the page title
  const title = document.title || '';
  
  // Get meta description if available
  const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
  
  // Get heading content
  const headings = Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.textContent?.trim()).filter(Boolean).join(' ');
  
  // Get main content (prioritize main element or article)
  const mainContent = document.querySelector('main')?.textContent || 
                     document.querySelector('article')?.textContent || 
                     '';
  
  // Limit the length to avoid processing too much text
  const combinedContent = [title, metaDescription, headings, mainContent].join(' ').slice(0, 5000);
  
  return combinedContent;
}

// Function to extract deadlines from text content
const extractDeadlines = (content: string): string[] => {
  const deadlines: string[] = []
  const deadlineMatches = content.match(new RegExp(`.{0,30}${DEADLINE_REGEX.source}.{0,30}`, 'gi'))
  
  if (deadlineMatches) {
    deadlineMatches.forEach((match) => {
      const dateMatch = match.match(DATE_REGEX)
      if (dateMatch) {
        deadlines.push(match.trim())
      }
    })
  }
  
  return deadlines
}

// Function to extract keywords that might indicate the project type
const extractKeywords = (content: string): string[] => {
  const keywords = []
  
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

  return {
    url,
    title,
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
    const pageContent = extractPageContent();
    sendResponse({ content: pageContent });
  }
  return true; // Keep channel open for async response
}); 