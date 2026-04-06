---
name: test-runner
description: テストコードの技術ルール（配置、モック、a11y、Given/When/Then変換）と実行方法を定義するスキル。
---

# Test Runner Skill

テストコードを書く際の**技術ルール**と**実行方法**を定義するスキル。テストシナリオの「設計」は `test-case-design` スキルが担当し、本スキルはそのシナリオを「コードに変換し、実行する方法」に特化する。

## テストコードのルール

1. **配置**: ユニットテストは対象ファイルと同階層に `.test.ts(x)` として配置。E2Eテストは `apps/web/e2e/` に `*.spec.ts` として配置
2. **APIモック**: 外部API依存のテストは `MSW` (Mock Service Worker) でモック化。実ネットワークリクエスト禁止
3. **エッジケース網羅**: 正常系だけでなく、空データ・APIエラー・境界値を含める
4. **a11y**: UIテストでは `@testing-library/react` の `getByRole`, `getByLabelText` 等を優先
5. **データ隔離**: E2Eテストはテスト用DBまたはSeedデータを使用。本番データに依存しない
6. **統合認証・Middlewareテスト（最重要）**: NextAuth等の認証設定（`authOptions` 等）は必ず一元化し、重複定義を禁止する。またE2Eテストにおいて「OAuth画面の操作回避」を理由にログイン後テストをスキップしてはならない。テスト専用のCredentialsProvider等の裏口を用意し、本来の `middleware.ts` のルーティングやセッション参照を含む「結合テスト」を必ず実装する。

## テスト実行コマンド

| テスト種別 | コマンド | 実行ディレクトリ |
|---|---|---|
| E2E | `npx playwright test` | `apps/web` |
| Unit | `npx vitest run` | プロジェクトルート or `apps/web` |
| 型チェック | `npx tsc --noEmit` | プロジェクトルート |

## Given/When/Then → テストコード変換ルール

`test-case:approved` のIssueからテストコードを書く際の変換ルール：

| テストケース | テストコード |
|---|---|
| **Given（前提条件）** | `beforeEach` / テストデータセットアップ |
| **When（操作）** | ページ遷移、クリック、関数呼び出し等のアクション |
| **Then（期待結果）** | `expect` / `toBeVisible` / `toHaveText` 等のアサーション |

テスト実装完了後、元のテストケースIssueにコメントでファイルパスを記載すること：
```bash
gh issue comment <ISSUE_ID> --body "✅ テストコード実装完了: \`apps/web/e2e/[test-name].spec.ts\`"
```

## 参考例
- ユニットテスト: `examples/component_test.tsx`
- MSWハンドラ: `examples/msw_handler.ts`
- E2Eテスト: `examples/e2e_test.spec.ts`
