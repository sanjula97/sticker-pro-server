import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import data from '../data.js';
import User from '../models/user'

const JWT_SECRET = 'hwkghkjhwr7667%^$gadhj'

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

//Login
app.post('/api/login', async (req, res) => {
  const {username, password} = req.body
  const user = await User.findOne({username}).lean()

  if(!user){
    return res.send({status: 'error', data: {token: 'Invalid username/password'}});
  }

  if(await bcrypt.compare(password, user.password)){

    const token = jwt.sign({
      id: user._id,
      username: user.username
    }, JWT_SECRET)

    return res.send({status: 'ok', data: {token, message: 'Valid credentials'}});
  }

  res.send({status: 'error', data: {message: 'Invalid username/password'}});
});


//Register
app.post('/api/register', async (req, res) => {
  const {username, password} = req.body

  if(!username || typeof username !== 'string') {
    return res.json({ status: 'error', message: 'Invalid username'})
  }

  if(!password || typeof password !== 'string') {
    return res.json({ status: 'error', message: 'Invalid password'})
  }

  if(password.length < 5) {
    return res.json({ status: 'error', message: 'Password too small. Should be atleast 6 charactors'})
  }

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

//change password
app.post('/api/change-password', async (req, res) => {
  const {token, newPassword} = req.body

  if(!newPassword || typeof newPassword !== 'string') {
    return res.json({ status: 'error', message: 'Invalid password'})
  }

  if(newPassword.length < 5) {
    return res.json({ status: 'error', message: 'Password too small. Should be atleast 6 charactors'})
  } 

  try {
    const user = jwt.verify(token, JWT_SECRET)
    const _id = user.id
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await User.updateOne(
        {_id},
        {
          $set: {password: hashedPassword}
        }
      )
    res.send({status: 'ok', data: {message: 'Password changed'}});
  } catch (error) {
    res.send({status: 'error', data: {message: 'Server error'}});
  }

});

//Get Products
app.get('/api/products', (req, res) => {
  res.send(data.products);
});

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});