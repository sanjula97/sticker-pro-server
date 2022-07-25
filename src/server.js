import express from 'express';
import cors from 'cors';
import data from '../data.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
}))

// test
app.get('/api/products', (req, res) => {
  res.send(data.products);
  // res.send('Hello World! babel')
});

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});