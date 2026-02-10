const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (_, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    res.json(rows);
  });
});

router.post('/', (req, res) => {
  const p = req.body;

  db.run(`
    INSERT OR REPLACE INTO products 
    VALUES (?,?,?,?,?,?,?,?)
  `,
  [p.id, p.name, p.price, p.cost, p.category, p.stock, p.minStock, p.image]);

  res.sendStatus(200);
});

router.delete('/:id', (req, res) => {
  db.run("DELETE FROM products WHERE id = ?", [req.params.id]);
  res.sendStatus(200);
});

module.exports = router;