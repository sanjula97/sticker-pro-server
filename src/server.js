import express from 'express';
import cors from 'cors';
import data from '../data.js';
import bodyParser from 'body-parser'

const app = express();

// parse application/json
app.use(bodyParser.json())

app.use(cors({
  origin: 'http://localhost:3000',
}))

// test
app.get('/api/products', (req, res) => {
  res.send(data.products);
  // res.send('Hello World! babel')
});

app.post('/api/register', (req, res) => {
  console.log("req body", req.body)
  res.json({ status: 'ok'})
})

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});