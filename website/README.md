# TabHive Website

This is the official website for the TabHive browser extension, a tool that helps users organize their browser tabs using intelligent clustering and course code detection.

## Features

- Modern, responsive design
- Built with React, TypeScript, and Styled Components
- Animations with Framer Motion
- Optimized for performance and SEO

## Getting Started

### Prerequisites

- Node.js (v14 or later recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
```
git clone https://github.com/your-username/tabhive-website.git
cd tabhive-website
```

2. Install dependencies:
```
npm install
# or if you're using yarn
yarn install
```

3. Start the development server:
```
npm start
# or
yarn start
```

This will start the development server at `http://localhost:3000`.

## Project Structure

```
website/
├── public/             # Static files
│   ├── index.html      # HTML template
│   ├── favicon.ico     # Favicon
│   └── manifest.json   # Web app manifest
├── src/                # Source files
│   ├── components/     # React components
│   │   ├── Header.tsx  # Site header
│   │   ├── Hero.tsx    # Hero section
│   │   └── ...         # Other components
│   ├── App.tsx         # Main App component
│   ├── index.tsx       # Entry point
│   └── theme.ts        # Theme configuration
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── README.md           # This file
```

## Building for Production

To build the project for production, run:

```
npm run build
# or
yarn build
```

This will create a `build` directory with optimized files ready for deployment.

## Deployment

The website can be deployed to various hosting platforms such as:

- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 