const express = require('express');
const mongodb = require('mongodb');
const session = require('express-session');

const router = express.Router();

var sess;

//Get posts
router.get('/', async (req, res) => {
  const posts = await loadPostsCollection();
  res.send(await posts.find({}).toArray());
});

//Add posts
router.post('/', async (req, res) => {
  const posts = await loadPostsCollection();
  await posts.insertOne({

    text: req.body.text,
    author: req.body.author ? req.body.author : 'אנונימי',
    createdAt: new Date()

  }).then(result => {
    sess = req.session;
    sess.name = result.insertedId;
  });
  res.status(201).send();
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
    useNewUrlParser: true
  });

  return client.db('vue-express').collection('posts');
}


module.exports = router;