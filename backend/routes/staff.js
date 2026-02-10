const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (_, res) => {
  db.all("SELECT * FROM staff", [], (err, rows) => {
    rows.forEach(s => s.isClockedIn = !!s.isClockedIn);
    res.json(rows);
  });
});

router.put('/toggle/:id', (req, res) => {
  db.run(`
    UPDATE staff 
    SET isClockedIn = NOT isClockedIn,
        lastClockIn = strftime('%s','now')*1000
    WHERE id=?
  `, [req.params.id]);

  res.sendStatus(200);
});

module.exports = router;
