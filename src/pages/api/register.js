// pages/api/register.js
export default async function handler(req, res) {
    if (req.method === 'POST') {
      // バリデーションなどの処理があればここに追加
      const { familyName, username, password } = req.body;

      // バリデーションは無視して成功のレスポンスを返す
      if (!familyName || !username || !password) {
        return res.status(400).json({ message: 'すべてのフィールドを入力してください。' });
      }

      // ここで成功のレスポンスを返す
      res.status(200).json({ message: '登録成功しました。' });
    } else {
      // メソッドが違う場合は 405 メソッド不許可
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
