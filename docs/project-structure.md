# プロジェクト構成

## ディレクトリ構造

```
remote-visual-guidance/
├── app/                          # Next.js App Router
│   ├── ar/                       # ARアプリケーションページ
│   │   └── page.tsx              # AR表示とUI制御
│   ├── layout.tsx                # ルートレイアウト
│   ├── page.tsx                  # ホームページ
│   └── globals.css               # グローバルCSS (Tailwind含む)
│
├── components/                   # Reactコンポーネント
│   ├── ARScene.tsx               # A-Frame/AR.jsを使用したARシーン
│   ├── ColorPicker.tsx           # 色選択UI
│   └── ObjectSelector.tsx        # 3Dオブジェクト選択UI
│
├── public/                       # 静的ファイル
│   └── markers/                  # ARマーカー画像格納
│
├── docs/                         # ドキュメント
│   ├── project-structure.md      # プロジェクト構成 (このファイル)
│   ├── tech-stack.md             # 技術スタック詳細
│   └── development-guide.md      # 開発ガイド
│
├── node_modules/                 # 依存パッケージ
│
├── .next/                        # Next.jsビルド出力
│
├── package.json                  # プロジェクト設定と依存関係
├── package-lock.json             # 依存関係のロックファイル
├── next.config.js                # Next.js設定
├── tsconfig.json                 # TypeScript設定
├── tailwind.config.ts            # Tailwind CSS設定
├── postcss.config.js             # PostCSS設定
├── .eslintrc.json                # ESLint設定
├── .gitignore                    # Git除外設定
└── README.md                     # プロジェクト説明
```

## ファイル詳細

### ルートレベル

#### `package.json`
プロジェクトのメタデータと依存関係を定義
- **主要な依存関係**:
  - `next@14.2.33` - Next.jsフレームワーク
  - `react@18.3.1` - React本体
  - `three@0.164.0` - 3Dグラフィックスライブラリ
  - `@ar-js-org/ar.js@3.4.6` - AR機能
  - `aframe@1.4.2` - WebVRフレームワーク
  - `tailwindcss@4.x` - UIスタイリング

#### `next.config.js`
Next.jsの設定ファイル
- WebPackカスタマイズ（3Dモデルファイル対応）

#### `tsconfig.json`
TypeScriptコンパイラ設定
- パスエイリアス: `@/*` → ルートディレクトリ
- React JSX対応

#### `tailwind.config.ts`
Tailwind CSSのカスタム設定
- コンテンツパス指定
- カスタムカラー定義

### app/ ディレクトリ

#### `app/layout.tsx`
アプリケーション全体の共通レイアウト
- HTMLドキュメント構造
- メタデータ設定
- グローバルCSS読み込み

#### `app/page.tsx`
ホームページ（ランディングページ）
- プロジェクト概要表示
- 技術スタック説明
- ARアプリへのナビゲーション

#### `app/ar/page.tsx`
ARアプリケーションのメインページ
- ARSceneコンポーネント統合
- ColorPicker / ObjectSelectorの配置
- UIコントロール状態管理

#### `app/globals.css`
グローバルスタイル定義
- Tailwind CSSディレクティブ
- カスタムCSS変数
- ダークモード対応

### components/ ディレクトリ

#### `components/ARScene.tsx`
AR表示の中核コンポーネント
- **機能**:
  - A-Frame/AR.jsの動的ロード
  - HIROマーカー認識
  - 3Dオブジェクトのレンダリング
  - カメラアクセス
- **Props**:
  - `markerColor`: マーカー表示色
  - `objectType`: 表示する3Dオブジェクトタイプ

#### `components/ColorPicker.tsx`
色選択UIコンポーネント
- **機能**:
  - プリセット色選択（6色）
  - カスタムカラーピッカー
  - 選択状態の視覚的フィードバック
- **Props**:
  - `color`: 現在選択されている色
  - `onChange`: 色変更時のコールバック

#### `components/ObjectSelector.tsx`
3Dオブジェクト選択UIコンポーネント
- **機能**:
  - オブジェクトタイプ選択（Box/Sphere/Cylinder）
  - アイコン表示
  - 選択状態の視覚的フィードバック
- **Props**:
  - `objectType`: 現在選択されているオブジェクト
  - `onChange`: オブジェクト変更時のコールバック

### public/ ディレクトリ

#### `public/markers/`
ARマーカー画像の保存場所
- HIROマーカー画像
- カスタムマーカー画像（将来的に追加可能）

### docs/ ディレクトリ

プロジェクトドキュメント一式を格納
- 構成説明
- 開発ガイド
- 技術仕様

## データフロー

```
app/ar/page.tsx (親コンポーネント)
    ├── State管理
    │   ├── markerColor (色状態)
    │   └── objectType (オブジェクト状態)
    │
    ├── ColorPicker
    │   └── onChange → markerColor更新
    │
    ├── ObjectSelector
    │   └── onChange → objectType更新
    │
    └── ARScene
        ├── Props: markerColor, objectType
        └── A-Frame/AR.jsによるレンダリング
```

## コンポーネント間の依存関係

```
app/ar/page.tsx
    ↓ import
    ├── components/ARScene.tsx
    │       ↓ 動的ロード
    │       ├── A-Frame (CDN)
    │       └── AR.js (CDN)
    │
    ├── components/ColorPicker.tsx
    └── components/ObjectSelector.tsx

app/page.tsx
    ↓ import
    └── next/link (ARページへのナビゲーション)
```

## ビルド・実行フロー

### 開発モード
```bash
npm run dev
```
1. Next.js開発サーバー起動 (localhost:3000)
2. ホットリロード有効化
3. TypeScriptトランスパイル
4. Tailwind CSSコンパイル

### プロダクションビルド
```bash
npm run build
npm start
```
1. 最適化されたビルド生成
2. 静的ページ生成（可能な場合）
3. 本番サーバー起動

## 重要なポイント

### 1. Client-Side Rendering
- A-Frame/AR.jsはブラウザAPIに依存
- 全てのARコンポーネントは `"use client"` ディレクティブ使用

### 2. 動的スクリプトロード
- A-Frame/AR.jsはCDN経由で動的にロード
- SSR時のエラー回避のため、`useEffect`内で実行

### 3. HTTPS要件
- カメラアクセスにはHTTPS環境が必要
- 開発時は`localhost`で動作可能

### 4. マーカーベースAR
- HIROマーカーをデフォルト使用
- カスタムマーカー対応可能（要設定）

## 拡張ポイント

### 新しいUIコンポーネントの追加
1. `components/`に新コンポーネント作成
2. `app/ar/page.tsx`でインポート
3. 必要に応じてState追加

### カスタムマーカーの追加
1. マーカー画像を`public/markers/`に配置
2. `ARScene.tsx`の`<a-marker>`タグを編集
3. `type="pattern" url="/markers/custom.patt"`を指定

### 新しい3Dオブジェクトの追加
1. `ObjectSelector.tsx`にオプション追加
2. `ARScene.tsx`の`renderObject()`を拡張

## トラブルシューティング

### カメラが起動しない
- HTTPS環境か確認
- ブラウザのカメラ許可設定を確認
- 他のアプリがカメラを使用していないか確認

### マーカーが認識されない
- 照明条件を確認（明るすぎ/暗すぎNG）
- マーカーの印刷品質を確認
- カメラとマーカーの距離を調整（20-50cm推奨）

### ビルドエラー
- `node_modules`削除後、`npm install`再実行
- Node.jsバージョン確認（18.x以上推奨）
- TypeScriptエラーは`tsconfig.json`を確認
