import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import bcrypt from 'bcryptjs'

import data from '../data.js';
import User from '../models/user'

console.log("User model =>", User)

mongoose.connect('mongodb://localhost:27017/ausmodz', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
});

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

app.post('/api/register', async (req, res) => {
  const {username, password} = req.body

  var hashedPassword =  await bcrypt.hash(password, 10);
  console.log("hashed body body",  hashedPassword)

  try {
    const response = await User.create({
      username,
      password: hashedPassword
    })
    console.log("Response", response)
    return res.json({ status: 'ok'})
  } catch (error) {
    console.log(JSON.stringify(error))
    if(error.code === 11000) {
      return res.json({ status: 'error', message: 'Username already in use'})
    }
    throw error
    
  }

})

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});