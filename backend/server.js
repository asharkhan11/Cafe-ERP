const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use('/products', require('./routes/products'));
app.use('/orders', require('./routes/orders'));
app.use('/staff', require('./routes/staff'));
app.use('/config', require('./routes/config'));

app.listen(3001, () => {
  console.log('Backend running on http://localhost:3001');
});
