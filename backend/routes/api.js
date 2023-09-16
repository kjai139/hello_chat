const express = require('express')
const { account_create_post, account_login_post } = require('../controllers/accountControllers')
const isAuthenticated = require('../middleware/authentication')
const { auth_check_get } = require('../controllers/authController')
const router = express.Router()


router.post('/account/create', account_create_post)

router.post('/account/login', account_login_post)

router.get('/auth/check', isAuthenticated, auth_check_get)

module.exports = router