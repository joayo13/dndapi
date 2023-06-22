Post = require('../models/post')
User = require('../models/user')
CommentSchema = require('../models/comment')
const asyncHandler = require('express-async-handler')
const { body, validationResult } = require("express-validator");
const jwt = require('jsonwebtoken')

exports.comment_create_comment = [
    body('body').isLength({min: 1}).withMessage('Text cannot be empty').trim().escape(),
    asyncHandler(async(req, res, next) => {
      const errors = validationResult(req)
      if(!errors.isEmpty()) {
        res.json({errors: errors.array()})
      }
      jwt.verify(req.token, process.env.SECRET_KEY, (err, authData) => {
        if(err) {
          res.sendStatus(403);
        } else {
          const comment = new CommentSchema({
          body: req.body.body,
          author: authData.user._id,
          post: req.params.id,
          date: Date.now(),
          })
          comment.save()
          res.json({authData})
          next()
        }
      })
    })
]
exports.comment_get_comments = asyncHandler(async (req, res, next) => {
    const comments = await CommentSchema.find({post: req.params.id})
    res.json({comments})
})
exports.comment_update_comment = [
    body('body').isLength({min: 1}).withMessage('Text cannot be empty').trim().escape(),
    asyncHandler(async(req, res, next) => {
      const errors = validationResult(req)
      if(!errors.isEmpty()) {
        res.json({errors: errors.array()})
      }
      jwt.verify(req.token, process.env.SECRET_KEY, async (err, authData) => {
        if(err) {
          res.sendStatus(403);
        } else {
          const comment = new CommentSchema({
          _id: req.params.cid,
          body: req.body.body,
          author: authData.user._id,
          post: req.params.id,
          date: Date.now(),
          })
          await CommentSchema.findOneAndUpdate({_id: req.params.cid}, comment)
          res.json({authData})
          next()
        }
      })
    })
]
exports.comment_delete_comment = asyncHandler(async (req, res, next) => {
    jwt.verify(req.token, process.env.SECRET_KEY, async (err, authData) => { 
      if(err) {
        res.sendStatus(403);
      } else {
        await CommentSchema.deleteOne({_id: req.params.cid, author: authData.user._id})
        res.json({message: 'deleted comment'})
      }
    })
  })