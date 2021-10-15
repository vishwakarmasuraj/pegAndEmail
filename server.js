const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes');
require('dotenv').config()
const port = process.env.PORT
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(routes)

// connect to mongoose

mongoose
  .connect(
    process.env.DATABASE_CONNECTION
  )
  .then(() => {
    console.log('connect to Database')
  });
app.listen(()=> console.log(`Server is listening at ${port}`))
