---
name: code-implementation
description: 技術設計・コード実装・UIコンポーネント作成を、Ventityのアーキテクチャ規約に従って行うスキル。
---

# Code Implementation Skill

承認済みテストケースを受け取り、**技術設計（How）からコード実装まで**を行うスキル。
UIコンポーネント実装ルールも含む。

## 技術設計ルール

1. **CLAUDE.md の熟読**: 実装前に必ず `CLAUDE.md` を読み、「鉄の掟」を遵守する
2. **AI.md の参照**: 対象featureの `AI.md` があれば熟読し、局所ルールを遵守する
3. **垂直分割の徹底**: すべての実装は `features/{feature-name}/` 内で完結させる
4. **横方向インポート禁止**: `features/A` は `features/B` を直接インポートしない
5. **Slotsパターン**: feature間合成には `ReactNode` 型のpropsを使う
6. **Smart/Dumb分離**: データフェッチロジックとUIを分離する

## コード実装ルール

1. **featureディレクトリ構造**:
   ```
   features/{feature-name}/
   ├── components/    # UIコンポーネント
   ├── hooks/         # カスタムフック
   ├── server/        # Server Actions等
   ├── types/         # 機能固有の型
   ├── index.ts       # 公開API
   └── AI.md          # 局所ルール
   ```

2. **テストファースト**: 必ずテストが先に存在する状態で実装に入る（`test-runner` スキルで作成済み）

3. **一時ファイル禁止**: プロジェクトディレクトリ内に一時ファイルを作成しない。必要なら `/tmp/` を使用

## UIコンポーネントルール

1. **デザインシステム準拠**: Tailwind CSSを使用。独自CSSクラスは原則禁止。既存のカラーパレット・余白等のTokensに準拠する
2. **アクセシビリティ（a11y）**:
   - インタラクティブ要素には適切な `aria-label`, `aria-expanded` 等を付与
   - キーボードナビゲーション対応（`tabIndex`, `onKeyDown`）
3. **インタラクション**: ホバーエフェクト、状態変化時のトランジション（マイクロインタラクション）を実装
4. **Presentational Component**: データフェッチはコンポーネント内に持たせず、上位層からPropsで受け取る

## 参考テンプレート

- コンポーネント: `templates/component.tsx`
