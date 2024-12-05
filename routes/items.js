const express = require('express');
const router = express.Router();
const db = require('../models/database');


router.get('/', (req, res) => {
  db.all('SELECT * FROM items', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ items: rows });
  });
});


router.post('/', (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const sql = 'INSERT INTO items (name, description) VALUES (?, ?)';
  db.run(sql, [name, description || ''], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({
      id: this.lastID,
      name,
      description,
    });
  });
});


router.put('/:id', (req, res) => {
  const { name, description } = req.body;
  const { id } = req.params;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const sql = 'UPDATE items SET name = ?, description = ? WHERE id = ?';
  db.run(sql, [name, description || '', id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      id,
      name,
      description,
    });
  });
});


router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM items WHERE id = ?';
  db.run(sql, [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(200).json({ message: `Item with ID ${id} deleted` });
  });
});

module.exports = router;
