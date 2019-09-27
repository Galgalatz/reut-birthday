const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');

//inital app
const app = express();

//Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(session({
  secret: 'shhh',
  name: '',
  proxy: true,
  resave: true,
  saveUninitialized: true
}));



//api/posts -> posts.js
const posts = require('./routes/api/posts');

app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));


