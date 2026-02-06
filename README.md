# Discogs Enhancer (TypeScript Re-implementation)

A Chrome Extension for Discogs.com, re-implemented in TypeScript with modern tooling.
Original idea by [salcido/discogs-enhancer](https://github.com/salcido/discogs-enhancer).

## Features
- **Dark Mode**: A sleek dark theme for Discogs.
- **Demand Index**: Displays the Want/Have ratio on Release pages to gauge item popularity.
- **Apple Music Toggle**: Option to hide Apple Music players/widgets.
- **Marketplace Enhancements**: Foundations for inventory filtering and highlighting.

## Tech Stack
- **Framework**: React 18
- **Language**: TypeScript
- **Bundler**: Vite
- **Extension Tooling**: CRXJS (Manifest V3)

## Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start development server (HMR):
   ```bash
   npm run dev
   ```
3. Load extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` directory

## Build
To create a production build:
```bash
npm run build
```
