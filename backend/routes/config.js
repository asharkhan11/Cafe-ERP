const express = require('express');
const db = require('../db');
const router = express.Router();

/* Get config */
router.get('/', (req, res) => {
  db.get(`SELECT * FROM config WHERE id = 1`, [], (err, row) => {
    if (err) return res.status(500).json(err);

    // If not exists, insert default once
    if (!row) {
      const defaultConfig = {
        id: 1,
        name: 'Cafe ERP',
        currency: '₹',
        taxRate: 0.18
      };

      db.run(`
        INSERT INTO config (id, name, currency, taxRate)
        VALUES (1, ?, ?, ?)
      `, [defaultConfig.name, defaultConfig.currency, defaultConfig.taxRate]);

      return res.json(defaultConfig);
    }

    res.json(row);
  });
});

/* Update config */
router.post('/', (req, res) => {
  const c = req.body;

  db.run(`
    INSERT INTO config (id, name, currency, taxRate)
    VALUES (1, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name=excluded.name,
      currency=excluded.currency,
      taxRate=excluded.taxRate
  `, [c.name, c.currency, c.taxRate]);

  res.sendStatus(200);
});

module.exports = router;
