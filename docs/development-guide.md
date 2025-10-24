# 開発ガイド

このドキュメントでは、プロジェクトの開発環境セットアップから、実装の詳細、デプロイまでを説明します。

---

## 目次

1. [環境セットアップ](#環境セットアップ)
2. [開発サーバーの起動](#開発サーバーの起動)
3. [コンポーネント開発](#コンポーネント開発)
4. [AR機能の実装](#ar機能の実装)
5. [スタイリング](#スタイリング)
6. [テスト](#テスト)
7. [ビルドとデプロイ](#ビルドとデプロイ)
8. [トラブルシューティング](#トラブルシューティング)

---

## 環境セットアップ

### 1. 必要なソフトウェア

- **Node.js**: v18.x 以上
- **npm**: v9.x 以上
- **Git**: バージョン管理用

### 2. プロジェクトのクローン

```bash
git clone https://github.com/koma-ry1117/remote-visual-guidance.git
cd remote-visual-guidance
```

### 3. 依存関係のインストール

```bash
npm install
```

### 4. 環境変数の設定（必要な場合）

`.env.local`ファイルを作成:

```bash
# 例: 外部APIを使用する場合
NEXT_PUBLIC_API_URL=https://api.example.com
```

---

## 開発サーバーの起動

### 1. 開発モードで起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開く

### 2. HTTPS環境で起動（カメラアクセステスト用）

HTTPSが必要な場合は、以下の方法で自己証明書を使用:

```bash
# mkcertのインストール（初回のみ）
brew install mkcert  # macOS
# または
choco install mkcert  # Windows

# 証明書作成
mkcert -install
mkcert localhost

# package.jsonに追加
"dev:https": "next dev --experimental-https"

# HTTPS起動
npm run dev:https
```

---

## コンポーネント開発

### 1. 新しいコンポーネントの作成

`components/`ディレクトリに新規ファイル作成:

```tsx
// components/NewComponent.tsx
"use client";

interface NewComponentProps {
  // Props定義
  title: string;
}

export default function NewComponent({ title }: NewComponentProps) {
  return (
    <div className="p-4">
      <h2>{title}</h2>
    </div>
  );
}
```

### 2. コンポーネントのインポート

```tsx
// app/page.tsx
import NewComponent from "@/components/NewComponent";

export default function Page() {
  return <NewComponent title="Hello" />;
}
```

### 3. コンポーネント設計のベストプラクティス

#### 単一責任の原則
- 1つのコンポーネントは1つの役割
- 複雑な場合は小さなコンポーネントに分割

#### Props型定義
```tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}
```

#### デフォルト値の設定
```tsx
export default function Button({
  label,
  onClick,
  variant = "primary",
  disabled = false,
}: ButtonProps) {
  // ...
}
```

---

## AR機能の実装

### 1. ARSceneコンポーネントの構造

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

export default function ARScene() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // スクリプト動的ロード
    const loadScripts = async () => {
      // A-Frameロード
      const aframeScript = document.createElement("script");
      aframeScript.src = "https://cdn.jsdelivr.net/.../aframe.min.js";
      document.head.appendChild(aframeScript);
      await new Promise((resolve) => (aframeScript.onload = resolve));

      // AR.jsロード
      const arScript = document.createElement("script");
      arScript.src = "https://cdn.jsdelivr.net/.../aframe-ar.js";
      document.head.appendChild(arScript);
      await new Promise((resolve) => (arScript.onload = resolve));

      setIsLoaded(true);
    };

    loadScripts();
  }, []);

  return isLoaded ? (
    <a-scene embedded arjs>
      {/* ARコンテンツ */}
    </a-scene>
  ) : (
    <div>Loading...</div>
  );
}
```

### 2. カスタムマーカーの追加

#### ステップ1: マーカー画像の準備
- 高コントラストの画像（推奨: 512x512px）
- 黒い枠で囲まれた内部デザイン

#### ステップ2: マーカーパターンファイル生成
1. [AR.js Marker Training](https://ar-js-org.github.io/AR.js/three.js/examples/marker-training/examples/generator.html)にアクセス
2. 画像をアップロード
3. `.patt`ファイルをダウンロード

#### ステップ3: プロジェクトに配置
```bash
public/markers/custom-marker.patt
```

#### ステップ4: ARSceneで使用
```tsx
<a-marker type="pattern" url="/markers/custom-marker.patt">
  <a-box position="0 0.5 0" material="color: red;"></a-box>
</a-marker>
```

### 3. 3Dモデルの追加

#### GLTFモデルの使用
```tsx
<a-marker preset="hiro">
  <a-entity
    gltf-model="/models/my-model.glb"
    scale="0.5 0.5 0.5"
    position="0 0 0"
  ></a-entity>
</a-marker>
```

### 4. インタラクション追加

#### クリックイベント
```tsx
<a-box
  position="0 0.5 0"
  material="color: red;"
  event-set__enter="_event: mouseenter; material.color: yellow"
  event-set__leave="_event: mouseleave; material.color: red"
></a-box>
```

---

## スタイリング

### 1. Tailwind CSSの使用

#### ユーティリティクラス
```tsx
<div className="p-4 bg-blue-500 text-white rounded-lg shadow-md">
  コンテンツ
</div>
```

#### レスポンシブデザイン
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* ... */}
</div>
```

#### カスタムクラスの追加
```css
/* app/globals.css */
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700;
  }
}
```

### 2. ダークモード対応

```tsx
<div className="bg-white dark:bg-gray-800 text-black dark:text-white">
  コンテンツ
</div>
```

---

## テスト

### 1. 単体テスト（将来的に追加予定）

```bash
# Jestのインストール
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# テスト実行
npm test
```

### 2. E2Eテスト（将来的に追加予定）

```bash
# Playwrightのインストール
npm install --save-dev @playwright/test

# テスト実行
npm run test:e2e
```

### 3. AR機能の手動テスト

#### テストチェックリスト
- [ ] カメラアクセス許可が正しく動作
- [ ] HIROマーカーが認識される
- [ ] 3Dオブジェクトが正しく表示される
- [ ] 色変更が即座に反映される
- [ ] オブジェクト切り替えが正常に動作
- [ ] UIコントロールの表示/非表示が機能
- [ ] 照明条件を変えてテスト
- [ ] マーカーとの距離を変えてテスト

---

## ビルドとデプロイ

### 1. プロダクションビルド

```bash
npm run build
```

ビルドの成功確認:
```bash
npm start
```

### 2. Vercelへのデプロイ

#### 方法1: Vercel CLIを使用

```bash
# Vercel CLIのインストール
npm install -g vercel

# デプロイ
vercel
```

#### 方法2: GitHubと連携

1. GitHubリポジトリにプッシュ
2. [Vercel](https://vercel.com)でプロジェクトをインポート
3. 自動デプロイ設定

### 3. その他のホスティング

#### Netlify
```bash
# netlify.tomlを作成
[build]
  command = "npm run build"
  publish = ".next"
```

#### 静的エクスポート（制限あり）
```bash
# next.config.jsに追加
output: 'export'

# ビルド
npm run build
```

**注意**: ARコンポーネントは動的機能を使用するため、静的エクスポートは非推奨

---

## トラブルシューティング

### 1. カメラが起動しない

**原因と解決策:**

| 原因 | 解決策 |
|-----|-------|
| HTTP環境 | HTTPSまたは`localhost`を使用 |
| ブラウザ許可なし | ブラウザのカメラ許可を確認 |
| 他のアプリが使用中 | カメラを使用している他のアプリを閉じる |
| iOSのSafari | `navigator.mediaDevices`のポリフィル追加 |

### 2. マーカーが認識されない

**チェックポイント:**
- [ ] 照明は適切か（明るすぎ/暗すぎNG）
- [ ] マーカーの印刷品質は良好か
- [ ] カメラとマーカーの距離（20-50cm推奨）
- [ ] マーカーが平面に配置されているか
- [ ] マーカーが画面に完全に映っているか

### 3. ビルドエラー

#### TypeScriptエラー
```bash
# 型チェックをスキップ（一時的）
npm run build -- --no-type-check
```

#### 依存関係エラー
```bash
# node_modules削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

### 4. パフォーマンス問題

**最適化策:**
- A-Frame の`stats`コンポーネントでFPS確認
- オブジェクトのポリゴン数を削減
- テクスチャサイズを最適化
- `debugUIEnabled: false`で不要なUIを無効化

### 5. A-Frameの警告

```
WARNING: Multiple instances of Three.js detected
```

**解決策:**
```bash
# package.jsonで単一バージョンに固定
npm dedupe
```

---

## 開発のヒント

### 1. Hot Reloadの制限

A-Frame/AR.jsはブラウザのリロードが必要な場合があります:
- マーカー設定変更
- A-Frameコンポーネント登録

### 2. デバッグ方法

#### A-Frameインスペクター
```tsx
<a-scene inspector="url: https://cdn.jsdelivr.net/gh/aframevr/aframe-inspector@master/dist/aframe-inspector.min.js">
```

ブラウザで `Ctrl + Alt + I` でインスペクター起動

#### AR.jsデバッグUI
```tsx
<a-scene arjs="debugUIEnabled: true;">
```

### 3. VSCode拡張機能推奨

- **ESLint**: コード品質チェック
- **Prettier**: コードフォーマット
- **Tailwind CSS IntelliSense**: Tailwindクラス補完
- **Error Lens**: エラー表示強化

---

## コミット規約

### コミットメッセージフォーマット

```
<type>: <subject>

<body>
```

**Type:**
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント
- `style`: スタイル変更
- `refactor`: リファクタリング
- `test`: テスト追加
- `chore`: その他

**例:**
```
feat: Add custom marker support

- Added marker pattern loader
- Updated ARScene component
- Added documentation
```

---

## さらなる学習リソース

### 公式チュートリアル
- [Next.js Learn](https://nextjs.org/learn)
- [A-Frame School](https://aframe.io/aframe-school/)
- [AR.js Documentation](https://ar-js-org.github.io/AR.js-Docs/)

### コミュニティ
- [A-Frame Discord](https://discord.gg/Btmw4W)
- [AR.js GitHub Discussions](https://github.com/AR-js-org/AR.js/discussions)

### 参考プロジェクト
- [AR.js Examples](https://ar-js-org.github.io/AR.js/aframe/examples/)
- [A-Frame Examples](https://aframe.io/examples/)
