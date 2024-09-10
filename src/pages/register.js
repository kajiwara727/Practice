// pages/register.js
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Register() {
  const [familyName, setFamilyName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // 簡単なバリデーション
    if (!familyName || !username || !password || !confirmPassword) {
      setError('すべてのフィールドを入力してください。');
      return;
    }
    if (password !== confirmPassword) {
      setError('パスワードが一致しません。');
      return;
    }

    try {
        // バックエンドの API エンドポイントに POST リクエストを送信
        // ここで成功するレスポンスをモックする
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ familyName, username, password }),
          });

          // レスポンスが成功の場合に /memo_link へリダイレクト
          if (response.ok) {
            const result = await response.json();
            console.log('登録成功:', result);
            setError('');
            router.push('/memo_list');
          } else {
            throw new Error('登録に失敗しました。');
          }
        } catch (err) {
          // エラーメッセージの設定
          setError(err.message);
    }
  };

  return (
    <div>
      <h1>新規登録</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="familyName">ファミリーネーム:</label>
          <input
            type="text"
            id="familyName"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
            required
          />
        </div>
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
        <div>
          <label htmlFor="confirmPassword">パスワード確認:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">
          登録
        </button>
      </form>
      <p>
        すでにアカウントをお持ちですか？ <Link href="/login">ログイン</Link>
      </p>
    </div>
  );
}
