// Content script for Gmail integration
console.log('Job Application Email Assistant: Content script loaded');

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'insertEmail') {
        insertEmailIntoGmail(request.subject, request.body);
        sendResponse({success: true});
    }
});

function insertEmailIntoGmail(subject, body) {
    // Get stored email content
    chrome.storage.local.get(['generatedSubject', 'generatedBody'], function(result) {
        const emailSubject = result.generatedSubject;
        const emailBody = result.generatedBody;
        
        // Wait for Gmail to load
        setTimeout(() => {
            try {
                // Find compose button and click it
                const composeButton = document.querySelector('[role="button"][gh="cm"]') || 
                                    document.querySelector('div[role="button"]:has-text("Compose")') ||
                                    document.querySelector('[data-tooltip="Compose"]');
                
                if (composeButton) {
                    composeButton.click();
                    
                    // Wait for compose window to open
                    setTimeout(() => {
                        fillComposeForm(emailSubject, emailBody);
                    }, 1000);
                } else {
                    // Try to find existing compose window
                    fillComposeForm(emailSubject, emailBody);
                }
            } catch (error) {
                console.error('Error inserting email:', error);
                showNotification('Error inserting email. Please try again.', 'error');
            }
        }, 500);
    });
}

function fillComposeForm(subject, body) {
    try {
        // Find subject field
        const subjectField = document.querySelector('input[name="subjectbox"]') ||
                           document.querySelector('[data-tooltip="Subject"]') ||
                           document.querySelector('input[placeholder*="Subject"]');
        
        if (subjectField) {
            subjectField.value = subject;
            subjectField.dispatchEvent(new Event('input', { bubbles: true }));
            subjectField.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // Find body field (Gmail uses contenteditable div)
        const bodyField = document.querySelector('[role="textbox"][aria-label*="Message"]') ||
                         document.querySelector('div[contenteditable="true"][role="textbox"]') ||
                         document.querySelector('[data-tooltip="Message body"]');
        
        if (bodyField) {
            // Clear existing content
            bodyField.innerHTML = '';
            
            // Insert new content with proper formatting
            const formattedBody = body.replace(/\n/g, '<br>');
            bodyField.innerHTML = formattedBody;
            
            // Trigger events to ensure Gmail recognizes the content
            bodyField.dispatchEvent(new Event('input', { bubbles: true }));
            bodyField.dispatchEvent(new Event('focus', { bubbles: true }));
            bodyField.dispatchEvent(new Event('blur', { bubbles: true }));
            
            // Position cursor at the end
            const range = document.createRange();
            const selection = window.getSelection();
            range.selectNodeContents(bodyField);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        }

        showNotification('Email template inserted successfully!', 'success');
        
    } catch (error) {
        console.error('Error filling compose form:', error);
        showNotification('Could not insert email. Please copy from the extension popup.', 'error');
    }
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 4px;
        color: white;
        font-family: Arial, sans-serif;
        font-size: 14px;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        ${type === 'success' ? 'background-color: #4CAF50;' : 'background-color: #f44336;'}
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 4000);
}

// Alternative method for older Gmail interface
function insertEmailAlternative(subject, body) {
    // Try to find compose textarea (older Gmail)
    const textArea = document.querySelector('textarea[name="to"]') ||
                    document.querySelector('textarea[tabindex="1"]');
    
    if (textArea) {
        const composeArea = textArea.closest('form');
        if (composeArea) {
            const subjectInput = composeArea.querySelector('input[name="subject"]');
            const bodyTextarea = composeArea.querySelector('textarea');
            
            if (subjectInput) {
                subjectInput.value = subject;
            }
            
            if (bodyTextarea) {
                bodyTextarea.value = body;
            }
        }
    }
}

// Monitor for compose window changes
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
            // Check if compose window was added
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && node.querySelector && 
                    (node.querySelector('[role="dialog"]') || node.querySelector('.nH'))) {
                    // Gmail compose window might have opened
                    console.log('Gmail compose window detected');
                }
            });
        }
    });
});

// Start observing
observer.observe(document.body, {
    childList: true,
    subtree: true
});