<!-- ====== PROJECT-SPECIFIC: ここから書き換える ====== -->
# [プロジェクト名]

[プロジェクトの1〜2行の説明を書く]
<!-- ====== PROJECT-SPECIFIC: ここまで ====== -->

AI-Native Development Guideline

このプロジェクトは、AIによる開発効率を最大化するために**「垂直分割（Vertical Slice）」と「コンテキストの最小化」**を最優先します。

**最優先ルール：共通化よりも独立性**
- 複数機能で同じロジックが必要になった場合でも、安易に `shared` へ抽出せず、各機能ディレクトリ（features/）内での「重複」を許容すること。
- 「共通化」は、その変更が全機能に波及し、AIのコンテキストを汚染するリスクがあると認識せよ。
- 独立性が保たれていることで、AIは一つのフォルダ内の情報だけで完璧な修正を行える状態を維持する。

1. 基本思想：One Directory, One Context
コンテキストの封じ込め: すべての機能は features/{feature-name}/ 内で完結させる。

DRYより独立性: 共通化によって依存関係が複雑になるくらいなら、コードの重複（コピペ）を許容する。

AIの視界制限: AIが修正を行う際は、対象の機能フォルダ以外の情報を読み込まずに済むように設計する。

2. ディレクトリ構造の掟
AIは常に以下の構造を維持し、新しい機能を追加する際は自動的にこのパターンに従うこと。

<!-- ====== PROJECT-SPECIFIC: プロジェクトに合わせて具体例を書き換える ====== -->

```
/ (root)
 apps/
    web/                   # フロントエンド
       app/               # ルーティング
       features/          # 垂直分割された機能ディレクトリ
          [feature-name]/
              components/
              hooks/
              server/
              types/
              index.ts
              AI.md
       shared/
    workers/               # バックグラウンド処理
        functions/
            [function-name]/
                index.ts
                AI.md
 packages/
    database/              # DB共有パッケージ
        prisma/
           schema.prisma
           migrations/
           seed.ts
        src/
           index.ts
        package.json
 CLAUDE.md
```

<!-- ====== PROJECT-SPECIFIC: ここまで ====== -->

**`apps/web/` 直下に配置してよいもの（ホワイトリスト）:**
- `app/`、`features/`、`shared/`、`public/`
- 設定ファイル（`next.config.ts`, `tsconfig.json`, `package.json` 等）
- 環境変数（`.env`, `.env.local`）
- **上記以外のディレクトリ（`lib/`, `scripts/`, `utils/`, `prisma/` 等）の作成は禁止。**

3. AIが守るべき「鉄の掟」

 横方向のインポート禁止
features/A は features/B の中のファイルを直接インポートしてはならない。
共通化が必要な場合は、shared/ に移動するか、それぞれの features/ 内に同じロジックを持たせる。

 独自の「小さな型」の定義
プロジェクト全体の巨大な GlobalTypes.ts を作らない。
各機能の types/ 内で、その機能に必要なプロパティだけを持った型を定義する。

 結合は apps/web でのみ行う
各機能は「部品」として独立させ、それらを組み合わせてページを作るのは apps/web/app/ 下のファイルのみとする。

 コンポーネント合成は Slots パターンを使う
あるfeatureのコンポーネント内に、別featureのコンポーネントを表示したい場合、横方向のインポートではなく `ReactNode` 型の props（スロット）を使って合成する。

 ページ層（app/）の責務（オーケストレーター）
ページ層は「どのデータを取得し、どの機能コンポーネントを配置合成するか」を決定する「指揮者」に徹する。
ページ層自体にはビジネス固有のロジックを持たせず、各機能コンポーネントへ依存注入（DI）すること。

 UIとデータフェッチの分離（Smart & Dumb Components）
UIが特定のデータ取得元に過度に密結合しないようにする。

 機能間ステート共有のベストプラクティス
- URL（`SearchParams`）を介した状態の共有と同期
- ページ上位からの Zustand ストアや Context のトップダウン注入（DI）

 純粋な共通UI（Design System）の例外
ビジネスロジックを持たない純粋UIは `apps/web/shared/ui/` に配置してよい。

 アーキテクチャレビューの重点チェック
1. 横方向インポートの有無
2. Slotsパターンの適用漏れ
3. Orchestratorの責務逸脱
4. Smart/Dumb分離の妥当性
5. AI.mdの局所ルール遵守
6. スキーマ変更の責務妥当性

<!-- ====== PROJECT-SPECIFIC: 技術スタックを変更可能 ====== -->
4. 技術スタックの統一

Framework: Next.js (App Router)
Styling: Tailwind CSS (独自のCSSクラスは原則禁止)
Data Fetching: Server Actions / fetch (RSC)
State Management: URL状態管理、または Zustand (機能フォルダ内に閉じる)
Package Manager: **npm**（npm workspaces）
<!-- ====== PROJECT-SPECIFIC: ここまで ====== -->

5. 新規機能追加時の手順
features/ 下に新しいディレクトリを作成する。
その直下に AI.md を作成し、その機能の目的と制約を記述する。
index.ts を通じて apps/web に機能を公開する。

Note to AI: コードを「綺麗に共通化」することよりも、「そのフォルダだけで理解可能であること」を優先してください。

## 6. AIエージェントへの指示（Skills & Workflows）

| スキル | 用途 |
|---|---|
| `test-case-design` | 要件の引き出しテストケース設計Issue起票 |
| `test-runner` | テストコードの技術ルール（配置, モック, a11y）と実行 |
| `code-implementation` | 技術設計コード実装UIコンポーネント |
| `code-review` | コードレビューアーキテクチャ監査ブラウザ操作確認 |
| `github-ops` | Issue作成PR作成コメントラベル操作 |

### 一時ファイルの作成禁止
AIがプロジェクトディレクトリ内に一時ファイルを作成することを**厳禁**とする。
**一時ファイルが必要な場合は必ず `/tmp/` を使用すること。**

<!-- ====== PROJECT-SPECIFIC: サービス構成を書き換える ====== -->
## 7. サービスアーキテクチャ

| サービス | ディレクトリ | デプロイ先 | 役割 |
|---|---|---|---|
| **Web** | `apps/web/` | [デプロイ先] | ユーザー向けUI |
| **Workers** | `apps/workers/` | [デプロイ先] | バックグラウンド処理 |
| **Database** | `packages/database/` | - | Prismaスキーマクライアント |

### apps 間の鉄の掟
**apps間は互いのコードを直接インポートしてはならない。**
- DB アクセスは `packages/database/` 経由
- 型やutilが両方で必要なら重複を許容
- 環境変数は各app独立の `.env` で管理
<!-- ====== PROJECT-SPECIFIC: ここまで ====== -->

## 9. テストファーストの原則

**実装前に必ずテストを書く。** テスト技術ルールは `test-runner` スキル参照。

### テスト承認フロー
1. `planner` ワークフローがテストケースをIssue起票（`test-case:pending`）
2. 管理者がラベルを `test-case:approved` に変更して承認
3. `feature-development` ワークフローが `developer`  `qa-reviewer` と連携

 AIは `test-case:pending` のIssueを勝手に実装してはならない。
