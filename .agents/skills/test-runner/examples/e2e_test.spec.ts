import { test, expect } from '@playwright/test';

// ============================================================
// E2E テストのグッドパターン例
// PRDの受け入れ条件をそのままテストケースに変換している
// ============================================================

test.describe('エンティティ検索機能', () => {
    // ----------------------------------------------------------
    // 正常系: PRD 受け入れ条件 #1 に対応
    // ----------------------------------------------------------
    test('名前で検索して結果が絞り込まれること', async ({ page }) => {
        await page.goto('/entities');

        // 検索欄にテキストを入力（aria-label でアクセシブルに取得）
        const searchInput = page.getByRole('searchbox', { name: '検索' });
        await searchInput.fill('にじさんじ');

        // Debounce (300ms) + API応答を待つ
        await page.waitForTimeout(500);

        // 検索結果のリストアイテムがすべて「にじさんじ」を含むこと
        const items = page.getByRole('listitem');
        const count = await items.count();
        expect(count).toBeGreaterThan(0);

        for (let i = 0; i < count; i++) {
            await expect(items.nth(i)).toContainText('にじさんじ');
        }
    });

    // ----------------------------------------------------------
    // 境界値・異常系: PRD 受け入れ条件 #2 に対応
    // ----------------------------------------------------------
    test('検索結果が0件の場合に空状態メッセージが表示されること', async ({ page }) => {
        await page.goto('/entities');

        const searchInput = page.getByRole('searchbox', { name: '検索' });
        await searchInput.fill('存在しない名前xyz');

        await page.waitForTimeout(500);

        await expect(
            page.getByText('該当するエンティティが見つかりません'),
        ).toBeVisible();
    });

    // ----------------------------------------------------------
    // ユーザー操作: PRD 受け入れ条件 #3 に対応
    // ----------------------------------------------------------
    test('ページネーションで次ページに遷移できること', async ({ page }) => {
        await page.goto('/entities');

        // 「次へ」ボタンをクリック
        const nextButton = page.getByRole('button', { name: '次へ' });
        await expect(nextButton).toBeVisible();
        await nextButton.click();

        // URLに cursor パラメータが付与されること
        await expect(page).toHaveURL(/[?&]cursor=/);
    });
});
