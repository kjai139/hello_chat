const express = require('express')
const { account_create_post } = require('../controllers/accountControllers')
const router = express.Router()


router.post('/account/create', account_create_post)


module.exports = router