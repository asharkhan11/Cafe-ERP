const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (_, res) => {
  db.all("SELECT * FROM orders ORDER BY timestamp DESC", [], (err, rows) => {
    rows.forEach(o => o.items = JSON.parse(o.items));
    res.json(rows);
  });
});

router.post('/', (req, res) => {
  const o = req.body;

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    db.run(
      `
      INSERT INTO orders (
        id, items, subtotal, tax, total, profit,
        timestamp, paymentMethod, staffId, status
      )
      VALUES (?,?,?,?,?,?,?,?,?,?)
      `,
      [
        o.id,
        JSON.stringify(o.items),
        o.subtotal,
        o.tax,
        o.total,
        o.profit,
        o.timestamp,
        o.paymentMethod,
        o.staffId || null,
        o.status || 'completed'
      ],
      (err) => {
        if (err) {
          db.run('ROLLBACK');
          console.error('Order insert error:', err);
          return res.sendStatus(500);
        }

        for (const item of o.items) {
          db.run(
            `UPDATE products SET stock = stock - ? WHERE id = ?`,
            [item.quantity, item.productId],
            (err) => {
              if (err) {
                db.run('ROLLBACK');
                console.error('Stock update error:', err);
                return res.sendStatus(500);
              }
            }
          );
        }

        db.run('COMMIT', (err) => {
          if (err) {
            console.error('Commit error:', err);
            return res.sendStatus(500);
          }
          res.sendStatus(200);
        });
      }
    );
  });
});



router.put('/cancel/:id', (req, res) => {
  const orderId = req.params.id;

  // Get the order to restore stock
  db.get(`SELECT items FROM orders WHERE id = ?`, [orderId], (err, row) => {
    if (err || !row) {
      console.error('Order fetch error:', err);
      return res.sendStatus(500);
    }

    // Update order status
    db.run(`UPDATE orders SET status='cancelled' WHERE id=?`, [orderId], (err) => {
      if (err) {
        console.error('Order cancel error:', err);
        return res.sendStatus(500);
      }

      // Restore stock for each item
      const items = JSON.parse(row.items);
      items.forEach(item => {
        db.run(
          `UPDATE products SET stock = stock + ? WHERE id = ?`,
          [item.quantity, item.productId],
          (err) => {
            if (err) console.error('Stock restore error:', err);
          }
        );
      });

      res.sendStatus(200);
    });
  });
});

module.exports = router;