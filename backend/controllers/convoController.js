const Convo = require('../models/convoModel')
const debug = require('debug')('hello_chat:convoController')
const Message = require('../models/messageModel')

exports.convo_get_post = async (req, res) => {
    debug('convo get post', req.user._id, req.body.selectedUser)
    try {
        const convo = await Convo.find({
            participants: {
                $all: [req.user._id, req.body.selectedUser]
            }
        })

        

        
        if (convo.length > 0) {
            debug('convo found:', convo)

            const messageArray = await Message.find({
                convo: convo[0]._id
            }).sort({
                timestamp: 1
            }).limit(50).populate('sender')

            
            res.json({
                message: 'messages found',
                messageArr: messageArray,
                success: true
            })
        } else {
            res.json({
                message: 'no existing convo',
                
            })
        }

    } catch (err) {
        res.status(500).json({
            message: err
        })
    }
}