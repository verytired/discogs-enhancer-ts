# Discogs Enhancer (TypeScript) Implementation Plan

## Goal Description
GitHub上の [salcido/discogs-enhancer](https://github.com/salcido/discogs-enhancer) と同等の機能を、TypeScriptを用いて再実装する。
モダンな開発体験と型安全性を確保するため、Vite + React + TypeScript + CRXJS の構成を採用する。
これにより、HMR (Hot Module Replacement) などの恩恵を受けつつ、効率的に拡張機能を開発可能にする。

## User Review Required
> [!NOTE]
> 元の拡張機能は "100% vanilla JS" を謳っているが、本プロジェクトではメンテナンス性と開発効率を重視し、React と TypeScript を採用する。
> UI部分 (Popup, Options) は React で構築し、Discogs ページ内に注入するコンテンツスクリプト部分は軽量さを保つため Vanilla TypeScript または必要に応じて Preact/React を使用する方針とする。

## Proposed Changes

### Project Structure (Root)

#### [NEW] [package.json](file:///Users/yutaka/Workspace/discogs/package.json)
- `vite`, `@crxjs/vite-plugin`, `react`, `typescript` などの依存関係を定義。

#### [NEW] [vite.config.ts](file:///Users/yutaka/Workspace/discogs/vite.config.ts)
- CRXJS プラグインの設定。
- Content Script, Background Script, Popup のビルド設定。

#### [NEW] [manifest.json](file:///Users/yutaka/Workspace/discogs/manifest.json)
- Manifest V3 対応。
- 必要な権限 (permissions) の定義。

### Source Code (`src/`)

#### [NEW] [`src/manifest.ts`](file:///Users/yutaka/Workspace/discogs/src/manifest.ts)
- TypeScript でマニフェストを定義し、ビルド時に生成する構成（CRXJSの推奨パターン）。

#### [NEW] `src/background/`
- Service Worker の実装。

#### [NEW] `src/content/`
- ページに注入されるスクリプト。
- 機能ごとにモジュール分割 (e.g., `marketplace.ts`, `styling.ts`).

#### [NEW] `src/popup/`
- 拡張機能アイコンクリック時のポップアップUI。
- React コンポーネント。

### Documentation
- `docs/discogs_enhancer_reimplementation/` にドキュメントを配置。

## Verification Plan

### Automated Tests
- `npm test` (Vitest を導入予定) でユーティリティ関数の単体テストを実行。
- `npm run build` でビルドが通ることを確認。

### Manual Verification
- Chrome に `dist` フォルダ (または開発モード) を読み込ませる。
- Discogs の各ページ (Marketplace, Release page) を開き、機能 (まずはログ出力や簡単なDOM操作) が動作することを確認。
- ポップアップが開くことを確認。
