# Demand Index 修正ウォークスルー (v0.1.3)

## ユーザーリクエスト
ユーザーから以下の問題が報告されました:
1. 日本語インターフェースを使用している場合にDiscogsでDemand Indexが表示されない
2. `npm run build` でのビルドエラー
3. 表示位置が画面左下になる問題
4. 設定でOFFにしても表示され続ける問題

## 分析

### 1. ビルドエラー
- `watchSettings` がテスト内でインポートされていましたが使用されていませんでした
- `vite` の型定義が設定と競合していました

### 2. Demand Index の問題
- 元の実装では英語のキーワード "Have:" と "Want:" のみを検索していました
- 日本語版Discogsでは "持っている" (Have) と "欲しい" (Want) が使用されています
- 要素検索ロジックを更新し、これらのローカライズされた文字列をサポートする必要がありました

### 3. 表示位置の問題
- ページ全体を検索していたため、ヘッダーやフッターの「Have」「Want」を誤検出していました
- 統計セクション（`#release-stats` または `section` 要素）に検索範囲を限定する必要がありました

### 4. 設定トグルの問題
- 設定変更を監視していましたが、`demandIndex` の変更に対応していませんでした
- OFFにした時に既存の要素を削除する処理が必要でした

## 変更内容

### 1. ビルド修正
- `src/utils/storage.test.ts` で未使用の `watchSettings` インポートを削除しました
- `vite.config.ts` を更新し、`vitest/config` から `defineConfig` を使用するようにして型互換性を向上させました

### 2. ローカライズ対応
- `src/content/demand-index/index.ts` を更新:
    - `isHave` 関数を変更し、`Have:`, `持っている` をチェックするようにしました
    - `isWant` 関数を変更し、`Want:`, `欲しい` をチェックするようにしました
- `src/content/demand-index/index.test.ts` を更新:
    - 日本語Discogsレイアウトをシミュレートする新しいテストケースを追加しました

### 3. 表示位置の修正
- 統計セクションの検出ロジックを改善:
    - `#release-stats` や `section` 要素を優先的に検索
    - セクションが見つからない場合はドキュメント全体にフォールバック
- 要素検出ロジックの改善:
    - 葉要素（`li`, `span`, `a`, `td`, `th`）を優先的に検索
    - コンテナ要素（`ul`, `ol`）を誤って検出しないように除外

### 4. 設定トグルの修正
- `removeDemandIndex` 関数を追加して、全てのDemand Index要素を削除
- `src/content/index.ts` で `demandIndex` 設定の変更を監視
- OFFにしたら `removeDemandIndex()` を実行して既存の表示を削除

## 検証
- **ビルド**: `npm run build` が成功することを確認しました
- **テスト**: `npm test src/content/demand-index/index.test.ts` で全4テストケース（Legacy, Modern, Live, Japanese）がパスすることを確認しました
- **動作確認**: 
    - ✅ 英語版Discogsで正常に動作
    - ✅ 日本語版Discogsで正常に動作
    - ✅ 統計セクション内の正しい位置に表示
    - ✅ 設定のON/OFFで即座に表示/非表示が切り替わる

## 次のステップ
- ドキュメントの更新完了
- v0.1.3 としてリリース準備完了
