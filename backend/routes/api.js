const express = require('express')
const { account_create_post, account_login_post } = require('../controllers/accountControllers')
const isAuthenticated = require('../middleware/authentication')
const { auth_check_get, auth_signout_delete } = require('../controllers/authController')
const { user_check_get, user_status_update_post, user_friends_add_get, user_fiends_add_post } = require('../controllers/userController')
const { messages_post, message_edit } = require('../controllers/messageController')
const { convo_get_post } = require('../controllers/convoController')
const router = express.Router()

const multer = require('multer')
const { image_upload_post } = require('../controllers/imageController')
const storage = multer.memoryStorage()
const upload = multer({storage: storage})


router.post('/account/create', account_create_post)

router.post('/account/login', account_login_post)

router.get('/auth/check', isAuthenticated, auth_check_get)

router.get('/users/get', isAuthenticated, user_check_get)

router.delete('/auth/signout', isAuthenticated, auth_signout_delete)

router.post('/messages/send', isAuthenticated, messages_post)

router.post('/convo/get', isAuthenticated, convo_get_post)

router.post('/messages/edit', isAuthenticated, message_edit)

router.post('/user/status/update', isAuthenticated, user_status_update_post)

router.post('/image/upload', isAuthenticated, upload.single('image'), image_upload_post)

router.get('/users/add', isAuthenticated, user_friends_add_get)

router.post('/users/addFriend', isAuthenticated, user_fiends_add_post)

module.exports = router