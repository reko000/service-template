---
name: github-ops
description: GitHub操作（Issue作成、PR作成、コメント、ラベル操作、ブランチ管理）を一元化するスキル。
---

# GitHub Operations Skill

GitHub CLI（`gh`）を使ったGitHub操作の共通ルール。すべてのワークフローがこのスキルを参照する。

## ブランチ管理

### ブランチ作成
```bash
git fetch origin
git checkout -b feature/issue-<ID> origin/main
```

### worktree環境での.envコピー
```bash
MAIN_REPO_ROOT=$(dirname $(git rev-parse --git-common-dir))
cp "$MAIN_REPO_ROOT/apps/web/.env" "apps/web/.env" 2>/dev/null || true
cp "$MAIN_REPO_ROOT/apps/web/.env.local" "apps/web/.env.local" 2>/dev/null || true
cp "$MAIN_REPO_ROOT/packages/database/.env" "packages/database/.env" 2>/dev/null || true
```

### mainブランチでの操作禁止
コミット・pushの前に必ず確認:
```bash
git branch --show-current
# main/master でないことを確認してから操作する
```

## Issue操作

### Issue起票
```bash
gh issue create \
  --title "テストケース: [シナリオ名]" \
  --label "test-case:pending" \
  --body "<Issue本文>"
```
※ Issue本文が長い場合は `/tmp/` に一時ファイルを作成して `--body-file /tmp/issue_body.md` を使用。プロジェクトディレクトリ内に一時ファイルを作成しない。

### Issueロック（二重処理防止）
```bash
ISSUE_ID="選定したID"
CURRENT_ASSIGNEES=$(gh issue view $ISSUE_ID --json assignees -q '.assignees | length')

if [ "$CURRENT_ASSIGNEES" -eq 0 ]; then
  gh issue edit $ISSUE_ID --add-assignee "@me"
  gh issue comment $ISSUE_ID --body "🤖 AI Agent is working on this! 🚀"
else
  echo "Error: Issue is already assigned."
fi
```

### Issueコメント
```bash
gh issue comment <ISSUE_ID> --body "<コメント内容>"
```

## PR操作

### PR作成
```bash
git add .
git commit -m "feat: resolve issue #<ID>"
git push origin HEAD

gh pr create \
  --title "Resolve Issue #<ID>: <短い説明>" \
  --body "
## What
<何を作ったか>

## How
<実装の概要>

## Verification
<テスト・型チェック・ビルドの結果>

Closes #<ID>
"
```

### PRレビューコメント
```bash
gh pr review <PR_NUMBER> --approve --body "<レビューコメント>"
# または
gh pr review <PR_NUMBER> --request-changes --body "<修正依頼>"
```

### PRコメント
```bash
gh pr comment <PR_NUMBER> --body "<コメント内容>"
```

## コミットメッセージ規約

```
<type>: <短い説明>

Types:
- feat: 新機能
- fix: バグ修正
- refactor: リファクタリング
- test: テスト追加・修正
- docs: ドキュメント
- chore: その他
```

## ラベル運用

| ラベル | 意味 | 付与タイミング |
|---|---|---|
| `test-case:pending` | 承認待ち | プランナーがテストケースIssueを起票した直後 |
| `test-case:approved` | 承認済み | 管理者がレビューし承認したとき |

## 一時ファイルルール

**プロジェクトディレクトリ内に一時ファイルを作成してはならない。**
worktree環境では他のワーカーに差分として波及するため。

必要な場合は `/tmp/` を使用:
- PRボディの下書き → `--body` 引数に直接渡すか `/tmp/` を使用
- Issue情報のダンプ → `gh issue view` を直接叩く
- デバッグスクリプト → `/tmp/` に配置
