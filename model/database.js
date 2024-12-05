const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database('./items.db', (err) => {
  if (err) {
    console.error('Failed to connect to database', err);
  } else {
    console.log('Connected to SQLite database');
  }
});


db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;
