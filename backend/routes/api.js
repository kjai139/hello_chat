const express = require('express')
const { account_create_post, account_login_post } = require('../controllers/accountControllers')
const router = express.Router()


router.post('/account/create', account_create_post)

router.post('/account/login', account_login_post)

module.exports = router