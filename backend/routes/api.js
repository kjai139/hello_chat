const express = require('express')
const { account_create_post, account_login_post } = require('../controllers/accountControllers')
const isAuthenticated = require('../middleware/authentication')
const { auth_check_get, auth_signout_delete } = require('../controllers/authController')
const { user_check_get } = require('../controllers/userController')
const { messages_post } = require('../controllers/messageController')
const { convo_get_post } = require('../controllers/convoController')
const router = express.Router()


router.post('/account/create', account_create_post)

router.post('/account/login', account_login_post)

router.get('/auth/check', isAuthenticated, auth_check_get)

router.get('/users/get', isAuthenticated, user_check_get)

router.delete('/auth/signout', isAuthenticated, auth_signout_delete)

router.post('/messages/send', isAuthenticated, messages_post)

router.post('/convo/get', isAuthenticated, convo_get_post)

module.exports = router