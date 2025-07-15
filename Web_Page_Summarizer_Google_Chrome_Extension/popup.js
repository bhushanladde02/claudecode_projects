document.addEventListener('DOMContentLoaded', function() {
    const summarizeBtn = document.getElementById('summarize');
    const content = document.getElementById('content');
    
    summarizeBtn.addEventListener('click', async function() {
        try {
            // Get the active tab
            const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
            
            if (!tab) {
                showError('Unable to access current tab');
                return;
            }
            
            // Show loading state
            showLoading();
            summarizeBtn.disabled = true;
            
            // Execute content script to extract page content
            const results = await chrome.scripting.executeScript({
                target: {tabId: tab.id},
                function: extractPageContent
            });
            
            if (!results || !results[0] || !results[0].result) {
                showError('Unable to extract page content');
                return;
            }
            
            const pageData = results[0].result;
            
            // Generate summary
            const summary = generateSummary(pageData.content);
            
            // Display summary
            showSummary(summary, pageData.title);
            
        } catch (error) {
            console.error('Error:', error);
            showError('Failed to generate summary: ' + error.message);
        } finally {
            summarizeBtn.disabled = false;
        }
    });
    
    function showLoading() {
        content.innerHTML = '<div class="loading">🔄 Analyzing page content...</div>';
    }
    
    function showError(message) {
        content.innerHTML = `<div class="error">❌ ${message}</div>`;
    }
    
    function showSummary(summary, title) {
        const summaryHtml = `
            <div class="page-title">${title}</div>
            <div class="summary">
                <ol>
                    ${summary.map(line => `<li>${line}</li>`).join('')}
                </ol>
            </div>
        `;
        content.innerHTML = summaryHtml;
    }
    
    function generateSummary(text) {
        // Clean and prepare text
        const cleanText = text.replace(/\s+/g, ' ').trim();
        
        if (cleanText.length < 100) {
            return ['Page content is too short to generate a meaningful summary.'];
        }
        
        // Split into sentences
        const sentences = cleanText.match(/[^\.!?]+[\.!?]+/g) || [];
        
        if (sentences.length === 0) {
            return ['Unable to parse page content into sentences.'];
        }
        
        // Clean sentences
        const cleanSentences = sentences
            .map(s => s.trim())
            .filter(s => s.length > 20 && s.length < 200)
            .slice(0, 50); // Limit to first 50 sentences for processing
        
        if (cleanSentences.length === 0) {
            return ['No suitable sentences found for summarization.'];
        }
        
        // Simple extractive summarization
        const summary = extractiveSummarization(cleanSentences, cleanText);
        
        // Ensure we have exactly 10 lines
        while (summary.length < 10 && cleanSentences.length > summary.length) {
            const remaining = cleanSentences.filter(s => !summary.includes(s));
            if (remaining.length === 0) break;
            summary.push(remaining[0]);
        }
        
        return summary.slice(0, 10);
    }
    
    function extractiveSummarization(sentences, fullText) {
        // Score sentences based on various factors
        const sentenceScores = sentences.map(sentence => {
            let score = 0;
            
            // Position scoring (earlier sentences often more important)
            const position = sentences.indexOf(sentence);
            score += Math.max(0, 10 - position) * 0.1;
            
            // Length scoring (prefer moderate length)
            const length = sentence.split(' ').length;
            if (length >= 10 && length <= 25) score += 2;
            else if (length >= 6 && length <= 35) score += 1;
            
            // Keyword frequency
            const words = sentence.toLowerCase().split(/\W+/);
            const commonWords = getTopWords(fullText.toLowerCase(), 20);
            const keywordCount = words.filter(word => 
                commonWords.includes(word) && word.length > 3
            ).length;
            score += keywordCount * 0.5;
            
            // Avoid very short or very long sentences
            if (sentence.length < 30 || sentence.length > 150) score -= 1;
            
            // Prefer sentences with numbers, dates, or specific information
            if (/\d/.test(sentence)) score += 0.5;
            if (/\b(because|therefore|however|moreover|furthermore|additionally)\b/i.test(sentence)) score += 0.3;
            
            return { sentence, score };
        });
        
        // Sort by score and select top sentences
        const topSentences = sentenceScores
            .sort((a, b) => b.score - a.score)
            .slice(0, 10)
            .map(item => item.sentence);
        
        // Reorder by original position to maintain flow
        return topSentences.sort((a, b) => 
            sentences.indexOf(a) - sentences.indexOf(b)
        );
    }
    
    function getTopWords(text, count) {
        const words = text.split(/\W+/).filter(word => 
            word.length > 3 && 
            !['this', 'that', 'with', 'have', 'will', 'from', 'they', 'been', 'said', 'each', 'which', 'their', 'time', 'more', 'very', 'what', 'know', 'just', 'first', 'into', 'over', 'think', 'also', 'your', 'work', 'life', 'only', 'can', 'still', 'should', 'after', 'being', 'now', 'made', 'before', 'here', 'through', 'when', 'where', 'much', 'some', 'these', 'many', 'would', 'there'].includes(word.toLowerCase())
        );
        
        const frequency = {};
        words.forEach(word => {
            frequency[word] = (frequency[word] || 0) + 1;
        });
        
        return Object.keys(frequency)
            .sort((a, b) => frequency[b] - frequency[a])
            .slice(0, count);
    }
});

// Function to be injected into the page
function extractPageContent() {
    // Remove script and style elements
    const scripts = document.querySelectorAll('script, style, nav, footer, header, aside, .advertisement, .ad, .sidebar');
    scripts.forEach(el => el.remove());
    
    // Try to find main content area
    const mainContent = document.querySelector('main, article, .content, .post, .entry, #content, #main') || document.body;
    
    // Extract text content
    let text = mainContent.innerText || mainContent.textContent || '';
    
    // Clean up text
    text = text.replace(/\n\s*\n/g, '\n').trim();
    
    // Get page title
    const title = document.title || 'Untitled Page';
    
    return {
        content: text,
        title: title,
        url: window.location.href
    };
}