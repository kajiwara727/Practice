// pages/index.js
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>シェアっと！</h1>
      <p>メッセージ</p>
      <ul>
        <li>
          <Link href="/login">ログイン</Link>
        </li>
        <li>
          <Link href="/register">新規登録</Link>
        </li>
      </ul>
    </div>
  );
}
