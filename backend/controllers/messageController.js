const SocketIoConfig = require('../socket')
const debug = require('debug')('hello_chat:messageController')
const Message = require('../models/messageModel')
const Convo = require('../models/convoModel')

exports.messages_post = async (req, res) => {
    try {
        debug('msg:', req.body.message)
        debug('users:', req.body.users)
        debug('sender:', req.body.sender)
        const messageContent = req.body.message

        const existingConvo = await Convo.find({
            participants: {
                $all: req.body.users
            }
        })

        if (existingConvo.length > 0) {
            debug('a convo already exist:', existingConvo)
        } else {
            debug('convo doesnt exist between users yet')
        }

        SocketIoConfig.io.emit('message', messageContent)
        res.status(200).json({
            success: true
        })

    } catch (err) {
        debug(err)
        res.status(500).json({
            message: err
        })
    }
}