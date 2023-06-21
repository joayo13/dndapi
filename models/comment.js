const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    body: {type: String, required: true},
    post: { type: mongoose.Types.ObjectId, ref: "Post", required: true },
    author: {type: mongoose.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: Date.now, required: true},
  });

  module.exports = mongoose.model("Comment", commentSchema)