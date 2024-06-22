const express = require('express');
const app = express();
const port = 3001;
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./hogwarts.db');
const cors = require('cors');
app.use(cors());

app.use(express.json());

// Initialize database and pre-populate with Hogwarts houses
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS houses (id INTEGER PRIMARY KEY, name TEXT, points INTEGER)", () => {
      // Pre-populate with Hogwarts houses
      const houses = [
        { id: 1, name: 'Gryffindor', points: 0 },
        { id: 2, name: 'Hufflepuff', points: 0 },
        { id: 3, name: 'Ravenclaw', points: 0 },
        { id: 4, name: 'Slytherin', points: 0 }
      ];
  
      const stmt = db.prepare("INSERT OR IGNORE INTO houses (id, name, points) VALUES (?, ?, ?)");
      for (const house of houses) {
        stmt.run(house.id, house.name, house.points);
      }
      stmt.finalize();
    });
  });

// GET all houses
app.get('/houses', (req, res) => {
  db.all("SELECT * FROM houses", [], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(rows);
    }
  });
});

// POST update points
app.post('/houses/:id/points', (req, res) => {
  const { id } = req.params;
  const { points } = req.body; // Expecting { points: 1 } or { points: -1 } or { points: 5 } or { points: -5 }

  db.run("UPDATE houses SET points = points + ? WHERE id = ?", [points, id], function(err) {
    if (err) {
      res.status(500).send(err.message);
    } else if (this.changes === 0) {
      res.status(404).send("House not found");
    } else {
      res.send("Points updated successfully");
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});