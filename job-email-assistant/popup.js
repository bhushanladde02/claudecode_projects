// popup.js - Separate JavaScript file for the extension popup

// Email templates
const templates = {
    general: {
        subject: "Application for {position} Position",
        body: `Dear {greeting},

I am writing to express my strong interest in the {position} position at {company}. As a Senior Software Engineer with 8+ years of experience in architecting enterprise-scale solutions, I am excited about the opportunity to contribute to your team.

In my current role, I have:
• Reduced operational costs by $2M+ annually through process optimization
• Led cross-functional teams delivering multi-million dollar projects
• Architected backend ETL pipelines processing 100M+ daily records
• Built unified data warehouse systems consolidating 12+ data sources

My technical expertise includes:
- Cloud Architecture & AWS Solutions (S3, Lambda, EC2)
- Backend Development (Java/J2EE, Python, Node.js, Spring Boot)
- ETL Pipeline Optimization & Data Engineering
- DevOps & CI/CD Implementation (Docker, Kubernetes, GitLab)
- AI/ML Integration & Automation

{additional_notes}

I have attached my resume for your review and would welcome the opportunity to discuss how my experience aligns with your team's needs. Thank you for your consideration.

Best regards,
Bhushan Ladde
laddebhushan@gmail.com
+1 (916)-477-5226`
    },
    referral: {
        subject: "Referred Application for {position} Position",
        body: `Dear {greeting},

I was referred to this {position} opportunity at {company} and am very excited to apply. As a Senior Software Engineer with extensive experience in cloud architecture and backend development, I believe I would be a strong addition to your team.

Key highlights of my experience:
• 8+ years architecting enterprise-scale solutions
• Delivered $2M+ in annual cost savings through optimization
• Expert in AWS, Java/J2EE, Python, and data engineering
• Proven track record with multi-million dollar project delivery

{additional_notes}

I would appreciate the opportunity to discuss how my background aligns with your needs. My resume is attached for your review.

Thank you for your time and consideration.

Best regards,
Bhushan Ladde
laddebhushan@gmail.com
+1 (916)-477-5226`
    },
    cold_outreach: {
        subject: "Senior Software Engineer - Exploring Opportunities at {company}",
        body: `Dear {greeting},

I hope this message finds you well. I am reaching out to express my interest in potential opportunities within {company}'s engineering team.

As a Senior Software Engineer with 8+ years of experience, I have successfully:
• Architected systems processing 100M+ daily records
• Reduced operational costs by $2M+ through strategic optimization
• Led teams delivering complex enterprise solutions
• Built scalable cloud-native applications on AWS

I am particularly drawn to {company} because of {additional_notes}

I would love to connect and learn more about current or upcoming opportunities that might align with my background. Would you be available for a brief conversation?

Thank you for your time.

Best regards,
Bhushan Ladde
laddebhushan@gmail.com
+1 (916)-477-5226`
    },
    follow_up: {
        subject: "Following up on {position} Application",
        body: `Dear {greeting},

I hope you're doing well. I wanted to follow up on my application for the {position} position at {company} that I submitted recently.

I remain very interested in this opportunity and believe my experience in enterprise software development and cloud architecture would be valuable to your team. 

{additional_notes}

I would be happy to provide any additional information you might need or answer any questions about my background.

Thank you for your time and consideration.

Best regards,
Bhushan Ladde
laddebhushan@gmail.com
+1 (916)-477-5226`
    }
};

// DOM elements - will be initialized when DOM loads
let companyNameInput, positionTitleInput, hiringManagerInput, templateSelect, additionalNotesInput, emailPreview, statusDiv;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    companyNameInput = document.getElementById('companyName');
    positionTitleInput = document.getElementById('positionTitle');
    hiringManagerInput = document.getElementById('hiringManager');
    templateSelect = document.getElementById('templateSelect');
    additionalNotesInput = document.getElementById('additionalNotes');
    emailPreview = document.getElementById('emailPreview');
    statusDiv = document.getElementById('status');

    // Add event listeners
    document.getElementById('generateEmail').addEventListener('click', generateEmail);
    document.getElementById('insertEmail').addEventListener('click', insertEmail);

    // Load saved data
    loadSavedData();

    // Save data on input change
    [companyNameInput, positionTitleInput, hiringManagerInput].forEach(input => {
        input.addEventListener('change', function() {
            chrome.storage.local.set({
                [input.id]: input.value
            });
        });
    });
});

// Generate email function
function generateEmail() {
    const company = companyNameInput.value || '[Company Name]';
    const position = positionTitleInput.value || '[Position Title]';
    const manager = hiringManagerInput.value || 'Hiring Manager';
    const template = templateSelect.value;
    const notes = additionalNotesInput.value;

    const greeting = manager === 'Hiring Manager' ? 'Hiring Manager' : manager;
    
    let emailBody = templates[template].body;
    let subject = templates[template].subject;

    // Replace placeholders
    subject = subject.replace('{position}', position);
    emailBody = emailBody.replace(/{company}/g, company);
    emailBody = emailBody.replace(/{position}/g, position);
    emailBody = emailBody.replace(/{greeting}/g, greeting);
    emailBody = emailBody.replace(/{additional_notes}/g, notes || '');

    // Store generated email
    chrome.storage.local.set({
        generatedSubject: subject,
        generatedBody: emailBody
    });

    emailPreview.value = `Subject: ${subject}\n\n${emailBody}`;
    
    showStatus('Email generated successfully!', 'success');
}

// Insert into Gmail function
function insertEmail() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0].url.includes('mail.google.com')) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'insertEmail'
            }, function(response) {
                if (chrome.runtime.lastError) {
                    showStatus('Please refresh Gmail and try again!', 'error');
                } else {
                    showStatus('Attempting to insert email into Gmail...', 'success');
                }
            });
        } else {
            showStatus('Please navigate to Gmail first!', 'error');
        }
    });
}

// Show status message
function showStatus(message, type) {
    statusDiv.innerHTML = `<div class="status ${type}">${message}</div>`;
    setTimeout(() => {
        statusDiv.innerHTML = '';
    }, 3000);
}

// Load saved data
function loadSavedData() {
    chrome.storage.local.get(['companyName', 'positionTitle', 'hiringManager'], function(result) {
        if (result.companyName) companyNameInput.value = result.companyName;
        if (result.positionTitle) positionTitleInput.value = result.positionTitle;
        if (result.hiringManager) hiringManagerInput.value = result.hiringManager;
    });
}