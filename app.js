const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const app = express(); 
const db = new sqlite3.Database('./items.db');


app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'public'))); 


app.get('/items', (req, res) => {
  db.all('SELECT * FROM items', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ items: rows });
  });
});

app.post('/items', (req, res) => {
  const { name, description } = req.body;
  const dateCreated = new Date().toISOString();
  db.run('INSERT INTO items (name, description, date_created) VALUES (?, ?, ?)', [name, description, dateCreated], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID, name, description, dateCreated });
  });
});

app.put('/items/:id', (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  db.run('UPDATE items SET name = ?, description = ? WHERE id = ?', [name, description, id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id, name, description });
  });
});

app.patch('/items/:id', (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  db.run('UPDATE items SET name = ?, description = ? WHERE id = ?', [name || null, description || null, id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id, name, description });
  });
});

app.delete('/items/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM items WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: `Item with id ${id} deleted` });
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
