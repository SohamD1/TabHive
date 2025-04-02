const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..');
const distDir = path.join(srcDir, 'dist');

// Create popup.html
const popupHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FlowForge Tab Organizer</title>
  <style>
    html, body {
      margin: 0;
      padding: 0;
      width: 350px;
      height: 380px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      overflow: hidden;
    }
    #root {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script src="popup.js"></script>
</body>
</html>
`;

// Ensure directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Write popup.html
fs.writeFileSync(path.join(distDir, 'popup.html'), popupHtml);
console.log('Generated popup.html');

// Copy manifest.json
const manifestPath = path.join(srcDir, 'src', 'manifest.json');
const manifestDestPath = path.join(distDir, 'manifest.json');
fs.copyFileSync(manifestPath, manifestDestPath);
console.log('Copied manifest.json');

// Move background.js to root of dist if it exists in src folder
const backgroundSrcPath = path.join(distDir, 'src', 'background.js');
const backgroundDestPath = path.join(distDir, 'background.js');
if (fs.existsSync(backgroundSrcPath)) {
  fs.copyFileSync(backgroundSrcPath, backgroundDestPath);
  console.log('Moved background.js to root of dist');
}

// Move content.js to root of dist if it exists in src folder
const contentSrcPath = path.join(distDir, 'src', 'content.js');
const contentDestPath = path.join(distDir, 'content.js');
if (fs.existsSync(contentSrcPath)) {
  fs.copyFileSync(contentSrcPath, contentDestPath);
  console.log('Moved content.js to root of dist');
}

// Create assets directory
const assetsDir = path.join(distDir, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Copy icon.png at different sizes
const iconSizes = [16, 48, 128];
for (const size of iconSizes) {
  const iconPath = path.join(srcDir, 'assets', `icon-${size}.png`);
  const iconDestPath = path.join(assetsDir, `icon-${size}.png`);
  
  // Use a default icon if the specific size doesn't exist
  const defaultIconPath = path.join(srcDir, 'assets', 'icon.png');
  
  if (fs.existsSync(iconPath)) {
    fs.copyFileSync(iconPath, iconDestPath);
  } else if (fs.existsSync(defaultIconPath)) {
    fs.copyFileSync(defaultIconPath, iconDestPath);
  }
}
console.log('Copied icon files');

console.log('Build completed successfully!'); 