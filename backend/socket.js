

const { Server } = require('socket.io')
const User = require('./models/userModel')
const debug = require('debug')('hello_chat:socket')

let origin

if (process.env.NODE_ENV === 'production'){
    origin = ''
} else {
    origin = ["http://localhost:3000", "http://localhost:3001"]
}

module.exports = (server) => {
    const io = new Server(server, {
        cors: {
            origin: origin,
            methods: ['GET', 'POST'],
            credentials: true
        }
    })

    

    io.on('connection', (socket) => {
        console.log('A user has connected.')
        let openId

        socket.on('joinRoom', (userId) => {
            openId = userId
            socket.join(userId)
            socket.to(userId).emit('joinnedRoom', {
                room: userId
            })
            console.log(`User ${openId} has joinned room ${userId}`)
            debug(`user is in room` ,socket.rooms)
        })


        socket.on('login-status', (sender) => {
                
            const recipents = sender.friends.concat(sender.freeFriends)


            recipents.forEach((frd) => {
                console.log('friend Id from socket:', frd._id)
                console.log('sender', sender.sender, 'status:', sender.status)
                
                socket.to(frd._id).emit('friend-login-status', {
                    sender: sender.sender,
                    status: sender.status
                })
            })

           

        
             
          
        
            

            
        })

        socket.on('redirectReq', (data) => {
            socket.to(data.sender).emit('userLogged')
        })

        socket.on('disconnecting', () => {
            console.log('socket rooms', socket.rooms)
        })

        socket.on('disconnect', async () => {
            debug(`User ${openId} disconnected`)
            const theUserId = openId

            try {
                const theUser = await User.findByIdAndUpdate(theUserId, {
                    status: 'offline'
                }).populate('friends')

                for (const frd of theUser.friends) {
                    try {
                        socket.to(frd._id.toString()).emit('friend-login-status', {
                            sender: theUser._id,
                            status: 'offline'
                        })

                    } catch (err) {
                        debug('error emitting on dc', err)
                    }
                }

               


                debug('user logged out on dc')
            } catch (err){
                debug('error logging user out on dc', err)
            }
            
            console.log('socket rooms size: ', socket.rooms.size)
        })
    })

    module.exports.io = io
}
