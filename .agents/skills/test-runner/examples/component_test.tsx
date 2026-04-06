import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MyComponent } from './MyComponent';
// プロジェクトで利用するテストランナー（VitestやJest）の関数は適宜import等で解決する

describe('MyComponent', () => {
  it('タイトルと説明文が正しくレンダリングされること', () => {
    // コンポーネントのレンダリング
    render(<MyComponent title="テストタイトル" description="テスト説明文" />);
    
    // a11yを意識した取得方法: classやidではなく role に依存する
    expect(screen.getByRole('heading', { name: 'テストタイトル' })).toBeInTheDocument();
    expect(screen.getByText('テスト説明文')).toBeInTheDocument();
  });

  it('ボタンをクリックした時にonClickハンドラが呼ばれること', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn(); // Vitestの場合
    
    render(<MyComponent title="タイトル" onClick={handleClick} />);
    
    // 正規表現でボタン名にマッチさせる
    const button = screen.getByRole('button', { name: /アクションを実行/ });
    await user.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
