var express = require('express');
var app = express();
require('dotenv').config();
const mysql = require('mysql');
const cors = require('cors');
const session = require('express-session');
const bcrypt = require('bcrypt');


const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

app.use(cors());
app.use(express.json());

// 新規ユーザーの登録
app.post('/api/new', (req, res) => {
  const family = req.body.family;
  const pwd = req.body.pwd;
  const users = req.body.user;

  users.forEach((user) => {
    // パスワードをハッシュ化
    bcrypt.hash(pwd, 10, (err, hash) => {
      if (err) throw err;

      // ハッシュ化されたパスワードをデータベースに保存
      connection.query(
        'INSERT INTO login (myname, pwd, family) VALUES (?, ?, ?)',
        [user, hash, family],
        (error, result) => {
          if (error) throw error;
          res.json({ data: result });
        }
      );
    });
  });
});


// ログイン（未実装）
app.post('/api/login', (req, res) => {
  const { myname, pwd } = req.body;

  // ユーザー名に基づいてデータベースからユーザーを取得
  connection.query(
    'SELECT * FROM login WHERE myname = ?',
    [myname],
    (error, results) => {
      if (error) throw error;

      if (results.length > 0) {
        const hashedPassword = results[0].pwd;

        // パスワードの比較
        bcrypt.compare(pwd, hashedPassword, (err, isMatch) => {
          if (err) throw err;

          if (isMatch) {
            // セッションを設定
            req.session.userId = results[0].id;
            req.session.username = myname;
            req.session.family = results[0].family;

            res.json({ message: 'Login successful' });
          } else {
            res.status(401).json({ message: 'Invalid credentials' });
          }
        });
      } else {
        res.status(401).json({ message: 'User not found' });
      }
    }
  );
});


// ニーズの追加
app.post('/api/needs', (req, res) => {
  const { myname, family, need, cnt } = req.body;
  connection.query(
    'INSERT INTO needs (myname, family, need, cnt) VALUES (?, ?, ?, ?)',
    [myname, family, need, cnt],
    (error, result) => {
      if (error) throw error;
      res.json({ data: result });
    }
  );
});

// ニーズの更新
app.put('/api/needs/:id', (req, res) => {
  const cnt = req.body.cnt;
  const id = req.params.id;
  connection.query(
    'UPDATE needs SET cnt = ? WHERE id = ?',
    [cnt, id],
    (error, result) => {
      if (error) throw error;
      res.json({ data: result });
    }
  );
});

// ニーズの削除
app.delete('/api/needs/:id', (req, res) => {
  const id = req.params.id;
  connection.query(
    'DELETE FROM needs WHERE id = ?',
    [id],
    (error, result) => {
      if (error) throw error;
      res.json({ data: result });
    }
  );
});

// 家族情報の取得
app.get('/api/family', (req, res) => {
  const family = req.query.family;
  connection.query(
    'SELECT myname, need, cnt FROM needs WHERE family = ?',
    [family],
    (error, result) => {
      if (error) throw error;
      res.json({ data: result });
    }
  );
});

// 個別ニーズの取得
app.post('/api/individual', (req, res) => {
  const family = req.body.family;
  connection.query(
    'SELECT myname, need, cnt FROM needs WHERE family = ?',
    [family],
    (error, result) => {
      if (error) return res.status(500).json({ error: 'Database query error' });
      res.json({ data: result });
    }
  );
});

// 個別ニーズ（ユーザー）の取得
app.post('/api/individual/user', (req, res) => {
  const family = req.body.family;
  connection.query(
    'SELECT myname, need, cnt FROM needs WHERE family = ? ORDER BY myname ASC',
    [family],
    (error, result) => {
      if (error) throw error;
      res.json({ data: result });
    }
  );
});

// 個別ニーズ（ニーズ）の取得
app.post('/api/individual/need', (req, res) => {
  const family = req.body.family;
  connection.query(
    'SELECT myname, need, cnt FROM needs WHERE family = ? ORDER BY need ASC',
    [family],
    (error, result) => {
      if (error) throw error;
      res.json({ data: result });
    }
  );
});

// ニーズのカウント取得
app.get('/api/individual/cnt', (req, res) => {
  const family = req.query.family;
  connection.query(
    'SELECT myname, need, cnt FROM needs WHERE family = ? ORDER BY cnt ASC',
    [family],
    (error, result) => {
      if (error) throw error;
      res.json({ data: result });
    }
  );
});

module.exports = app;