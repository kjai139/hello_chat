const User = require('../models/userModel')




exports.user_check_get = async (req, res) => {
    try {
        const userList = await User.find({
            _id: {
                $ne: req.user._id
            }
        }).limit(5)

        res.json({
            users: userList,
            success: true
        })

    } catch (err) {
        res.status(500).json({
            message: err
        })
    }
}

exports.user_status_update_post = async (req, res) => {
    try {
        const user = await User.findById(req.body.userId)

        user.status = req.body.newStatus
        await user.save()

        res.json({
            success: true
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

exports.user_friends_add_get = async (req, res) => {
    try {

        const target = await User.find({normalized_name : req.query.name})

        if (target.length > 0) {
            res.json({
                message: `found user ${target[0]}`,
                friend: target[0],
                success:true
            })
        } else {
            res.json({
                message: `Username does not exist.`
            })
        }
        

    } catch (err) {
        res.status(500).json({
            message:err.message
        })
    }
}