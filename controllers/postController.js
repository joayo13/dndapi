Post = require('../models/post')
User = require('../models/user')
const asyncHandler = require('express-async-handler')
const { body, validationResult } = require("express-validator");
const jwt = require('jsonwebtoken')
exports.post_create_post = [ 
    body('title').isLength({min: 1}).withMessage('Title cannot be empty').trim().escape(),
    body('body').isLength({min: 1}).withMessage('Text cannot be empty').trim().escape(),
    body('hidden').isBoolean().withMessage('hidden attribute must be of boolean value'),
    asyncHandler( async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      res.json({errors: errors.array()})
    }
    jwt.verify(req.token, process.env.SECRET_KEY, (err, authData) => {
      if(err) {
        res.sendStatus(403);
      } else {

        const post = new Post({
        title: req.body.title,
        author: authData.user._id,
        body: req.body.body,
        date: Date.now(),
        hidden: req.body.hidden,
        })
        post.save()
        res.json({authData, postid: post._id})
        next()
      }
    })
    
})
]
exports.post_get_posts = asyncHandler(async(req, res, next) => {
  const posts = await Post.find({})
  res.json({posts})
})
exports.post_get_post = asyncHandler(async (req, res, next) => {
  const post = await Post.find({_id: req.params.id})
  res.json(post)
})
exports.post_delete_post = asyncHandler(async (req, res, next) => {
  jwt.verify(req.token, process.env.SECRET_KEY, async (err, authData) => { 
    if(err) {
      res.sendStatus(403);
    } else {
      await Post.deleteOne({_id: req.params.id, author: authData.user._id})
      res.json({message: 'deleted post'})
    }
  })
})
exports.post_update_post = [
    body('title').isLength({min: 1}).withMessage('Title cannot be empty').trim().escape(),
    body('body').isLength({min: 1}).withMessage('Text cannot be empty').trim().escape(),
    body('hidden').isBoolean().withMessage('hidden attribute must be of boolean value'),
    asyncHandler( async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      res.json({errors: errors.array()})
    }
    jwt.verify(req.token, process.env.SECRET_KEY, async (err, authData) => {
      if(err) {
        res.sendStatus(403);
      } else {

        const post = new Post({
        _id: req.params.id,
        title: req.body.title,
        author: authData.user._id,
        body: req.body.body,
        date: Date.now(),
        hidden: req.body.hidden,
        })
        await Post.findOneAndUpdate({_id: req.params.id}, post)
        res.json({authData, postid: post._id})
        next()
      }
    })
    
})
]