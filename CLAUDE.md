# Remote Visual Guidance プロジェクトメモリ

## プロジェクト概要

**Remote Visual Guidance**: 遠隔作業支援のためのAR（拡張現実）プロトタイプ。WebベースでHIROマーカーを使用し、3D注釈・作業手順・記録機能を提供。

**スタック**: Next.js 14 / TypeScript / AR.js / A-Frame / Tailwind CSS

**核心価値**: シンプルさ・実用性・最小限の実装・プロトタイプ重視

詳細: `@README.md`

---

## Claude Code ワークフロー

### 基本フロー
1. **Explore**: 関連ファイル読み込み→実装計画を確認
2. **Plan-Code**: 最小限の実装で機能を実現
3. **Test**: 動作確認→必要に応じて修正
4. **Commit**: 機能完了を確認→コミット

### 効果的な依頼方法
- ❌ 悪い例: 「注釈機能を実装して」
- ✅ 良い例: 「#7のissueに従ってtypes/annotations.tsを作成して」

### その他のTips
- **Issue駆動**: GitHubのissueを確認してから実装
- **最小実装**: 必要最小限の機能のみ実装（過剰な機能追加は避ける）
- **コンテキストリセット**: `/clear`で新セッション開始

---

## 必須コマンド

### 開発
```bash
npm run dev                    # 開発サーバー起動（localhost:3000）
npm run build                  # プロダクションビルド
npm run start                  # プロダクション起動
npm run lint                   # ESLint実行
```

### Git操作
```bash
gh issue list                  # issue一覧表示
gh issue view <番号>           # issue詳細表示
gh issue close <番号>          # issueをクローズ
```

---

## コーディング規約

### TypeScript基準
- `strict: true` の遵守
- 型推論より明示的な型定義を優先
- `any` 型の使用は最小限に

### React/Next.js
- Client Components (`"use client"`) を適切に使用
- App Router使用
- コンポーネントは単一責任原則を遵守

### 設計原則
- **KISS (Keep It Simple)**: シンプルで理解しやすいコード
- **DRY (Don't Repeat Yourself)**: コードの重複を避ける
- **YAGNI (You Ain't Gonna Need It)**: 必要な機能のみ実装

詳細: `@docs/development/design_principles.md`（作成予定）

---

## プロジェクト固有の重要事項

### Phase構成
このプロジェクトは6つのPhaseに分かれています：

1. **Phase 1**: データ構造とコンテキスト設計
2. **Phase 2**: AR注釈コンポーネント実装
3. **Phase 3**: 注釈配置UIツール実装
4. **Phase 4**: 作業手順管理システム実装
5. **Phase 5**: 記録機能実装
6. **Phase 6**: UI統合とリファインメント

### 実装の進め方
- **Issue駆動開発**: 必ずGitHub issueを確認してから実装
- **サブissueの活用**: 各Phaseにはサブissueがあり、詳細な実装手順が記載されている
- **順序厳守**: Phase 1から順番に実装（依存関係があるため）

### ディレクトリ構造
```
remote-visual-guidance/
├── app/                    # Next.js App Router
│   ├── ar/                 # ARアプリページ
│   ├── layout.tsx          # ルートレイアウト
│   └── page.tsx            # ホームページ
├── components/             # Reactコンポーネント
│   ├── annotations/        # AR注釈コンポーネント
│   ├── tools/              # UIツール
│   ├── workflow/           # 作業手順コンポーネント
│   └── recording/          # 記録機能コンポーネント
├── contexts/               # React Context
├── types/                  # TypeScript型定義
├── utils/                  # ユーティリティ関数
├── data/                   # サンプルデータ
├── docs/                   # ドキュメント
└── public/                 # 静的ファイル
    └── markers/            # ARマーカー
```

---

## A-Frame / AR.js 特有の注意事項

### A-Frameコンポーネントの実装
- A-Frameはカスタム要素（`<a-scene>`, `<a-marker>` など）を使用
- TypeScriptでは `declare global` で型定義が必要
- position/rotationは文字列形式で渡す（例: `"0 1 0"`）

### AR.jsの制約
- HIROマーカーをデフォルトで使用
- カメラアクセスにはHTTPS環境が必須（開発時はlocalhostで可）
- ブラウザ互換性: Chrome/Edge推奨、iOS Safari 14+

### 動的スクリプトロード
- A-Frame/AR.jsはCDN経由で動的にロード
- SSR時のエラー回避のため、`useEffect`内で実行
- スクリプトロード完了後に`isLoaded`フラグを立てる

---

## Git規約

### コミットメッセージ規約

Conventional Commits形式を使用：

```
<type>[optional scope]: <description>

[optional body]
```

#### コミットタイプ

| タイプ       | 説明                     | 例                                       |
| ------------ | ------------------------ | ---------------------------------------- |
| **feat**     | 新機能の追加             | `feat(annotation): 矢印注釈コンポーネント追加` |
| **fix**      | バグ修正                 | `fix(workflow): ステップ移動の不具合を修正` |
| **docs**     | ドキュメントのみの変更   | `docs: README更新`                       |
| **style**    | コードスタイルの変更     | `style: インデント修正`                  |
| **refactor** | リファクタリング         | `refactor(utils): capture関数を整理`     |
| **test**     | テストの追加・修正       | `test: AnnotationContextのテスト追加`    |
| **chore**    | ビルド・設定の変更       | `chore: package.json更新`                |

### ブランチ命名規則

```bash
<type>/<issue-number>-<short-description>
```

#### 例
```bash
feature/7-types-annotations
fix/12-annotation-toolbar-bug
docs/update-readme
```

---

## Issue管理

### Issue確認
```bash
# すべてのissueを確認
gh issue list

# 特定のissueの詳細を確認
gh issue view 7

# ブラウザで開く
gh issue view 7 --web
```

### Issueの構造
各issueには以下の情報が含まれています：
- **親Issue参照**（サブissueの場合）
- **依存関係**
- **目的**
- **作成/修正するファイルパス**
- **完全な実装コード**
- **実装手順**
- **完了条件チェックリスト**
- **テスト方法**
- **注意事項**

### Issueのクローズ
```bash
# サブissue完了時
gh issue close 7

# 親issueはすべてのサブissue完了後にクローズ
gh issue close 1
```

---

## トラブルシューティング

### A-Frame関連
- **カメラが起動しない**: HTTPS環境またはlocalhostで実行しているか確認
- **マーカーが認識されない**: 照明条件を確認、マーカーの印刷品質を確認

### ビルド関連
- **TypeScriptエラー**: `npm run build` でエラー確認
- **依存関係エラー**: `node_modules`削除後、`npm install`再実行

### 実装関連
- **複雑すぎる実装**: issueの完了条件を再確認、最小限の実装に絞る
- **依存関係エラー**: Phase順序を確認、前のPhaseが完了しているか確認

---

## 参照ドキュメント索引

### プロジェクト
- プロジェクト概要: `@README.md`
- プロジェクト構成: `@docs/project-structure.md`
- 技術スタック: `@docs/tech-stack.md`
- 開発ガイド: `@docs/development-guide.md`

### Issue
- Phase 1: Issue #1（サブissue: #7, #8）
- Phase 2: Issue #2（サブissue: #9, #10, #11）
- Phase 3: Issue #3（サブissue: #12）
- Phase 4: Issue #4（サブissue: #13, #14, #15）
- Phase 5: Issue #5（サブissue: #16, #17）
- Phase 6: Issue #6（サブissue: #18, #19）

---

## 重要な原則

### 最小限の実装
このプロジェクトはプロトタイプであり、以下を最優先します：
- ✅ 動作する最小限の機能
- ✅ シンプルで理解しやすいコード
- ✅ issueの完了条件を満たす実装
- ❌ 過剰な最適化
- ❌ 不要な追加機能
- ❌ 複雑な設計パターン

### Issue駆動開発
- 必ずissueを確認してから実装
- issueに記載された実装コードを参考にする
- 完了条件を全て満たすことを確認
- issueの範囲外の実装は行わない

---

**IMPORTANT**: このプロジェクトメモリは最小限のコア情報のみを含みます。詳細はGitHub issueおよび`docs/`配下のドキュメントを参照してください。
