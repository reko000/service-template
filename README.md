# Service Template

AIエージェントと協働するための開発テンプレート。
新しいプロジェクトを立ち上げる際に、このテンプレートをベースにして即座に開発を開始できます。

## 使い方

### 1. テンプレートからリポジトリを作成

GitHub で「Use this template」ボタンをクリック、または:

```bash
gh repo create my-new-service --template <このリポジトリ> --clone
```

### 2. プロジェクト固有部分を書き換える

`CLAUDE.md` 内の `<!-- PROJECT-SPECIFIC -->` マーカーで囲まれたセクションを、自分のプロジェクトに合わせて編集する：

- **プロジェクト名と説明**（冒頭）
- **ディレクトリ構造の具体例**（セクション2）
- **技術スタック**（セクション4）- デフォルトは Next.js / Tailwind / npm
- **サービスアーキテクチャ**（セクション7）- デプロイ先、サービス構成

### 3. 開発開始

```bash
# /feature-development で機能開発ワークフローを起動
```

## 含まれるもの

### Workflows（役割）
| ワークフロー | 役割 |
|---|---|
| `feature-development` | オーケストレーター。3役割を統括 |
| `planner` | 要件整理  テストケース設計  Issue起票 |
| `developer` | 技術設計  TDD  PR作成 |
| `qa-reviewer` | コードレビュー  E2E  ブラウザ確認 |

### Skills（能力）
| スキル | 用途 |
|---|---|
| `test-case-design` | テストケース設計Issue起票 |
| `test-runner` | テスト実行技術ルール |
| `code-implementation` | 技術設計コード実装 |
| `code-review` | コードレビュー品質検証 |
| `github-ops` | GitHub操作一元化 |

## PROJECT-SPECIFIC マーカーについて

CLAUDE.md 内でプロジェクト固有の記述は以下のHTMLコメントで囲まれています：

```html
<!-- ====== PROJECT-SPECIFIC: 説明 ====== -->
（ここを書き換える）
<!-- ====== PROJECT-SPECIFIC: ここまで ====== -->
```

マーカーで囲まれて**いない**部分は全プロジェクト共通のルールです。変更しないでください。
