import express from 'express';
// import data from './data.js';

const app = express();
// test
app.get('/api/products', (req, res) => {
  // res.send(data.products);
  res.send('Hello World! babel')
});

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});