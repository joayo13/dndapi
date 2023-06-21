const express = require("express");
const router = express.Router();

const user_controller = require('../controllers/userController')
const post_controller = require('../controllers/postController')
const comment_controller = require('../controllers/commentController')
function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if(typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ')
    const bearerToken = bearer[1]
    req.token = bearerToken
    next()
  } else {
    res.sendStatus(403)
  }
}
router.get('/api', user_controller.index)
router.post('/api/signup', user_controller.user_create_post)
router.post('/api/login', user_controller.user_login_post)
router.post('/api/post', verifyToken, post_controller.post_create_post)
router.get('/api/posts', post_controller.post_get_posts)
router.put('/api/post/:id/update', verifyToken, post_controller.post_update_post)
router.get('/api/post/:id', post_controller.post_get_post)
router.delete('/api/post/:id/delete', verifyToken, post_controller.post_delete_post)
router.get('/api/post/:id/comments', comment_controller.comment_get_comments)
router.post('/api/post/:id/comment', verifyToken, comment_controller.comment_create_comment)
router.put('/api/post/:id/comment/:cid/update', verifyToken, comment_controller.comment_update_comment)
router.delete('/api/post/:id/comment/:cid/delete', verifyToken, comment_controller.comment_delete_comment)

module.exports = router