const jwt = require('jsonwebtoken')
require('dotenv').config()
const debug = require('debug')('hello_chat:authentication')

const isAuthenticated = (req, res, next) => {
    // debug('token', req.cookies.jwtToken)

    try {
        const token = req.cookies.jwtToken
       
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)

        req.user = decodedToken
        debug('user is authenticated:')
        next()
    } catch (err) {
        res.status(400).json({
            message: 'Invalid or expired token. Please log in.',
            reroute: true
        })
    }
}


module.exports = isAuthenticated