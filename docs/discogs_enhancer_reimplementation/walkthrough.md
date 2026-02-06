# Walkthrough: Discogs Enhancer (TypeScript Re-implementation)

## Project Overview
このプロジェクトは、Discogs.com の機能を拡張するブラウザ拡張機能の TypeScript 再実装版です。
Vite, React, CrxJS を採用し、モダンで型安全な開発環境を実現しています。

## Architecture
- **Language**: TypeScript
- **Framework**: React (Popup / Options UI), Vanilla TS (Content Scripts)
- **Build Tool**: Vite + @crxjs/vite-plugin
- **State Management**: `chrome.storage.local` via `src/utils/storage.ts`

## Directory Structure
```
src/
├── background/      # Service Worker (Background script)
├── content/         # Scripts injected into Discogs pages
│   ├── marketplace/ # Marketplace specific features
│   ├── styles/      # CSS files (e.g. Dark Mode)
│   ├── utils/       # DOM utilities
│   └── index.ts     # Content script entry point
├── options/         # Options Page (React)
├── popup/           # Popup UI (React)
├── utils/           # Shared utilities (Storage, etc)
└── manifest.ts      # Manifest V3 configuration
```

## How to Add a New Feature
1. **Define Settings**:
   Add a new field to `UserSettings` interface in `src/utils/storage.ts`.
   ```typescript
   export interface UserSettings {
     // ...
     newFeatureEnabled: boolean;
   }
   ```

2. **Update UI**:
   Add a toggle switch in `src/options/App.tsx` (and `src/popup/App.tsx` if needed).

3. **Implement Logic**:
   - if it's a page modification, create a new module in `src/content/`.
   - Import and initialize it in `src/content/index.ts`.
   - Use `watchSettings` to react to real-time setting changes.

## Feature Implementations
### Demand Index
Calculates and displays the Want/Have ratio on Release pages.
- **Src**: `src/content/demand-index/`
- **Logic**: Parses "Have" and "Want" counts from the stats section, calculates ratio, and injects a new element.
- **Safety**: Injects as a sibling to the stats list to avoid React hydration conflicts.

### Apple Music Toggle
Controls the visibility of Apple Music players/widgets.
- **Src**: `src/content/apple-music/`
- **Logic**: Injects a specific `<style>` tag to hide Apple Music if disabled.

### Dark Mode
Applies a dark theme to the Discogs interface.
- **Src**: `src/content/styles/dark-mode.css`

## Verification
1. Run `npm run build`
2. Load valid `dist/` folder to Chrome Extensions (Developer Mode).
3. Open a Discogs Release page to see Demand Index.
4. Toggle settings in the Extension Popup or Options page.
