// Simple content script for TabHive
// This script runs on each page to provide communication between
// the browser tabs and the extension

console.log('TabHive content script loaded');

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getPageMetadata') {
    // Collect basic page metadata
    const metadata = {
      title: document.title,
      url: window.location.href,
      domain: window.location.hostname,
      headings: Array.from(document.querySelectorAll('h1, h2'))
        .slice(0, 5)
        .map(h => h.textContent?.trim())
        .filter(Boolean)
    };
    
    sendResponse({ success: true, metadata });
  }
  
  // Keep the message channel open for async responses
  return true;
});

// This file deliberately kept simple to avoid performance impact 