const express = require("express");

const router = express.Router();

const Posts = require("../moduller/post.modul");

const client = require("../config/redis");

const { json } = require("express/lib/response");

router.get("", async (req, res) => {
  try {
    // const post = await Posts.find().lean().exec();

    client.get("posts", async function (err, fetchPosts) {
      console.log(fetchPosts);
      if (fetchPosts) {
        const posts = JSON.parse(fetchPosts);

        return res.status(200).send({ posts, redis: true });
      } else {
        try {
          const posts = await Posts.find().lean().exec();
          client.set("posts", JSON.stringify(posts));
          return res.status(200).send({ posts, redis: false });
        } catch (error) {
          return res.status(500).send({ message: error.message });
        }
      }
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});


router.post("", async (req, res) => {
  try {
    const post = await Posts.create(req.body);

    // find all data in mongo db
    const posts = await Posts.find().lean().exec();

    // set data in redis
    client.set("posts", JSON.stringify(posts));

    return res.status(200).send({ post });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
});



router.get("/:id", async (req, res) => {
  try {
    //  const post = await Posts.findById(req.params.id).lean().exec();
    client.get(`posts.${req.params.id}`, async function (err, fetchPosts) {
      if (fetchPosts) {
        const posts = JSON.parse(fetchPosts);
        return res.status(200).send({ posts, redis: true });
      } else {
        try {
          const posts = await Posts.findById(req.params.id).lean().exec();
          client.set(`posts.${req.params.id}`, JSON.stringify(posts));
          return res.status(201).send({ posts, redis: false });
        } catch (error) {
          return res.status(400).send({ message: error.message });
        }
      }
    });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
});






router.patch("/:id", async (req, res) => {
  try {
    const post = await Posts.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .lean()
      .exec();

    const posts = await Posts.find().lean().exec();

    client.set(`posts.${req.params.id}`, JSON.stringify(posts));
    client.set("posts", JSON.stringify(posts));

    return res.status(200).send({ post });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
});





router.delete("/:id", async (req, res) => {
  try {
    const post = await Posts.findByIdAndDelete(req.params.id);
    const posts = await Posts.find().lean().exec();
    client.del(`posts.${req.params.id}`);
    client.set("posts", JSON.stringify(posts));
    return res.status(200).send({ post });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
});





module.exports = router;
