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

mongoose
  .connect(
    process.env.DATABASE_CONNECTION
  )
  .then(() => {
    console.log('connect to Database')
  });

// const port =
//   process.env.NODE_ENV === 'production' ? process.env.PORT || 80 : 3000
// app.listen(3000, () => console.log(`Server listening on port ${3000}`));
app.listen(()=> console.log(`Server is listening at ${port}`))
