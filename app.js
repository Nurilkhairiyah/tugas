const express = require('express');
const mysql = require('mysql2');
const app = express();

// Middleware untuk body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Koneksi ke MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pertemuan5',
});

connection.connect((err) => {
  if (err) {
    console.error('Terjadi kesalahan dalam koneksi ke MYSQL:', err.stack);
    return;
  }
  console.log('Koneksi MYSQL berhasil dengan id ' + connection.threadId);
});

// Set view engine EJS
app.set('view engine', 'ejs');

// Route untuk menampilkan semua pengguna (Read)
app.get('/', (req, res) => {
  const query = 'SELECT * FROM users';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error saat query:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.render('index', { users: results });
  });
});

// Route untuk menambahkan pengguna baru (Create)
app.post('/add', (req, res) => {
  const { nama, email, phone } = req.body;
  const query = 'INSERT INTO users (nama, email, phone) VALUES (?, ?, ?)';
  connection.query(query, [nama, email, phone], (err, result) => {
    if (err) {
      console.error('Error saat menambahkan data:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.redirect('/?status=added');
  });
});

// Route untuk menampilkan halaman edit (Update)
app.get('/edit/:id', (req, res) => {
  const query = 'SELECT * FROM users WHERE id = ?';
  connection.query(query, [req.params.id], (err, results) => {
    if (err) {
      console.error('Error saat mengambil data:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.render('edit', { user: results[0] });
  });
});

// Route untuk menyimpan perubahan data pengguna (Update)
app.post('/update/:id', (req, res) => {
  const { nama, email, phone } = req.body;
  const query = 'UPDATE users SET nama = ?, email = ?, phone = ? WHERE id = ?';
  connection.query(query, [nama, email, phone, req.params.id], (err, result) => {
    if (err) {
      console.error('Error saat memperbarui data:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.redirect('/?status=updated');
  });
});

// Route untuk menghapus pengguna (Delete)
app.get('/delete/:id', (req, res) => {
  const query = 'DELETE FROM users WHERE id = ?';
  connection.query(query, [req.params.id], (err, results) => {
    if (err) {
      console.error('Error saat menghapus data:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.redirect('/?status=deleted');
  });
});

// Jalankan server
app.listen(3000, () => {
  console.log('Server berjalan di port 3000, buka web melalui http://localhost:3000');
});
