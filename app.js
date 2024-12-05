const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = new sqlite3.Database('./items.db', (err) => {
  if (err) {
    console.error('Failed to connect to database', err);
  } else {
    console.log('Connected to SQLite database');
  }
});


app.get('/', (req, res) => {
  res.send('Welcome to the Web App!');
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
