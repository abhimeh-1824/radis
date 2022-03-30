const express = require("express");

const app = express();

const postdata = require("./controller/post.control")

app.use(express.json());

app.use("/post",postdata)

module.exports = app;
