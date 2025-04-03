# TabHive Website

This is the marketing website for the TabHive browser extension, featuring a modern black and yellow design.

## Features

- Floating navigation bar
- Call to action section
- Introduction with key features
- Demo section with instructional steps
- Download section with buttons for different browsers

## Development Setup

1. Make sure you have Node.js installed on your system
2. Navigate to the Website directory
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm start
   ```
5. Open your browser and visit: http://localhost:3000

## Building for Production

To create an optimized production build:

```
npm run build
```

The build output will be in the `temp/build` directory, ready for deployment.

## Project Structure

- `/src` - Contains all React components and code
  - `/components` - Individual UI components
    - `Navbar.tsx` - Floating navigation bar
    - `CallToAction.tsx` - Main hero section
    - `Introduction.tsx` - Features description
    - `Demo.tsx` - Demo visualization
    - `Download.tsx` - Download buttons
  - `App.tsx` - Main application component
  - `index.tsx` - Entry point
- `/public` - Static assets including logo image

## Technologies Used

- React
- TypeScript
- Styled Components
