# FlowForge - Chrome Extension for Unified Academic/Developer Productivity

FlowForge is a Chrome extension that automatically organizes fragmented workflows (code, research, deadlines) into context-aware workspaces. It helps students and developers save time by managing related tabs, detecting deadlines, and providing easy access to grouped resources.

## Features

- **Auto-Groups Resources by Project**
  - Detects open tabs related to your active task using URLs and content analysis
  - One-click workspace restore: Reopen all tabs for a project

- **Deadline Detection**
  - Parses web content for due dates and deadlines using regex
  - Organizes deadline information by project

- **Project Organization**
  - Tag-based organization system
  - Search and filter workspaces

## Development

This project is built with:
- TypeScript
- React
- Plasmo Extension Framework
- Chakra UI
- Zustand for state management

### Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

### Building for Production

```bash
# Create production build
pnpm build

# Package the extension
pnpm package
```

## Project Structure

```
flowforge/
├── src/
│   ├── components/       # UI components
│   ├── hooks/            # Custom React hooks
│   ├── store/            # State management
│   ├── utils/            # Utility functions
│   ├── background.ts     # Background script
│   └── content.ts        # Content scripts
├── assets/               # Static assets
├── popup.tsx             # Extension popup
└── README.md             # You are here
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
