const asyncHandler = require('express-async-handler')
const { body, validationResult } = require("express-validator");
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const user = require('../models/user');
const jwt = require('jsonwebtoken');

exports.index = (req, res) => {
    res.json({
        message: "welcome to the api"
    })
}
exports.user_create_post = [
    body("email").isEmail().withMessage('Invalid Email address'),
    body("password").isLength({ min: 4 })
    .escape()
    .withMessage("Password must be longer than 4 characters"),
    asyncHandler(async (req, res, next) => {
  
      const errors = validationResult(req);
  
      if(!errors.isEmpty()) {
          res.json({
            errors: errors.array(),
          })
          return
      }
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
          if(err) {
           return next(err)
          }
          try {
           const user = new User({
             email: req.body.email,
             password: hashedPassword,
           });
           const result = await user.save();
           res.json({message: 'user saved'})
         } catch(err) {
           return next(err);
         };
         });
  })
]
exports.user_login_post = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if(result) {
                jwt.sign({user}, process.env.SECRET_KEY, { expiresIn: '12h' }, (err, token) => {
                    res.json({token})
                })
            } else {
                res.json({message: 'incorrect pass'})
            }
        })
    })