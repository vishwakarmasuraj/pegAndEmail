const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const routes = require('./routes')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(routes)

mongoose
  .connect(
    'mongodb+srv://suraj:suraj%405151@cluster0.oodet.mongodb.net/one?retryWrites=true&w=majority',
  )
  .then(() => {
    console.log('connect to Database')
  })

const port =
  process.env.NODE_ENV === 'production' ? process.env.PORT || 80 : 3000
app.listen(3000, () => console.log(`Server listening on port ${3000}`))
