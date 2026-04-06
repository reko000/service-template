---
description: 機能開発の全体フローを統括するオーケストレーター。プランナー→承認→開発者→QAレビュアーを連携させる。
---
# 機能開発ワークフロー（Feature Development）

機能の要件定義からPRマージまでを、3つの役割ワークフロー（planner / developer / qa-reviewer）を順に呼び出して完遂するオーケストレーター。

## 全体フロー

```
Step 1: planner に設計依頼 → Issue起票
Step 2: 人間の承認を待つ（test-case:pending → approved）
Step 3: developer に実装依頼 → PR作成
Step 4: qa-reviewer に検証依頼 → 判定
Step 5: 結果に応じて分岐
```

## Step 1: プランナーに設計依頼

`planner` ワークフローを実行する。

- 入力: 人間の要望、PRD、会話内容
- 出力: GitHub Issue（`test-case:pending` ラベル付き）

1つの要望が複数シナリオに分かれる場合、プランナーが分割してIssueを起票する。
この時点では実装に一切着手しない。

## Step 2: 人間の承認を待つ

プランナーが起票したIssueを人間に提示し、承認を待つ。

- 人間がラベルを `test-case:approved` に変更 → Step 3 へ
- 人間が修正を指示 → Step 1 に戻る（プランナーにIssue修正を依頼）
- 人間がCloseした場合 → そのIssueはスキップ

**AIは `test-case:pending` のIssueを勝手に実装してはならない。**

## Step 3: 開発者に実装依頼

`developer` ワークフローを実行する。

- 入力: 承認済みIssue（`test-case:approved`）
- 出力: GitHub PR

### 差し戻し
開発者が実装中に「要件が曖昧・矛盾している」と判断した場合、Issueにコメントを残して Step 1 に戻る（プランナーに差し戻し）。

## Step 4: QAレビュアーに検証依頼

`qa-reviewer` ワークフローを実行する。

- 入力: 開発者が作成したPR
- 出力: Approve / Request Changes

## Step 5: 結果判定

| QAの判定 | アクション |
|---|---|
| **Approve** | PRをマージ可能状態にして人間に通知。次の機能へ |
| **Request Changes（コード修正）** | Step 3 に戻る（開発者に修正コメントを伝えて再実装） |
| **Request Changes（要件の問題）** | Step 1 に戻る（プランナーにIssue見直しを依頼） |

## 撤退条件

同じエラーで **3回やり直しても解決できない場合**、作業を中断し `[AI Blocked]` ドラフトPRを作成して人間の介入を要請する。

## 複数Issue時のループ

1つの機能が複数Issueに分割されている場合、Step 3〜5 を各Issueについて繰り返す。
すべてのIssueが完了したら次の機能へ移る。
