// pages/login.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // 簡単なバリデーション
    if (!username || !password) {
      setError('すべてのフィールドを入力してください。');
      return;
    }

    try {
      // バックエンドの API エンドポイントに POST リクエストを送信
      // ここで成功するレスポンスをモックする
      const response = {
        ok: true,
        json: async () => ({ message: 'ログイン成功しました。' }),
      };

      // 上記のモックされたレスポンスを `fetch` が返すようにする
      const result = await response.json();
      console.log('ログイン成功:', result);
      setError('');
      // ログイン後に /memo_list ページにリダイレクト
      router.push('/memo_list');
    } catch (err) {
      // エラーメッセージの設定
      setError('ログインに失敗しました。');
    }
  };

  return (
    <div>
      <h1>ログイン</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">ユーザー名:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">パスワード:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">
          ログイン
        </button>
      </form>
      <p>
        アカウントをお持ちでないですか？ <Link href="/register">新規登録</Link>
      </p>
    </div>
  );
}
