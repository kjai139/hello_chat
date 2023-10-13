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
        const thefriend = await User.findById(req.body.id)

        const doesFrdExist = target.friends.some(obj => obj._id === req.body.id)
        const doesFrdHaveUser = thefriend.friends.some(obj => obj._id === req.user._id)

        if (doesFrdExist || doesFrdHaveUser) {
            res.json({
                message: 'Error: User is already your friend or they already have you as a friend.'
            })
            
        } else {
            const updatedFrds = [...target.friends, friendId]
            
            const updatedFriendsFrds = [...thefriend.friends, req.user._id]

            target.friends = updatedFrds
            thefriend.friends = updatedFriendsFrds
            await target.save()
            await thefriend.save()
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

exports.user_fiends_sendRequest_post = async (req, res) => {
    try {
        const friendId = req.body.id
        const target = await User.findById(friendId)
        const requester = await User.findById(req.user._id)

        const targetReqExist = target.friendRequests.some(obj => obj._id === req.user._id)
        const requesterReqExist = requester.friendRequests.some(obj => obj._id === friendId)

        if (targetReqExist) {
            res.json({
                message: 'Friend request already pending.'
            })
        } else if (requesterReqExist) {
            const filteredReq = requester.friendRequests.filter((obj) => obj._id !== friendId)
            requester.friendRequests = filteredReq
            await requester.save()
            res.json({
                addFriend: true
            })
        } else {
            const updatedPending = [...target.friendRequests, req.user._id]
            target.friendRequests = updatedPending
            await target.save()
            res.json({
                success: true,
                message: 'Friend request sent.'
            })
        }

    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}