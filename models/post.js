const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title: {type: String, required: true},
    author: {type: mongoose.Types.ObjectId, ref: "User", required: true },
    body: {type: String, required: true},
    date: { type: Date, default: Date.now, required: true},
    hidden: {type: Boolean, required: true},
  });

  module.exports = mongoose.model("Post", postSchema)