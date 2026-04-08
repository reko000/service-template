---
name: test-case-design
description: 人間の要望やPRDからテストケースを設計し、承認フロー付きのGitHub Issueとして起票するスキル。
---

# Test Case Design Skill

人間との会話を通じて要望を引き出し、**テストケース（テストシナリオ）をGitHub Issueとして起票する**スキル。
起票されたIssueは管理者の承認を経て、AIが自律的にテストコード・機能コードを実装する。

## パイプラインにおける位置

```
人間: 「〇〇がほしい」
  ↓ planner ワークフローが本スキルで要件整理 + テストケース設計
GitHub Issue（test-case:pending）
  ↓ 管理者がラベル変更で承認
feature-development オーケストレーターが developer → qa-reviewer と連携して実装 → PR
```

## 1. 要件の引き出し（旧 requirements-definition）

テストケースを書く前に、曖昧な要望を明確にする。

### ルール
- **ユーザーストーリーの言語化**: 機能要件だけをまとめず、必ずチケットを `As a (アクター) / I want (機能) / So that (提供価値)` の形式に落とし込み、「技術タスク」ではなく「価値」を定義すること。
- **目的の明確化**: 「なぜ（Why）それが必要なのか」を必ず言語化する
- **不明点は質問**: 勝手に推測せず、複数のオプションを提示してユーザーに聞く
- **非機能要件・実運用環境の特定**: 動かすだけではなく、実運用インフラでどう影響するかを考慮する
- **テスト可能な粒度**: 受け入れ条件は「操作→期待結果」で記述し、曖昧な表現を禁止する

### 良い要件と悪い要件の例
`examples/good_requirements.md` を参照。

## 2. テストケース設計

### ルール
1. **粒度**: 1 Issue = 1機能シナリオ。独立したシナリオは別Issueに分割
2. **Given/When/Then**: 各テストケースは「前提条件（Given）」「操作（When）」「期待結果（Then）」で構造化
3. **テスト種別の明記**: E2E (Playwright) / Unit (Vitest) / Integration を明記
4. **エッジケースの網羅**: 正常系だけでなく、空データ・エラー時・境界値を含める。特に**認証（NextAuth）やミドルウェア**が絡む機能では、「ダミーログインでセッションを張った状態でアクセスし、無限リダイレクト等のルーティング不具合が起きずに画面が表示されるか」という観点（実体に近い結合シナリオ）を漏らさず記載すること。OAuth等外部の仕様を言い訳にシナリオをスキップしてはならない。
5. **Issue分割**: 1つのIssueは 1 PR で完結する粒度（1〜3日）に収める

### テンプレート
起票時は `templates/test-case-issue.md` のフォーマットを使用すること。

## 3. ラベル運用とIssueライフサイクル（Single Source of Truth）

**テストケースIssue = 実装対象Issue** である。テストケースの起票から実装・PRクローズまで、1つのIssueで完結する。

| ラベル | 意味 | 付与タイミング |
|---|---|---|
| `test-case:pending` | 承認待ち | AIがテストケースIssueを起票した直後 |
| `test-case:approved` | 承認済み | 管理者がレビューし承認したとき |

```
起票（test-case:pending）→ 管理者承認（test-case:approved）→ AIが取得・実装 → PRの `Closes #ID` でクローズ
```

- 起票時は必ず `test-case:pending` ラベルを付与する
- AIは `test-case:approved` のIssueのみを実装対象とする
- **`test-case:pending` のIssueを勝手に実装してはならない**

## 起票コマンド例

```bash
gh issue create \
  --title "テストケース: [シナリオ名]" \
  --label "test-case:pending" \
  --body "$(cat /tmp/test_case_body.md)"
```
