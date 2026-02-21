# 実装計画

1. **設定ストレージの更新 (`src/utils/storage.ts`)**
   - `UserSettings` インターフェイスに `maxItemsPerPage: boolean` プロパティを追加。
   - `defaultSettings` に `maxItemsPerPage: true` を設定して、デフォルトで有効になるようにする。

2. **設定UIの更新 (`src/options/App.tsx`)**
   - オプション画面の「General」セクションに `<ToggleSwitch>` コンポーネントを用い、「Max Items Per Page」の設定切り替えUIを追加する。
   - ラベルは "Max Items Per Page" とし、説明文には "Always show 500 items on Artist and Label pages" を設定する。

3. **機能モジュールの作成 (`src/content/max-items.ts`)**
   - 現在のURLを取得し、パスが `/artist/` または `/label/` で始まるか判定する処理を実装。
   - 該当し、かつURLパラメータの `limit` が `500` ではない場合、`limit=500` を付与して `window.location.replace` によりURLを再読込する関数を作成する。

4. **コンテントスクリプトへの組み込み (`src/content/index.ts`)**
   - アプリケーション初期ロード時に、ストレージから取得した設定値の `maxItemsPerPage` が真であれば、作成したリダイレクト処理の関数を実行するように変更する。
