const User = require('../models/userModel')




exports.user_check_get = async (req, res) => {
    try {
        const userList = await User.find({
            _id: {
                $ne: req.user._id
            }
        }).limit(3)

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

exports.user_fiends_add_post = async (req, res) => {
    try {
        const friendId = req.body.id
        const target = await User.findById(req.user._id)

        const doesFriendExist = target.friends.some(obj => obj._id === req.body.id)

        if (doesFriendExist) {
            res.json({
                message: 'User is already your friend.'
            })
        } else {
            const updatedFriends = [...target.friends, friendId]
            target.friends = updatedFriends
            await target.save()
            res.json({
                success: true,
                updatedFriends: target,
                message: 'User added to friends.'
            })
        }

    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}