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


exports.auth_signout_delete = async (req, res) => {
    try {
        res.cookie('jwtToken', '', {
            httpOnly: true,
            maxAge: 0,
            sameSite: 'None',
            secure: true
        })

        res.json({
            message: 'user has successfully signed out', 
            ok: true
        })
    } catch (err) {
        res.status(500).json({
            message: err
        })
    }
}