const debug = require('debug')('hello_chat:authController')

exports.auth_check_get = async (req, res) => {
    debug('req user from auth check', req.user)
    if (req.user) {
        res.json({
            ok:true,
            user: req.user
        })
    } else {
        res.json({
            message: 'user is not signed in'
        })
    }
}