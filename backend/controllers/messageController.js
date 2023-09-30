const SocketIoConfig = require('../socket')
const debug = require('debug')('hello_chat:messageController')
const Message = require('../models/messageModel')
const Convo = require('../models/convoModel')


exports.message_edit = async (req, res) => {
    try {
        const prevMsg = await Message.findById(req.body.messageId)

        prevMsg.content = prevMsg.content + '\n' + req.body.message

        await prevMsg.save()
        debug('new msg:', prevMsg.content)
        const newPrevMsg = await Message.findById(req.body.messageId)
        SocketIoConfig.io.emit('sameUserMsg', newPrevMsg)
        res.json({
            success:true
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

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
            const newMsg = new Message({
                convo: existingConvo[0]._id,
                sender: req.body.sender,
                content: messageContent
            })
            
            await newMsg.save()
            const getNewMsg = await Message.findById(newMsg._id).populate('sender')
            SocketIoConfig.io.emit('message', getNewMsg)
            res.status(200).json({
                success: true
            })
        } else {
            debug('convo doesnt exist between users yet')
            const newConvo = new Convo({
                participants: req.body.users
            })

            const savedConvo = await newConvo.save()
            debug('saved convo id', savedConvo._id)

            const newMsg = new Message({
                convo:savedConvo._id,
                sender: req.body.sender,
                content: messageContent
            })

            await newMsg.save()

            const getNewMsg = await Message.findById(newMsg._id).populate('sender')
            SocketIoConfig.io.emit('message', getNewMsg)
            res.status(200).json({
                success: true
            })

        }

        

    } catch (err) {
        debug(err)
        res.status(500).json({
            message: err
        })
    }
}