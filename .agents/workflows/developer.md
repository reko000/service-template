---
description: 承認済みIssueを受け取り、技術設計→TDD実装→PR作成までを行う開発者ワークフロー
---
# 開発者ワークフロー（Developer）

承認済みのテストケースIssueを受け取り、技術設計からPR作成までを完遂する。

## 使用スキル

| スキル | 用途 |
|---|---|
| `code-implementation` | 技術設計・コード実装・UIコンポーネント |
| `test-runner` | テストコード作成・実行 |
| `github-ops` | ブランチ作成・PR作成・コメント |

## 手順

### 1. タスクのロックとブランチ作成

`github-ops` スキルに従い、Issueをロックしてブランチを作成する。

- Issueが他の誰かにアサインされていないか再確認
- 自分にアサイン + コメントで着手を宣言
- `feature/issue-<ID>` ブランチを `origin/main` から作成

### 2. 技術設計（How）

`code-implementation` スキルに従い、実装方針を決める。

- DB設計、API設計、コンポーネント構造を検討
- `CLAUDE.md` の「鉄の掟」に照らしてセルフレビュー
- 対象featureの `AI.md` があれば熟読し、局所ルールを遵守
- 実装計画（`implementation_plan.md`）を作成

### 3. 🔴 Red: テスト作成

`test-runner` スキルに従い、失敗するテストを先に書く。

- `test-case:approved` のIssueの場合 → Given/When/Then をテストコードに変換
- 通常Issueの場合 → 受け入れ条件からテストシナリオを作成

テストを実行し、**意図通りに失敗する（Red）ことを確認**してから次に進む:
- E2E: `npx playwright test`（`apps/web` ディレクトリで実行）
- Unit: `npx vitest run`

### 4. 🟢 Green: 実装

`code-implementation` スキルに従い、テストをパスさせるコードを実装する。

- UI変更時はデザインシステム準拠・a11y対応
- feature/ ディレクトリ内で完結させる（横方向インポート禁止）

### 5. 品質チェック

すべてパスすることを確認:
1. テスト全パス（`npx playwright test` / `npx vitest run`）
2. 型チェック（`npx tsc --noEmit`）
3. 本番ビルド（`npm run build`）
4. アーキテクチャ監査: `git diff --name-only HEAD` で変更ファイルを特定し、`CLAUDE.md` の規約違反をチェック
5. **[重要] デプロイ・インフラ検査**: エミュレータだけでなく、本番環境で実際に動作するための設定ファイル（環境変数、`firebase.json` などのリソース定義）が欠落していないか自己点検する
6. **ユーザーストーリーの達成確認**: Issue冒頭に設定された `As a / I want / So that` が、インフラを伴う実環境上で「確実に（So that）の価値を提供できる状態」になっているか最終確認する

### 6. PR作成

`github-ops` スキルに従い、PRを作成する。

### 差し戻し

実装中に「要件が曖昧・矛盾している」と判断した場合:
1. Issueにコメントで具体的な問題点を記載
2. オーケストレーターにプランナーへの差し戻しを報告

### 撤退条件

同じエラーで **3回やり直しても解決できない場合**:
1. `[AI Blocked]` ドラフトPRを作成
2. 問題の詳細をPR本文に記載
3. オーケストレーターに報告
