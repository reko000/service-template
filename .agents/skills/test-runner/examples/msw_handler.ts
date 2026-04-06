import { http, HttpResponse } from 'msw';

// 特定のFeature用のMSWハンドラ定義例
export const handlers = [
  // 正常系のモック
  http.get('/api/users/:userId', ({ params }) => {
    const { userId } = params;
    return HttpResponse.json({
      id: userId,
      name: 'Test User',
      email: 'test@example.com',
    });
  }),

  // 異常系のモック（特定のIDの時はエラーを返すようにする等でテストを分岐）
  http.get('/api/users/error-id', () => {
    return new HttpResponse(null, { status: 404 });
  }),
];
