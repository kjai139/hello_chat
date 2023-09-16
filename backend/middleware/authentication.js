const jwt = require('jsonwebtoken')
require('dotenv').config()
const debug = require('debug')('hello_chat:authentication')

const isAuthenticated = (req, res, next) => {
    const token = req.cookies.jwtToken

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)

        req.user = decodedToken
        debug('user is authenticated:', req.user)
        next()
    } catch (err) {
        res.status(400).json({
            message: 'Invalid or expired token'
        })
    }
}


module.exports = isAuthenticated