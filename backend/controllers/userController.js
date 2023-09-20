const User = require('../models/userModel')




exports.user_check_get = async (req, res) => {
    try {
        const userList = await User.find().limit(5)

        res.json({
            users: userList
        })

    } catch (err) {
        res.status(500).json({
            message: err
        })
    }
}