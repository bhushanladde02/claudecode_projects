# Web Page Summarizer Chrome Extension

A Chrome extension that generates concise 10-line abstract summaries of web pages using intelligent text extraction and summarization algorithms.

## Features

- **10-Line Summaries**: Generates exactly 10 key points from any web page
- **Smart Content Extraction**: Identifies and extracts main content while filtering out navigation, ads, and irrelevant elements
- **Modern UI**: Beautiful glassmorphism design with smooth animations
- **Fast Processing**: Client-side processing for instant results
- **Universal Compatibility**: Works on any website

## Installation

1. Download all the extension files to a folder
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select your extension folder
5. The extension icon will appear in your toolbar

## Required Files

Make sure you have these files in your extension folder:

- `manifest.json` - Extension configuration
- `popup.html` - Extension popup interface
- `popup.js` - Main extension logic
- `content.js` - Content script for page interaction
- Icon files (optional but recommended):
  - `icon16.png` (16x16 pixels)
  - `icon48.png` (48x48 pixels)
  - `icon128.png` (128x128 pixels)

## Usage

1. Navigate to any web page you want to summarize
2. Click the Web Summarizer extension icon in your toolbar
3. Click "Generate Summary" button
4. View the 10-line summary in the popup

## How It Works

The extension uses a sophisticated extractive summarization algorithm:

1. **Content Extraction**: Identifies main content areas and removes navigation, ads, and irrelevant elements
2. **Text Processing**: Cleans and normalizes the extracted text
3. **Sentence Scoring**: Analyzes sentences based on:
   - Position in the document
   - Length and readability
   - Keyword frequency
   - Semantic importance
4. **Summary Generation**: Selects the top 10 most important sentences
5. **Reordering**: Maintains original sentence order for better flow

## Permissions

The extension requires these permissions:
- `activeTab`: To access content of the currently active tab
- `scripting`: To execute content scripts for text extraction

## Browser Compatibility

- Chrome 88+
- Chromium-based browsers (Edge, Brave, etc.)

## Privacy

- All processing happens locally in your browser
- No data is sent to external servers
- No personal information is collected or stored

## Troubleshooting

**Summary not generating?**
- Ensure the page has substantial text content
- Try refreshing the page and running the extension again
- Check if the website blocks content scripts

**Poor summary quality?**
- The algorithm works best with well-structured articles and blog posts
- Very short pages may not generate meaningful summaries
- Pages with mostly images or videos may not summarize well

## Customization

You can modify the summarization algorithm in `popup.js`:
- Adjust sentence scoring weights
- Change the number of summary lines
- Modify content filtering rules

## Technical Details

- **Manifest Version**: 3
- **Content Security Policy**: Follows Chrome extension best practices
- **Performance**: Lightweight with minimal memory usage
- **Architecture**: Uses content scripts and popup interaction

## Contributing

Feel free to improve the extension by:
- Enhancing the summarization algorithm
- Adding support for different languages
- Improving the UI/UX
- Adding more customization options

## License

Open source - feel free to modify and distribute.

## Version History

- **v1.0**: Initial release with basic summarization functionality