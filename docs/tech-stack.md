# 技術スタック詳細

## バージョン情報（2025年推奨）

| カテゴリ | 技術 | バージョン | 用途 |
|---------|-----|-----------|------|
| **フレームワーク** | Next.js | 14.2.33 | Reactベースのフルスタックフレームワーク |
| **言語** | TypeScript | 5.x | 型安全な開発 |
| **UI ライブラリ** | React | 18.3.1 | UIコンポーネント構築 |
| **AR 基盤** | AR.js | 3.4.6 | マーカーベースAR機能 |
| **3D フレームワーク** | A-Frame | 1.4.2 | WebVRフレームワーク |
| **3D エンジン** | Three.js | 0.164.0 | 3Dグラフィックスレンダリング |
| **CSS フレームワーク** | Tailwind CSS | 4.x | ユーティリティファーストCSS |
| **パッケージ管理** | npm | - | 依存関係管理 |

---

## 各技術の詳細

### 1. Next.js 14.x

**選定理由:**
- App Routerによる最新のルーティングシステム
- React Server Components（RSC）対応
- TypeScript完全サポート
- 優れた開発者体験（Fast Refresh、自動最適化）

**主な機能:**
- ファイルベースルーティング（`app/`ディレクトリ）
- サーバーサイドレンダリング（SSR）
- 静的サイト生成（SSG）
- APIルート（バックエンド機能）
- 画像最適化

**プロジェクトでの利用:**
- `app/`ディレクトリでページ構成
- `"use client"`でクライアントコンポーネント指定（AR機能用）
- 開発サーバー: `npm run dev`

---

### 2. React 18.x

**選定理由:**
- Next.js 14の推奨バージョン
- Concurrent Features対応
- 自動バッチング
- Suspenseの改善

**主な機能:**
- Hooks（useState, useEffect, useRef など）
- コンポーネントベースのUI構築
- 仮想DOM による効率的な更新

**プロジェクトでの利用:**
- 全てのUIコンポーネント
- State管理（色選択、オブジェクト選択）
- ライフサイクル管理（スクリプト動的ロード）

---

### 3. AR.js 3.4.6

**選定理由:**
- マーカーベースARの実績豊富
- 軽量（追加ライブラリ最小限）
- A-Frameとの統合が容易
- 無料でオープンソース

**主な機能:**
- マーカー認識（HIRO, Kanji, カスタム）
- カメラアクセス
- 3Dオブジェクトの位置トラッキング
- NFT（Natural Feature Tracking）対応

**プロジェクトでの利用:**
- CDN経由で動的ロード
- A-Frameと統合して使用
- HIROマーカー認識

**CDN:**
```html
https://cdn.jsdelivr.net/gh/AR-js-org/AR.js@3.4.5/aframe/build/aframe-ar.js
```

---

### 4. A-Frame 1.4.2

**選定理由:**
- 宣言的なHTML風の3Dシーン構築
- Three.jsをベースとした高レベルAPI
- VR/AR対応
- エコシステムが充実

**主な機能:**
- Entity-Component-System（ECS）アーキテクチャ
- HTMLタグで3Dシーン定義（`<a-scene>`, `<a-box>`など）
- カメラ、ライト、マテリアル管理
- アニメーション

**プロジェクトでの利用:**
- ARシーンの構築（`<a-scene>`）
- 3Dオブジェクト配置（`<a-box>`, `<a-sphere>`, `<a-cylinder>`）
- マーカー定義（`<a-marker>`）

**CDN:**
```html
https://cdn.jsdelivr.net/npm/aframe@1.4.2/dist/aframe-master.min.js
```

---

### 5. Three.js 0.164.0

**選定理由:**
- 業界標準の3Dライブラリ
- AR.js 3.4.6と完全互換
- 豊富な機能とドキュメント
- アクティブな開発とコミュニティ

**主な機能:**
- WebGLベースの3Dレンダリング
- ジオメトリ、マテリアル、メッシュ管理
- カメラ、ライト制御
- アニメーションシステム

**プロジェクトでの利用:**
- A-Frameの内部エンジンとして使用
- 直接的な操作は最小限（A-Frame経由）

---

### 6. Tailwind CSS 4.x

**選定理由:**
- ユーティリティファーストで高速開発
- レスポンシブデザインが容易
- カスタマイズ性が高い
- Next.jsとの統合がシームレス

**主な機能:**
- ユーティリティクラス（`flex`, `p-4`, `bg-blue-500`など）
- レスポンシブ修飾子（`sm:`, `md:`, `lg:`など）
- ダークモード対応
- カスタムテーマ

**プロジェクトでの利用:**
- 全UIコンポーネントのスタイリング
- レスポンシブレイアウト
- カラーパレット管理

**設定ファイル:**
- `tailwind.config.ts` - カスタマイズ
- `app/globals.css` - ディレクティブ読み込み

---

### 7. TypeScript 5.x

**選定理由:**
- 型安全性によるバグ削減
- IDEサポート向上（自動補完、リファクタリング）
- Next.js推奨
- 大規模開発に適している

**主な機能:**
- 静的型チェック
- インターフェース定義
- ジェネリクス
- 型推論

**プロジェクトでの利用:**
- 全ファイルを`.tsx`/`.ts`で作成
- Props型定義（`ColorPickerProps`など）
- イベントハンドラ型定義

---

## 依存関係の互換性

### 検証済み組み合わせ

```json
{
  "next": "^14.2.33",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "three": "0.164.0",
  "@ar-js-org/ar.js": "3.4.6",
  "aframe": "1.4.2",
  "tailwindcss": "^4"
}
```

### 既知の問題と回避策

#### 1. AR.js と Three.js のバージョン競合
- **問題**: AR.js 3.4.5以前はThree.js 0.126.0に依存
- **解決**: AR.js 3.4.6以降を使用（Three.js 0.164.0対応）

#### 2. A-Frame の SSR エラー
- **問題**: Next.jsのSSR時にブラウザAPIアクセスでエラー
- **解決**: `"use client"`ディレクティブ使用、スクリプト動的ロード

#### 3. Tailwind CSS 4.x の設定変更
- **問題**: v3からの破壊的変更
- **解決**: `tailwind.config.ts`で適切に設定

---

## 開発環境要件

### Node.js
- **推奨バージョン**: 18.x 以上
- **確認方法**: `node -v`

### npm
- **推奨バージョン**: 9.x 以上
- **確認方法**: `npm -v`

### ブラウザ
| ブラウザ | 最小バージョン | AR対応 | カメラ対応 |
|---------|--------------|-------|----------|
| Chrome | 90+ | ✅ | ✅ (HTTPS必須) |
| Firefox | 88+ | ✅ | ✅ (HTTPS必須) |
| Safari | 14+ | ✅ | ✅ (HTTPS必須) |
| Edge | 90+ | ✅ | ✅ (HTTPS必須) |

---

## パフォーマンス最適化

### 1. コード分割
- Next.jsが自動で実行
- 動的インポート使用可能: `next/dynamic`

### 2. 画像最適化
- `next/image`コンポーネント使用
- WebP自動変換

### 3. AR.js 最適化
- `debugUIEnabled: false` で デバッグUI無効化
- `detectionMode: mono_and_matrix` で高速化

### 4. Tailwind CSS 最適化
- プロダクションビルドで未使用クラス削除
- PurgeCSS自動実行

---

## セキュリティ考慮事項

### 1. HTTPS必須
- カメラアクセスにはHTTPS環境必須
- 開発時は`localhost`で代用可能

### 2. CDN信頼性
- AR.js/A-FrameはCDN経由でロード
- SRI（Subresource Integrity）追加検討

### 3. 依存関係の脆弱性
- 定期的に`npm audit`実行
- 重大な脆弱性は即座に対応

---

## 今後の拡張候補

### 1. 状態管理ライブラリ
- **Zustand** または **Jotai**: 軽量で型安全
- 複雑なState管理が必要になった場合

### 2. UIコンポーネントライブラリ
- **shadcn/ui**: Tailwind CSSベース、カスタマイズ容易
- より高度なUIが必要な場合

### 3. 3Dモデルローダー
- **react-three-fiber**: React用Three.jsラッパー
- GLTFモデル読み込み

### 4. バックエンド機能
- Next.js API Routes または Supabase
- マーカーデータ保存、ユーザー認証

### 5. PWA化
- `next-pwa`プラグイン
- オフライン対応、インストール可能

---

## 参考リンク

### 公式ドキュメント
- [Next.js](https://nextjs.org/docs)
- [React](https://react.dev/)
- [AR.js](https://ar-js-org.github.io/AR.js-Docs/)
- [A-Frame](https://aframe.io/docs/)
- [Three.js](https://threejs.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)

### コミュニティ
- [AR.js GitHub](https://github.com/AR-js-org/AR.js)
- [A-Frame Slack](https://aframe.io/community/)
- [Next.js GitHub Discussions](https://github.com/vercel/next.js/discussions)
