# WebAR Marker App

AR.js + A-Frame + Next.js で構築された**WebARマーカーアプリケーション**です。マーカーベースのAR体験を、Webブラウザ上で簡単に実現できます。

## 特徴

- 📱 **マーカーベースAR**: HIROマーカーを使用した安定したAR表示
- 🎨 **リアルタイム色変更**: UIから3Dオブジェクトの色を即座に変更
- 🔲 **複数オブジェクト対応**: 立方体、球体、円柱を切り替え可能
- 🚀 **Next.js 14**: App Routerによる最新のアーキテクチャ
- 💅 **Tailwind CSS**: 美しいレスポンシブUI
- 🔒 **型安全**: TypeScriptによる開発

## デモ

| ホーム画面 | AR画面 |
|-----------|--------|
| プロジェクト概要とナビゲーション | カメラでマーカーを認識してAR表示 |

## 技術スタック

| カテゴリ | 技術 | バージョン |
|---------|-----|-----------|
| フレームワーク | Next.js | 14.2.33 |
| UI ライブラリ | React | 18.3.1 |
| AR 基盤 | AR.js | 3.4.6 |
| 3D フレームワーク | A-Frame | 1.4.2 |
| 3D エンジン | Three.js | 0.164.0 |
| CSS フレームワーク | Tailwind CSS | 4.x |
| 言語 | TypeScript | 5.x |

詳細は [docs/tech-stack.md](docs/tech-stack.md) を参照してください。

## クイックスタート

### 前提条件

- Node.js 18.x 以上
- npm 9.x 以上

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/koma-ry1117/remote-visual-guidance.git
cd remote-visual-guidance

# 依存関係をインストール
npm install
```

### 開発サーバー起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

### ARアプリの使い方

1. トップページから「ARアプリを起動」ボタンをクリック
2. カメラへのアクセスを許可
3. **HIROマーカー**をカメラに向ける
   - [HIROマーカーをダウンロード](https://ar-js-org.github.io/AR.js/data/images/hiro.png)
4. マーカー上に3Dオブジェクトが表示されます
5. 画面上部のUIで色やオブジェクトを変更

## プロジェクト構成

```
remote-visual-guidance/
├── app/                    # Next.js App Router
│   ├── ar/                 # ARアプリページ
│   ├── layout.tsx          # ルートレイアウト
│   ├── page.tsx            # ホームページ
│   └── globals.css         # グローバルCSS
├── components/             # Reactコンポーネント
│   ├── ARScene.tsx         # ARシーン
│   ├── ColorPicker.tsx     # 色選択UI
│   └── ObjectSelector.tsx  # オブジェクト選択UI
├── docs/                   # ドキュメント
│   ├── project-structure.md
│   ├── tech-stack.md
│   └── development-guide.md
├── public/                 # 静的ファイル
│   └── markers/            # ARマーカー
├── package.json
├── next.config.js
├── tsconfig.json
└── tailwind.config.ts
```

詳細は [docs/project-structure.md](docs/project-structure.md) を参照してください。

## ドキュメント

- [プロジェクト構成](docs/project-structure.md) - ファイル構造と各コンポーネントの詳細
- [技術スタック](docs/tech-stack.md) - 使用技術の詳細とバージョン情報
- [開発ガイド](docs/development-guide.md) - セットアップから開発、デプロイまでの手順

## 主な機能

### 1. マーカー認識

HIROマーカー（AR.jsの標準マーカー）を自動認識し、3Dオブジェクトを表示します。

### 2. リアルタイムカスタマイズ

- **色選択**: プリセット6色 + カスタムカラーピッカー
- **オブジェクト選択**: 立方体、球体、円柱

### 3. レスポンシブUI

スマートフォン、タブレット、デスクトップに対応したレスポンシブデザイン。

## 開発

### ビルド

```bash
npm run build
```

### プロダクション起動

```bash
npm start
```

### Lint

```bash
npm run lint
```

## デプロイ

### Vercel (推奨)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Vercelアカウントにログイン
2. GitHubリポジトリを接続
3. 自動デプロイ

### その他のホスティング

- **Netlify**: 自動ビルド・デプロイ対応
- **AWS Amplify**: サーバーレスホスティング
- **Firebase Hosting**: Googleのホスティングサービス

詳細は [docs/development-guide.md](docs/development-guide.md) の「ビルドとデプロイ」セクションを参照してください。

## 注意事項

### カメラアクセス

- **HTTPS環境が必須**（本番環境）
- 開発時は `localhost` で動作可能
- ブラウザのカメラ許可設定を確認

### ブラウザ対応

| ブラウザ | 対応状況 |
|---------|---------|
| Chrome | ✅ 完全対応 |
| Firefox | ✅ 完全対応 |
| Safari | ✅ iOS 14+ |
| Edge | ✅ 完全対応 |

### マーカー使用のヒント

- 印刷する場合は高品質で印刷
- 照明は適度に明るく（直射日光は避ける）
- カメラとマーカーの距離: 20-50cm推奨
- マーカーは平面に配置

## トラブルシューティング

### カメラが起動しない

- HTTPS環境または `localhost` で実行しているか確認
- ブラウザのカメラ許可設定を確認
- 他のアプリがカメラを使用していないか確認

### マーカーが認識されない

- 照明条件を確認
- マーカーの印刷品質を確認
- カメラとマーカーの距離を調整
- マーカーが完全に画面に映っているか確認

詳細は [docs/development-guide.md](docs/development-guide.md) の「トラブルシューティング」セクションを参照してください。

## 今後の拡張予定

- [ ] カスタムマーカー作成機能
- [ ] GLTFモデル読み込み機能
- [ ] マーカーデータの保存機能
- [ ] マルチマーカー対応
- [ ] アニメーション機能
- [ ] スクリーンショット撮影機能

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 参考資料

- [AR.js Documentation](https://ar-js-org.github.io/AR.js-Docs/)
- [A-Frame Documentation](https://aframe.io/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Three.js Documentation](https://threejs.org/docs/)

## コントリビューション

プルリクエストを歓迎します！大きな変更の場合は、まずIssueを開いて変更内容を議論してください。

## 作成者

[@koma-ry1117](https://github.com/koma-ry1117)

## サポート

問題が発生した場合は、[Issues](https://github.com/koma-ry1117/remote-visual-guidance/issues)で報告してください。
