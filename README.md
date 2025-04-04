# TabHive - Intelligent Tab Organizer

<img src="https://github.com/user-attachments/assets/ac3aabad-cd95-4715-8633-59be77b27e28" width="300"/>



TabHive is a powerful browser extension that helps you organize tabs by clustering similar content together, making your browsing experience more productive and less cluttered.

## Features

- **Smart Clustering**: Automatically groups similar tabs based on content
- **Course Code Detection**: Recognizes academic course codes like "MATH 118" and groups related tabs
- **Advanced Algorithm**: Uses sophisticated text analysis to understand tab content
- **Privacy Focused**: All processing happens locally in your browser
- **Time Saving**: Reduces time spent searching through tabs, increasing productivity
- **User Friendly**: Simple interface that makes organizing tabs effortless with one click

## Project Structure

This repository contains two main components:

1. **Browser Extension** (`/tabhive`): The core extension that runs in Chrome and other Chromium-based browsers
2. **Marketing Website** (`/website`): The promotional website for the extension

### Browser Extension

The extension uses a clustering algorithm to analyze tab content and group similar tabs together. It's built with TypeScript and uses modern browser APIs.

Key technical features:
- Content-based clustering using K-means algorithm
- Course code detection with regular expressions
- Chrome Tab Groups API integration
- No external API dependencies - all processing is local

### Marketing Website

The website showcases the extension's features and provides download links. It's built with React, TypeScript, and Styled Components.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn package manager
- Chrome browser (for testing the extension)

### Development Setup

1. Clone this repository:
```
git clone https://github.com/your-username/tabhive.git
cd tabhive
```

2. Install dependencies for both projects:
```
# For the extension
cd tabhive
npm install

# For the website
cd ../website
npm install
```

3. Build the extension:
```
cd tabhive
npm run build:complete
```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in the top right)
   - Click "Load unpacked" and select the `tabhive/dist` directory

5. Run the website locally:
```
cd website
npm start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
