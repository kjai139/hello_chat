const User = require('../models/userModel')
const debug = require('debug')('hello_chat:userController')
const SocketIoConfig = require('../socket')


exports.user_check_get = async (req, res) => {

    try {
        const theUser = await User.findById(req.user._id).populate('friends').populate('friendRequests')

        
        const userList = await User.find({
            
                    _id: {
                        $ne: req.user._id,
                        $nin: theUser.friends
                    }
             
           
        }).limit(3)

        

       
        

        res.json({
            freeFriends: userList,
            newUser: theUser,
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
        const normalizedUsername = req.query.name.toLowerCase()

        const target = await User.find({normalized_name : normalizedUsername}).populate('friends')

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

        const doesFrdExist = target.friends.some(obj => obj._id.toString() === req.body.id)
        const doesFrdHaveUser = thefriend.friends.some(obj => obj._id.toString() === req.user._id)
        const isInUserPending = target.friendRequests.some(obj => obj._id.toString() === req.body.id )

        if (doesFrdExist || doesFrdHaveUser) {
            res.json({
                message: 'Error: User is already your friend or they already have you as a friend.'
            })
            
        } else {
            if (isInUserPending) {
                debug('Friend is in user pending, updating user pending...')
                const filteredPending = target.friendRequests.filter((obj) => {
                    return obj._id.toString() !== req.body.id
                })
                target.friendRequests = filteredPending
            }
            const updatedFrds = [...target.friends, friendId]
            
            const updatedFriendsFrds = [...thefriend.friends, req.user._id]

            target.friends = updatedFrds
            thefriend.friends = updatedFriendsFrds
            SocketIoConfig.io.to(friendId).emit('addedByFrd', {
                newFriend: target
            })
            await target.save()
            await thefriend.save()
            res.json({
                success: true,
                newFriend: thefriend,
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
        const sender = await User.findById(req.user._id)
        // const requester = await User.findById(req.user._id)

        const targetReqExist = target.friendRequests.some(obj => obj._id.toString() === req.user._id.toString())
        // const requesterReqExist = requester.friendRequests.some(obj => obj._id === friendId)

        if (targetReqExist) {
            res.json({
                message: 'Friend request already pending.'
            })
        }  else {
            const updatedPending = [...target.friendRequests, req.user._id]
            target.friendRequests = updatedPending
            await target.save()
            SocketIoConfig.io.to(friendId).emit('incFrdReq', {
                newPending: sender
            })
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

exports.user_friends_decline = async (req, res) => {
    try {
        const friendId = req.body.id
        const theUser = await User.findById(req.user._id)

        const filteredPending = theUser.friendRequests.filter((obj) => {
            debug('obj._id', obj._id, friendId)
            debug('is objid same as friendid', obj._id !== friendId)
            return obj._id.toString() !== friendId
        })


        debug('filteredPending', filteredPending)
        debug('theUserFriendRequests', theUser.friendRequests)

        theUser.friendRequests = filteredPending
        await theUser.save()
        res.json({
            success: true,
            message: `${req.body.id}'s friend request declined.`
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

exports.user_friends_delete = async (req, res) => {
    try {
        const friendId = req.query.id
        

        const theUser = await User.findById(req.user._id)

        const filteredFriends = theUser.friends.filter((obj) => {
            return obj._id.toString() !== friendId
        })

        theUser.friends = filteredFriends

        debug('THE USER FROM DELETE FRIENDs', theUser)

        const theFriend = await User.findById(req.query.id)

        const filteredFriendsFriends = theFriend.friends.filter((obj) => {
            return obj._id.toString() !== req.user._id
        })

        theFriend.friends = filteredFriendsFriends

        await theUser.save()
        await theFriend.save()

        SocketIoConfig.io.to(friendId).emit('deletedByFrd', {
            deletedBy: req.user._id
        })

        res.json({
            newUser: theUser,
            message: `Friend ${friendId} deleted.`,
            success: true
        })


    } catch (err) {
        res.status(500).json({
            message:err.message
        })
    }
}