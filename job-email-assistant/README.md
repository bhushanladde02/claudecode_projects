# Job Application Email Assistant

> 🚀 A Chrome extension that helps software engineers write professional job application emails with personalized templates and Gmail integration.

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green?logo=googlechrome)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?logo=javascript)
![Gmail](https://img.shields.io/badge/Gmail-Integration-red?logo=gmail)

## 📋 Overview

The **Job Application Email Assistant** is a Chrome extension designed specifically for software engineers to streamline the job application process. It generates personalized, professional emails using your actual achievements and technical experience, then seamlessly integrates with Gmail for quick sending.

### ✨ Key Features

- **🎯 Personalized Templates** - 4 different email types for various scenarios
- **📧 Gmail Integration** - Direct insertion into Gmail compose window
- **📋 Copy to Clipboard** - Reliable fallback for manual pasting
- **💾 Data Persistence** - Remembers your company and position details
- **🔄 Real-time Preview** - See your email before sending
- **⚡ Quick Generation** - Generate professional emails in seconds

## 🛠️ Installation

### Method 1: Load Unpacked Extension

1. **Download or Clone** this repository
```bash
git clone https://github.com/bhushanladde02/job-email-assistant.git
cd job-email-assistant
```

2. **Open Chrome Extensions**
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)

3. **Load Extension**
   - Click "Load unpacked"
   - Select the `job-email-assistant` folder
   - Extension should appear in your extensions list

4. **Pin Extension**
   - Click the puzzle piece icon in Chrome toolbar
   - Find "Job Application Email Assistant"
   - Click the pin icon to keep it visible

## 📁 Project Structure

```
job-email-assistant/
├── manifest.json          # Extension configuration
├── popup.html             # Main UI interface
├── popup.js              # Extension logic and templates
├── content.js            # Gmail integration script
├── icons/                # Extension icons (optional)
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md             # This file
```

## 🎯 How to Use

### 1. Fill in Job Details
- **Company Name**: Target company (e.g., Google, Microsoft)
- **Position Title**: Exact job title from posting
- **Hiring Manager**: Name if known (optional)
- **Email Template**: Choose from 4 available templates
- **Additional Notes**: Custom details about the role/company

### 2. Generate Email
- Click **"Generate Email"** to create personalized content
- Review the preview before proceeding

### 3. Send Email
**Option A: Automatic Gmail Integration**
- Ensure Gmail is open in another tab
- Click **"Insert into Gmail"**
- Extension opens compose window and fills content

**Option B: Manual Copy-Paste**
- Click **"Copy to Clipboard"**
- Open Gmail manually
- Paste content into compose window

## 📧 Available Email Templates

### 1. **General Application**
Standard application email highlighting your full technical background and achievements.

### 2. **Referral Application**
For when someone referred you to the position - emphasizes the referral connection.

### 3. **Cold Outreach**
For reaching out about potential opportunities when no specific job is posted.

### 4. **Follow-up Email**
For following up on applications you've already submitted.

## 🔧 Customization

### Adding Your Own Templates

Edit the `templates` object in `popup.js`:

```javascript
templates.myCustomTemplate = {
    subject: "Your Custom Subject - {position}",
    body: `Your custom email body with {company} and {position} placeholders...`
};
```

### Updating Personal Information

Modify the contact information and achievements in the email templates to match your current details:

```javascript
// In popup.js, update the template bodies with your information
Best regards,
Your Name
your.email@example.com
+1 (555) 123-4567
```

## ⚙️ Technical Details

### Technologies Used
- **Manifest V3** - Latest Chrome extension standard
- **Vanilla JavaScript** - No external dependencies
- **Chrome Storage API** - For data persistence
- **Chrome Tabs API** - For Gmail integration
- **Content Scripts** - For DOM manipulation in Gmail

### Key Components

#### `manifest.json`
- Extension configuration and permissions
- Content script registration for Gmail
- Action popup configuration

#### `popup.js`
- Email template management
- Form handling and validation
- Chrome storage integration
- Clipboard functionality

#### `content.js`
- Gmail DOM interaction
- Compose window detection and manipulation
- Error handling and notifications

## 🐛 Troubleshooting

### Extension Not Loading
- Ensure all files are in the correct directory structure
- Check Chrome Developer Console for errors
- Verify manifest.json syntax is valid

### Gmail Integration Not Working
- **Check Gmail URL**: Extension only works on `mail.google.com`
- **Refresh Gmail**: Reload the Gmail page after installing extension
- **Try Manual Copy**: Use "Copy to Clipboard" as fallback
- **Check Compose Window**: Ensure Gmail compose is open

### Content Not Inserting
- **Generate First**: Always click "Generate Email" before inserting
- **Check Permissions**: Ensure extension has permission for Gmail
- **Use Fallback**: Copy to clipboard and paste manually

### Common Issues
```
Issue: "Please navigate to Gmail first!"
Solution: Open Gmail in active tab before using extension

Issue: "Please generate an email first!"
Solution: Fill form details and click "Generate Email"

Issue: Content Security Policy errors
Solution: Ensure popup.js is separate from popup.html
```

## 📝 Contributing

### Development Setup

1. **Fork the repository**
2. **Make your changes**
3. **Test thoroughly**:
   - Load extension in Chrome
   - Test all email templates
   - Verify Gmail integration
   - Check error handling

4. **Submit pull request**

### Adding New Features

- New email templates
- Additional integrations (Outlook, etc.)
- Enhanced formatting options
- Company-specific customizations

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Support

If you encounter any issues or have questions:

1. **Check the Troubleshooting section** above
2. **Open an issue** on GitHub with:
   - Chrome version
   - Error messages (if any)
   - Steps to reproduce the problem
3. **Email**: laddebhushan@gmail.com

## 🚀 Future Enhancements

- [ ] Outlook integration
- [ ] LinkedIn messaging support
- [ ] Company research integration
- [ ] Follow-up scheduling
- [ ] Email tracking
- [ ] Template sharing
- [ ] AI-powered customization

## 👨‍💻 Author

**Bhushan Ladde**
- GitHub: [@bhushanladde02](https://github.com/bhushanladde02)
- LinkedIn: [bhushanladde](https://linkedin.com/in/bhushanladde)
- Email: laddebhushan@gmail.com
