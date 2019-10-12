const express = require('express');
const mongodb = require('mongodb');
// const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

//inital app
const app = express();

//Middleware
app.use(cookieParser());

const router = express.Router();

//Add posts (login -> set token)
router.post('/', async (req, res) => {
  let cookieList = [];
  const posts = await loadPostsCollection();
  await posts.insertOne({
    text: req.body.text,
    author: req.body.author ? req.body.author : 'אנונימי',
    createdAt: new Date()
  })

    .then(result => {
      cookie = res.cookie('user', result.insertedId);
      // cookie = res.cookie('user', cookieList.push(result.insertedId), { maxAge: 900000, httpOnly: true });
      return cookie;
      // res.cookie('user', result.insertedId);
      // return req.cookies.user;

    }).catch(err => {
      console.log(err);
    });

  res.status(201).send(req.cookie);
});

//Get posts (post -> verify token)
router.get('/', async (req, res) => {
  const posts = await loadPostsCollection();
  const mysort = { createdAt: -1 };
  res.status(200).send(await posts.find({}).sort(mysort).toArray());
});


//Edit post
router.post('/:id', async (req, res) => {
  const posts = await loadPostsCollection();
  await posts.update(
    { _id: new mongodb.ObjectID(req.params.id) },
    {
      $set:
      {
        text: req.body.text,
        author: req.body.author ? req.body.author : 'אנונימי',
        createdAt: new Date()
      }
    }
  )
  res.status(201).send();
});

//Delete posts
router.delete('/:id', async (req, res) => {

  const posts = await loadPostsCollection();
  await posts.deleteOne({ _id: new mongodb.ObjectID(req.params.id) });

  res.status(200).send();
});


async function loadPostsCollection() {
  const client = await mongodb.MongoClient.connect('mongodb+srv://admin:12345@cluster0-w5mju.mongodb.net', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  return client.db('vue-express').collection('posts');
}


//FORMAT OF TOKEN 
// Authorizaion: Bearer <access_token>
function verifyToken(req, res, next) {
  //Get auth header value
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' '); // from string to array (makes Bearer <access_token> to [Bearer, <access_token>])
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();

  } else {
    check_token = false;
    // res.status(403).send();
  }
}

module.exports = router;