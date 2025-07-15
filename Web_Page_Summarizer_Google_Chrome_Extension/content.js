// Content script for the Web Summarizer extension
// This script runs on every webpage and can interact with the page content

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getPageContent') {
        try {
            const pageData = extractPageContent();
            sendResponse({ success: true, data: pageData });
        } catch (error) {
            sendResponse({ success: false, error: error.message });
        }
    }
});

// Function to extract and clean page content
function extractPageContent() {
    // Create a clone of the document to avoid modifying the original
    const doc = document.cloneNode(true);
    
    // Remove unwanted elements
    const unwantedSelectors = [
        'script', 'style', 'nav', 'footer', 'header', 'aside',
        '.advertisement', '.ad', '.sidebar', '.menu', '.navigation',
        '.social-share', '.comments', '.related-posts', '.popup',
        '[class*="ad"]', '[id*="ad"]', '.cookie-banner', '.newsletter'
    ];
    
    unwantedSelectors.forEach(selector => {
        const elements = doc.querySelectorAll(selector);
        elements.forEach(el => el.remove());
    });
    
    // Try to find the main content area
    const contentSelectors = [
        'main', 'article', '[role="main"]', '.content', '.post', 
        '.entry', '#content', '#main', '.article-body', '.post-content',
        '.entry-content', '.blog-post', '.news-content'
    ];
    
    let mainContent = null;
    for (const selector of contentSelectors) {
        mainContent = doc.querySelector(selector);
        if (mainContent) break;
    }
    
    // If no main content found, use body but filter out navigation elements
    if (!mainContent) {
        mainContent = doc.body;
        // Remove common navigation and sidebar elements
        const navElements = mainContent.querySelectorAll('nav, .nav, .navigation, .menu, .sidebar, .widget');
        navElements.forEach(el => el.remove());
    }
    
    // Extract text content
    let text = mainContent ? (mainContent.innerText || mainContent.textContent || '') : '';
    
    // Clean up the text
    text = text
        .replace(/\s+/g, ' ')  // Replace multiple whitespaces with single space
        .replace(/\n\s*\n/g, '\n')  // Remove extra line breaks
        .trim();
    
    // Get page metadata
    const title = document.title || 'Untitled Page';
    const url = window.location.href;
    const domain = window.location.hostname;
    
    // Get meta description if available
    const metaDescription = document.querySelector('meta[name="description"]');
    const description = metaDescription ? metaDescription.getAttribute('content') : '';
    
    return {
        content: text,
        title: title,
        url: url,
        domain: domain,
        description: description,
        wordCount: text.split(/\s+/).length,
        characterCount: text.length
    };
}

// Add a subtle indicator that the extension is active (optional)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeExtension);
} else {
    initializeExtension();
}

function initializeExtension() {
    // Add a small, non-intrusive indicator that the extension is active
    // This is completely optional and can be removed if not desired
    console.log('🔍 Web Summarizer extension is active on this page');
}

// Helper function to detect if page has substantial content
function hasSubstantialContent() {
    const content = extractPageContent();
    return content.wordCount > 100 && content.characterCount > 500;
}

// Export functions for use by the popup (if needed)
window.webSummarizerExtension = {
    extractPageContent,
    hasSubstantialContent
};